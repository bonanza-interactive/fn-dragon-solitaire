import {gfx, input} from '@apila/engine';
import {anim} from '@apila/game-libraries';
import {AnimationStateListener, TrackEntry} from '@apila/spine';
import {CORE, GAME} from './game';
import {TimedEvent} from './game-timer';
import {AUTO_TICK} from './main';
import {minMaxNormalize} from './util/utils-gfx';
import {getBitmapText, getNode, getSpine, getSprite} from './util/utils-node';
import {COIN_RAIN} from './config/particle-effects';
import {WebfontSprite} from './webfont/sprite';
import {FONT, FONT_STYLE} from './webfont/config';
import {LOCALIZER} from './framework';
import * as particle from '@apila/particle-runtime';

/**
 * notes/todo:
 * <=1x bet: only win sum, no scroll, no effects, low-scale sound effect
 * >1x bet: scrolling winsum, no win text
 * >=15x bet: scrolling winsum, iso voitto/big win/stor vinst
 * >=40x bet: scrolling winsum, supervoitto/super win/supervinst
 * >=1000x bet: scrolling winsum, megavoitto/mega win/megavinst
 *
 * ranges can be game specific
 */

const ranges = [
  {
    low: 0,
    high: 20,
    minScroll: 0.35,
    maxScroll: 2.5,
    minScaling: 1.0,
    maxScaling: 1.05,
    animation: '1',
  },
  {
    low: 20,
    high: 40,
    minScroll: 0.35,
    maxScroll: 3.5,
    minScaling: 1.05,
    maxScaling: 1.1,
    animation: '2',
  },
  {
    low: 40,
    high: 100,
    minScroll: 0.35,
    maxScroll: 4.5,
    minScaling: 1.1,
    maxScaling: 1.2,
    animation: '3',
  },
  // {
  //   low: 100,
  //   high: 200,
  //   minScroll: 0.35,
  //   maxScroll: 5.5,
  //   animation: '4',
  // },
];

const options = {
  tinyWinFadeTime: 0.3,

  smallWinScrollTime: 0.3,
  bigWinAppearDelay: 0.3,

  smallWinFadeTime: 0.2,
  bigWinFadeTime: 0.5,

  smallWinScaleTime: 0.1,
  bigWinScaleTime: 0.3,

  appearScaleAmount: [0.7, 1],

  bigWinBumpTime: 0.3,
  bigWinBumpAmount: 0.1,

  hideDuration: 0.2,

  smallWinHideDelay: 2,
  bigWinHideDelay: 3,

  showScrollerOnSmallWins: false,

  showMoneyOnSmallWins: false,
};

export enum ScrollStyle {
  None = 0,
  EnableBigWin = 1 << 0,
  ShowScroller = 1 << 1,
  HideAfterDelay = 1 << 2,
}

function getLevelScrollTime(winFactor: number, level: number): number {
  const range = ranges[level];
  let winFactorN = minMaxNormalize(winFactor, range.low, range.high);
  winFactorN = gfx.clamp(winFactorN, 0, 1);
  const scrollTime = anim.easeLinear(
    range.minScroll,
    range.maxScroll,
    winFactorN
  );
  return scrollTime;
}

function getLevelScaling(winFactor: number, level: number): number {
  const range = ranges[level];
  let winFactorN = minMaxNormalize(winFactor, range.low, range.high);
  winFactorN = gfx.clamp(winFactorN, 0, 1);
  const scaling = anim.easeLinear(
    range.minScaling,
    range.maxScaling,
    winFactorN
  );
  return scaling;
}

function getTargetLevel(winFactor: number): number {
  let level = 0;
  for (; level < ranges.length - 1; ++level) {
    if (winFactor < ranges[level].high) {
      break;
    }
  }

  return level;
}

class MoneyRainEffect {
  public coinRain: particle.ParticleEffect;
  public reelIndex?: number;
  public remove?: (moneyRain: MoneyRainEffect) => void;

  constructor(parent: gfx.Empty) {
    this.coinRain = particle.createEffect(COIN_RAIN, {
      name: 'coin_rain_particle',
      parent,
      depthGroup: parent.depthGroup,
    });

    AUTO_TICK.add(this.coinRain);
  }

  public show(level: number): void {
    this.coinRain.start();

    const emitrateMultipliers = [1, 2, 3];
    const emitrateMultiplier = emitrateMultipliers[level];

    const emitrate =
      COIN_RAIN.emitterProperties[1].emitRate.value[0] * emitrateMultiplier;

    this.coinRain.emitters[1].emitRate = particle.paramScalar(emitrate);
  }

  public burst(): void {
    this.coinRain.emitters[0].restart();
  }

  public stop(): void {
    this.coinRain.stop();
  }
}

export class WinScroll implements AnimationStateListener {
  private scrollWinsum: gfx.BitmapText;
  private scrollTitle: WebfontSprite;
  private scrollEffect: gfx.Spine;
  private scrollRoot: gfx.Empty;

  private winscrollBump: gfx.Empty;
  private winscrollFade: gfx.Empty;

  private moneyRain: MoneyRainEffect;

  private timeline = new anim.Timeline();
  private delayedHide?: TimedEvent;
  private delayedScroll?: TimedEvent;

  private winsum = 0;
  private bet = 0;
  private scrollStyle = ScrollStyle.None;
  private winFactor = 0;
  private currentLevel = 0;
  private targetLevel = 0;
  private scrolling = false;
  private scrollPromise?: (finished: boolean) => void;

  private currentTimelines: anim.Playback[] = [];

  constructor(parent: gfx.NodeProperties) {
    this.scrollWinsum = getBitmapText(parent, 'winscroll-text');
    this.scrollTitle = new WebfontSprite(
      GAME.canvasTextBuilder,
      getSprite(parent, 'winscroll-title'),
      FONT.windisplayText,
      FONT_STYLE.windisplayText
    );
    this.scrollRoot = getNode(parent, 'winscroll-root');
    this.scrollEffect = getSpine(parent, 'winscroll-effect');

    this.winscrollBump = getNode(parent, 'winscroll-bump-scaling');
    this.winscrollFade = getNode(parent, 'winscroll-fade-scaling');

    this.scrollEffect.glShader = 'spine_alpha';
    this.scrollEffect.glUniform.multiplyColor = [1, 1, 1, 1];
    this.scrollEffect.state.addListener(this);

    const moneyRainRoot = getNode(parent, 'moneyrain-root');

    this.moneyRain = new MoneyRainEffect(moneyRainRoot);

    this.scrollRoot.visible = false;

    CORE.input.listenNode(this.scrollWinsum, (e) => {
      if (e.type === input.EventType.RELEASE) {
        this.scrollerClicked();
      }
    });
  }
  public start(_entry: TrackEntry): void {
    this.scrollEffect.visible = true;
  }

  public scroll(
    winsum: number,
    bet: number,
    scrollStyle: ScrollStyle
  ): Promise<boolean> {
    if (
      this.winsum === winsum &&
      this.bet === bet &&
      this.scrollStyle === scrollStyle
    ) {
      return Promise.resolve(true);
    }

    if (this.delayedHide) {
      this.delayedHide.cancel();
      this.delayedHide = undefined;
    }
    if (this.delayedScroll) {
      this.delayedScroll.cancel();
      this.delayedScroll = undefined;
    }

    this.winsum = winsum;
    this.bet = bet;
    this.scrollStyle = scrollStyle;

    this.currentLevel = 0;
    this.winFactor = this.winsum / this.bet;
    this.targetLevel =
      this.scrollStyle & ScrollStyle.EnableBigWin
        ? getTargetLevel(this.winFactor)
        : 0;

    if (this.targetLevel > 0) {
      this.scrollWinsum.position = [0, 70];
    } else {
      this.scrollWinsum.position = [0, 20];
    }

    // small win, no scroll and effects
    if (
      !(this.scrollStyle & ScrollStyle.ShowScroller) &&
      this.winsum <= this.bet
    ) {
      if (options.showScrollerOnSmallWins) {
        this.scrollRoot.visible = true;
        this.scrollWinsum.visible = false;
        this.scrollTitle.visible = false;
        this.scrollWinsum.opacity = 0;
        this.scrollTitle.opacity = 0;

        this.scrollEffect.state.setAnimation(0, 'base_loop', true);
        this.scrollEffect.glUniform.multiplyColor = [1, 1, 1, 1];

        this.scrollEffect.state.setAnimation(1, 'start_small', false);

        this.scrollRoot.scale = [ranges[0].minScaling, ranges[0].minScaling];

        this.scrollWinsum.visible = true;

        this.currentTimelines.push(
          this.timeline.animate(
            (t) => t,
            options.tinyWinFadeTime,
            (value) => (this.scrollWinsum.opacity = value)
          )
        );

        CORE.fx.trigger('fx_winsum_noscroll');

        this.lastScrollLevel();
      }

      return Promise.resolve(true);
    }

    this.scrollRoot.visible = true;
    this.scrollWinsum.visible = false;
    this.scrollTitle.visible = false;
    this.scrollWinsum.opacity = 0;
    this.scrollTitle.opacity = 0;

    this.timeline = new anim.Timeline();

    this.scrollEffect.state.setAnimation(0, 'base_loop', true);
    this.scrollEffect.glUniform.multiplyColor = [1, 1, 1, 1];

    if (this.targetLevel === 0) {
      this.scrollEffect.state.setAnimation(1, 'start_normal', false);
    } else {
      const n = ranges[this.currentLevel].animation;
      this.scrollEffect.state.setAnimation(1, `start_${n}`, false);
    }

    this.delayedScroll = CORE.gameTimer.invoke(
      this.targetLevel === 0 ? 0 : options.bigWinAppearDelay,
      () => {
        this.delayedScroll = undefined;
        this.animateTextScrolling();

        this.scrollWinsum.visible = true;

        if (this.targetLevel > 0) {
          this.scrollTitle.visible = true;
        }

        this.timeline.animate(
          (t) => t,
          this.targetLevel === 0
            ? options.smallWinFadeTime
            : options.bigWinFadeTime,
          (value) => {
            this.scrollWinsum.opacity = value;
            this.scrollTitle.opacity = value;
          }
        );

        this.timeline.animate(
          (t) => t,
          this.targetLevel === 0
            ? options.smallWinScaleTime
            : options.bigWinScaleTime,
          (value) => {
            const s =
              options.appearScaleAmount[0] +
              (options.appearScaleAmount[1] - options.appearScaleAmount[0]) *
                anim.easeOutCubic(0, 1, value);

            this.winscrollFade.scale = [s, s];
          }
        );

        this.scrolling = true;
        this.moneyRain.show(this.currentLevel);

        CORE.fx.trigger('fx_winsum_scrolling_start');
        if (this.targetLevel > 0) {
          CORE.fx.trigger('fx_winsum_big');
          CORE.fx.trigger('fx_winsum_scrolling_bg_start');

          this.updateBigWinTitle();
        } else {
          CORE.fx.trigger('fx_winsum_small');

          this.scrollEffect.state.setAnimation(1, 'start_normal', false);
        }
      }
    );

    return new Promise((resolve) => {
      this.scrollPromise = resolve;
    });
  }

  private animateTextScrolling(): void {
    const scrollTime =
      this.targetLevel === 0
        ? options.smallWinScrollTime
        : getLevelScrollTime(this.winFactor, this.currentLevel);
    const range = ranges[this.currentLevel];
    const levelMinWinsum = range.low * this.bet;
    const levelMaxWinsum = range.high * this.bet;

    const scaling = getLevelScaling(this.winFactor, this.currentLevel);

    const targetScroll =
      this.currentLevel === this.targetLevel ? this.winsum : levelMaxWinsum;

    let previousSum = levelMinWinsum;
    this.currentTimelines.push(
      this.timeline
        .animate(
          (t) => t,
          scrollTime,
          (value) => {
            // slow down function...
            const P0 = 0.0;
            const P1 = 0.8;
            const P2 = 0.9;
            const P3 = 1.0;
            const x =
              P0 * Math.pow(1 - value, 3) +
              P1 * 3 * Math.pow(1 - value, 2) * value +
              P2 * 3 * (1 - value) * Math.pow(value, 2) +
              P3 * Math.pow(value, 3);

            let sum = Math.floor(
              anim.easeLinear(levelMinWinsum, targetScroll, x)
            );

            // add variation to avoid patterns in scrolling sum
            const diff = Math.min(Math.max(0, sum - previousSum), 30);
            sum += Math.floor(Math.random() * diff) - diff / 2;
            sum = gfx.clamp(sum, levelMinWinsum, targetScroll);

            this.scrollWinsum.text = LOCALIZER.money(sum);

            const scaleValue = anim.easeLinear(
              range.minScaling,
              scaling,
              value
            );
            this.winscrollBump.scale = [scaleValue, scaleValue];

            previousSum = sum;
          }
        )
        .after(() => {
          if (this.currentLevel < this.targetLevel) {
            CORE.fx.trigger(`fx_end_win_text_appears_${this.currentLevel}`);
            this.nextScrollLevel();
          } else {
            this.lastScrollLevel();
          }
        })
    );
  }

  private updateBigWinTitle(): void {
    this.moneyRain.burst();

    this.scrollTitle.text = LOCALIZER.get(
      `win_scroll_level_${this.currentLevel}`
    );

    this.currentTimelines.push(
      this.timeline.animate(
        (t) => t,
        options.bigWinBumpTime,
        (value) => {
          const scaleValue =
            1 +
            options.bigWinBumpAmount *
              (0.5 - 0.5 * Math.cos(Math.pow(1 - value, 3) * Math.PI * 2));

          this.scrollTitle.scale = [scaleValue, scaleValue];
        }
      )
    );
  }

  public hide(): void {
    if (this.delayedHide !== undefined || this.scrollRoot.visible === false) {
      return;
    }

    if (this.delayedScroll) {
      this.delayedScroll.cancel();
      this.delayedScroll = undefined;
    }

    if (this.scrollPromise) {
      this.scrollPromise(false);
      this.scrollPromise = undefined;
    }
    this.timeline = new anim.Timeline();

    if (this.winsum === 0) {
      return;
    }

    this.scrollWinsum.visible = true;
    this.scrollWinsum.text = LOCALIZER.money(this.winsum);

    this.delayedHide = CORE.gameTimer.invoke(options.hideDuration, () => {
      this.scrollEffect.visible = false;
      this.scrollTitle.visible = false;
      this.scrollRoot.visible = false;
      this.scrollTitle.text = '';
      this.delayedHide = undefined;
      this.currentTimelines = [];
      this.winsum = 0;
      this.scrollStyle = ScrollStyle.None;
      this.bet = 0;
    });

    this.timeline.animate(anim.InOutQuad(1, 0), options.hideDuration, (t) => {
      this.scrollEffect.glUniform.multiplyColor = [t, t, t, t];
      this.scrollTitle.opacity = t;
      this.scrollWinsum.opacity = t;
    });

    if (this.scrolling) {
      this.scrolling = false;
      this.moneyRain.stop();
      if (this.targetLevel > 0) {
        CORE.fx.trigger('fx_winsum_scrolling_stop_big');
      } else {
        CORE.fx.trigger('fx_winsum_scrolling_stop_small');
      }
    }
  }

  public update(delta: number): void {
    this.timeline.tick(delta);
  }

  public nextScrollLevel(): void {
    ++this.currentLevel;
    this.animateTextScrolling();

    const n = ranges[this.currentLevel].animation;
    this.scrollEffect.state.setAnimation(1, `start_${n}`, false);

    // Increase emit rate for each scroll level
    this.moneyRain.show(this.currentLevel);

    this.updateBigWinTitle();
  }

  public lastScrollLevel(): void {
    this.scrollTitle.scale = [1, 1];
    this.scrollWinsum.text = LOCALIZER.money(this.winsum);
    this.scrolling = false;
    this.moneyRain.stop();
    if (this.targetLevel > 0) {
      CORE.fx.trigger('fx_winsum_scrolling_stop_big');
    } else {
      CORE.fx.trigger('fx_winsum_scrolling_stop_small');
    }

    if (this.scrollStyle & ScrollStyle.HideAfterDelay) {
      const hideTime =
        this.targetLevel === 0
          ? options.smallWinHideDelay
          : options.bigWinHideDelay;

      this.currentTimelines.push(
        this.timeline
          .animate(
            (t) => t,
            hideTime,
            (_) => {}
          )
          .after(() => {
            if (this.scrollPromise) {
              this.scrollPromise(true);
              this.scrollPromise = undefined;
            }

            this.hide();
          })
      );
    }
  }

  public scrollerClicked(): void {
    if (this.scrolling) {
      this.currentTimelines.forEach((e) => e.remove());
      this.currentTimelines = [];

      if (this.currentLevel < this.targetLevel) {
        this.nextScrollLevel();
      } else if (this.scrolling) {
        this.lastScrollLevel();
      }
    } else {
      if (this.scrollPromise) {
        this.scrollPromise(true);
        this.scrollPromise = undefined;
      }

      this.hide();
    }
  }
}
