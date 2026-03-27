// import {debugConfig} from '../config/config';
// import {CORE, GAME} from '../game';
// import {CLIENT_STATE, StateMachineRoundData} from '../main';
// import {AnyState, State} from '../state-machine';
// import {GambleEnter} from './gamble-enter';
// import {GambleExit} from './gamble-exit';
// import {computeWinCents} from '../util/win-amount';
// import {GAMEFW, LOCALIZER} from '../framework';
// import {wait} from '../util/utils';
// import {nextInput} from '../forward-input';
// import {gambleMusicLevel} from '../util/utils-game';

// export class GambleQuery extends State<StateMachineRoundData> {
//   public async run(data: StateMachineRoundData): Promise<AnyState> {
//     if (GAMEFW.state().autoplayRunning || debugConfig.autoPlay) {
//       return new GambleExit(false);
//     }

//     CORE.fx.trigger(
//       `fx_dbl_query_${gambleMusicLevel(computeWinCents(data), data.bet)}`
//     );

//     if (CLIENT_STATE.replay) {
//       await wait(1500);

//       const gambleIndex = CLIENT_STATE.replay.events.findIndex(
//         (e) => e.action === 'gamble'
//       );

//       if (gambleIndex !== -1) {
//         CLIENT_STATE.roundStep = gambleIndex;
//         return new GambleEnter(data);
//       }

//       return new GambleExit(false);
//     }

//     const winAmount = computeWinCents(data.round.winFactor, data.bet);
//     const canGamble = data.round.canGamble && winAmount > 0;
//     CLIENT_STATE.gambleStake = canGamble ? CLIENT_STATE.winsum : 0;

//     if (winAmount > 0 && !data.round.canGamble) {
//       GAME.baseGameFrameText.setText(
//         LOCALIZER.get('basegame_win_exceeds_max', LOCALIZER.money(winAmount))
//       );
//     }

//     if (!data.round.canGamble) {
//       return new GambleExit(false);
//     }

//     let collectAndPlay = false;
//     GAMEFW.inputs('collectAndPlay', 'gamble', 'collect');
//     switch (await nextInput()) {
//       case 'collectAndPlay':
//         collectAndPlay = true;
//         break;
//       case 'gamble':
//         CORE.fx.trigger('fx_dbl_query_stop');
//         GAMEFW.inputs();
//         return new GambleEnter(data);
//       default:
//         break;
//     }

//     GAMEFW.inputs();
//     return new GambleExit(collectAndPlay);
//   }
// }
