import {input} from '@apila/engine';
import {CORE, GAME} from '../game';
import {CLIENT_STATE, StateMachineRoundData} from '../main';
import {AnyState, State} from '../state-machine';
// import {Result} from './result';
import {BackendUtil} from '../util/backend-util';
import {assert, assertDefined} from '../util/assert';
// import {findAction} from '../util/replay-util';
// import {Action} from '../config/backend-types';
import {wait} from '../util/utils';
import {customInput, nextInput} from '../forward-input';

// export class FourOfAKind extends State<StateMachineRoundData> {
//   // public async run(_data: StateMachineRoundData): Promise<AnyState> {
//   //   let roundResult: StateMachineRoundData;
//   //   // if (CLIENT_STATE.replay) {
//   //   //   const {
//   //   //     roundState,
//   //   //     params: {pick},
//   //   //   } = findAction(CLIENT_STATE.replay);
//   //   //   CLIENT_STATE.deckSelect = pick;
//   //   //   roundResult = {
//   //   //     bet: CLIENT_STATE.replay.bet,
//   //   //     round: assertDefined(roundState),
//   //   //   };
//   //   //   await wait(1000);
//   //   // } else {
//   //   //   GAME.cards.cardHilite('deck');

//   //   //   CLIENT_STATE.deckSelect = await this.selectCard();

//   //   //   GAME.cards.disableCardHilites();
//   //   //   roundResult = await BackendUtil.pick(CLIENT_STATE.deckSelect, false);
//   //   // }

//   //   // assert(roundResult.round.result !== undefined);
//   //   GAME.cards.selectCard(CLIENT_STATE.deckSelect);
//   //   // return new Result(roundResult);
//   // }

//   private async selectCard(): Promise<number> {
//     const nodes = GAME.cards.cardSelectionNodesFourOfAKind();

//     const ids: number[] = [];
//     const cleanUp = () => {
//       for (const i of ids) {
//         CORE.input.removeListener(i);
//       }
//     };
//     for (let i = 0; i < nodes.length; ++i) {
//       const id = CORE.input.listenNode(
//         nodes[i],
//         (e: input.InputEvent) => {
//           if (e.pressed) {
//             customInput(`custom/pick${i}`);
//           }
//         },
//         'pointer'
//       );
//       ids.push(id);
//     }

//     const pickAction = await nextInput();
//     cleanUp();
//     const pick = Number.parseInt(pickAction.slice('custom/pick'.length), 10);
//     assert(pick >= 0 && pick < 4);
//     return pick;
//   }
// }
