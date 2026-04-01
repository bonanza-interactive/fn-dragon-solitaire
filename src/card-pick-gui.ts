import {gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';

import {GameConfig} from './config/config';
import {AUTO_TICK} from './main';
import {wait} from './util/utils';
import {getBitmapText, getSprite} from './util/utils-node';
import {LOCALIZER} from './framework';

export class CardPickGui {
  private readonly infoText: gfx.BitmapText;
  private readonly dimmerBg: gfx.Sprite;
  private readonly dimmerOriginalScale;
  private readonly dimmerOriginalOpacity;

  private timeline = new anim.Timeline();
  private blinkTimeline = new anim.Timeline();
  private isVisible = false;
  private shouldBlink = true;

  public constructor(parent: gfx.NodeProperties) {
    this.infoText = getBitmapText(parent, 'selection_info_text');
    this.dimmerBg = getSprite(parent, 'selection_info_dimmer');
    this.dimmerOriginalScale = this.dimmerBg.scale;
    this.dimmerOriginalOpacity = this.dimmerBg.opacity;
  }

  public async show(isFreespin: boolean): Promise<void> {
    this.isVisible = true;
    this.shouldBlink = true;
    this.infoText.visible = true;
    this.dimmerBg.visible = true;

    const minAmount = isFreespin
      ? GameConfig.gameConfig.freespin.minSelections
      : GameConfig.gameConfig.basegame.minSelections;

    const maxAmount = isFreespin
      ? GameConfig.gameConfig.freespin.maxSelections
      : GameConfig.gameConfig.basegame.maxSelections;

    this.infoText.text = LOCALIZER.get(
      'selection_info',
      minAmount === maxAmount ? `${minAmount}` : `${minAmount}-${maxAmount}`,
    );

    const textBoundingBox = this.infoText.worldBoundingBox;
    const textWidth = textBoundingBox[2] - textBoundingBox[0];
    const dimmerScaleX = textWidth / 327.0;
    this.dimmerBg.scale = [
      this.dimmerOriginalScale[0] * dimmerScaleX,
      this.dimmerOriginalScale[1],
    ];

    AUTO_TICK.add(this.timeline);
    AUTO_TICK.add(this.blinkTimeline);
    this.timeline.animate(anim.OutQuad(0, 1), 0.4, (alpha) => {
      this.infoText.opacity = alpha;
      this.dimmerBg.opacity = this.dimmerOriginalOpacity * alpha;
    });
    await wait(5000);
    this.blinkInfoText();
  }

  public hide(): void {
    if (!this.isVisible) {
      return;
    }
    this.isVisible = false;

    AUTO_TICK.remove(this.blinkTimeline);
    const fromAlpha = this.infoText.opacity;
    this.blinkTimeline.tick(9999); //Call this to completely kill
    this.timeline
      .animate(anim.OutQuad(fromAlpha, 0), 0.4, (alpha) => {
        this.infoText.opacity = alpha;
        this.dimmerBg.opacity = this.dimmerOriginalOpacity * alpha;
      })
      .after(() => {
        this.infoText.visible = false;
        this.dimmerBg.visible = false;
        AUTO_TICK.remove(this.timeline);
      });
  }

  private async blinkInfoText(): Promise<void> {
    await wait(1500);

    if (this.isVisible && this.shouldBlink) {
      this.blinkTimeline
        .animate(anim.InOutQuad(1, 0), 0.4, (alpha) => {
          this.infoText.opacity = alpha;
          this.dimmerBg.opacity = this.dimmerOriginalOpacity * alpha;
        })
        .after(() => {
          if (this.isVisible && this.shouldBlink) {
            this.blinkTimeline
              .animate(anim.InOutQuad(0, 1), 1.2, (alpha) => {
                this.infoText.opacity = alpha;
                this.dimmerBg.opacity = this.dimmerOriginalOpacity * alpha;
              })
              .after(() => {
                this.blinkInfoText();
              });
          }
        });
    }
  }

  public async shake(): Promise<void> {
    this.shouldBlink = false;
    this.blinkTimeline.tick(9999);
    this.infoText.opacity = 1;
    this.dimmerBg.opacity = this.dimmerOriginalOpacity;

    this.timeline
      .animate(anim.Linear(0.0, 1.0), 0.15, (_t) => {
        const shakeX = -6 + Math.random() * 12.0;
        const shakeY = -2 + Math.random() * 4.0;
        this.infoText.position = [shakeX, shakeY];
      })
      .after(() => {
        this.infoText.position = [0, 0];
      });
  }
}
