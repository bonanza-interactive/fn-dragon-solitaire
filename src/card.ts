import {CurveInterpolator} from 'curve-interpolator';

import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {Timeline} from '@apila/game-libraries/dist/game-animation';
import {Physics} from '@apila/spine';

import {CardParticle} from './card-particle';
import {
  CARD_BACK,
  CARD_DRAGON,
  CardLocation,
  CardName,
  rankAnimationNames,
  suitSkinNames,
} from './config/config';
import {GameLayer} from './config/schemas';
import {CORE, GAME} from './game';
import {HiliteAnimation} from './hilite-animation';
import {findAllImages} from './ImageAtlas';
import {AUTO_TICK} from './main';
import {waitAnimation, waitEvent} from './util/spine-utils';
import {getCardNodeName, voidPromise, wait} from './util/utils';
import {getNode} from './util/utils-node';
import {IS_MOBILE_DEVICE} from './framework';

export class Card {
  public inputNode: gfx.Empty;

  private moveNode: gfx.Empty;
  private effectNode: gfx.Empty;
  private cardSprite: gfx.Sprite;
  private cardSpine: gfx.Spine;
  private dropShadow: gfx.Sprite;

  private spriteHilite: HiliteAnimation;
  private cardsImages: string[];

  private _cardIndex = -1;
  private cardParticle: CardParticle | null;

  private timeline: anim.Timeline;
  private bounceTimeline: anim.Timeline;
  private root: gfx.Empty;

  public text: gfx.BitmapText;

  private _useSpine = true;
  private currentLocation: CardLocation | undefined = undefined;

  constructor(root: gfx.Empty, timeline: anim.Timeline, isLast: boolean) {
    this.root = root;

    this.moveNode = CORE.gfx.createEmpty();
    this.moveNode.size = IS_MOBILE_DEVICE ? [130.0, 320.0] : [215.0, 320.0];
    this.moveNode.pivot = [0.5, 0.5];
    this.moveNode.parent = root;

    let position = isLast ? [0, 0] : [-43, 0];
    let size = isLast ? [210.0, 320.0] : [125.0, 320.0];

    if (IS_MOBILE_DEVICE) {
      position = [0.0, 0.0];
      size = [130.0, 320.0];
    }

    this.inputNode = CORE.gfx.createEmpty();
    this.inputNode.name = 'card_input';
    this.inputNode.position = position;
    this.inputNode.size = size;
    this.inputNode.pivot = [0.5, 0.5];
    this.inputNode.parent = this.moveNode;

    this.dropShadow = CORE.gfx.createSprite();
    this.dropShadow.name = 'card_drop_shadow';
    this.dropShadow.image = 'drop_shadow';
    this.dropShadow.pivot = [0.5, 0.5];
    this.dropShadow.position = [10.0, 27.0];
    this.dropShadow.opacity = 0.3;
    this.dropShadow.parent = this.moveNode;
    this.dropShadow.visible = false;
    this.dropShadow.depthGroup = GameLayer.Cards;

    const skeletonName = IS_MOBILE_DEVICE ? 'loke_cards_mobile' : 'loke_cards';
    this.cardSpine = CORE.gfx.createSpine(skeletonName);
    this.cardSpine.name = 'card_spine';
    this.cardSpine.parent = this.moveNode;
    this.cardSpine.depthGroup = GameLayer.Cards;
    this.cardSpine.visible = false;

    this.effectNode = CORE.gfx.createEmpty();
    this.effectNode.scale = IS_MOBILE_DEVICE ? [0.92, 0.99] : [1.0, 1.0];
    this.effectNode.parent = this.cardSpine;

    this.cardsImages = findAllImages('cards');
    this.cardSprite = CORE.gfx.createSprite();
    this.cardSprite.name = 'card_sprite';
    this.cardSprite.pivot = [0.5, 0.5];
    this.cardSprite.parent = this.moveNode;
    this.cardSprite.visible = false;
    this.cardSprite.depthGroup = GameLayer.Cards;
    this.cardSprite.glShader = 'sprite_alpha';
    this.cardSprite.glUniform.tint = [1, 1, 1, 1];
    this.spriteHilite = new HiliteAnimation(this.cardSprite);
    this.timeline = timeline;
    this.bounceTimeline = new Timeline();

    this.cardParticle = null;

    this.text = CORE.gfx.createBitmapText('Default');
    this.text.scale = [2, 2];
    this.text.parent = this.cardSprite;
    this.text.depthGroup = 1000;
  }

  set parent(parent: gfx.Empty | null) {
    this.moveNode.parent = parent;
    this.moveNode.position = [0, 0];
    this.moveNode.scale = [1, 1];
  }

  get parent(): gfx.Empty | null {
    return this.moveNode.parent;
  }

  get depthGroup(): number {
    if (this.cardSpine.visible) {
      return this.cardSpine.depthGroup;
    } else {
      return this.cardSprite.depthGroup;
    }
  }

  set depthGroup(d: number) {
    this.cardSpine.depthGroup = d;
    this.cardSprite.depthGroup = d;
    this.dropShadow.depthGroup = d;
    this.cardParticle?.setDepthGroup(d);
  }

  get useSpine(): boolean {
    return this._useSpine;
  }

  set useSpine(isSpine: boolean) {
    this._useSpine = isSpine;

    this.cardSpine.visible = isSpine;
    this.cardSprite.visible = !isSpine;
    this.dropShadow.visible = !isSpine && this.cardIndex !== CARD_BACK;

    const cardIndex = this.cardIndex;
    if (!isSpine) {
      this.cardSprite.image = `card_atlas_image_${cardIndex}`;
      return;
    }

    const isDragon = cardIndex === CARD_DRAGON;
    this.resetSkeleton(isDragon);

    if (cardIndex === CARD_BACK) {
      this.cardSpine.state.setAnimation(0, 'back');
      this.cardSpine.update(1, Physics.none);
    } else if (!isDragon) {
      const suit = Math.floor(cardIndex / 13);
      const rank = cardIndex % 13;
      if (suit < suitSkinNames.length) {
        this.cardSpine.skin = suitSkinNames[suit];
      }
      if (rank < rankAnimationNames.length) {
        this.cardSpine.state.setAnimation(0, rankAnimationNames[rank]);
      }
    }
  }

  get cardIndex(): number {
    return this._cardIndex;
  }

  set cardIndex(index: number) {
    this._cardIndex = index;
    this.useSpine = true;
    //this.useSpine = PLATFORM.isMobile
    //  ? index !== CARD_BACK
    //  : index === CARD_DRAGON;
  }

  set shadow(val: boolean) {
    if (!IS_MOBILE_DEVICE) {
      this.cardSpine.state.setAnimation(3, val ? 'shadow_on' : 'shadow_off');
    }
  }

  private resetSkeleton(isDragon: boolean): void {
    const skeletonName: string = IS_MOBILE_DEVICE
      ? isDragon
        ? 'dragon_card_mobile2'
        : 'loke_cards_mobile'
      : isDragon
        ? 'dragon_card'
        : 'loke_cards';

    if (this.cardSpine.skeletonName === skeletonName) {
      return;
    }

    const spine = CORE.gfx.createSpine(skeletonName);
    spine.depthGroup = this.cardSpine.depthGroup;
    spine.scale = this.cardSpine.scale;
    spine.position = this.cardSpine.position;
    spine.parent = this.moveNode;
    spine.visible = this.cardSpine.visible;
    this.cardSpine = spine;

    if (isDragon) {
      this.cardSpine.state.setAnimation(0, 'idle', true);
    }
  }

  get node(): gfx.NodeProperties {
    return this.moveNode;
  }

  public isEffectPlaying() {
    return this.cardParticle != null && this.cardParticle.isPlaying();
  }

  private getCardParticle(): CardParticle {
    if (this.cardParticle == null) {
      this.cardParticle = GAME.particlePlayer.getCardParticle(
        this,
        this.effectNode,
      );
    }
    this.cardParticle.setSlim(this.slim);
    return this.cardParticle;
  }

  private releaseParticle(): void {
    if (this.cardParticle != null) {
      this.cardParticle.kill();
      GAME.particlePlayer.poolCardParticle(this.cardParticle);
      this.cardParticle = null;
    }
  }

  private activateParticle(
    action: 'setGlow' | 'setGambleFirstCard' | 'setGambleWin' | 'setGambleLose',
    activate: boolean,
  ): void {
    if (activate) {
      this.getCardParticle()[action](true);
    } else {
      if (this.cardParticle != null) {
        this.cardParticle[action](false);
        this.releaseParticle();
      }
    }
  }

  public setWinParticle(
    active: boolean,
    selected: number,
    matches: number,
    isFreespin: boolean,
  ): void {
    this.light = active;
    if (active) {
      this.getCardParticle().setWin(active, selected, matches, isFreespin);
    } else {
      this.cardParticle?.setWin(false, selected, matches, isFreespin);
      this.releaseParticle();
    }
  }

  set glow(active: boolean) {
    this.activateParticle('setGlow', active);
  }

  set gambleFirstCard(active: boolean) {
    this.activateParticle('setGambleFirstCard', active);
  }

  set gambleWin(active: boolean) {
    this.activateParticle('setGambleWin', active);
  }

  set gambleLose(active: boolean) {
    this.activateParticle('setGambleLose', active);
  }

  get visible(): boolean {
    return this.cardSpine.visible || this.cardSprite.visible;
  }
  set visible(vis: boolean) {
    if (vis) {
      this.cardSpine.visible = this.useSpine;
      this.cardSprite.visible = !this.useSpine;
      this.dropShadow.visible = !this.useSpine && this.cardIndex !== CARD_BACK;
    } else {
      this.cardSpine.visible = false;
      this.cardSprite.visible = false;
      this.dropShadow.visible = false;
    }
  }

  get slim(): boolean {
    const animName = this.cardSpine.state.getCurrent(1)?.animation?.name;
    return animName === 'card_idle_s';
  }
  set slim(slim: boolean) {
    const animName = slim ? 'card_idle_s' : 'card_transformation2';
    const anim = this.cardSpine.skeleton.data.findAnimation(animName);
    if (anim !== null) {
      this.cardSpine.state.setAnimationWith(1, anim);
    }
    this.cardParticle?.setSlim(slim);
    this.dropShadow.scale = slim ? [0.5, 1.0] : [1.0, 1.0];
    this.effectNode.scale = IS_MOBILE_DEVICE
      ? [slim ? 1.0 : 0.92, slim ? 0.985 : 0.99]
      : [1.0, 1.0];
  }

  set light(active: boolean) {
    const animName = this.slim
      ? active
        ? 'light_on_slim'
        : 'light_off_slim'
      : active
        ? 'light_on'
        : 'light_off';
    this.cardSpine.state.setAnimation(2, animName);
  }

  public dim(): void {
    this.cardSprite.glUniform.tint = [0.9, 0.9, 0.9, 1.0];
  }

  public undim(): void {
    this.cardSprite.glUniform.tint = [1.0, 1.0, 1.0, 1.0];
  }

  public reset(): void {
    if (this.useSpine) {
      this.cardSpine.opacity = 1;
      this.cardSpine.state.setEmptyAnimation(0);
      this.cardSpine.state.setEmptyAnimation(1);
      this.cardSpine.state.setEmptyAnimation(2);
      this.cardSpine.state.setEmptyAnimation(3);
      const animName = 'card_idle';
      const anim = this.cardSpine.skeleton.data.findAnimation(animName);
      if (anim !== null) {
        this.cardSpine.state.setAnimationWith(1, anim);
      }
    } else {
      this.cardSprite.opacity = 1;
    }
  }

  public killEffects(): void {
    if (this.cardParticle) {
      this.cardParticle.kill();
      GAME.particlePlayer.poolCardParticle(this.cardParticle);
      this.cardParticle = null;
    }
  }

  public update(delta: number): void {
    if (this.useSpine && this.cardSpine.visible) {
      this.cardSpine.update(delta, Physics.none);
    }
    this.cardParticle?.update(delta);
  }

  public async discard(
    animationTimeSeconds: number,
    animationDelaySeconds = 0,
    start: CardLocation,
    target: CardLocation,
    targetOffset = [0, 0],
  ): Promise<void> {
    await this.move(
      animationTimeSeconds,
      animationDelaySeconds,
      start,
      target,
      false,
      [0, 0],
      targetOffset,
    );
    this.visible = false;
  }

  public async returnToTableDeck(delay: number): Promise<void> {
    if (this.currentLocation === undefined) return;

    const start = this.currentLocation;
    const target = {name: CardName.TableDeck};
    const targetOffset = [0, -20];

    this.parent = this.getCardNode(start);

    return this.discard(0.2, delay, start, target, targetOffset).then(() => {
      this.currentLocation = target;
    });
  }

  public setPosition(location: CardLocation): void {
    const node = this.getCardNode(location);
    this.currentLocation = location;
    this.moveNode.position = node.position;
    this.moveNode.scale = node.scale;
  }

  public copyPosition(other: Card): void {
    this.moveNode.worldPosition = other.moveNode.worldPosition;
    this.moveNode.scale = other.moveNode.scale;
  }

  public async move(
    animationTimeSeconds: number,
    animationDelaySeconds = 0,
    start: CardLocation,
    target: CardLocation,
    turnOffSlim = false,
    startOffset = [0, 0],
    targetOffset = [0, 0],
  ): Promise<void> {
    await wait(animationDelaySeconds * 1000);

    if (turnOffSlim && IS_MOBILE_DEVICE) {
      this.slim = false;
    }

    this.cardSpine.visible = this.useSpine;
    this.cardSprite.visible = !this.useSpine;

    this.parent = this.root;
    const nodeStart = this.getCardNode(start);
    const nodeTarget = this.getCardNode(target);
    const {promise: cardMoved, resolve} = voidPromise();

    this.timeline
      .animate(anim.OutQuad(0, 1), animationTimeSeconds, (t) => {
        const x = anim.easeLinear(
          nodeStart.worldPosition[0] + startOffset[0],
          nodeTarget.worldPosition[0] + targetOffset[0],
          t,
        );
        const y = anim.easeLinear(
          nodeStart.worldPosition[1] + startOffset[1],
          nodeTarget.worldPosition[1] + targetOffset[1],
          t,
        );
        const parentScale =
          nodeTarget.parent !== null ? nodeTarget.parent.scale[0] : 1;
        const scale = anim.easeLinear(
          nodeStart.scale[0],
          nodeTarget.scale[0] * parentScale,
          t,
        );
        this.moveNode.worldPosition = [x, y];
        this.moveNode.scale = [scale, scale];
      })
      .after(() => {
        resolve();
      });

    await cardMoved;

    this.parent = nodeTarget;
    this.currentLocation = target;
  }

  public async arcMove(
    arc: number,
    animationTimeSeconds: number,
    animationDelaySeconds = 0,
    start: CardLocation,
    target: CardLocation,
  ): Promise<void> {
    await wait(animationDelaySeconds * 1000);

    this.cardSpine.visible = this.useSpine;
    this.cardSprite.visible = !this.useSpine;

    this.parent = this.root;
    const nodeStart = this.getCardNode(start);
    const nodeTarget = this.getCardNode(target);
    const {promise: cardMoved, resolve} = voidPromise();

    this.timeline
      .animate(
        (t) => t,
        animationTimeSeconds,
        (delta) => {
          const mid = [
            (nodeStart.position[0] + nodeTarget.position[0]) / 2,
            (nodeStart.position[1] + nodeTarget.position[1]) / 2 + arc,
          ];
          const from = [nodeStart.position[0], nodeStart.position[1]];
          const to = [nodeTarget.position[0], nodeTarget.position[1]];
          const spline = new CurveInterpolator([from, mid, to], {
            tension: 0,
            alpha: 1,
          });
          const point = spline.getPointAt(delta);
          this.moveNode.position = [point[0], point[1]];

          const scale = anim.easeLinear(
            nodeStart.scale[0],
            nodeTarget.scale[0],
            delta,
          );
          this.moveNode.scale = [scale, scale];
        },
      )
      .after(() => {
        resolve();
      });

    await cardMoved;

    this.parent = nodeTarget;
    this.currentLocation = target;
  }

  public async flip(
    back: number,
    delay: number,
    time: number,
    flipDelay = 0,
    isGamble = false,
  ): Promise<void> {
    this.cardSpine.visible = this.useSpine;
    this.cardSprite.visible = !this.useSpine;

    const {promise: cardFlipped, resolve} = voidPromise();

    // CORE.fx.trigger(isGamble ? 'fx_gamble_flip_card' : 'fx_swap_cards');
    if (isGamble) {
      CORE.fx.trigger('fx_gamble_flip_card');
    }
    this.timeline
      .animate(anim.Linear(0, 1), time / 2 + flipDelay, (t) => {
        this.cardSpine.scale[0] = 1 - t;
        this.cardSprite.scale[0] = 1 - t;
      })
      .delay(delay)
      .chain(anim.Linear(0, 1), time / 2 + flipDelay, (t) => {
        this.cardSprite.scale[0] = t;
        this.cardSpine.scale[0] = t;
      })
      .before(() => {
        this.cardIndex = back;
      })
      .after(() => {
        resolve();
      });

    await cardFlipped;
  }

  public async swap(cardIndex: number, delay: number): Promise<void> {
    const didUseSpine = this.useSpine;
    if (!didUseSpine) {
      this.useSpine = true;
    }

    const entry = this.cardSpine.state.setAnimation(1, 'swap');
    entry.delay = delay;
    waitEvent(this.cardSpine, {event: 'new_card', entry}).then(() => {
      // don't use this.cardIndex = cardIndex; since it would turn off spine animation
      this._cardIndex = cardIndex;
      this.useSpine = true;
    });
    await waitAnimation(this.cardSpine, 'swap');

    if (!didUseSpine) {
      this.useSpine = false;
    }
  }

  public async doSelectionExitAnimation(delaySec: number): Promise<void> {
    if (this.useSpine) {
      await wait(delaySec * 1000);
      this.cardSpine.state.setAnimation(1, 'select_exit');
    }
  }

  private getCardNode(cardLocation: CardLocation): gfx.Empty {
    const nodeName = getCardNodeName(cardLocation.name, cardLocation.index);
    return getNode(this.root, nodeName);
  }

  public activateDragonCard(): void {
    CORE.fx.trigger('fx_dragon_activated');
    this.cardSpine.state.setAnimation(0, 'dragon_firebreath');
    waitAnimation(this.cardSpine, 'dragon_firebreath').then(() => {
      this.cardSpine.state.setAnimation(0, 'idle', true);
    });
  }

  public async jiggle(durationSec: number, delaySec: number): Promise<void> {
    await wait(delaySec * 1000);
    const originalPos = [this.moveNode.position[0], this.moveNode.position[1]];
    this.timeline
      .animate(anim.Linear(0, 1), durationSec, (t) => {
        this.moveNode.position = [
          originalPos[0],
          originalPos[1] - 10.0 * Math.sin(Math.PI * t),
        ];
      })
      .after(() => {
        this.moveNode.position = originalPos;
      });
  }

  public async bounce(factor: number): Promise<void> {
    this.bounceTimeline.tick(9999);
    AUTO_TICK.add(this.bounceTimeline);
    const originalScale = this.moveNode.scale[0];
    this.bounceTimeline
      .animate(anim.Linear(0, 1), 0.2, (t) => {
        const s = originalScale + 0.1 * factor * Math.sin(Math.PI * t);
        this.moveNode.scale = [s, s];
      })
      .after(() => {
        this.moveNode.scale = [originalScale, originalScale];
        AUTO_TICK.remove(this.bounceTimeline);
      });
  }
}
