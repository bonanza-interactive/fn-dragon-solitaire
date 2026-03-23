import * as superstruct from 'superstruct';

import {
  GamblePick,
  GameConfig,
  GameConfigSchema as GamePaysSchema,
  Replay,
  ReplaySchema,
  RoundState,
  RoundStateSchema,
} from '../config/backend-types';
import {GAMEFW} from '../framework';
import {
  RecoveryStep,
  RecoveryStepState,
  eCasinoToGame,
  gameToECasino,
} from '../config/recovery-step';

export type RecoveryData = {
  roundState: RoundState;
  bet: number;
  recoveryStep?: RecoveryStep;
};

type RoundHistoryEvent = Record<string, unknown>;
export let ROUND_HISTORY: RoundHistoryEvent[] = [];

class Recorder {
  static placeBet(
    e: Awaited<ReturnType<(typeof GAMEFW)['play']>>,
    action: string,
    params: unknown
  ) {
    ROUND_HISTORY = [];
    ROUND_HISTORY.push({
      method: 'placeBet',
      action,
      params,
      bet: (<Record<string, unknown>>e).bet,
      roundState: (<Record<string, unknown>>e).round,
    });
  }

  static settleBet() {
    ROUND_HISTORY.push({method: 'settleBet'});
  }

  static action(
    e: Awaited<ReturnType<(typeof GAMEFW)['action']>>,
    action: string,
    params: unknown
  ) {
    ROUND_HISTORY.push({
      method: 'action',
      action,
      params,
      roundState: (<Record<string, unknown>>e).round,
    });
  }
}

export class BackendUtil {
  private static cachedState: RecoveryData | undefined;

  public static replayData: Replay | undefined;

  public static async init(): Promise<GameConfig> {
    const gamePays = GAMEFW.settings().pays;
    superstruct.assert(gamePays, GamePaysSchema);

    const initReply = await GAMEFW.initialize();
    if (initReply.type !== 'history') {
      if (initReply.data.round) {
        superstruct.assert(initReply.data.round, RoundStateSchema);
        superstruct.assert(initReply.data.bet, superstruct.number());
        this.cachedState = {
          roundState: initReply.data.round,
          bet: initReply.data.bet,
          recoveryStep: initReply.data.recovery
            ? eCasinoToGame(initReply.data.recovery)
            : undefined,
        };
      }
    } else {
      superstruct.assert(initReply.data, ReplaySchema);
      this.replayData = initReply.data;
    }
    return gamePays;
  }

  public static restoreGameState(): RecoveryData | undefined {
    return this.cachedState;
  }

  public static async play(
    requestedBet: number
  ): Promise<
    {accepted: false} | {accepted: true; round: RoundState; bet: number}
  > {
    const gameData = await GAMEFW.play(requestedBet, 'deal', {});
    Recorder.placeBet(gameData, 'deal', {});
    if (gameData.accepted) {
      superstruct.assert(gameData.round, RoundStateSchema);
      return {
        accepted: true,
        round: gameData.round,
        bet: gameData.bet,
      };
    } else {
      return {accepted: false};
    }
  }

  public static async complete(): Promise<void> {
    await GAMEFW.complete();
    Recorder.settleBet();
  }

  public static async step(
    state: RecoveryStepState | null,
    index = 0
  ): Promise<void> {
    const step = state !== null ? gameToECasino({state, index}) : [];
    return await GAMEFW.step(step);
  }

  public static async gamble(
    pick: GamblePick
  ): Promise<{round: RoundState; bet: number}> {
    const params = {pick};
    const gameData = await GAMEFW.action('gamble', params);
    Recorder.action(gameData, 'gamble', params);
    superstruct.assert(gameData.round, RoundStateSchema);
    return {round: gameData.round, bet: gameData.bet};
  }

  public static async pick(
    pick: number,
    swap: boolean
  ): Promise<{
    round: RoundState;
    bet: number;
  }> {
    const params = {pick, swap};
    const gameData = await GAMEFW.action('pick', params);
    Recorder.action(gameData, 'pick', params);
    superstruct.assert(gameData.round, RoundStateSchema);
    return {round: gameData.round, bet: gameData.bet};
  }

  public static async cheatRandom(params: number[]): Promise<void> {
    await GAMEFW.cheatRandom(params, null);
  }

  public static async cheatState(state: unknown): Promise<void> {
    await GAMEFW.cheatState(state);
  }
}
