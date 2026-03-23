import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {CurveInterpolator} from 'curve-interpolator';
import {AnimatedImage} from './animated-image';
import {findAllImages} from './image-atlas';
import {GameLayer} from './config/schemas';
import {CORE} from './game';
import {HiliteAnimation} from './hilite-animation';
import {getCardNodeName, voidPromise} from './util/utils';
import {CardLocation} from './config/config';
import {getNode} from './util/utils-node';
import {runWaitAnimation} from './cards';

const JOKER_ANIM_FRAMES = 20;

export class Card {
  private moveNode: gfx.Empty;
  private cardSprite: gfx.Sprite;

  private hilite: HiliteAnimation;
  private cardsImages: string[];

  private _cardIndex = -1;
  private jokerAnimation: AnimatedImage;
  private jokerAnimFrames: number[][] = [];
  private glowSprite: gfx.Sprite;
  private glowHilite: HiliteAnimation;
  private timeline: anim.Timeline;
  private root: gfx.Empty;

  public text: gfx.BitmapText;
  public timeScale = 1;

  constructor(root: gfx.Empty, timeline: anim.Timeline) {
    this.moveNode = CORE.gfx.createEmpty();
    this.moveNode.pivot = [0.5, 0.5];
    this.moveNode.parent = root;
    this.root = root;

    this.cardsImages = findAllImages('cards');
    this.cardSprite = CORE.gfx.createSprite();
    this.cardSprite.pivot = [0.5, 0.5];
    this.cardSprite.parent = this.moveNode;
    this.cardSprite.visible = false;
    this.cardSprite.depthGroup = GameLayer.Cards;
    this.hilite = new HiliteAnimation(this.cardSprite);
    this.timeline = timeline;

    const jokerImages = findAllImages('joker_anim');
    this.jokerAnimation = new AnimatedImage(this.cardSprite, jokerImages, 30);

    for (let j = 0; j < 4; j++) {
      const jokerFrames = [];
      for (let i = 0; i < JOKER_ANIM_FRAMES; i++) {
        jokerFrames.push(i + 20 * j);
      }
      this.jokerAnimFrames.push(jokerFrames);
    }

    this.glowSprite = CORE.gfx.createSprite();
    this.glowSprite.parent = this.cardSprite;
    this.glowSprite.image = 'card_glow';
    this.glowSprite.pivot = [0.5, 0.5];
    this.glowHilite = new HiliteAnimation(this.glowSprite);
    this.glowHilite.hilite(0.3, 1.0, 0.3, 0.0, true);
    this.glowSprite.visible = false;

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

  set depthGroup(d: number) {
    this.cardSprite.depthGroup = d;
  }

  set cardIndex(index: number) {
    this._cardIndex = index;
    this.cardSprite.image = this.cardsImages[index];
  }

  get cardIndex(): number {
    return this._cardIndex;
  }

  get node(): gfx.NodeProperties {
    return this.cardSprite;
  }

  set glow(active: boolean) {
    this.glowSprite.visible = active;
  }

  get visible(): boolean {
    return this.cardSprite.visible;
  }

  set visible(vis: boolean) {
    this.cardSprite.visible = vis;
  }

  public dim(): void {
    if (!this.cardSprite.visible) return;

    this.hilite.hilite(1, 0.35, 0.1, 0);
  }

  public reset(): void {
    this.cardSprite.opacity = 1;
  }

  public async showJokerAnim(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const card = this.cardIndex;
      if (card >= 0 && card < 52 && card % 13 === 1) {
        this.cardIndex = 53 + Math.floor(card / 13);
        this.jokerAnimation.playAnimation(
          JOKER_ANIM_FRAMES,
          this.jokerAnimFrames[Math.floor(card / 13)]
        );
        await runWaitAnimation(this.timeline, JOKER_ANIM_FRAMES / 30);
      }
      resolve();
    });
  }

  public async discard(
    animationTimeSeconds: number,
    animationDelaySeconds = 0,
    start: CardLocation,
    target: CardLocation
  ): Promise<void> {
    await this.move(animationTimeSeconds, animationDelaySeconds, start, target);
    this.visible = false;
  }

  public async move(
    animationTimeSeconds: number,
    animationDelaySeconds = 0,
    start: CardLocation,
    target: CardLocation
  ): Promise<void> {
    await runWaitAnimation(this.timeline, animationDelaySeconds);

    this.parent = this.root;
    const nodeStart = this.getCardNode(start);
    const nodeTarget = this.getCardNode(target);
    const {promise: cardMoved, resolve} = voidPromise();
    this.timeline
      .animate(anim.Linear(0, 1), animationTimeSeconds, (t) => {
        const x = anim.easeLinear(
          nodeStart.position[0],
          nodeTarget.position[0],
          t
        );
        const y = anim.easeLinear(
          nodeStart.position[1],
          nodeTarget.position[1],
          t
        );
        const scale = anim.easeLinear(
          nodeStart.scale[0],
          nodeTarget.scale[0],
          t
        );
        this.moveNode.position = [x, y];
        this.moveNode.scale = [scale, scale];
      })
      .before(() => {
        this.cardSprite.visible = true;
      })
      .after(() => {
        resolve();
      });

    await cardMoved;

    this.parent = nodeTarget;
  }

  public async arcMove(
    arc: number,
    animationTimeSeconds: number,
    animationDelaySeconds = 0,
    start: CardLocation,
    target: CardLocation
  ): Promise<void> {
    await runWaitAnimation(this.timeline, animationDelaySeconds);

    this.cardSprite.visible = true;
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
            delta
          );
          this.moveNode.scale = [scale, scale];
        }
      )
      .after(() => {
        resolve();
      });

    await cardMoved;

    this.parent = nodeTarget;
  }

  public flip(
    front: number,
    back: number,
    delay: number,
    time: number,
    flipDelay = 0
  ) {
    this.cardSprite.visible = true;

    return this.timeline
      .animate(anim.Linear(0, 1), time / 2 + flipDelay, (t) => {
        this.cardSprite.scale[0] = 1 - t;
      })
      .delay(delay)
      .before(() => {
        this.cardSprite.image = this.cardsImages[front];
      })
      .chain(anim.Linear(0, 1), time / 2 + flipDelay, (t) => {
        this.cardSprite.scale[0] = t;
      })
      .before(() => {
        this.cardIndex = back;
        this.cardSprite.image = this.cardsImages[this.cardIndex];
      });
  }

  private getCardNode(cardLocation: CardLocation): gfx.Empty {
    const nodeName = getCardNodeName(cardLocation.name, cardLocation.index);
    return getNode(this.root, nodeName);
  }
}
