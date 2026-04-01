import {gfx} from '@apila/engine';
import * as particle from '@apila/particle-runtime';

import {Card} from './card';
import {CardParticle} from './card-particle';
import {GAME} from './game';
import {AUTO_TICK} from './main';
import {BG_EMBERS} from './particles/BG_embers';
import {getNode} from './util/utils-node';

export class ParticlePlayer {
  public readonly bgEmbers: particle.ParticleEffect;

  public readonly cardParticles: CardParticle[] = [];

  constructor() {
    const gameRoot = GAME.nodeStorage.baseGame.nodes.root;

    const emberParent = getNode(gameRoot, 'ember_fx');
    this.bgEmbers = particle.createEffect(BG_EMBERS, {
      parent: emberParent,
      depthGroup: emberParent.depthGroup,
      name: 'ember_fx_particle',
    });
    AUTO_TICK.add(this.bgEmbers);
    this.bgEmbers.start();
  }

  public getCardParticle(
    card: Card,
    cardNode: gfx.NodeProperties,
  ): CardParticle {
    let particle: CardParticle;
    if (this.cardParticles.length > 0) {
      particle = this.cardParticles.pop() as CardParticle;
      particle.setParent(cardNode);
    } else {
      particle = new CardParticle(cardNode);
    }
    particle.setDepthGroup(card.depthGroup);
    return particle;
  }

  public poolCardParticle(particle: CardParticle): void {
    this.cardParticles.push(particle);
  }
}

export function startParticle(p: particle.ParticleEffect): void {
  p.start();
  p.emitters.forEach((emitter) => {
    if (emitter.mesh) {
      emitter.mesh.visible = true;
    }
  });
}

export function stopParticle(p: particle.ParticleEffect): void {
  p.stop();
  p.reset();
  p.emitters.forEach((emitter) => {
    if (emitter.mesh) {
      emitter.mesh.visible = false;
    }
  });
}
