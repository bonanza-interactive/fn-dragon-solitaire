import {gfx} from '@apila/engine';
import {clamp} from '@apila/engine/dist/apila-gfx';
import {EventType} from '@apila/engine/dist/apila-input';
import {anim} from '@apila/game-libraries';
import {AnimationStateListener, Physics, TrackEntry} from '@apila/spine';

import {FireBreathState} from './dragon-panel';
import {CORE, GAME} from './game';
import {TimedEvent} from './game-timer';
import {AUTO_TICK} from './main';
import {Pool} from './pool';
import {wait} from './util/utils';
import {minMaxNormalize} from './util/utils-gfx';
import {getBitmapText, getNode, getSpine, getSprite} from './util/utils-node';
import {WinScrollEffect} from './win-scroll-effect';
import {LOCALIZER} from './framework';
import {WebfontSprite} from './webfont/sprite';
import {FONT, FONT_STYLE} from './webfont/config';

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
    high: 15,
    minScroll: 0.35,
    maxScroll: 2.5,
    minScaling: 1.0,
    maxScaling: 1.05,
    animation: '1',
  },
  {
    low: 15,
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

  hideDuration: 0.5,

  smallWinHideDelay: 2,
  bigWinHideDelay: 4,

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
  winFactorN = clamp(winFactorN, 0, 1);
  const scrollTime = anim.easeLinear(
    range.minScroll,
    range.maxScroll,
    winFactorN,
  );
  return scrollTime;
}

function getLevelScaling(winFactor: number, level: number): number {
  const range = ranges[level];
  let winFactorN = minMaxNormalize(winFactor, range.low, range.high);
  winFactorN = clamp(winFactorN, 0, 1);
  const scaling = anim.easeLinear(
    range.minScaling,
    range.maxScaling,
    winFactorN,
  );
  return scaling;
}

export function getTargetLevel(winFactor: number): number {
  let level = 0;
  for (; level < ranges.length - 1; ++level) {
    if (winFactor < ranges[level].high) {
      break;
    }
  }

  return level;
}

class MoneyRainEffect implements AnimationStateListener {
  public spine: gfx.Spine;
  public reelIndex?: number;
  public remove?: (moneyRain: MoneyRainEffect) => void;

  constructor(parent: gfx.Empty) {
    this.spine = CORE.gfx.createSpine('money_rain');
    this.spine.parent = parent;
    this.spine.depthGroup = parent.depthGroup;
    this.spine.state.addListener(this);

    AUTO_TICK.add(this.spine, Physics.none);
  }

  public complete(entry: TrackEntry): void {
    if (entry.trackIndex === 0) {
      if (this.remove) {
        this.remove(this);
      }
    }
  }

  public show(level: number): void {
    const animations = ['rain_big', 'rain_mega', 'rain_epic'];

    this.spine.visible = true;
    this.spine.state.setAnimation(
      0,
      animations[Math.min(Math.max(level, 0), animations.length)],
    );

    const randomAnimations = ['randomize_0', 'randomize_1', 'randomize_2'];

    const randomLevel = Math.floor(Math.random() * randomAnimations.length);

    this.spine.state.setAnimation(1, randomAnimations[randomLevel]);
  }

  public burst(): void {
    this.spine.visible = true;
    this.spine.state.setAnimation(0, 'burst');
  }
}

export class WinScroll implements AnimationStateListener {
  public extraEffect: WinScrollEffect;

  private scrollWinsum: gfx.BitmapText;
  private scrollTitle: WebfontSprite;
  private scrollEffects: gfx.Spine[] = [];
  private scrollRoot: gfx.Empty;

  private winscrollBump: gfx.Empty;
  private winscrollFade: gfx.Empty;

  private moneyRain: Pool<MoneyRainEffect>;

  private timeline = new anim.Timeline();
  private delayedHide?: TimedEvent;
  private delayedScroll?: TimedEvent;

  private winsum = 0;
  private bet = 0;
  private multiplier = 1;
  private isVisible = false;
  private isQueueMultiplier = false;
  private exceedMaxWin = false;
  private isBaseGame = false;
  private scrollStyle = ScrollStyle.None;
  private winFactor = 0;
  private currentLevel = 0;
  private targetLevel = 0;
  private scrolling = false;
  private scrollingTimer = 0;
  private scrollPromise?: (finished: boolean) => void;
  private onScrollComplete?: () => void;

  private currentTimelines: anim.Playback[] = [];

  constructor(parent: gfx.NodeProperties) {
    this.extraEffect = new WinScrollEffect(parent);

    this.scrollWinsum = getBitmapText(parent, 'winscroll-text');
    this.scrollTitle = new WebfontSprite(
      GAME.canvasTextBuilder,
      getSprite(parent, 'winscroll-title'),
      FONT.windisplayText,
      FONT_STYLE.windisplayText,
    );

    this.scrollRoot = getNode(parent, 'winscroll-root');

    const scrollTint = getSpine(parent, 'winscroll-tint');

    this.winscrollBump = getNode(parent, 'winscroll-bump-scaling');
    this.winscrollFade = getNode(parent, 'winscroll-fade-scaling');

    scrollTint.glShader = 'spine_alpha';
    scrollTint.glUniform['multiplyColor'] = [1, 1, 1, 1];
    scrollTint.state.addListener(this);

    this.scrollEffects.push(scrollTint);

    const moneyRainRoot = getNode(parent, 'moneyrain-root');

    this.moneyRain = new Pool<MoneyRainEffect>(() => {
      const effect = new MoneyRainEffect(moneyRainRoot);
      effect.remove = (item) => {
        item.spine.state.clearTracks();
        item.spine.skeleton.setToSetupPose();
        item.spine.visible = false;
        this.moneyRain.release(item);
      };

      return effect;
    });

    this.scrollRoot.visible = false;

    CORE.input.listenNode(this.scrollWinsum, (e) => {
      if (e.type === EventType.RELEASE) {
        this.scrollerClicked();
      }
    });
  }
  public start(_entry: TrackEntry): void {
    this.scrollEffects.forEach((effect) => {
      effect.visible = true;
    });
  }

  public scroll(
    winsum: number,
    bet: number,
    multiplier: number,
    exceedMaxWin: boolean,
    isBaseGame: boolean,
    scrollStyle: ScrollStyle,
    onScrollComplete?: () => void,
  ): Promise<boolean> {
    this.onScrollComplete = onScrollComplete;
    if (
      this.winsum === winsum &&
      this.bet === bet &&
      this.multiplier === multiplier &&
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

    this.isVisible = true;
    this.exceedMaxWin = exceedMaxWin;
    this.isBaseGame = isBaseGame;
    this.winsum = winsum;
    this.bet = bet;
    this.scrollStyle = scrollStyle;
    this.multiplier = multiplier;
    this.isQueueMultiplier = this.multiplier > 1;

    this.currentLevel = 0;
    this.targetLevel = -1;
    this.onMultiplierApplied();

    // small win, no scroll and effects
    const noScroll = this.getWinsum() <= this.bet && isBaseGame;

    if (this.isQueueMultiplier) {
      const delay = noScroll ? 0 : this.winFactor >= 10 ? 1400 : 400;
      GAME.dragonPanel.startDragonBreath(
        FireBreathState.WinsumMultiplierBreath,
        delay,
        noScroll ? 1.8 : 1,
      );
    }

    if (noScroll) {
      this.scrollRoot.visible = true;
      this.scrollWinsum.visible = false;
      this.scrollTitle.visible = false;
      this.scrollWinsum.opacity = 0;
      this.scrollTitle.opacity = 0;

      this.scrollEffects.forEach((effect) => {
        effect.state.setAnimation(0, 'base_loop', true);
        effect.glUniform['multiplyColor'] = [1, 1, 1, 1];
        effect.state.setAnimation(1, 'start_small', false);
      });

      this.scrollRoot.scale = [ranges[0].minScaling, ranges[0].minScaling];

      this.scrollWinsum.visible = true;

      this.currentTimelines.push(
        this.timeline.animate(
          (t) => t,
          options.tinyWinFadeTime,
          (value) => (this.scrollWinsum.opacity = value),
        ),
      );

      CORE.fx.trigger('fx_winsum_noscroll');
      this.lastScrollLevel();

      return Promise.resolve(true);
    }

    this.scrollRoot.visible = true;
    this.scrollWinsum.visible = false;
    this.scrollTitle.visible = false;
    this.scrollWinsum.opacity = 0;
    this.scrollTitle.opacity = 0;

    this.timeline = new anim.Timeline();

    this.scrollEffects.forEach((effect) => {
      effect.state.setAnimation(0, 'base_loop', true);
      effect.glUniform['multiplyColor'] = [1, 1, 1, 1];

      if (this.targetLevel === 0) {
        effect.state.setAnimation(1, 'start_normal', false);
      } else {
        const n = ranges[this.currentLevel].animation;
        effect.state.setAnimation(1, `start_${n}`, false);
      }
    });

    this.delayedScroll = CORE.gameTimer.invoke(
      this.targetLevel === 0 ? 0 : options.bigWinAppearDelay,
      () => {
        this.delayedScroll = undefined;
        this.animateTextScrolling(0, this.getWinsum());

        this.scrollWinsum.visible = true;

        this.toggleScrollTitleText();

        this.scrolling = true;
        this.scrollingTimer = 0;

        CORE.fx.trigger('fx_winsum_scrolling_start');
        if (this.targetLevel == 0) {
          CORE.fx.trigger(
            this.getWinsum() / this.bet < 5.0
              ? 'fx_winsum_noscroll'
              : 'fx_winsum_small',
          );

          this.scrollEffects.forEach((effect) => {
            effect.state.setAnimation(1, 'start_normal', false);
          });
        } else {
          CORE.fx.trigger('fx_winsum_big');
          CORE.fx.trigger('fx_winsum_scrolling_bg_start');
          this.updateBigWinTitle();
        }
      },
    );

    return new Promise((resolve) => {
      this.scrollPromise = resolve;
    });
  }

  private animateTextScrolling(from: number, to: number): void {
    let scrollTime =
      this.targetLevel === 0
        ? options.smallWinScrollTime
        : getLevelScrollTime(this.winFactor, this.currentLevel);
    const range = ranges[this.currentLevel];
    const startingValue = from;
    const levelMaxWinsum = range.high * this.bet;

    if (this.isQueueMultiplier) {
      let totalScrollTime = 0;
      for (let i = 0; i <= this.targetLevel; ++i) {
        totalScrollTime += getLevelScrollTime(this.winFactor, i);
      }
      if (this.winFactor >= 10) {
        scrollTime *= 2.0 / totalScrollTime;
      } else {
        scrollTime *= 1.0 / totalScrollTime;
      }
    }

    const scaling = getLevelScaling(this.winFactor, this.currentLevel);

    const targetScroll =
      this.currentLevel === this.targetLevel ? to : levelMaxWinsum;

    let scrollValue = startingValue;
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
              anim.easeLinear(startingValue, targetScroll, x),
            );

            // add variation to avoid patterns in scrolling sum
            const diff = Math.min(Math.max(0, sum - scrollValue), 30);
            sum += Math.floor(Math.random() * diff) - diff / 2;
            sum = clamp(sum, startingValue, targetScroll);

            // this.scrollWinsum.text = CORE.localization.formatValue(
            //   sum,
            //   loc.MoneyContextType.Price,
            //   {forceDecimals: true},
            // );
            this.scrollWinsum.text = LOCALIZER.money(sum);

            const scaleValue = anim.easeLinear(
              range.minScaling,
              scaling,
              value,
            );
            this.winscrollBump.scale = [scaleValue, scaleValue];

            scrollValue = sum;
          },
        )
        .after(() => {
          if (this.currentLevel < this.targetLevel) {
            CORE.fx.trigger(`fx_end_win_text_appears_${this.currentLevel}`);
            this.nextScrollLevel();
          } else {
            this.lastScrollLevel();
          }
        }),
    );
  }

  private updateBigWinTitle(): void {
    this.extraEffect.playBigWinParticle(this.currentLevel);
    this.moneyRain.reserve().burst();

    const key = `win_scroll_level_${this.currentLevel}`;
    // CORE.localization.bind(this.scrollTitle, key as keyof Translations);
    this.scrollTitle.text = LOCALIZER.get(key);

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
        },
      ),
    );
  }

  public hide(): void {
    this.isVisible = false;
    this.extraEffect.hideBigWinEffect();

    CORE.fx.trigger('fx_winsum_stop_all');

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
      this.scrollEffects.forEach((effect) => {
        effect.visible = false;
      });
      this.scrollTitle.visible = false;
      this.scrollRoot.visible = false;
      // CORE.localization.unbind(this.scrollTitle);
      this.delayedHide = undefined;
      this.currentTimelines = [];
      this.winsum = 0;
      this.scrollStyle = ScrollStyle.None;
      this.bet = 0;
    });

    this.timeline.animate(anim.InOutQuad(1, 0), options.hideDuration, (t) => {
      this.scrollEffects.forEach((effect) => {
        effect.glUniform['multiplyColor'] = [t, t, t, t];
      });
      this.scrollTitle.opacity = t;
      this.scrollWinsum.opacity = t;
    });
  }

  public update(delta: number): void {
    if (this.scrolling) {
      if (
        ((this.targetLevel === 0 && options.showMoneyOnSmallWins) ||
          this.targetLevel > 0) &&
        this.scrollingTimer <= 0.0
      ) {
        this.moneyRain.reserve().show(this.currentLevel);
        this.scrollingTimer = 0.4;
      }

      this.scrollingTimer -= delta;
    }
    this.extraEffect.update(delta);
    this.extraEffect.updateMultiplier(delta);
    this.timeline.tick(delta);
  }

  public nextScrollLevel(): void {
    ++this.currentLevel;
    const range = ranges[this.currentLevel];
    const currentValue = range.low * this.bet;
    this.animateTextScrolling(currentValue, this.getWinsum());

    const n = ranges[this.currentLevel].animation;

    this.scrollEffects.forEach((effect) => {
      effect.state.setAnimation(1, `start_${n}`, false);
    });

    this.updateBigWinTitle();
  }

  public async lastScrollLevel(): Promise<void> {
    this.scrollTitle.scale = [1, 1];
    this.scrollWinsum.text = LOCALIZER.money(this.getWinsum());
    this.scrolling = false;
    if (!this.isQueueMultiplier) {
      this.onScrollComplete?.();
    }
    if (this.targetLevel > 0) {
      CORE.fx.trigger('fx_winsum_scrolling_stop_big');
    } else {
      CORE.fx.trigger('fx_winsum_scrolling_stop_small');
    }

    if (this.isQueueMultiplier) {
      this.isQueueMultiplier = false;
      await wait(1000);
      if (!this.isVisible) {
        return;
      }

      if (this.getWinsum() > this.bet && this.winFactor < 10) {
        await wait(666);
      }
      this.extraEffect.multiplierEffect(this.multiplier);
      await wait(this.multiplier < 10 ? 500 : 1500);
      if (!this.isVisible) {
        return;
      }

      this.extraEffect.doMultiplierExplosion();
      await wait(this.multiplier < 10 ? 500 : 700);
      if (!this.isVisible) {
        return;
      }

      this.onMultiplierApplied();
      if (this.targetLevel > 0) {
        this.toggleScrollTitleText(false);
        this.updateBigWinTitle();
        this.extraEffect.playBigWinParticle(this.currentLevel);
        CORE.fx.trigger('fx_winsum_scrolling_bg_start');

        this.scrollEffects.forEach((effect) => {
          effect.state.setAnimation(0, 'base_loop', true);
          effect.glUniform['multiplyColor'] = [1, 1, 1, 1];
          const n = ranges[this.currentLevel].animation;
          effect.state.setAnimation(1, `start_${n}`, false);
        });
      }
      this.animateTextScrolling(this.winsum / this.multiplier, this.winsum);

      await wait(3000);
      this.extraEffect.killMultiplierEffect();
    } else {
      if (this.isBaseGame) {
        CORE.fx.trigger('music_gamble_query');
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
              (_) => {},
            )
            .after(() => {
              if (this.scrollPromise) {
                this.scrollPromise(true);
                this.scrollPromise = undefined;
              }

              this.hide();
            }),
        );
      }
    }
  }

  public scrollerClicked(): void {
    if (this.isBaseGame) {
      CORE.fx.trigger('music_gamble_query');
    }
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

  private getWinsum(): number {
    return this.isQueueMultiplier ? this.winsum / this.multiplier : this.winsum;
  }

  private onMultiplierApplied(): void {
    this.winFactor = this.getWinsum() / this.bet;
    const oldTargetLevel = this.targetLevel;
    this.targetLevel =
      this.scrollStyle & ScrollStyle.EnableBigWin
        ? getTargetLevel(this.winFactor)
        : 0;

    if (this.targetLevel > 0 && oldTargetLevel < 1) {
      this.scrollWinsum.position = [0, 20];
      this.extraEffect.bigWinEffect();
    } else {
      this.scrollWinsum.position = [0, 20];
    }
  }

  private toggleScrollTitleText(isFadeIn = true): void {
    if (this.targetLevel > 0) {
      this.scrollTitle.visible = true;
    }

    if (isFadeIn) {
      this.timeline.animate(
        (t) => t,
        this.targetLevel === 0
          ? options.smallWinFadeTime
          : options.bigWinFadeTime,
        (value) => {
          this.scrollWinsum.opacity = value;
          this.scrollTitle.opacity = value;
        },
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
        },
      );
    } else {
      this.scrollWinsum.opacity = 1;
      this.scrollTitle.opacity = 1;
    }
  }
}
