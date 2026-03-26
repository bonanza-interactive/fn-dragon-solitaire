// import {StateMachineRoundData} from '../main';
// import {AnyState, State} from '../state-machine';
// import {winningRound} from '../util/utils';
// import {ResultNoWin} from './result-no-win';
// // import {ResultWinBasegame} from './result-win-basegame';

// export class EndRound extends State<StateMachineRoundData> {
//   public run(data: StateMachineRoundData): AnyState {
//     if (winningRound(data.round)) {
//       // return new ResultWinBasegame(data);
//     } else {
//       return new ResultNoWin();
//     }
//   }
// }
