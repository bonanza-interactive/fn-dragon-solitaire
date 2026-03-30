import {gfx} from '@apila/engine';
import {CanvasResizePolicy} from '@apila/engine/dist/apila-gfx';
import {fx} from '@apila/game-libraries';

import * as btypes from './backend-types';

const aspectRatioMin = 1 / 3;
const aspectRatioDefault = 16 / 9;
const aspectRatioMax = 3 / 1;
const worldLandscapeMinHeight = 1200;
const worldPortraitMinWidth = 1300;

export class GameConfig {
  public static gameConfig: btypes.GameConfig;
  public static GAME_PATH = '';
  public static GAME_NAME = 'villitkakkoset';
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
  enableHotReload: process.env.NODE_ENV === 'development',
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

export type MiscConfig = {
  readonly recovery: Recovery;
  readonly userStartFreespins: boolean;
  readonly startWithSpacebar: boolean;
  readonly preloadConfirmation: boolean;
  readonly quickPlaySpeed: number;
};

export const miscConfig: MiscConfig = {
  recovery: Recovery.Full,
  userStartFreespins: false,
  startWithSpacebar: true,
  preloadConfirmation: true,
  quickPlaySpeed: 3,
};

export const debugConfig = {
  autoPlay: false,
  pause: false,
  stepFrames: -1,
  speed: 1.0,
  simulateSlowDevice: 0,
  elapsedTimeOffset: 0.0,
  trace: false,
  collectSoundOnReveal: false,
  showSafeZone: false,
};

export enum CardName {
  Discard = 'discard',
  Waste = 'waste',
  Deck = 'deck',
  StackLeft = 'stack_left',
  StackLeftDiscard = 'stack_left_discard',
  StackRight = 'stack_right',
  Stack = 'stack',
  StackRightDiscard = 'stack_right_discard',
  Hand = 'hand',
  FourOfAKindReserve = '4OAK_reserve',
  FourOfAKindHand = '4OAK_hand',
  FourOfAKindDiscard = '4OAK_discard',
  GambleHand = 'gamble_hand',
  GambleDiscard = 'gamble_discard',
}

export const CARD_LOCATION_PREFIX = 'card_location';
export type CardLocation = {name: CardName; index?: number};

export type CardMovement = {
  start: CardLocation;
  target: CardLocation;
};
