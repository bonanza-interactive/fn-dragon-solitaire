import {assert, assertDefined} from './assert';
import {
  Actions,
  // PickAction,
  Replay,
  ReplayRound,
} from '../config/backend-types';

type ParamsOfAction = {
  deal: Record<string, never>;
  // pick: PickAction;
  // gamble: GamblePickAction;
};

export function findAction<K extends Actions>(
  replay: Replay,
  action: K
): ReplayRound & {params: ParamsOfAction} {
  const evt = assertDefined(replay.events.find((e) => e.action === action));
  assert(evt.params != null);
  return evt as ReplayRound & {params: ParamsOfAction};
}

export function findLastAction<K extends Actions>(
  replay: Replay,
  action: K
): ReplayRound & {params: ParamsOfAction} {
  const evt = assertDefined(
    replay.events
      .slice()
      .reverse()
      .find((e) => e.action === action)
  );
  assert(evt.params != null);
  return evt as ReplayRound & {params: ParamsOfAction};
}
