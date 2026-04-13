import {
  Infer,
  Struct,
  any,
  array,
  boolean,
  enums,
  number,
  optional,
  size,
  string,
  type,
} from 'superstruct';

// superstruct definitions for backend types
export enum Actions {
  DEAL = 'deal',
  PICK = 'pick',
}

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

export const CardSchema = type({
  rank: CardRankSchema,
  suit: CardSuitSchema,
  isJoker: boolean(),
});

const RoundSchema = type({
  roundType: string(),
  winFactor: number(),
});

export enum Location {
  STOCK = 'STOCK',
  WASTE_PILE = 'WASTE_PILE',
  STACK_1 = 'STACK_1',
  STACK_2 = 'STACK_2',
  STACK_3 = 'STACK_3',
  STACK_4 = 'STACK_4',
  STACK_5 = 'STACK_5',
  STACK_6 = 'STACK_6',
  STACK_7 = 'STACK_7',
  FOUNDATION = 'FOUNDATION',
}

export const LocationSchema: Struct<Location> = enums([
  Location.STOCK,
  Location.WASTE_PILE,
  Location.STACK_1,
  Location.STACK_2,
  Location.STACK_3,
  Location.STACK_4,
  Location.STACK_5,
  Location.STACK_6,
  Location.STACK_7,
  Location.FOUNDATION,
]);

export const MoveSchema = type({
  from: LocationSchema,
  to: LocationSchema,
  count: number(),
});

export const BonusResultSchema = type({
  suit: CardSuitSchema,
  count: number(),
  winFactor: number(),
});

export const FeatureStatusSchema = type({
  bonusResult: optional(BonusResultSchema),
  bonusWinningCards: optional(array(CardSchema)),
  multiplier: optional(number()),
});

export const RoundStateSchema = type({
  rounds: array(RoundSchema),
  picks: optional(array(MoveSchema)),
  wastePile: array(CardSchema),
  openCards: size(array(size(array(CardSchema), 0, 13)), 7),
  foundationTops: size(array(CardSchema), 0, 4),
  faceDownCounts: size(array(number()), 7),
  featureStatus: FeatureStatusSchema,
  hash: string(),
  canGamble: boolean(),
  state: string(),
  winFactor: number(),
  v: number(),
  maxWinFactorReached: boolean(),
  winLimitExceeded: boolean(),
  bonusWon: boolean(),
});

export const GameStateSchema = type({
  storedStake: optional(number()),
  // recovery: optional(RecoveryState),
  v: number(),
});

export const GameConfigSchema = type({
  mathver: string(),
  // paytables: PaytablesSchema,
  // paylines: PaylinesSchema,
  // freespinGamble: optional(array(FreespinGambleItem)),
  // gamble: optional(GambleSchema),
  // wilds: optional(array(WildsSchema)),
  balance: optional(number()),
});

export const ReplayRoundSchema = type({
  action: optional(string()),
  method: string(),
  params: any(),
  gameState: optional(GameStateSchema),
  roundState: optional(RoundStateSchema),
});

export const ReplaySchema = type({
  bet: number(),
  events: array(ReplayRoundSchema),
  gameClientConfig: any(),
  recoveryState: optional(array(number())),
  roundId: string(),
  version: any(),
});

export type ReplayRound = Infer<typeof ReplayRoundSchema>;
export type Replay = Infer<typeof ReplaySchema>;
export type RoundState = Infer<typeof RoundStateSchema>;
export type GameState = Infer<typeof GameStateSchema>;
export type GameConfig = Infer<typeof GameConfigSchema>;
export type Round = Infer<typeof RoundSchema>;
