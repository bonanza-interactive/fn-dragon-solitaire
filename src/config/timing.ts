import {GAMEFW} from '../framework';
import {lerp} from '../util/utils';
import {miscConfig} from './config';

export type DealingTimingConfig = {
  /** Delay of how long to stop on each card (s) */
  delayBetweenCards: number;
  /** Delay of how long to stop on each card (s) */
  moveBetweenCards: number;
  /** Delay of how long to stop on each card if have win already (s) */
  delayBetweenCardsIfWin: number;
  /** Delay of how long to stop on each card if have active multiplier (s) */
  delayBetweenCardsIfMultiplier: number;
  /** Delay of how long to stop on each card if have a big multiplier (s) */
  delayBetweenCardsIfBigMultiplier: number;
  /** Delay of how long to stop on dragon card (s) */
  delayOnDragon: number;
  /** Delay of how long to stop on dragon card when no win possible (s) */
  delayOnDragonNoWin: number;
  /** Slow anticipation, for last card and big multipliers (s) */
  anticipateReveal: number;
  anticipateEnd: number;
  /** Anticipate dragon to appear when have matched all cards (s) */
  anticipateDragon: number;
  /** Deck return time at end (s) */
  deckReturn: number;
};

export type GambleTimingConfig = {
  /** How often do the cards jiggle animation (s) */
  jiggleInterval: number;
  /** How long the cards jiggle animation last (s) */
  jiggleDuration: number;
  /** How long it takes for each card to be dealt (s) */
  dealDuration: number;
};
type Timing = {
  dealing_normal: DealingTimingConfig;
  dealing_quick: DealingTimingConfig;
  gamble_normal: GambleTimingConfig;
  gamble_quick: GambleTimingConfig;
};
/** Timing values: */
const timing: Timing = {
  dealing_normal: {
    /** Delay of how long to stop on each card (s) */
    delayBetweenCards: 0.1,
    /** Delay of how long to stop on each card (s) */
    moveBetweenCards: 0.1,
    /** Delay of how long to stop on each card if have win already (s) */
    delayBetweenCardsIfWin: 0.3,
    /** Delay of how long to stop on each card if have active multiplier (s) */
    delayBetweenCardsIfMultiplier: 0.3,
    /** Delay of how long to stop on each card if have a big multiplier (s) */
    delayBetweenCardsIfBigMultiplier: 0.6,
    /** Delay of how long to stop on dragon card (s) */
    delayOnDragon: 1.4,
    /** Delay of how long to stop on dragon card when no win possible (s) */
    delayOnDragonNoWin: 0.6,
    /** Slow anticipation, for last card and big multipliers (s) */
    anticipateReveal: 0.7,
    anticipateEnd: 0.2,
    /** Anticipate dragon to appear when have matched all cards (s) */
    anticipateDragon: 0.6,
    /** Deck return time at end (s) */
    deckReturn: 0.3,
  },
  dealing_quick: {
    /** Delay of how long to stop on each card (s) */
    delayBetweenCards: 0.03,
    /** Delay of how long to stop on each card (s) */
    moveBetweenCards: 0.03,
    /** Delay of how long to stop on each card if have win already (s) */
    delayBetweenCardsIfWin: 0.1,
    /** Delay of how long to stop on each card if have active multiplier (s) */
    delayBetweenCardsIfMultiplier: 0.1,
    /** Delay of how long to stop on each card if have a big multiplier (s) */
    delayBetweenCardsIfBigMultiplier: 0.3,
    /** Delay of how long to stop on dragon card (s) */
    delayOnDragon: 0.7,
    /** Delay of how long to stop on dragon card when no win possible (s) */
    delayOnDragonNoWin: 0.3,
    /** Slow anticipation, for last card and big multipliers (s) */
    anticipateReveal: 0.2,
    anticipateEnd: 0.05,
    /** Anticipate dragon to appear when have matched all cards (s) */
    anticipateDragon: 0.3,
    /** Deck return time at end (s) */
    deckReturn: 0.1,
  },

  gamble_normal: {
    /** How often do the cards jiggle animation (s) */
    jiggleInterval: 4.0,
    /** How long the cards jiggle animation last (s) */
    jiggleDuration: 0.2,
    /** How long it takes for each card to be dealt (s) */
    dealDuration: 0.3,
  },
  gamble_quick: {
    /** How often do the cards jiggle animation (s) */
    jiggleInterval: 4.0,
    /** How long the cards jiggle animation last (s) */
    jiggleDuration: 0.2,
    /** How long it takes for each card to be dealt (s) */
    dealDuration: 0.1,
  },
};

export function getDealingTiming(): DealingTimingConfig {
  const quickPlayFactor = GAMEFW.state().quickplay * miscConfig.spinSpeed;
  return lerpDealingTimingConfig(
    timing.dealing_normal,
    timing.dealing_quick,
    quickPlayFactor,
  );
}

export function getGambleTiming(): GambleTimingConfig {
  const quickPlayFactor = GAMEFW.state().quickplay * miscConfig.spinSpeed;
  return lerpGambleTimingConfig(
    timing.gamble_normal,
    timing.gamble_quick,
    quickPlayFactor,
  );
}

function lerpDealingTimingConfig(
  a: DealingTimingConfig,
  b: DealingTimingConfig,
  x: number,
): DealingTimingConfig {
  return {
    delayBetweenCards: lerp(a.delayBetweenCards, b.delayBetweenCards, x),
    moveBetweenCards: lerp(a.moveBetweenCards, b.moveBetweenCards, x),
    delayBetweenCardsIfWin: lerp(
      a.delayBetweenCardsIfWin,
      b.delayBetweenCardsIfWin,
      x,
    ),
    delayBetweenCardsIfMultiplier: lerp(
      a.delayBetweenCardsIfMultiplier,
      b.delayBetweenCardsIfMultiplier,
      x,
    ),
    delayBetweenCardsIfBigMultiplier: lerp(
      a.delayBetweenCardsIfBigMultiplier,
      b.delayBetweenCardsIfBigMultiplier,
      x,
    ),
    delayOnDragon: lerp(a.delayOnDragon, b.delayOnDragon, x),
    delayOnDragonNoWin: lerp(a.delayOnDragonNoWin, b.delayOnDragonNoWin, x),
    anticipateReveal: lerp(a.anticipateReveal, b.anticipateReveal, x),
    anticipateEnd: lerp(a.anticipateEnd, b.anticipateEnd, x),
    anticipateDragon: lerp(a.anticipateDragon, b.anticipateDragon, x),
    deckReturn: lerp(a.deckReturn, b.deckReturn, x),
  };
}

function lerpGambleTimingConfig(
  a: GambleTimingConfig,
  b: GambleTimingConfig,
  x: number,
): GambleTimingConfig {
  return {
    jiggleInterval: lerp(a.jiggleInterval, b.jiggleInterval, x),
    jiggleDuration: lerp(a.jiggleDuration, b.jiggleDuration, x),
    dealDuration: lerp(a.dealDuration, b.dealDuration, x),
  };
}
