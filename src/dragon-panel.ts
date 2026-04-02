import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {Timeline} from '@apila/game-libraries/dist/game-animation';
import * as particle from '@apila/particle-runtime';
import {AnimationStateListener, Bone, Event, TrackEntry} from '@apila/spine';

import {Round} from './config/backend-types';
import {GameLayer} from './config/schemas';
import {CORE, GAME} from './game';
import {TimedEvent} from './game-timer';
import {AUTO_TICK, CLIENT_STATE} from './main';
import {startParticle} from './particle-player';
import {DRAGON_BREATH} from './particles/dragon_breath';
import {DRAGON_BREATH_2} from './particles/dragon_breath_2';
import {waitAnimation, waitEvent} from './util/spine-utils';
import {wait} from './util/utils';
import {getBitmapText, getNode} from './util/utils-node';

export enum FireBreathState {
  None,
  WinsumMultiplierBreath,
  FreespinsWonBreath,
}

export class DragonPanel {
  private readonly spine: gfx.Spine;
  private readonly dragonBreath: particle.ParticleEffect;
  private readonly dragonBreathFreespins: particle.ParticleEffect;
  private readonly freepinsText: gfx.BitmapText;
  private readonly fireTarget: Bone;
  private readonly effectBone: Bone;
  private readonly effectNode: gfx.NodeProperties;
  private readonly emberParent: gfx.NodeProperties;

  private readonly targetVisualizer: gfx.Sprite;

  private readonly dragonIdleTrack = 1;
  private readonly mirrorIdleTrack = 2;
  private readonly freespinBgTrack = 3;
  private readonly freespinIdleTrack = 4;

  private delayedFireBreath?: TimedEvent;
  private dragonBreathListener?: AnimationStateListener;
  private fireBreathState = FireBreathState.None;
  private freespinRound = 0;
  private isSleeping = true;
  private timeline = new Timeline();
  private freespinTextDefaultScale: number;
  private dragonBreathAnimationSpeed = 1;

  public constructor(spineNode: gfx.Spine) {
    this.spine = spineNode;
    this.fireTarget = this.spine.skeleton.findBone('fire_target');
    this.effectBone = this.spine.skeleton.findBone('effect_bone');
    this.freepinsText = getBitmapText(this.spine, 'dragon_freespin_counter');
    this.freespinTextDefaultScale = this.freepinsText.scale[0];

    const gameRoot = GAME.nodeStorage.baseGame.nodes.root;
    this.emberParent = getNode(gameRoot, 'ember_fx');

    this.dragonBreath = particle.createEffect(DRAGON_BREATH_2, {
      parent: this.spine,
      depthGroup: GameLayer.WinscrollText - 1,
      name: 'dragon_breath_particle',
    });

    this.dragonBreathFreespins = particle.createEffect(DRAGON_BREATH, {
      parent: this.spine,
      depthGroup: GameLayer.DragonBreathFreespins,
      name: 'dragon_breath_freespins_particle',
    });

    this.effectNode = CORE.gfx.createEmpty({
      name: 'dragon_breath_effect_node',
      parent: this.spine,
    });

    this.spine.state.data.setMix('animation', 'multiplier_idle_2', 0.2);

    this.initDragonBreathEffect(this.dragonBreath);
    this.initDragonBreathEffect(this.dragonBreathFreespins);

    this.dragonBreath.emitters.forEach((emitter) => {
      emitter.worldSpaceNode = this.effectNode;
    });

    this.dragonBreathFreespins.emitters.forEach((emitter) => {
      emitter.worldSpaceNode = this.effectNode;
    });

    this.targetVisualizer = CORE.gfx.createSprite();
    this.targetVisualizer.name = 'target_visualizer';
    this.targetVisualizer.image = 'wintable_button';
    this.targetVisualizer.pivot = [0.5, 0.5];
    this.targetVisualizer.visible = false;
    this.targetVisualizer.depthGroup = 500;
    this.targetVisualizer.parent = this.spine;

    AUTO_TICK.add(this);
    this.show();
  }

  private initDragonBreathEffect(effect: particle.ParticleEffect): void {
    effect.emitters.forEach((emitter) => {
      emitter.shape.direction = 'radial';
      emitter.shape.pivot = particle.paramVector2([100, 0]);
    });
  }

  public async show(fadeInMs = 0): Promise<void> {
    this.spine.state.setAnimation(this.dragonIdleTrack, 'dragon_sleep', true);
    this.spine.state.setAnimation(this.mirrorIdleTrack, 'mirror_idle', true);
    this.isSleeping = true;

    if (fadeInMs === 0) {
      this.spine.visible = true;
      this.spine.opacity = 1;
      return;
    }

    this.spine.visible = true;
    this.timeline.animate(anim.OutQuad(0, 1), fadeInMs / 1000, (alpha) => {
      this.spine.opacity = alpha;
    });
  }

  public async hide(fadeOutMs = 0): Promise<void> {
    if (fadeOutMs === 0) {
      this.spine.visible = false;
      return;
    }

    this.timeline
      .animate(anim.OutQuad(1, 0), fadeOutMs / 1000, (alpha) => {
        this.spine.opacity = alpha;
      })
      .after(() => {
        this.spine.visible = false;
      });
  }

  public isVisible(): boolean {
    return this.spine.visible;
  }

  public reset(): void {
    this.deactivateBonus();
    this.spine.state.setEmptyAnimation(0);
    this.spine.state.setEmptyAnimation(this.freespinBgTrack);
    this.spine.state.setEmptyAnimation(this.freespinIdleTrack);
    this.spine.skin = 'default';
  }

  public async randomize(
    round: Round,
    isFreespins: boolean,
    skipAnimation = false,
  ): Promise<void> {
    // const isWonFreepins = round.freespinsAmount
    //   ? round.freespinsAmount > 0
    //   : false;
    const isWonFreepins = CLIENT_STATE.freespinWon;
    this.freespinRound = isFreespins ? ++this.freespinRound : 0;

    if (isFreespins) {
      this.freepinsText.text = `${CLIENT_STATE.freespinsLeft}`;
      this.freepinsText.visible = true;
      this.bounceFreespinsCounter();
    } else {
      this.freepinsText.visible = false;
    }

    if (!skipAnimation) {
      const entry = this.spine.state.setAnimation(
        0,
        isFreespins ? 'multiplier_raffle_FS' : 'multiplier_raffle',
      );
      waitEvent(this.spine, {event: 'multiplier_switch', entry}).then(() => {
        if (isWonFreepins) {
          this.spine.skin = `freespin`;
        } else {
          // const multiplier = isFreespins
          //   ? round.multiplier
          //   : round.win.multiplier;
          const multiplier = round.winFactor;
          if (multiplier !== undefined) {
            this.spine.skin = `${multiplier}x`;
          } else {
            this.spine.skin = `freespin`;
          }
        }
      });
      if (entry.animation) {
        await wait(entry.animation.duration * 1000);
      }

      if (isFreespins) {
        this.spine.state.setAnimation(0, 'multiplier_idle_active', true);
      } else if (!isWonFreepins) {
        this.spine.state.setAnimation(0, 'multiplier_idle', true);
      }
    } else {
      if (isWonFreepins) {
        this.spine.skin = `freespin`;
      }
    }
  }

  public async activateBonus(
    isWonFreespins: boolean,
    delayMs = 0,
  ): Promise<void> {
    await wait(delayMs);
    if (isWonFreespins) {
      CORE.fx.trigger('fx_freespin_activation');
      this.spine.state.setAnimation(0, 'multiplier_raffle_FS');
    } else {
      CORE.fx.trigger('fx_multiplier_activation');
      this.spine.state.setAnimation(0, 'multiplier_activate');
      this.spine.state.addAnimation(0, 'multiplier_idle_active', true);
    }
    this.isSleeping = false;
    this.spine.state.setAnimation(this.dragonIdleTrack, 'dragon_wakeup');
    this.spine.state.addAnimation(
      this.dragonIdleTrack,
      'dragon_idle_loop',
      true,
    );
    await wait(1000);
  }

  public deactivateBonus(isRoundEnd = false): void {
    if (!this.isSleeping) {
      this.isSleeping = true;
      if (isRoundEnd) {
        this.spine.state.setAnimation(0, 'multiplier_idle', true);
      } else {
        this.spine.state.setAnimation(0, 'multiplier_deactivate');
      }
      this.spine.state.setAnimation(this.dragonIdleTrack, 'dragon_back_sleep');
      this.spine.state.addAnimation(this.dragonIdleTrack, 'dragon_sleep', true);
    }
  }

  public async freespinsStart(): Promise<void> {
    this.freepinsText.text = `${CLIENT_STATE.freespinsLeft}`;
    this.freepinsText.opacity = 0;
    this.freepinsText.visible = true;
    this.timeline
      .animate(
        anim.OutQuad(0, 1),
        0.7,
        anim.Property(this.freepinsText, 'opacity'),
      )
      .delay(0.3);

    this.spine.state.setAnimation(this.freespinIdleTrack, 'animation');
    this.spine.state.addAnimation(
      this.freespinIdleTrack,
      'multiplier_idle_2',
      true,
    );
    this.spine.state.setAnimation(this.freespinBgTrack, 'freespin_counter');
    await waitAnimation(this.spine, 'freespin_counter');
    this.stopDragonBreath();
  }

  public freespinsEnd(): void {
    this.timeline
      .animate(
        anim.OutQuad(1, 0),
        0.5,
        anim.Property(this.freepinsText, 'opacity'),
      )
      .after(() => {
        this.freepinsText.visible = false;
      });

    this.spine.state.setAnimation(
      this.freespinBgTrack,
      'freespin_counter_remove',
    );
    waitAnimation(this.spine, 'freespin_counter_remove').then(() => {
      this.spine.state.setEmptyAnimation(this.freespinIdleTrack);
    });
  }

  public async startDragonBreath(
    breathState: FireBreathState,
    delay: number,
    animationSpeed = 1,
  ): Promise<void> {
    this.fireBreathState = breathState;
    this.dragonBreathAnimationSpeed = animationSpeed;

    if (delay > 500) {
      this.spine.state.setAnimation(
        this.dragonIdleTrack,
        'dragon_breath_waitloop',
        true,
      );
    }

    this.delayedFireBreath = CORE.gameTimer.invoke(delay / 1000, () => {
      this.delayedFireBreath = undefined;

      const entry = this.spine.state.setAnimation(
        this.dragonIdleTrack,
        'dragon_breath',
        false,
      );
      entry.timeScale = animationSpeed;

      this.dragonBreathListener = {
        event: (entry: TrackEntry, event: Event): void => {
          if (event.data.name !== 'dragon_breath') {
            return;
          }
          if (entry.animation && entry.animation.name !== 'dragon_breath') {
            return;
          }
          if (this.dragonBreathListener === undefined) {
            return;
          }

          this.spine.state.removeListener(this.dragonBreathListener);
          if (this.fireBreathState === FireBreathState.FreespinsWonBreath) {
            CORE.fx.trigger('fx_dragon_fire_breath');
            startParticle(this.dragonBreathFreespins);
          } else {
            CORE.fx.trigger('fx_dragon_fire_breath');
            startParticle(this.dragonBreath);
          }
        },
        dispose: (trackEntry: TrackEntry): void => {
          if (trackEntry === entry && this.dragonBreathListener !== undefined) {
            this.spine.state.removeListener(this.dragonBreathListener);
          }
        },
      };
      this.spine.state.addListener(this.dragonBreathListener);

      this.spine.state.addAnimation(
        this.dragonIdleTrack,
        'dragon_idle_loop',
        true,
      );
    });
  }

  public stopDragonBreath(): void {
    if (this.delayedFireBreath) {
      this.delayedFireBreath.cancel();
      this.delayedFireBreath = undefined;
    }
    if (this.dragonBreathListener) {
      this.spine.state.removeListener(this.dragonBreathListener);
      this.dragonBreathListener = undefined;
    }

    if (this.fireBreathState === FireBreathState.None) {
      return;
    }

    if (this.fireBreathState === FireBreathState.FreespinsWonBreath) {
      this.dragonBreathFreespins.stop();
    } else if (
      this.fireBreathState === FireBreathState.WinsumMultiplierBreath
    ) {
      this.dragonBreath.stop();
    }

    wait(3000).then(() => {
      this.fireBreathState = FireBreathState.None;
      AUTO_TICK.remove(this.dragonBreath);
      AUTO_TICK.remove(this.dragonBreathFreespins);
    });
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
    if (this.fireBreathState === FireBreathState.None) {
      return;
    }

    if (this.fireBreathState === FireBreathState.WinsumMultiplierBreath) {
      this.fireTarget.x = -this.spine.worldPosition[0];
      this.fireTarget.y = this.spine.worldPosition[1];
      this.fireTarget.x /= this.spine.worldScale[0];
      this.fireTarget.y /= this.spine.worldScale[1];
      this.updateEffectNode(this.dragonBreath);
    } else if (this.fireBreathState === FireBreathState.FreespinsWonBreath) {
      const dragonPos = this.spine.worldPosition;
      const emberPos = this.emberParent.worldPosition;
      this.fireTarget.x = -dragonPos[0] + emberPos[0];
      this.fireTarget.y = dragonPos[1] - emberPos[1];
      this.fireTarget.x /= this.spine.worldScale[0];
      this.fireTarget.y /= this.spine.worldScale[1];
      this.updateEffectNode(this.dragonBreathFreespins);
    }

    this.targetVisualizer.position = [
      this.fireTarget.worldX,
      this.fireTarget.worldY,
    ];

    if (this.fireBreathState === FireBreathState.FreespinsWonBreath) {
      this.dragonBreathFreespins.update(
        delta * this.dragonBreathAnimationSpeed,
      );
    } else {
      this.dragonBreath.update(delta * this.dragonBreathAnimationSpeed);
    }
  }

  private updateEffectNode(effect: particle.ParticleEffect) {
    //const deltaX = this.fireTarget.worldX - this.effectBone.worldX;
    //const deltaY = this.effectBone.worldY - this.fireTarget.worldY;
    //emitter.mesh.rotation = Math.atan2(deltaX, deltaY);

    const angle =
      this.effectBone.getWorldRotationY() * (Math.PI / 180.0) - Math.PI;

    effect.emitters.forEach((emitter) => {
      if (emitter.mesh !== null) {
        emitter.mesh.position = [
          this.effectBone.worldX,
          this.effectBone.worldY,
        ];
        emitter.mesh.scale = [5.0, 5.0];
      }

      emitter.shape.pivot = particle.paramVector2([
        Math.cos(angle) * 100,
        Math.sin(angle) * 100,
      ]);
    });
  }

  private async bounceFreespinsCounter(): Promise<void> {
    this.timeline.animate(anim.Linear(0, 1), 0.2, (t) => {
      const s = this.freespinTextDefaultScale + 0.5 * Math.sin(Math.PI * t);
      this.freepinsText.scale = [s, s];
    });
  }
}
