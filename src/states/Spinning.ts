import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {assert} from '../util/utils';
import {EndRound} from './EndRound';

export class Spinning extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    CORE.fx.trigger('music_game_spinning');

    CLIENT_STATE.bet = data.bet;
    CLIENT_STATE.freespinWon = data.roundState.freespinWon;

    assert(data.roundState.rounds !== undefined);

    if (CLIENT_STATE.freespinWon) {
      CLIENT_STATE.freespinsLeft = data.roundState.rounds.length;
    }

    // const round = data.roundState.rounds[CLIENT_STATE.roundStep];

    await GAME.cards.doRound(data.roundState, false);

    return new EndRound(data);
  }
}
