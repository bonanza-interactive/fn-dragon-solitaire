// import {CORE, GAME} from '../game';
// import {CLIENT_STATE, StateMachineRoundData} from '../main';
// import {AnyState, State} from '../state-machine';
// import {wait} from '../util/utils';
// import {gambleMusicLevel} from '../util/utils-game';
// import {GambleExit} from './gamble-exit';
// import {GambleSelect} from './gamble-select';
// import {computeWinCents} from '../util/win-amount';
// import {GAMEFW} from '../framework';
// import {GamblePick, GamblePickSchema} from '../config/backend-types';
// import {assertDefined} from '../util/assert';
// import {replayRoundData} from '../client-state';
// import {nextInput} from '../forward-input';

// export const GAMBLE_BUTTON_HIDE_Y = 400;
// export const GAMBLE_BUTTON_SHOW_TIME = 0.25;

// export class Gamble extends State<StateMachineRoundData> {
//   public async run(data: StateMachineRoundData): Promise<AnyState> {
//     const winAmount = computeWinCents(data.round.winFactor, data.bet);
//     CORE.fx.trigger(`fx_dbl_guess_${gambleMusicLevel(winAmount, data.bet)}`);

//     GAMEFW.updateWins(winAmount);

//     data.round.gambleSelectableOptions?.forEach((e) => {
//       GAME.gambleButtons.showButton(true, e);
//       GAME.gambleButtons.setStake(e, winAmount);
//     });
//     await wait(GAMBLE_BUTTON_SHOW_TIME * 1000);

//     if (CLIENT_STATE.replay) {
//       GAME.gambleButtons.disableButtons(data.round.gambleSelectableOptions);
//       const {round} = replayRoundData(CLIENT_STATE);
//       await wait(1000);
//       return this.endSelect(assertDefined(round.gambleResult).selection, data);
//     } else {
//       GAME.gambleButtons.enableButtons(
//         data.round.gambleSelectableOptions ?? []
//       );

//       let collectAndPlay = false;

//       GAMEFW.inputs('collectAndPlay', 'collect');
//       const action = await nextInput();
//       GAMEFW.inputs();
//       if (action === 'collectAndPlay') {
//         collectAndPlay = true;
//       } else if (action === 'collect') {
//       } else if (action.substring(0, 6) === 'custom') {
//         const selection = action.substring(14);
//         CLIENT_STATE.gamblePick = selection;
//         return this.endSelect(GamblePickSchema.mask(selection), data);
//       }

//       return new GambleExit(collectAndPlay);
//     }
//   }

//   private async endSelect(
//     selection: GamblePick,
//     data: StateMachineRoundData
//   ): Promise<AnyState> {
//     GAME.gambleButtons.disableButtons(data.round.gambleSelectableOptions ?? []);
//     CORE.fx.trigger('fx_dbl_guess_stop');

//     return new GambleSelect({
//       round: data.round,
//       gamblePickSelected: selection,
//     });
//   }
// }
