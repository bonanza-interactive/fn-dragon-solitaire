// import {CORE, GAME} from '../game';
// import {CLIENT_STATE, StateMachineRoundData} from '../main';
// import {AnyState, State} from '../state-machine';
// import {cardToIndex, gambleMusicLevel, showWin} from '../util/utils-game';
// import {GambleContinue} from './gamble-continue';
// import {GambleExit} from './gamble-exit';
// import {GambleMaxWin} from './gamble-max-win';
// import {computeWinCents} from '../util/win-amount';
// import {assert} from '../util/assert';
// import {GAMEFW} from '../framework';

// export class GambleRound extends State<StateMachineRoundData> {
//   public async run(data: StateMachineRoundData): Promise<AnyState> {
//     const roundState = data.round;
//     // const gambleResult = roundState.gambleResult;

//     assert(gambleResult !== undefined);

//     const gambleWinAmount = computeWinCents(gambleResult.winFactor, data.bet);
//     CLIENT_STATE.winsum = gambleWinAmount;

//     await GAME.cards.revealDblCard(
//       cardToIndex(gambleResult.resultCard.rank, gambleResult.resultCard.suit)
//     );

//     if (roundState.canGamble && gambleResult) {
//       CLIENT_STATE.gambleStake = CLIENT_STATE.winsum;
//     }

//     GAMEFW.updateWins(gambleWinAmount);

//     if (gambleWinAmount > 0) {
//       CORE.fx.trigger('fx_dbl_win');

//       if (roundState.canGamble) {
//         showWin(gambleWinAmount);
//         CORE.fx.trigger(
//           `fx_dbl_guess_${gambleMusicLevel(computeWinCents(data), data.bet)}`
//         );
//       }
//     }

//     const replayEnded =
//       CLIENT_STATE.replay?.events[CLIENT_STATE.roundStep].method === 'complete';

//     if (!roundState.canGamble && gambleWinAmount > 0)
//       return new GambleMaxWin({round: roundState, bet: data.bet});
//     else if (!replayEnded && roundState.canGamble && gambleWinAmount > 0)
//       return new GambleContinue({round: roundState, bet: data.bet});
//     else {
//       CORE.fx.trigger('fx_dbl_lose');
//       return new GambleExit(false);
//     }
//   }
// }
