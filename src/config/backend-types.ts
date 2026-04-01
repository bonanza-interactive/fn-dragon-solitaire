import {
  Infer,
  Struct,
  any,
  array,
  boolean,
  enums,
  integer,
  number,
  optional,
  string,
  type,
} from 'superstruct';

// superstruct definitions for backend types

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

const PlayingCard = type({
  isJoker: boolean(),
  rank: CardRankSchema,
  suit: CardSuitSchema,
});

export enum CombinationType {
  LEFT_TO_RIGHT = 'LEFT_TO_RIGHT',
  WAYS_LEFT_TO_RIGHT = 'WAYS_LEFT_TO_RIGHT',
  SCATTER = 'SCATTER',
}

export const CombinationTypeSchema: Struct<CombinationType> = enums([
  CombinationType.LEFT_TO_RIGHT,
  CombinationType.WAYS_LEFT_TO_RIGHT,
  CombinationType.SCATTER,
]);

export enum RoundType {
  BASEGAME = 'basegame',
  FREESPIN = 'freespin',
}

export const RoundTypeSchema: Struct<RoundType> = enums([
  RoundType.BASEGAME,
  RoundType.FREESPIN,
]);

export enum Asset {
  BONUS = 'bonus',
  FREESPIN = 'freespin',
}

export const AssetSchema: Struct<Asset> = enums([Asset.BONUS, Asset.FREESPIN]);

export enum State {
  MAIN_STATE = 'main',
  RESULT_STATE = 'result',
  GAMBLE_STATE = 'gamble',
  FREESPIN_WON_STATE = 'freespin_won',
}

export const StateSchema: Struct<State> = enums([
  State.MAIN_STATE,
  State.RESULT_STATE,
  State.GAMBLE_STATE,
  State.FREESPIN_WON_STATE,
]);

export enum Action {
  SPIN_ACTION = 'spin',
  FREESPIN_PICK_ACTION = 'freespin_pick',
  GAMBLE_ACTION = 'gamble',
  GAMBLE_PICK_ACTION = 'gamblePick',
}

export const ActionSchema: Struct<Action> = enums([
  Action.SPIN_ACTION,
  Action.FREESPIN_PICK_ACTION,
  Action.GAMBLE_ACTION,
  Action.GAMBLE_PICK_ACTION,
]);

export const GambleActionSchema = type({
  pick: integer(),
});

const Win = type({
  matchingNumbers: array(PlayingCard),
  multiplier: optional(integer()), // freespin, or from basegame dragon card
  freespinsAmount: optional(integer()), // basegame dragon card
  containsDragon: optional(boolean()), // exists in basegame
  winFactor: integer(), // unmultiplied winFactor
});

const RoundSchema = type({
  roundType: RoundTypeSchema,
  win: Win,
  drawnNumbers: array(PlayingCard),
  selectedNumbers: array(PlayingCard),
  multiplier: integer(), // real won multiplier
  freespinsAmount: optional(integer()), // real won freespins count
  winFactor: integer(),
});

const OpenCardGambleResultSchema = type({
  resultCards: array(PlayingCard),
  pick: integer(),
  winFactor: integer(),
  canContinue: boolean(),
});

const GambleRoundSchema = type({
  stake: integer(),
  openCard: PlayingCard,
  result: optional(OpenCardGambleResultSchema),
});

export const RoundStateSchema = type({
  rounds: array(RoundSchema),
  gambleResult: optional(GambleRoundSchema),
  gambleSelectableOptions: optional(array(integer())),
  canGamble: boolean(),
  freespinWon: boolean(),
  state: StateSchema,
  winFactor: integer(),
  v: integer(),
  maxWinFactorReached: boolean(),
});

export const GameStateSchema = type({
  v: integer(),
});

const Payout = type({
  count: integer(),
  winFactor: integer(),
});

const PaytableCombinationSchema = type({
  selected: integer(),
  payout: array(Payout),
});

const PaytablesSchema = type({
  basegame: array(PaytableCombinationSchema),
  freespin: array(PaytableCombinationSchema),
});

const WeightedItem = type({
  item: any(),
  weight: integer(),
});

const BonusResultItem = type({
  suit: string(),
  count: integer(),
  winFactor: integer(),
});

const Features = type({
  bonusDraw: array(WeightedItem),
  bonusResultDraw: array(
    type({
      item: BonusResultItem,
      weight: integer(),
    }),
  ),
  multiplierHitDraw: array(WeightedItem),
  multiplierDraw: array(WeightedItem),
});

const SolitairePayout = type({
  range: array(integer()),
  winFactor: integer(),
});

const DeckWeight = type({
  item: integer(),
  weight: integer(),
});

const Solitaire = type({
  maxMoves: integer(),
  maxIterations: integer(),
  features: Features,
  solitairePayouts: array(SolitairePayout),
  deckIdWeights: array(DeckWeight),
  decks: any(),
});

export const GameConfigSchema = type({
  mathver: string(),
  solitaire: Solitaire,
});

export type Win = Infer<typeof Win>;
export type Round = Infer<typeof RoundSchema>;
export type GambleRound = Infer<typeof GambleRoundSchema>;
export type RoundState = Infer<typeof RoundStateSchema>;
export type GameState = Infer<typeof GameStateSchema>;
export type PaytableCombination = Infer<typeof PaytableCombinationSchema>;
export type Paytables = Infer<typeof PaytablesSchema>;
export type GameConfig = Infer<typeof GameConfigSchema>;
export type GambleAction = Infer<typeof GambleActionSchema>;

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
  roundState: optional(any()),
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
