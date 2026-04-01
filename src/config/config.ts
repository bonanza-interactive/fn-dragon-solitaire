import {gfx} from '@apila/engine';
import {CanvasResizePolicy} from '@apila/engine/dist/apila-gfx';
import {fx} from '@apila/game-libraries';

import {GameConfig as BackendGameConfig} from './backend-types';

const aspectRatioMin = 5 / 4; // ("tablet")
const aspectRatioDefault = 16 / 9;
const aspectRatioMax = 2880 / 1080;
const worldLandscapeMinHeight = 1200;
const worldPortraitMinWidth = 1300;

export class GameConfig {
  public static gameConfig: BackendGameConfig;
  public static GAME_PATH = '';
  public static GAME_NAME = 'lohikaarmekeno';
}

export type LayoutConfig = {
  readonly aspectRatioDefault: number;
  readonly aspectRatioMin: number;
  readonly aspectRatioMax: number;
  readonly landscape: {
    readonly worldMinHeight: number;
    readonly worldMaxHeight: number;
  };
  readonly portrait: {
    readonly worldMinWidth: number;
    readonly worldMaxWidth: number;
  };
  readonly margins: [number, number, number, number];
  readonly handScale: [number, number];
  readonly handScaleMobile: [number, number];
  readonly cardScale: [number, number];
  readonly cardScaleMobile: [number, number];
  readonly gambleCardScale: [number, number];
};

export const layoutConfig: LayoutConfig = {
  aspectRatioDefault,
  aspectRatioMin,
  aspectRatioMax,
  landscape: {
    worldMinHeight: worldLandscapeMinHeight,
    worldMaxHeight:
      (aspectRatioDefault / aspectRatioMin) * worldLandscapeMinHeight,
  },
  portrait: {
    worldMinWidth: worldPortraitMinWidth,
    worldMaxWidth:
      (aspectRatioDefault / aspectRatioMin) * worldPortraitMinWidth,
  },
  margins: [100, 0, 100, 0],
  cardScale: [0.8, 0.8],
  cardScaleMobile: [0.74, 0.74],
  handScale: [0.7, 0.7],
  handScaleMobile: [0.85, 0.85],
  gambleCardScale: [0.9, 0.9],
};

export const gfxConfig: Omit<gfx.GfxConfig, 'canvas' | 'context'> = {
  reference: {
    landscapeHeightInWorldUnits: layoutConfig.landscape.worldMinHeight,
    portraitWidthInWorldUnits: layoutConfig.portrait.worldMinWidth,
    aspectRatioRange: [
      layoutConfig.aspectRatioMin,
      layoutConfig.aspectRatioMax,
    ],
  },
  screenClearColor: [0, 0, 0, 0], //[0.36, 0.9, 0.3, 1.0],
  clearEveryFrame: true,
  resolutionScale: window.devicePixelRatio,
  canvasResizePolicy: CanvasResizePolicy.FILL_PARENT,
  canvasBufferResizeIntervalMs: 0,
};

export const fxConfig: fx.FxPlayerParams = {
  strictInit: true, // Strict error handling in initialization
  strictRun: true, // Strict error handling in runtime
  strictHandler: false, // Strict error handling for FxHandler errors
  strictMissing: true, // Strict error handling for missing events
  callDepthLimit: 5, // Maximum allowed event call depth
  delayCompensation: 0,
};

export enum Recovery {
  None,
  /** Recovery point between every subgame round. */
  Full,
}

export type RecoveryConfig = {
  readonly recovery: Recovery;
  readonly maxRecoveryCount: number;
};

export const recoveryConfig: Readonly<RecoveryConfig> = {
  recovery: Recovery.Full,
  maxRecoveryCount: 10,
};

export type MiscConfig = {
  readonly recovery: RecoveryConfig;
  readonly skipLoadingScreen: boolean;
  readonly userStartFreespins: boolean;
  readonly startWithSpacebar: boolean;
  readonly preloadConfirmation: boolean;
  spinSpeed: number;
};

export const miscConfig: MiscConfig = {
  recovery: recoveryConfig,
  skipLoadingScreen: false,
  userStartFreespins: false,
  startWithSpacebar: true,
  preloadConfirmation: true,
  spinSpeed: 1,
};

export const debugConfig = {
  autoPlay: false,
  speed: 1.0,
  simulateSlowDevice: 0,
  elapsedTimeOffset: 0.0,
  trace: false,
  collectSoundOnReveal: false,
  expose: true,
};

export enum CardName {
  Discard = 'discard',
  Deck = 'deck',
  StackSpades = 'stack_spades',
  StackClubs = 'stack_clubs',
  StackDiamonds = 'stack_diamonds',
  StackHearts = 'stack_hearts',
  Hand = 'hand',
  Table = 'table',
  TableDeck = 'table_deck',
  Gamble = 'gamble',
}

export const CARD_LOCATION_PREFIX = 'card_location';
export type CardLocation = {name: CardName; index?: number};

export type CardMovement = {
  start: CardLocation;
  target: CardLocation;
};

export const rankAnimationNames = [
  'ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'jack',
  'queen',
  'king',
];

export const suitSkinNames = ['spade', 'club', 'diamond', 'heart'];

export const CARD_BACK = 52; // ID of the card backside
export const CARD_DRAGON = 53; // ID of the dragon card
