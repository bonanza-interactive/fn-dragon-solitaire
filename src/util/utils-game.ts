import {Playback} from '@apila/game-libraries/dist/game-animation';

import {CARD_DRAGON} from '../config/config';
import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {ScrollStyle} from '../win-scroll';
import {RoundState} from '../config/backend-types';

export enum Suit {
  Spades = 'S',
  Clubs = 'C',
  Diamonds = 'D',
  Hearts = 'H',
  Jokers = 'Jokers',
}
export const tempData = [
  {
    selections: 2,
    weightedDraw: [
      {
        item: {
          freespinAmount: 3,
        },
        weight: 70,
      },
      {
        item: {
          multiplier: 2,
        },
        weight: 400,
      },
      {
        item: {
          multiplier: 3,
        },
        weight: 500,
      },
      {
        item: {
          multiplier: 5,
        },
        weight: 250,
      },
      {
        item: {
          multiplier: 7,
        },
        weight: 100,
      },
      {
        item: {
          multiplier: 10,
        },
        weight: 100,
      },
      {
        item: {
          multiplier: 50,
        },
        weight: 5,
      },
      {
        item: {
          multiplier: 100,
        },
        weight: 1,
      },
    ],
  },
];

export enum Rank {
  Rank_A = 'A',
  Rank_2 = '2',
  Rank_3 = '3',
  Rank_4 = '4',
  Rank_5 = '5',
  Rank_6 = '6',
  Rank_7 = '7',
  Rank_8 = '8',
  Rank_9 = '9',
  Rank_10 = '10',
  Rank_J = 'J',
  Rank_Q = 'Q',
  Rank_K = 'K',
  Joker = 'Joker',
}

export function rankToIndex(rank: string): number {
  return Object.keys(Rank).indexOf(rank);
}

export function suitToIndex(suit: string): number {
  return Object.keys(Suit).indexOf(suit);
}

export function cardToIndex(rank: string, suit: string): number {
  if (rank === 'Joker' || suit === 'Jokers') return CARD_DRAGON;
  const rankIndex = rankToIndex(rank);
  const suitIndex = suitToIndex(suit);
  return suitIndex * 13 + rankIndex;
}

export function indexToCard(index: number): string {
  const suit = Math.floor(index / 13);
  const rank = index % 13;
  return Object.values(Suit)[suit] + Object.values(Rank)[rank];
}

export function isExceedMaxWin(round: RoundState): boolean {
  return round.maxWinFactorReached;
}

export async function showWin(
  winAmount: number,
  enableBigWin: boolean,
  isHideAfterDelay: boolean,
  exceedMaxWin: boolean,
  isBaseGame: boolean,
  onScrollComplete?: () => void,
): Promise<void> {
  const scrollStyle = isHideAfterDelay
    ? enableBigWin
      ? ScrollStyle.HideAfterDelay |
        ScrollStyle.ShowScroller |
        ScrollStyle.EnableBigWin
      : ScrollStyle.HideAfterDelay | ScrollStyle.ShowScroller
    : enableBigWin
      ? ScrollStyle.ShowScroller | ScrollStyle.EnableBigWin
      : ScrollStyle.ShowScroller;

  await GAME.winScroll.scroll(
    winAmount,
    CLIENT_STATE.bet,
    1,
    exceedMaxWin,
    isBaseGame,
    scrollStyle,
    onScrollComplete,
  );

  if (enableBigWin) {
    GAME.dragonPanel.stopDragonBreath();
  }
}

export async function showWinWithMultiplier(
  winAmount: number,
  multiplier: number,
  isHideAfterDelay: boolean,
  exceedMaxWin: boolean,
  isBaseGame: boolean,
  onScrollComplete?: () => void,
): Promise<void> {
  const scrollStyle = isHideAfterDelay
    ? ScrollStyle.HideAfterDelay |
      ScrollStyle.ShowScroller |
      ScrollStyle.EnableBigWin
    : ScrollStyle.ShowScroller | ScrollStyle.EnableBigWin;
  await GAME.winScroll.scroll(
    winAmount,
    CLIENT_STATE.bet,
    multiplier,
    exceedMaxWin,
    isBaseGame,
    scrollStyle,
    onScrollComplete,
  );
}

export function playbackAsync(playback: Playback): Promise<void> {
  return new Promise<void>((resolve) => {
    playback.after(resolve);
  });
}

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
export function hsv2rgb(h: number, s: number, v: number): number[] {
  const f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1)];
}

export function hexColor(h: number, s: number, v: number): string {
  const rgbColor = hsv2rgb(h, s, v);

  return rgbColor
    .map((e) =>
      Math.floor(e * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');
}

export function getMaxMultiplier(): number | undefined {
  const weightedDraw = [
    {
      item: {
        freespinAmount: 3,
      },
      weight: 40,
    },
    {
      item: {
        multiplier: 2,
      },
    },
  ];
  const multipliers = [tempData, tempData];
  return multipliers.reduce(
    (maxMultiplier) => {
      const maxInDragonMultiplier = weightedDraw.reduce(
        (maxItemMultiplier, item) => {
          const itemMultiplier = item.item.multiplier;
          if (
            itemMultiplier !== undefined &&
            (maxItemMultiplier === undefined ||
              itemMultiplier > maxItemMultiplier)
          ) {
            return itemMultiplier;
          }
          return maxItemMultiplier;
        },
        undefined as number | undefined,
      );

      if (
        maxInDragonMultiplier !== undefined &&
        (maxMultiplier === undefined || maxInDragonMultiplier > maxMultiplier)
      ) {
        return maxInDragonMultiplier;
      }

      return maxMultiplier;
    },
    undefined as number | undefined,
  );
}

export function getAllMultipliers(isFreespins: boolean): number[] {
  const multipliers = isFreespins ? tempData : tempData;
  return [
    ...new Set(
      multipliers
        .flatMap((dragonMultiplier) =>
          dragonMultiplier.weightedDraw.map((item) => item.item.multiplier),
        )
        .filter((multiplier): multiplier is number => multiplier !== undefined),
    ),
  ].sort((a, b) => a - b);
}

export function getMultipliersAsText(
  isFreespins: boolean,
  replaceLastComma: string | undefined = undefined,
): string {
  const multipliers: number[] = getAllMultipliers(isFreespins);
  const multipliersString = multipliers
    .map((multiplier) => `${multiplier}x`)
    .join(', ');

  if (replaceLastComma !== undefined) {
    const formattedString = multipliersString.replace(
      /, ([^,]*)$/,
      ` ${replaceLastComma} $1`,
    );
    return formattedString;
  }

  return multipliersString;
}
