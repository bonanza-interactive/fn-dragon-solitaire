import {assert, assertDefined} from './assert';
import {Replay, ReplayRound} from '../config/backend-types';

type ParamsOfAction = {
  deal: Record<string, never>;
};

// export function findAction<K extends Action>(
//   replay: Replay,
// ): ReplayRound & {params: ParamsOfAction[K]} {
//   return evt as ReplayRound & {params: ParamsOfAction[K]};
// }

// export function findLastAction<K extends Action>(
//   replay: Replay,
//   action: K
// ): ReplayRound & {params: ParamsOfAction[K]} {
//   const evt = assertDefined(
//     replay.events
//       .slice()
//       .reverse()
//       .find((e) => e.action === action)
//   );
//   assert(evt.params != null);
//   return evt as ReplayRound & {params: ParamsOfAction[K]};
// }
