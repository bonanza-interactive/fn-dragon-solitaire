import {assert} from './utils';

export function computeWinAmount(winFactor: number, bet: number): number {
  const winAmount = (winFactor * bet) / 100;
  assert(winAmount - Math.floor(winAmount) === 0);
  return winAmount;
}
