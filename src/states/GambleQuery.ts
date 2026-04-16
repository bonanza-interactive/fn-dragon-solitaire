// import {CORE, GAME} from '../game';
// import {CLIENT_STATE, StateMachineRoundData} from '../main';
// import {AnyState, State} from '../state-machine';
// import {getTargetLevel} from '../win-scroll';
// import {GambleEnter} from './GambleEnter';
// import {SettleBet} from './settlebet';
// import {computeWinAmount} from '../util/win-amount';
// import {Input} from '@apila/casino-frame/types';
// import {GAMEFW, LOCALIZER} from '../framework';
// import {nextInput} from '../util/forward-input';
// import {setButtonState} from '../button-state-handler';
// import {wait} from '../util/utils';

// export class GambleQuery extends State<StateMachineRoundData> {
//   public async run(data: StateMachineRoundData): Promise<AnyState> {
//     if (CLIENT_STATE.replay) {
//       await wait(1500);

//       const gambleIndex = CLIENT_STATE.replay.events.findIndex(
//         (e) => e.action === 'gamble',
//       );

//       if (gambleIndex !== -1) {
//         CLIENT_STATE.roundStep = gambleIndex;
//         return new GambleEnter(data);
//       }

//       return new SettleBet();
//     }
//     const winAmount = computeWinAmount(data.roundState.winFactor, data.bet);
//     const gambleAllowed = data.roundState.canGamble && winAmount > 0;
//     const winLevel = getTargetLevel(winAmount / data.bet);
//     if (gambleAllowed) {
//       CORE.fx.trigger(
//         winLevel > 0 ? 'music_game_winning' : 'music_gamble_query',
//       );
//       setButtonState('return_to_selection', false, false);
//       setButtonState('swap_selected', false, false);
//     } else if (winAmount !== undefined && winAmount > 0) {
//       if (winLevel > 0) {
//         CORE.fx.trigger('music_game_winning');
//       }
//       CLIENT_STATE.winScrollCompletePromise.then(() => {
//         GAME.baseGameFrameText.setTextString(
//           LOCALIZER.get('basegame_win_exceeds_max', LOCALIZER.money(winAmount)),
//         );
//       });
//     } else {
//       return this.endGambleQuery();
//     }

//     const inputs: Input[] = ['collect', 'collectAndPlay'];
//     if (gambleAllowed) {
//       inputs.push('gamble');
//     }
//     CLIENT_STATE.gambleStake = gambleAllowed ? CLIENT_STATE.winsum : 0;

//     GAMEFW.inputs(...inputs);
//     const action = await nextInput();
//     GAMEFW.inputs();

//     if (action === 'collectAndPlay') {
//       CLIENT_STATE.attemptAutoPlay = true;
//     } else if (action === 'collect') {
//       // go through
//     } else if (action === 'gamble') {
//       return new GambleEnter(data);
//     }
//     return this.endGambleQuery();
//   }

//   private endGambleQuery(): AnyState {
//     return new SettleBet();
//   }
// }
