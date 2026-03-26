import {ChipType} from '../chips';
// import {Win} from '../config/backend-types';
import {GameConfig} from '../config/config';
import {GAME} from '../game';
import {CLIENT_STATE} from '../main';
import {ScrollStyle} from '../win-scroll';

export enum Suit {
  Spades = 'Spades',
  Clubs = 'Clubs',
  Diamonds = 'Diamonds',
  Hearts = 'Hearts',
}

export enum Rank {
  Rank_A = 'Rank_A',
  Rank_2 = 'Rank_2',
  Rank_3 = 'Rank_3',
  Rank_4 = 'Rank_4',
  Rank_5 = 'Rank_5',
  Rank_6 = 'Rank_6',
  Rank_7 = 'Rank_7',
  Rank_8 = 'Rank_8',
  Rank_9 = 'Rank_9',
  Rank_10 = 'Rank_10',
  Rank_J = 'Rank_J',
  Rank_Q = 'Rank_Q',
  Rank_K = 'Rank_K',
}

export function rankToIndex(rank: string): number {
  return Object.keys(Rank).indexOf(rank);
}

export function suitToIndex(suit: string): number {
  return Object.keys(Suit).indexOf(suit);
}

export function cardToIndex(rank: string, suit: string): number {
  const rankIndex = rankToIndex(rank);
  const suitIndex = suitToIndex(suit);

  return suitIndex * 13 + rankIndex;
}

export function isSwappable(cards: {rank: string; suit: string}[]): boolean {
  const hardPairLeft = cards[0].rank === cards[1].rank;
  const hardPairRight = cards[2].rank === cards[3].rank;
  const softPairLeft =
    cards[0].rank === Rank.Rank_2 || cards[1].rank === Rank.Rank_2;
  const softPairRight =
    cards[2].rank === Rank.Rank_2 || cards[3].rank === Rank.Rank_2;

  if (
    (hardPairRight && !hardPairLeft) ||
    (softPairRight && !hardPairLeft && !softPairLeft)
  ) {
    return true;
  }
  return false;
}

export function hasJoker(cards: {rank: string; suit: string}[]): boolean {
  return cards.find((e) => e.rank === Rank.Rank_2) !== undefined;
}

// export function getWinIndex(win: Win): number {
//   return GameConfig.gameConfig.paytable.findIndex((e) => e.rank === win.hand);
// }

export function getWinningCards(
  result: {rank: string; suit: string}[],
  winningCards: {rank: string; suit: string}[]
): number[] {
  const winningIndices = result
    .map((resultCard, i) =>
      winningCards.find(
        (winningCard) =>
          winningCard.rank === resultCard.rank &&
          winningCard.suit === resultCard.suit
      )
        ? i
        : -1
    )
    .filter((e) => e !== -1);

  return winningIndices;
}

export async function showWin(
  winAmount: number,
  enableBigWin = false
): Promise<void> {
  if (CLIENT_STATE.bonusWon) {
    GAME.chips.playAnimation(ChipType.LEFT, 2);
    GAME.chips.playAnimation(ChipType.RIGHT1, 2);
    GAME.chips.playAnimation(ChipType.RIGHT2, 2);
  } else {
    GAME.chips.playAnimation(ChipType.LEFT, 0);
    GAME.chips.playAnimation(ChipType.RIGHT1, 0);
    GAME.chips.playAnimation(ChipType.RIGHT2, 0);
  }

  const scrollStyle = enableBigWin
    ? ScrollStyle.HideAfterDelay |
      ScrollStyle.ShowScroller |
      ScrollStyle.EnableBigWin
    : ScrollStyle.HideAfterDelay | ScrollStyle.ShowScroller;

  return GAME.winScroll
    .scroll(winAmount, CLIENT_STATE.bet, scrollStyle)
    .then((_) => {});
}

export function gambleMusicLevel(winAmount: number, bet: number): number {
  const winsum = winAmount / bet;

  if (winsum < 10) return 0;
  else if (winsum < 25) return 1;
  else if (winsum < 50) return 2;
  else if (winsum < 100) return 3;
  else return 4;
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
        .padStart(2, '0')
    )
    .join('');
}
