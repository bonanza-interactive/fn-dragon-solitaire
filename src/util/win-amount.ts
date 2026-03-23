import {assert} from './assert';

export function computeWinCents(winFactor: number, bet: number): number;
export function computeWinCents(data: {
  bet: number;
  round: {winFactor: number};
}): number;
export function computeWinCents(
  winFactor:
    | number
    | {
        bet: number;
        round: {winFactor: number};
      },
  bet?: number
): number {
  let _winFactor: number;
  let _bet: number;
  if (typeof winFactor === 'number') {
    assert(bet != null);
    _winFactor = winFactor;
    _bet = bet;
  } else {
    _winFactor = winFactor.round.winFactor;
    _bet = winFactor.bet;
  }

  const winAmount = (_winFactor * _bet) / 100;
  assert(winAmount - Math.floor(winAmount) === 0);
  return winAmount;
}
