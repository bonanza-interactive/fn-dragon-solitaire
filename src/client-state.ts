import {Replay, RoundState} from './config/backend-types';
import {RecoveryStep} from './config/recovery-step';
import {computeWinCents} from './util/win-amount';

export class ClientState {
  public bet = 0;

  public recoveryState?: RecoveryStep;
  public roundStep = 0;
  public freespinsLeft = 0;
  public winsum = 0;

  public deckSelect = -1;
  public swap = false;
  public bonusWon = false;
  public sorted = false;

  public gambleStake = 0;
  public gambleOptions: string[] = [];
  public gamblePick?: string;

  public replay?: Replay;

  public restore(
    round: RoundState,
    bet: number,
    recoveryStep?: RecoveryStep
  ): void {
    this.bonusWon = round.bonusWon;
    this.recoveryState = recoveryStep;

    this.bet = bet;

    if (recoveryStep) {
      this.recoveryState = recoveryStep;
      this.roundStep = recoveryStep.index;
    }

    // if (round.gambleResult) {
    //   this.gambleStake = round.gambleResult?.stake;
    //   this.gamblePick = round.gambleResult.selection;
    // }

    this.winsum = computeWinCents(bet, round.winFactor);
  }

  public reset(): void {
    this.deckSelect = -1;
    this.swap = false;
    this.bonusWon = false;
    this.sorted = false;

    this.freespinsLeft = 0;
    this.winsum = 0;
    this.roundStep = 0;
    this.gamblePick = undefined;
    this.gambleOptions = [];
  }
}

export function replayRoundData(
  cs: ClientState,
  step?: number
): {
  round: RoundState;
  bet: number;
} {
  step = step ?? cs.roundStep;
  const evt = cs.replay?.events?.[step];
  if (!evt || !evt.roundState)
    throw new Error('Replay in progress and replay data is incomplete');

  return {
    round: evt.roundState,
    bet: cs.bet,
  };
}
