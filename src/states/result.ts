import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
import {EndRound} from './end-round';
import {computeWinCents} from '../util/win-amount';
import {GAMEFW} from '../framework';

export class Result extends State<StateMachineRoundData> {
  public async run(data: StateMachineRoundData): Promise<AnyState> {
    // assert(data.round.result !== undefined && data.round.result.length === 5);

    // if (data.round.hand.length === 4) {
    //   await GAME.cards.flipCard(CLIENT_STATE.deckSelect, {
    //     rank: data.round.result[4].rank,
    //     suit: data.round.result[4].suit,
    //     isJoker: data.round.result[4].isJoker,
    //   });
    // } else {
    //   await GAME.cards.flipCards(
    //     CLIENT_STATE.deckSelect === 1,
    //     {
    //       rank: data.round.result[3].rank,
    //       suit: data.round.result[3].suit,
    //       isJoker: data.round.result[3].isJoker,
    //     },
    //     {
    //       rank: data.round.result[4].rank,
    //       suit: data.round.result[4].suit,
    //       isJoker: data.round.result[4].isJoker,
    //     }
    //   );
    // }

    CLIENT_STATE.winsum = computeWinCents(data);
    if (CLIENT_STATE.winsum > 0) {
      GAMEFW.updateWins(CLIENT_STATE.winsum);
    }

    return new EndRound(data);
  }
}
