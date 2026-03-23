import {gfx, input, sound} from '@apila/engine';
import {fx} from '@apila/game-libraries';
import {Background} from './background';
import {Button} from './button';
import {Chips} from './chips';
import {Cards} from './cards';

import {Paytable} from './paytable';
import {SuperText} from './super-text';
import {fxConfig, gfxConfig} from './config/config';
import {FX_DEFS} from './config/fx-defs-game';
import {FrameText} from './frame-text';
import {GameTimer} from './game-timer';
import {NodeSchemaLoader} from './node-schema-loader';
import {NodeStorage} from './node-storage';
import {MessageQueue} from './util/message-queue';
import {WinScroll} from './win-scroll';
import * as particle from '@apila/particle-runtime';
import {GambleButtons} from './gamble-buttons';

type Gfx = gfx.Gfx;
type SoundPlayer = sound.SoundPlayer;
type Input = input.Input;

type Game = {
  nodeSchemaLoader: NodeSchemaLoader;
  nodeStorage: NodeStorage;

  canvasTextBuilder: gfx.CanvasTextBuilder;

  winScroll: WinScroll;

  cards: Cards;
  superRoundText: SuperText;
  chips: Chips;
  superBack: Background;
  paytable: Paytable;
  swapButton: Button;

  gambleButtons: GambleButtons;

  baseGameFrameText: FrameText;
  gambleGameFrameText: FrameText;

  entered: boolean;
};

type Core = {
  gfx: Gfx;
  canvas: HTMLCanvasElement;
  sound: SoundPlayer;
  input: Input;
  fx: fx.FxPlayer;
  gameTimer: GameTimer;
  messageQueue: MessageQueue;
};

// Export object before it has been initialized in order to allow initialization
// happen when something says it's ok to initialize.
export const GAME: Game = {} as Game;
export const CORE: Core = {} as Core;
/**
 * Initializes GAME. Document is searched for canvasId and if it is not found,
 * a new canvas with that id is created. This is then appended to
 * appendTo-element if one was given.
 * @param canvasId Canvas id to use. Default values is ´glCanvas´.
 * @param appendTo Element to append to item to. If none is given,
 * then canvas is not appended.
 */
export const initializeApila = (
  canvas: HTMLCanvasElement,
  context: WebGLRenderingContext
): void => {
  CORE.canvas = canvas;
  CORE.gfx = gfx.create({canvas, context, ...gfxConfig});
  CORE.messageQueue = new MessageQueue();

  CORE.sound = sound.create();
  CORE.input = input.create(CORE.gfx);
  CORE.gameTimer = new GameTimer();
  CORE.fx = new fx.FxPlayer();

  GAME.nodeSchemaLoader = new NodeSchemaLoader();
  GAME.nodeStorage = {stage: CORE.gfx.createStage()} as NodeStorage;

  GAME.entered = false;

  initializeFxPlayer();

  particle.init(CORE.gfx);
};

function initializeFxPlayer(): void {
  fx.fxSetLogLevel(fx.FxLogLevel.ERROR);
  fx.fxDefinitions['game'] = FX_DEFS;
  CORE.fx.configure(fxConfig);
  CORE.fx.registerHandler(new fx.FxSoundHandler('SoundHandler', CORE.sound));
  CORE.fx.registerHandler(new fx.FxMusicHandler('MusicHandler', CORE.sound));
  CORE.fx.addDefinitions(fx.fxDefinitions['game']);
  CORE.fx.initHandlers();
}
