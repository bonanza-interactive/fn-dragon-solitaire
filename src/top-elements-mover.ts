import {gfx} from '@apila/engine/dist';
import {anim} from '@apila/game-libraries';
import {Timeline} from '@apila/game-libraries/dist/game-animation';

import {CORE, GAME} from './game';
import {AUTO_TICK} from './main';
import {wait} from './util/utils';
import {ReelGameKitLayout, getReelGameKitLayout} from './util/utils-gfx';
import {getNode} from './util/utils-node';
import {IS_MOBILE_DEVICE} from './framework';

export enum TopElementsLocation {
  Default,
  CardSelection,
}

interface MoveParams {
  from: gfx.VectorT;
  target: gfx.VectorT;
}

export class TopElementsMover {
  private readonly topElementMover: gfx.Empty;
  private readonly dragonMover: gfx.Empty;

  private location = TopElementsLocation.Default;
  private moveAnims: anim.Playback[] = [];
  private timeline = new Timeline();

  constructor(root: gfx.NodeProperties) {
    this.topElementMover = getNode(root, 'top_elements_mover');
    this.dragonMover = getNode(root, 'dragon_mover');
    CORE.gfx.addLayoutChanged((layout) => {
      this.onLayoutChanged(getReelGameKitLayout(layout));
    });
    GAME.paytable.onVisibilityChanged.connect((isVisible) =>
      this.onPaytableVisibilityChange(isVisible),
    );
    AUTO_TICK.add(this.timeline);
  }

  public async move(
    location: TopElementsLocation,
    isAnimate = false,
    animationDelayMs = 0,
  ): Promise<void> {
    this.location = location;

    if (animationDelayMs > 0) {
      await wait(animationDelayMs);
    }

    this.cancelAllAnimations();
    this.moveTopElements(isAnimate);
    this.moveDragon(isAnimate);
  }

  private async moveTopElements(isAnimate = false): Promise<void> {
    const position: MoveParams = {
      from: this.topElementMover.position,
      target: [0, 0],
    };
    const scale: MoveParams = {
      from: this.topElementMover.scale,
      target: [1, 1],
    };

    if (this.location === TopElementsLocation.CardSelection) {
      const layout = getReelGameKitLayout(CORE.gfx.layout);
      const isPortrait = layout.orientation === gfx.Orientation.Portrait;
      if (isPortrait) {
        if (IS_MOBILE_DEVICE) {
          position.target = [0, -75];
          scale.target = [0.8, 0.8];
        } else {
          position.target = [0, -90];
          scale.target = [0.7, 0.7];
        }
      }
    }

    if (position.from === position.target && scale.from === scale.target) {
      return;
    }

    if (isAnimate) {
      this.animateMove(this.topElementMover, position, scale, 0.8);
    } else {
      this.topElementMover.position = position.target;
      this.topElementMover.scale = scale.target;
    }
  }

  private async moveDragon(isAnimate = false): Promise<void> {
    const position: MoveParams = {
      from: this.dragonMover.position,
      target: [0, 0],
    };
    const scale: MoveParams = {
      from: this.dragonMover.scale,
      target: [1, 1],
    };

    const layout = getReelGameKitLayout(CORE.gfx.layout);
    const isPortrait = layout.orientation === gfx.Orientation.Portrait;

    if (isPortrait && !GAME.paytable.isVisible()) {
      position.target[0] += IS_MOBILE_DEVICE ? 260 : 250;
    }

    if (position.from === position.target && scale.from === scale.target) {
      return;
    }

    if (isAnimate) {
      this.animateMove(this.dragonMover, position, scale, 0.8);
    } else {
      this.dragonMover.position = position.target;
      this.dragonMover.scale = scale.target;
    }
  }

  private animateMove(
    moveNode: gfx.Empty,
    position: MoveParams,
    scale: MoveParams,
    duration: number,
  ): void {
    this.moveAnims.push(
      this.timeline.animate(anim.OutQuad(0, 1), duration, (t) => {
        moveNode.position = [
          anim.easeLinear(position.from[0], position.target[0], t),
          anim.easeLinear(position.from[1], position.target[1], t),
        ];
        moveNode.scale = [
          anim.easeLinear(scale.from[0], scale.target[0], t),
          anim.easeLinear(scale.from[1], scale.target[1], t),
        ];
      }),
    );
  }

  private onLayoutChanged(_layout: ReelGameKitLayout) {
    this.move(this.location);
  }

  private onPaytableVisibilityChange(_isVisible: boolean) {
    this.move(this.location, true);
  }

  private cancelAllAnimations(): void {
    this.moveAnims.forEach((anim) => {
      anim.remove();
    });
    this.moveAnims = [];
  }
}
