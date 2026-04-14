import * as superstruct from 'superstruct';

import {
  GameConfig,
  GameConfigSchema as GamePaysSchema,
  Replay,
  ReplaySchema,
  RoundState,
  RoundStateSchema,
} from '../config/backend-types';
import {
  RecoveryStep,
  RecoveryStepState,
  eCasinoToGame,
  gameToECasino,
} from '../config/recovery-step';
import {GAMEFW} from '../framework';
import {GAME} from '../game';

export type RecoveryData = {
  roundState: RoundState;
  bet: number;
  recoveryStep?: RecoveryStep;
};

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
    requestedBet: number,
  ): Promise<
    {accepted: false} | {accepted: true; round: RoundState; bet: number}
  > {
    // const selections: string[] = GAME.cards.getHandCards();
    const gameData = await GAMEFW.play(requestedBet, 'deal', {});
    if (gameData.accepted) {
      superstruct.assert(gameData.round, RoundStateSchema);
      return {accepted: true, round: gameData.round, bet: gameData.bet};
    } else {
      return {accepted: false};
    }
  }

  public static async complete(): Promise<void> {
    await GAMEFW.complete();
  }

  public static async step(
    state: RecoveryStepState | null,
    index = 0,
  ): Promise<void> {
    const step = state !== null ? gameToECasino({state, index}) : [];
    return await GAMEFW.step(step);
  }

  private static ensureRounds(obj: RoundState): RoundState {
    if (!obj.rounds) {
      obj.rounds = [];
    }
    return obj;
  }

  public static async gamble(): Promise<RoundState> {
    const data = await GAMEFW.action('gamble', {});
    const r = data.round as RoundState;
    if (r !== null) {
      return r;
    } else {
      throw new Error(`gamble action failed`);
    }
  }

  public static async gamblePick(pick: number): Promise<RoundState> {
    const params = {pick};
    const gameData = await GAMEFW.action('gamblePick', params);

    const finalResult = this.ensureRounds(gameData.round as RoundState);

    if (finalResult !== null) {
      superstruct.assert(finalResult, RoundStateSchema);
      return finalResult;
    } else {
      throw new Error('gamble pick action failed!');
    }
  }

  public static async freespinPick(): Promise<
    {round: RoundState; bet: number} | undefined
  > {
    const selections: string[] = GAME.cards.getHandCards();
    const gameData = await GAMEFW.action('freespin_pick', {selections});
    if (gameData.round) {
      superstruct.assert(gameData.round, RoundStateSchema);
      return {round: gameData.round, bet: gameData.bet};
    } else {
      return undefined;
    }
  }

  public static async chooseHandCards(
    selectedNumbers: number[],
    isFreespins: boolean = false,
  ): Promise<void> {
    await GAME.cards.selectCards(selectedNumbers, isFreespins);
    GAME.cards.endCardSelection(isFreespins);
  }

  public static async cheatRandom(params: number[]): Promise<void> {
    await GAMEFW.cheatRandom(params, null);
  }

  public static async cheatState(state: unknown): Promise<void> {
    await GAMEFW.cheatState(state);
  }

  public static async solitairePick(pickIndex: number): Promise<RoundState> {
    const gameData = await GAMEFW.action('pick', {pick: pickIndex});

    const r = gameData.round as RoundState;

    if (r !== null) {
      superstruct.assert(r, RoundStateSchema);
      return r;
    } else {
      throw new Error('solitaire pick action failed');
    }
  }
  public static async solitairePickAuto(): Promise<RoundState> {
    const gameData = await GAMEFW.action('pick', {});

    const r = gameData.round as RoundState;

    if (r !== null) {
      superstruct.assert(r, RoundStateSchema);
      return r;
    } else {
      throw new Error('solitaire pick action failed');
    }
  }

  public static async autocomplete(): Promise<RoundState> {
    const gameData = await GAMEFW.action('pick', {});
    const r = gameData.round as RoundState;
    if (r !== null) {
      superstruct.assert(r, RoundStateSchema);
      return r;
    }
    throw new Error('autocomplete action failed');
  }

  public static resolvePickIndex(
    move: {from: string; to: string; count: number},
    picks: {from: string; to: string; count: number}[],
  ): number {
    const index = picks.findIndex(
      (p) => p.from === move.from && p.to === move.to && p.count === move.count,
    );

    if (index === -1) {
      console.error('Move not found in picks', {move, picks});
      throw new Error('Invalid move selected');
    }

    return index;
  }
}
