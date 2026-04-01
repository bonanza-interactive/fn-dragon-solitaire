import {gfx} from '@apila/engine';
import {NodeProperties} from '@apila/engine/dist/apila-gfx';
import {anim} from '@apila/game-libraries';

import {AUTO_TICK} from './main';
import {wait} from './util/utils';
import {getBitmapText, getNode} from './util/utils-node';
import {LOCALIZER} from './framework';

export class FreespinInfo {
  // private freespinCounter: gfx.Empty;
  public readonly freespinCounterText: gfx.BitmapText;
  public readonly freespinWinsumRoot: gfx.Empty;
  public readonly freespinWinsumText: gfx.BitmapText;

  private freespinCounterPrevious = 0;
  private freespinWinsumPrevious = 0;

  private timeline = new anim.Timeline();

  public constructor(root: NodeProperties) {
    this.freespinCounterText = getBitmapText(root, 'freespin_counter_text');
    this.freespinWinsumRoot = getNode(root, 'freespin_winsum');
    this.freespinWinsumText = getBitmapText(root, 'freespin_winsum_text');

    AUTO_TICK.add(this.timeline);
  }

  public async setFreespinsLeft(count: number): Promise<void> {
    this.freespinCounterText.text = `{dfff05}${count}`;

    let delayTime = 0;
    if (this.freespinCounterPrevious > count) {
      delayTime = 1000;
    } else if (this.freespinCounterPrevious < count) {
      delayTime = 400;
    }

    this.freespinCounterPrevious = count;
    return wait(delayTime);
  }

  public updateFreespinTotalWinsum(scroll: boolean, winsum: number): void {
    if (winsum === 0) {
      this.freespinWinsumText.visible = false;
      this.freespinWinsumPrevious = 0;
    } else {
      this.freespinWinsumRoot.visible = true;
      this.freespinWinsumText.visible = true;
      if (this.freespinWinsumPrevious === winsum || !scroll) {
        this.freespinWinsumPrevious = winsum;
        this.freespinWinsumText.text =
          `{ffd305}` + `${LOCALIZER.money(winsum)}`;
      } else {
        this.timeline
          .animate(
            (t) => t,
            0.5,
            (value) => {
              this.freespinWinsumText.text =
                `{ffd305}` +
                `${LOCALIZER.money(winsum * value + this.freespinWinsumPrevious * (1.0 - value))}`;
            },
          )
          .after(() => (this.freespinWinsumPrevious = winsum));
      }
    }
  }
}
