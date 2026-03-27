import {assert, assertDefined} from './assert';
import {
  Action,
  PickAction,
  Replay,
  ReplayRound,
} from '../config/backend-types';

type ParamsOfAction = {
  deal: Record<string, never>;
  pick: PickAction;
  // gamble: GamblePickAction;
};

export function findAction<K extends Action>(
  replay: Replay,
  action: K
): ReplayRound & {params: ParamsOfAction[K]} {
  const evt = assertDefined(replay.events.find((e) => e.action === action));
  assert(evt.params != null);
  return evt as ReplayRound & {params: ParamsOfAction[K]};
}

export function findLastAction<K extends Action>(
  replay: Replay,
  action: K
): ReplayRound & {params: ParamsOfAction[K]} {
  const evt = assertDefined(
    replay.events
      .slice()
      .reverse()
      .find((e) => e.action === action)
  );
  assert(evt.params != null);
  return evt as ReplayRound & {params: ParamsOfAction[K]};
}
