// import {GamblePick, RoundState} from '../config/backend-types';
// import {CLIENT_STATE} from '../main';
// import {AnyState, State} from '../state-machine';
// import {GambleRound} from './gamble-round';
// import {BackendUtil} from '../util/backend-util';
// import {replayRoundData} from '../client-state';
// import {wait} from '../util/utils';

// export type StateMachineGambleData = {
//   round: RoundState;
//   gamblePickSelected: GamblePick;
// };

// export class GambleSelect extends State<StateMachineGambleData> {
//   public async run(data: StateMachineGambleData): Promise<AnyState> {
//     if (CLIENT_STATE.replay) {
//       const round = replayRoundData(CLIENT_STATE);
//       ++CLIENT_STATE.roundStep;
//       await wait(1000);
//       return new GambleRound(round);
//     }

//     const pick = data.gamblePickSelected;

//     const result = await BackendUtil.gamble(pick);

//     return new GambleRound(result);
//   }
// }
