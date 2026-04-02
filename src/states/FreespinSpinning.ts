import {GAMEFW} from '../framework';
import {GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {trace} from '../util/trace';
import {assert, maxWinReached, wait} from '../util/utils';
// import {showWinWithMultiplier} from '../util/utils-game';
import {computeWinAmount} from '../util/win-amount';
import {FreespinMaxWin} from './FreespinMaxWin';
import {FreespinOutro} from './FreespinOutro';
import {FreespinRound} from './FreespinRound';

export class FreespinSpinning extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    const roundState = data.roundState;
    const rounds = roundState.rounds;

    assert(rounds !== undefined);
    assert(
      CLIENT_STATE.roundStep < rounds.length,
      `invalid round step ${CLIENT_STATE.roundStep} / ${rounds.length}`,
    );

    const round = rounds[CLIENT_STATE.roundStep];

    --CLIENT_STATE.freespinsLeft;

    assert(
      CLIENT_STATE.freespinsLeft >= 0,
      `invalid freespins amount: ${CLIENT_STATE.freespinsLeft}`,
    );

    trace('Freespin round:', round);

    GAME.dragonPanel.randomize(round, true);
    // await GAME.cards.doRound(round, true);

    // make sure we're on the last round, because the backend will send up to and including
    // the round where the max win was reached
    if (maxWinReached(data) && CLIENT_STATE.roundStep === rounds.length - 1) {
      return new FreespinMaxWin(data);
    }

    const winAmount = computeWinAmount(round.winFactor, GAMEFW.state().bet);

    if (winAmount > 0) {
      const anims: Promise<void>[] = [];
      // anims.push(
      //   showWinWithMultiplier(winAmount, round.multiplier, true, false, false),
      // );
      anims.push(wait(4000));
      await Promise.all(anims);
    } else {
      await wait(1500);
    }

    CLIENT_STATE.winsum += winAmount;
    GAMEFW.updateWins(CLIENT_STATE.winsum);

    if (CLIENT_STATE.freespinsLeft === 0) {
      return new FreespinOutro(data);
    } else {
      return new FreespinRound(data);
    }
  }
}
