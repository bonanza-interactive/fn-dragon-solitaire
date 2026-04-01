import {gfx} from '@apila/engine';
import * as particle from '@apila/particle-runtime';

import {GameLayer} from './config/schemas';
import {CORE, GAME} from './game';
import {startParticle, stopParticle} from './particle-player';
import {BIG_WIN_1} from './particles/big_win_1';
import {BIG_WIN_2} from './particles/big_win_2';
import {BIG_WIN_3} from './particles/big_win_3';
import {MULTIPLIER_EXPLOSION} from './particles/multiplier_explosion';
import {MULTIPLIER_X10} from './particles/multiplier_x10';
import {MULTIPLIER_X100} from './particles/multiplier_x100';
import {MULTIPLIER_X15} from './particles/multiplier_x15';
import {MULTIPLIER_X2} from './particles/multiplier_x2';
import {MULTIPLIER_X25} from './particles/multiplier_x25';
import {MULTIPLIER_X3} from './particles/multiplier_x3';
import {MULTIPLIER_X5} from './particles/multiplier_x5';
import {MULTIPLIER_X50} from './particles/multiplier_x50';
import {MULTIPLIER_X7} from './particles/multiplier_x7';
import {getSpine} from './util/utils-node';
import {Physics} from '@apila/spine';

export class WinScrollEffect {
  private parentNode: gfx.NodeProperties;

  private bigWinSpine: gfx.Spine;
  private bigWinParticles: particle.ParticleEffect[];

  private multiplierExplosion: particle.ParticleEffect;
  private multiplierParticles: particle.ParticleEffect[];
  private activeMultiplier: particle.ParticleEffect | undefined = undefined;
  private isMultiplierEffectRunning: boolean;

  public constructor(parent: gfx.NodeProperties) {
    this.parentNode = parent;
    this.bigWinSpine = getSpine(parent, 'big_win_spine');

    this.multiplierExplosion = this.createParticle(
      MULTIPLIER_EXPLOSION,
      'multiplier_explosion',
      2,
    );

    this.bigWinParticles = [];
    this.bigWinParticles.push(
      this.createParticle(BIG_WIN_1, 'big_win_particle_1', -20),
      this.createParticle(BIG_WIN_2, 'big_win_particle_2', -20),
      this.createParticle(BIG_WIN_3, 'big_win_particle_3', -20),
    );

    // crown position
    this.bigWinParticles[0].node.position = [0, -440];

    this.isMultiplierEffectRunning = false;
    this.multiplierParticles = [];
    this.multiplierParticles.push(
      this.createParticle(MULTIPLIER_X2, 'multiplier_x2', 1),
      this.createParticle(MULTIPLIER_X3, 'multiplier_x3', 1),
      this.createParticle(MULTIPLIER_X5, 'multiplier_x5', 1),
      this.createParticle(MULTIPLIER_X7, 'multiplier_x7', 1),
      this.createParticle(MULTIPLIER_X10, 'multiplier_x10', 1),
      this.createParticle(MULTIPLIER_X15, 'multiplier_x15', 1),
      this.createParticle(MULTIPLIER_X25, 'multiplier_x25', 1),
      this.createParticle(MULTIPLIER_X50, 'multiplier_x50', 1),
      this.createParticle(MULTIPLIER_X100, 'multiplier_x100', 1),
    );

    //const effect_spot = this.bigWinSpine.skeleton.findBone('effect_spot');
    for (const p of this.multiplierParticles) {
      //p.node.worldPosition = this.bigWinSpine.boneWorldPos(effect_spot);
      p.node.worldPosition = [0, 0];
    }
  }

  public update(delta: number): void {
    this.bigWinSpine.update(delta, Physics.none);
    for (const p of this.bigWinParticles) {
      if (p.isEmitting()) {
        p.update(delta);
      }
    }
  }

  public updateMultiplier(delta: number): void {
    this.multiplierExplosion.update(delta);
    if (this.isMultiplierEffectRunning && this.activeMultiplier !== undefined) {
      this.activeMultiplier.update(delta);
    }
  }

  private createParticle(
    effect: particle.EffectProperties,
    name: string,
    depthOffset: number,
  ): particle.ParticleEffect {
    return particle.createEffect(effect, {
      parent: this.parentNode,
      depthGroup: GameLayer.WinscrollText + depthOffset,
      name: name,
    });
  }

  public bigWinEffect(): void {
    this.bigWinSpine.visible = true;
    this.bigWinSpine.state.setAnimation(0, 'big_win_appear', false);
    this.bigWinSpine.state.addAnimation(0, 'big_win_loop', true);
  }

  public playBigWinParticle(level: number): void {
    startParticle(this.bigWinParticles[level]);
  }

  public hideBigWinEffect(): void {
    if (this.bigWinSpine.visible) {
      this.bigWinSpine.visible = false;
    }
    for (const p of this.bigWinParticles) {
      stopParticle(p);
    }
    GAME.dragonPanel.stopDragonBreath();
    this.killMultiplierEffect();
  }

  public multiplierEffect(multiplier: number): void {
    this.isMultiplierEffectRunning = true;
    this.activeMultiplier = this.multiplierToParticle(multiplier);
    startParticle(this.activeMultiplier);
  }

  public doMultiplierExplosion(): void {
    startParticle(this.multiplierExplosion);
    CORE.fx.trigger('fx_dragon_multiplier_apply');
  }

  private multiplierToParticle(multiplier: number): particle.ParticleEffect {
    switch (multiplier) {
      default:
      case 2:
        return this.multiplierParticles[0];
      case 3:
        return this.multiplierParticles[1];
      case 5:
        return this.multiplierParticles[2];
      case 7:
        return this.multiplierParticles[3];
      case 10:
        return this.multiplierParticles[4];
      case 15:
        return this.multiplierParticles[5];
      case 25:
        return this.multiplierParticles[6];
      case 50:
        return this.multiplierParticles[7];
      case 100:
        return this.multiplierParticles[8];
    }
  }

  public killMultiplierEffect() {
    this.isMultiplierEffectRunning = false;
    if (this.activeMultiplier !== undefined) {
      stopParticle(this.activeMultiplier);
      this.activeMultiplier = undefined;
    }
    stopParticle(this.multiplierExplosion);
  }
}
