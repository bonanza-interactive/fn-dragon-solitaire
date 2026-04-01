import {VectorT} from '@apila/engine/dist/apila-gfx';
import * as particle from '@apila/particle-runtime';

import {AUTO_TICK} from './main';
import {stopParticle} from './particle-player';

enum ParticleState {
  NotRunning,
  Active,
  Stopping,
}

export class CardParticleEffect {
  public effect: particle.ParticleEffect;
  private state = ParticleState.NotRunning;
  private _depthGroup = 0;

  constructor(effect: particle.ParticleEffect) {
    this.effect = effect;
    this.effect.depthGroup = 0;
    this.effect.stop();
    this.effect.reset();
    this.setVisible(false);
    stopParticle(this.effect);
  }

  public start(): void {
    this.state = ParticleState.Active;
    this.setVisible(true);
    this.effect.emitters.forEach((emitter) => {
      if (emitter.mesh) {
        emitter.mesh.visible = true;
      }
    });
    this.effect.depthGroup = this._depthGroup;
    this.effect.start();
    this.effect.emitters[0].onEmitterComplete = undefined;

    AUTO_TICK.add(this.effect);
  }

  public stop(): void {
    if (this.state !== ParticleState.Active) {
      return;
    }
    this.state = ParticleState.Stopping;
    this.effect.stop();
    this.effect.emitters[0].onEmitterComplete = () => {
      this.setVisible(false);
      this.effect.reset();
      this.effect.depthGroup = 0;
      AUTO_TICK.remove(this.effect);
      this.state = ParticleState.NotRunning;
    };
  }

  public kill(): void {
    this.setVisible(false);
    stopParticle(this.effect);
    this.effect.reset();
    this.effect.depthGroup = 0;
    AUTO_TICK.remove(this.effect);
    this.state = ParticleState.NotRunning;
  }

  set depthGroup(val: number) {
    this._depthGroup = val;
    this.effect.depthGroup = val;
  }

  set scale(val: VectorT) {
    this.effect.node.scale = val;
  }

  public isEmitting() {
    return this.effect.isEmitting();
  }

  private setVisible(isVisible: boolean): void {
    this.effect.node.visible = isVisible;
    for (const child of this.effect.node.children) {
      child.visible = isVisible;
    }
  }
}
