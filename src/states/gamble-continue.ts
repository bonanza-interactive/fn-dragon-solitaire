// import {GameConfig} from '../config/config';
// import {CORE, GAME} from '../game';
// import {CLIENT_STATE, StateMachineRoundData} from '../main';
// import {AnyState, State} from '../state-machine';
// import {GambleExit} from './gamble-exit';
// // import {GambleSelect} from './gamble-select';
// import {computeWinCents} from '../util/win-amount';
// // import {GamblePick, GamblePickSchema} from '../config/backend-types';
// import {assert, assertDefined} from '../util/assert';
// import {replayRoundData} from '../client-state';
// import {wait} from '../util/utils';
// import {nextInput} from '../forward-input';
// import {GAMEFW} from '../framework';

// export class GambleContinue extends State<StateMachineRoundData> {
//   public async run(data: StateMachineRoundData): Promise<AnyState> {
//     // assert(data.round.gambleResult !== undefined);
//     // assert(data.round.gambleSelectableOptions !== undefined);

//     // const allButtons = GameConfig.gameConfig.gamble.selections.map(
//     //   (e) => e.type
//     // );

//     // CLIENT_STATE.gambleOptions = data.round.gambleSelectableOptions;

//     // for (const button of allButtons) {
//     //   if (CLIENT_STATE.gambleOptions.includes(button)) {
//     //     GAME.gambleButtons.setStake(
//     //       button,
//     //       computeWinCents(data.round.gambleResult.winFactor, data.bet)
//     //     );
//     //   } else {
//     //     GAME.gambleButtons.hideButton(true, button);
//     //   }
//     // }

//     // if (CLIENT_STATE.replay) {
//     //   const {round} = replayRoundData(CLIENT_STATE);
//     //   // const selection = assertDefined(round.gambleResult).selection;
//     //   CLIENT_STATE.gamblePick = selection;
//     //   await wait(1000);
//     //   return this.endSelect(selection, data);
//     // }

//     let collectAndPlay = false;

//     // GAME.gambleButtons.enableButtons(data.round.gambleSelectableOptions);

//     GAMEFW.inputs('collectAndPlay', 'collect');
//     const action = await nextInput();
//     GAMEFW.inputs();

//     if (action === 'collectAndPlay') {
//       collectAndPlay = true;
//     } else if (action === 'collect') {
//     } else if (action.substring(0, 6) === 'custom') {
//       const selection = action.substring(14);
//       CLIENT_STATE.gamblePick = selection;
//       // return this.endSelect(GamblePickSchema.mask(selection), data);
//     }

//     return new GambleExit(collectAndPlay);
//   }

//   // private async endSelect(
//   //   selection: GamblePick,
//   //   data: StateMachineRoundData
//   // ): Promise<AnyState> {
//   //   assert(CLIENT_STATE.gamblePick !== undefined);
//   //   assert(
//   //     // GameConfig.gameConfig.gamble.selections
//   //       .map((e) => e.type.slice())
//   //       .includes(CLIENT_STATE.gamblePick)
//   //   );

//   //   GAME.gambleButtons.disableButtons(data.round.gambleSelectableOptions ?? []);

//   //   CORE.fx.trigger('fx_dbl_guess_stop');

//   //   GAME.winScroll.hide();
//   //   await GAME.cards.collectCards();
//   //   await GAME.cards.dealDblCard();

//   //   return new GambleSelect({
//   //     round: data.round,
//   //     gamblePickSelected: selection,
//   //   });
//   // }
// }
