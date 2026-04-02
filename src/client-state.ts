import {Replay, RoundState} from './config/backend-types';
import {RecoveryStep, RecoveryStepState} from './config/recovery-step';
import {computeWinAmount} from './util/win-amount';

export class ClientState {
  public bet = 0;

  public recoveryState?: RecoveryStepState;
  public roundStep = 0;
  public freespinsLeft = 0;
  public winsum = 0;

  public freespinWon = false;

  public gambleStake = 0;
  public gambleOptions: string[] = [];
  public gamblePick?: number;

  public attemptAutoPlay = false;
  public replay?: Replay;
  public winScrollCompletePromise: Promise<void> = Promise.resolve();
  public roundInProgress = false;

  public restore(
    round: RoundState,
    bet: number,
    recoveryData?: RecoveryStep,
  ): void {
    this.bet = bet;
    const maxRoundSteps = round.rounds?.length;
    if (recoveryData) {
      this.recoveryState = recoveryData.state;
      this.roundStep = recoveryData.index;
    }
    this.freespinWon = round.bonusWon;
    this.roundStep = Math.min(Math.max(this.roundStep, 0), maxRoundSteps ?? 0);
    // if (round.gambleResult) {
    //   this.gambleStake = round.gambleResult.stake;
    //   this.gamblePick = round.gambleResult.result?.pick;
    // }
    const roundsRestored = round.rounds.slice(0, this.roundStep);
    // const winsRestored = roundsRestored.flatMap((i) => i.winFactor);
    // this.winsum += winsRestored.reduce(
    //   (winsum, r) => winsum + (computeWinAmount(r.winFactor, bet) ?? 0),
    //   0,
    // );
    this.winsum += roundsRestored.reduce(
      (winsum, r) => winsum + (computeWinAmount(r.winFactor, bet) ?? 0),
      0,
    );
  }

  public reset(): void {
    this.freespinWon = false;
    this.freespinsLeft = 0;
    this.winsum = 0;
    this.roundStep = 0;
    this.attemptAutoPlay = false;
    this.gamblePick = undefined;
    this.gambleOptions = [];
    this.roundInProgress = false;
  }
}

export function replayRoundData(
  cs: ClientState,
  step?: number,
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
