import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {Timeline} from '@apila/game-libraries/dist/game-animation';
import * as particle from '@apila/particle-runtime';

import {GameLayer} from './config/schemas';
import {FireBreathState} from './dragon-panel';
import {GAME} from './game';
import {AUTO_TICK} from './main';
import {FS_CRACK_LAVA} from './particles/FS_crack_lava';
import {FS_FLAME_OCEAN} from './particles/FS_flame_ocean';
import {waitAnimation, waitEvent} from './util/spine-utils';
import {wait} from './util/utils';
import {getNode, getSpine} from './util/utils-node';
import {Physics} from '@apila/spine';

export class FreespinTransition {
  private readonly root: gfx.NodeProperties;
  private readonly transitionDark: gfx.Spine;
  private readonly transition: gfx.Spine;
  private readonly crackLava: particle.ParticleEffect;
  private readonly flameOcean: particle.ParticleEffect;

  constructor(root: gfx.NodeProperties) {
    this.root = root;
    this.transitionDark = getSpine(root, 'freespin_BG_dark');
    this.transition = getSpine(root, 'freespin_BG');

    this.crackLava = particle.createEffect(FS_CRACK_LAVA, {
      parent: root,
      depthGroup: GameLayer.FsTransitionBackground + 1,
      name: 'crack_lava_fx_particle',
    });

    const baseGameRoot = GAME.nodeStorage.baseGame.nodes.root;
    const flameOceanParent = getNode(baseGameRoot, 'flame_ocean');

    this.flameOcean = particle.createEffect(FS_FLAME_OCEAN, {
      parent: flameOceanParent,
      depthGroup: flameOceanParent.depthGroup,
      name: 'flame_ocean_fx_particle',
    });
  }

  public async enter(): Promise<void> {
    this.root.visible = true;
    AUTO_TICK.add(this.transition, Physics.none);
    AUTO_TICK.add(this.transitionDark, Physics.none);

    GAME.dragonPanel.startDragonBreath(FireBreathState.FreespinsWonBreath, 0);
    await wait(1200);

    this.doCameraShake(100, 2000);
    this.transitionDark.state.setAnimation(0, 'appear');

    const entry = this.transition.state.setAnimation(0, 'appear');
    waitEvent(this.transition, {event: 'crack_lava_start', entry}).then(() => {
      AUTO_TICK.add(this.crackLava);
      this.crackLava.start();
    });
    waitEvent(this.transition, {event: 'flame_ocean_start', entry}).then(() => {
      AUTO_TICK.add(this.flameOcean);
      this.flameOcean.start();
    });

    await waitAnimation(this.transition, 'appear').then(() => {
      this.transition.state.setAnimation(0, 'idle', true);
    });
  }

  public async exit(): Promise<void> {
    this.transitionDark.state.setAnimation(0, 'disappear');

    const entry = this.transition.state.setAnimation(0, 'disappear');
    waitEvent(this.transition, {event: 'crack_lava_stop', entry}).then(() => {
      this.crackLava.stop();
    });
    waitEvent(this.transition, {event: 'flame_ocean_stop', entry}).then(() => {
      this.flameOcean.stop();
    });

    await waitAnimation(this.transition, 'disappear').then(() => {
      this.flameOcean.reset();
      this.crackLava.reset();
      AUTO_TICK.remove(this.transition);
      AUTO_TICK.remove(this.transitionDark);
      AUTO_TICK.remove(this.flameOcean);
      AUTO_TICK.remove(this.crackLava);
      this.root.visible = false;
    });
  }

  private async doCameraShake(delay: number, duration: number): Promise<void> {
    await wait(delay);

    const baseGameRoot = GAME.nodeStorage.baseGame.nodes.root;
    const timeline = new Timeline();
    AUTO_TICK.add(timeline);
    timeline
      .animate(anim.Linear(1.0, 0.0), duration / 1000, (t) => {
        const power = Math.sin(Math.PI * t) * t;
        const shakeX = (-5 + Math.random() * 10.0) * power;
        const shakeY = (-7.5 + Math.random() * 15.0) * power;
        baseGameRoot.position = [shakeX, shakeY];
      })
      .after(() => {
        baseGameRoot.position = [0, 0];
        AUTO_TICK.remove(timeline);
      });
  }
}
