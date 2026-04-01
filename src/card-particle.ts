import {gfx} from '@apila/engine';
import * as particle from '@apila/particle-runtime';
import {AnimationStateListener, Physics} from '@apila/spine';

import {CardParticleEffect} from './card-particle-effect';
import {CORE, GAME} from './game';
import {DOUBLING_FIRST_CARD} from './particles/doubling_first_card';
import {DOUBLING_LOSE} from './particles/doubling_lose';
import {DOUBLING_WIN} from './particles/doubling_win';
import {DOUBLING_WIN_2} from './particles/doubling_win_2';
import {WIN_1} from './particles/win_1';
import {WIN_2} from './particles/win_2';
import {WIN_3} from './particles/win_3';
import {WIN_4} from './particles/win_4';

export class CardParticle {
  private parentNode: gfx.NodeProperties;
  private isSlim: boolean = false;
  private spineEffect: gfx.Spine;

  //win-1 is for the cards that hit in the game & freespin page
  private wins: CardParticleEffect[];
  //the first card that you have to fight against in the gamble game.
  private gamble_first_card: CardParticleEffect;
  //2 particle for doubling-win effect
  private doubling_win: CardParticleEffect;
  private doubling_win_2: CardParticleEffect;
  //losing the doubling game
  private doubling_lose: CardParticleEffect;

  private particles: CardParticleEffect[];

  constructor(parentNode: gfx.NodeProperties) {
    this.parentNode = parentNode;

    this.spineEffect = CORE.gfx.createSpine('doubling_effects');
    this.spineEffect.name = 'card_spine_effect';
    this.spineEffect.parent = parentNode;
    this.spineEffect.depthGroup = parentNode.depthGroup;
    this.spineEffect.visible = false;

    this.wins = [];
    const winParticles = [WIN_1, WIN_2, WIN_3, WIN_4];
    for (let i = 0; i < 4; i++) {
      const particle = this.addParticle(winParticles[i], `win_particle_${i}`);
      this.wins.push(new CardParticleEffect(particle));
    }
    this.gamble_first_card = new CardParticleEffect(
      this.addParticle(DOUBLING_FIRST_CARD, 'gamble_first_card'),
    );
    this.doubling_win = new CardParticleEffect(
      this.addParticle(DOUBLING_WIN, 'doubling_win'),
    );
    this.doubling_win_2 = new CardParticleEffect(
      this.addParticle(DOUBLING_WIN_2, 'doubling_win_2'),
    );
    this.doubling_lose = new CardParticleEffect(
      this.addParticle(DOUBLING_LOSE, 'doubling_lose'),
    );

    this.particles = [
      this.gamble_first_card,
      this.doubling_win,
      this.doubling_win_2,
      this.doubling_lose,
    ];
    this.setDepthGroup(this.parentNode.depthGroup);
  }

  private addParticle(
    properties: particle.EffectProperties,
    name: string,
  ): particle.ParticleEffect {
    const newParticle = particle.createEffect(properties, {
      parent: this.parentNode,
      name: name,
    });
    return newParticle;
  }

  public setParent(parentNode: gfx.NodeProperties): void {
    this.parentNode = parentNode;
    for (const p of [...this.particles, ...this.wins]) {
      p.effect.node.parent = this.parentNode;
      p.effect.node.position = [0, 0];
    }
    this.spineEffect.parent = this.parentNode;
    this.setDepthGroup(this.parentNode.depthGroup);
  }

  public update(delta: number): void {
    if (this.spineEffect.visible) {
      this.spineEffect.update(delta, Physics.none);
    }
  }

  public setDepthGroup(d: number): void {
    this.wins[0].depthGroup = d + 2;
    this.wins[1].depthGroup = d + 1;
    this.wins[2].depthGroup = d - 2;
    this.wins[3].depthGroup = d - 1;

    //Since doubling cards are not on top of each other
    //the layer for the doubling effect can easiy be changed.
    this.gamble_first_card.depthGroup = d;
    this.doubling_win.depthGroup = d + 1;
    this.doubling_win_2.depthGroup = d;

    this.doubling_lose.depthGroup = d + 1;
    this.spineEffect.depthGroup = d;
  }

  public setSlim(slim: boolean): void {
    this.isSlim = slim;
    for (const p of [...this.particles, ...this.wins]) {
      p.scale = slim ? [0.6, 1.0] : [1.0, 1.0];
    }
  }

  public setGlow(active: boolean): void {
    if (active) {
      this.spineEffect.visible = true;
      this.spineEffect.state.setAnimation(
        0,
        this.isSlim ? 'selection_slim' : 'selection',
        true,
      );
    } else {
      this.spineEffect.state.setAnimation(0, 'selection_off', true);
      this.spineEffect.visible = false;
    }
  }

  public setWin(
    active: boolean,
    selected: number,
    matches: number,
    isFreespin: boolean,
  ): void {
    if (active) {
      const winFactor = GAME.paytable.getPayoutWin(
        selected,
        matches,
        isFreespin,
      );
      let layer: number = 1;
      if (winFactor >= 3000) {
        layer = 4;
      } else if (winFactor >= 500) {
        layer = 3;
      } else if (winFactor > 0) {
        layer = 2;
      }
      for (let i = 0; i < layer; i++) {
        this.wins[i].start();
      }
    } else {
      for (const w of this.wins) {
        w.stop();
      }
    }
  }

  public setGambleFirstCard(active: boolean): void {
    if (active) {
      this.gambleSpineAnim('doubling_first_card');
      this.gamble_first_card.start();
    } else {
      this.gamble_first_card.stop();
      this.clearGambleSpine();
    }
  }

  public setGambleWin(active: boolean): void {
    if (active) {
      this.gambleSpineAnim('doubling_win');
      this.doubling_win.start();
      this.doubling_win_2.start();
    } else {
      this.clearGambleSpine();
      this.doubling_win.stop();
      this.doubling_win_2.stop();
    }
  }

  public setGambleLose(active: boolean): void {
    if (active) {
      this.spineEffect.visible = true;
      this.spineEffect.state.setAnimation(0, 'flash_burn', false);
      const onComplete: AnimationStateListener = {
        complete: () => {
          this.spineEffect.state.setAnimation(0, 'doubling_lose', true);
          this.spineEffect.state.removeListener(onComplete);
          this.doubling_lose.start();
        },
      };
      this.spineEffect.state.addListener(onComplete);
    } else {
      this.clearGambleSpine();
      this.doubling_lose.stop();
    }
  }

  private gambleSpineAnim(animation: string): void {
    this.spineEffect.visible = true;
    this.spineEffect.state.setAnimation(0, animation);
  }

  private clearGambleSpine(): void {
    this.spineEffect.state.setAnimation(0, 'clear');
    this.spineEffect.visible = false;
  }

  public kill(): void {
    for (const win of this.wins) {
      win.kill();
    }
    this.gamble_first_card.kill();
    this.gamble_first_card.kill();
    this.doubling_win.kill();
    this.doubling_win_2.kill();
    this.doubling_lose.kill();
  }

  public isPlaying(): boolean {
    return [...this.particles, ...this.wins].some((p) => p.isEmitting());
  }
}
