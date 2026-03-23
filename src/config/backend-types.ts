/* eslint-disable id-blacklist */
import {
  Infer,
  Struct,
  any,
  array,
  boolean,
  enums,
  integer,
  min,
  number,
  optional,
  size,
  string,
  type,
} from 'superstruct';
/* eslint-enable id-blacklist */

// superstruct definitions for backend types

export enum State {
  MAIN_STATE = 'main',
  BASE_CARDS_STATE = 'base_cards',
  RESULT_STATE = 'result',
}

export const StateSchema: Struct<State> = enums([
  State.MAIN_STATE,
  State.BASE_CARDS_STATE,
  State.RESULT_STATE,
]);

export enum Action {
  DEAL_ACTION = 'deal',
  PICK_ACTION = 'pick',
  GAMBLE_ACTION = 'gamble',
}

export const ActionSchema: Struct<Action> = enums([
  Action.DEAL_ACTION,
  Action.PICK_ACTION,
  Action.GAMBLE_ACTION,
]);

export enum GamblePick {
  LOW = 'low',
  HIGH = 'high',
  BLACK_SEVEN = 'black_seven',
}

export const GamblePickSchema: Struct<GamblePick> = enums([
  GamblePick.LOW,
  GamblePick.HIGH,
  GamblePick.BLACK_SEVEN,
]);

export enum Ranks {
  WILD_HAND = 'WILD_HAND',
  FIVE_OF_A_KIND = 'FIVE_OF_A_KIND',
  STRAIGHT_FLUSH = 'STRAIGHT_FLUSH',
  FOUR_OF_A_KIND = 'FOUR_OF_A_KIND',
  FULL_HOUSE = 'FULL_HOUSE',
  FLUSH = 'FLUSH',
  STRAIGHT = 'STRAIGHT',
  THREE_OF_A_KIND = 'THREE_OF_A_KIND',
  TWO_PAIR = 'TWO_PAIR',
}

export const RankSchema: Struct<Ranks> = enums([
  Ranks.WILD_HAND,
  Ranks.FIVE_OF_A_KIND,
  Ranks.STRAIGHT_FLUSH,
  Ranks.FOUR_OF_A_KIND,
  Ranks.FULL_HOUSE,
  Ranks.FLUSH,
  Ranks.STRAIGHT,
  Ranks.THREE_OF_A_KIND,
  Ranks.TWO_PAIR,
]);

export enum CardRank {
  JOKER = 'Joker',
  RANK_2 = 'Rank_2',
  RANK_3 = 'Rank_3',
  RANK_4 = 'Rank_4',
  RANK_5 = 'Rank_5',
  RANK_6 = 'Rank_6',
  RANK_7 = 'Rank_7',
  RANK_8 = 'Rank_8',
  RANK_9 = 'Rank_9',
  RANK_10 = 'Rank_10',
  RANK_J = 'Rank_J',
  RANK_Q = 'Rank_Q',
  RANK_K = 'Rank_K',
  RANK_A = 'Rank_A',
}

export const CardRankSchema: Struct<CardRank> = enums([
  CardRank.JOKER,
  CardRank.RANK_2,
  CardRank.RANK_3,
  CardRank.RANK_4,
  CardRank.RANK_5,
  CardRank.RANK_6,
  CardRank.RANK_7,
  CardRank.RANK_8,
  CardRank.RANK_9,
  CardRank.RANK_10,
  CardRank.RANK_J,
  CardRank.RANK_Q,
  CardRank.RANK_K,
  CardRank.RANK_A,
]);

export enum CardSuit {
  JOKERS = 'Jokers',
  SPADES = 'Spades',
  CLUBS = 'Clubs',
  HEARTS = 'Hearts',
  DIAMONDS = 'Diamonds',
}

export const CardSuitSchema: Struct<CardSuit> = enums([
  CardSuit.JOKERS,
  CardSuit.SPADES,
  CardSuit.CLUBS,
  CardSuit.HEARTS,
  CardSuit.DIAMONDS,
]);

export const PickActionSchema = type({
  pick: integer(),
  swap: boolean(),
});

export const GamblePickActionSchema = type({
  pick: GamblePickSchema,
});

export const CardSchema = type({
  rank: CardRankSchema,
  suit: CardSuitSchema,
  isJoker: boolean(),
});

export const GambleRoundSchema = type({
  selection: GamblePickSchema,
  resultCard: CardSchema,
  winFactor: integer(),
  stake: integer(),
});

export const WinSchema = type({
  hand: RankSchema,
  winningCards: array(CardSchema),
  winFactor: integer(),
});

export const RoundStateSchema = type({
  hand: size(array(CardSchema), 2, 4),
  flop: size(array(CardSchema), 0, 2),
  allowSwap: boolean(),
  roundMultiplier: min(integer(), 1),
  result: optional(size(array(CardSchema), 5)),
  gambleSelectableOptions: array(GamblePickSchema),
  win: optional(WinSchema),
  gambleResult: optional(GambleRoundSchema),
  canGamble: boolean(),
  state: StateSchema,
  winFactor: integer(),
  v: integer(),
  maxWinFactorReached: boolean(),
  bonusWon: boolean(),
});

export const GameStateSchema = type({
  v: integer(),
});

export const PaytableSchema = type({
  rank: RankSchema,
  winFactor: integer(),
});

export const GambleSelectionSchema = type({
  type: GamblePickSchema,
  multiplier: number(),
});

export const GambleSchema = type({
  selections: size(array(GambleSelectionSchema), 3),
});

export const GameConfigSchema = type({
  mathver: string(),
  paytable: size(array(PaytableSchema), 9),
  gamble: GambleSchema,
});

export type Win = Infer<typeof WinSchema>;
export type GambleRound = Infer<typeof GambleRoundSchema>;
export type RoundState = Infer<typeof RoundStateSchema>;
export type GameState = Infer<typeof GameStateSchema>;
export type Paytable = Infer<typeof PaytableSchema>;
export type GameConfig = Infer<typeof GameConfigSchema>;
export type PickAction = Infer<typeof PickActionSchema>;
export type GamblePickAction = Infer<typeof GamblePickActionSchema>;

// superstruct definitions for Nemo types

export enum ReplayMethods {
  PLAY = 'play',
  COMPLETE = 'complete',
  ACTION = 'action',
}

export const ReplayMethodSchema: Struct<ReplayMethods> = enums([
  ReplayMethods.PLAY,
  ReplayMethods.COMPLETE,
  ReplayMethods.ACTION,
]);

export const ReplayRoundSchema = type({
  action: optional(string()),
  method: ReplayMethodSchema,
  params: any(),
  gameState: optional(GameStateSchema),
  roundState: optional(RoundStateSchema),
});

export const ReplaySchema = type({
  roundId: string(),
  bet: integer(),
  gameClientConfig: any(),
  events: array(ReplayRoundSchema),
  recoveryState: optional(array(number())),
});

export type ReplayRound = Infer<typeof ReplayRoundSchema>;
export type Replay = Infer<typeof ReplaySchema>;
