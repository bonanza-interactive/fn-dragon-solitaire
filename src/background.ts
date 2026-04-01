import {gfx} from '@apila/engine';
import {ReelGameKitLayout, getReelGameKitLayout} from './util/utils-gfx';
import {CORE} from './game';

export class Background {
  private readonly spine: gfx.Spine;

  public constructor(spineNode: gfx.Spine) {
    this.spine = spineNode;

    CORE.gfx.addLayoutChanged((layout) => {
      this.onLayoutChanged(getReelGameKitLayout(layout));
    });
  }

  public onLayoutChanged(layout: ReelGameKitLayout) {
    const animationName =
      layout.orientation === gfx.Orientation.Portrait
        ? 'portrait'
        : 'landscape';
    this.spine.state.setAnimation(0, animationName);
  }
}
