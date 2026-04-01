import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

export const enum GameLayer {
  Background = 20,
  FsTransitionBackground = 70,
  Ember = 80,
  Gradient = 81,
  Dragon = 82,
  DragonBreathFreespins = 83,
  UiBar = 84,
  BehindCards = 85,
  Logo = 86,
  Gamble = 90,
  Cards = 100,
  Deck = 190,
  Foreground = 200,
  FsTransitionPopup = 201,

  BigWinEffect = 400,
  CoinAnimation = 410,
  WinscrollText = 420,

  DimLayer = 320,
  GambleGame = 450,
}

export const enum UiLayer {
  FreespinTransitionText = 230,
  UiGamble = 500,
  Ui = 510,
  FreespinPopup = 511,
}

export const INITIALLY_HIDDEN = {
  if: {
    initial: {
      visible: false,
    },
  },
};

export const CABINET_UI_BUTTON_TEXT: schema.NodeSchema = {
  type: gfx.DrawableType.BitmapText,
  align: gfx.TextAlignment.CENTER,
  pivot: [0.5, 0.5],
  scale: [0.55, 0.55],
  position: [1, -12],
  opacity: 0.4,
  font: 'west_32_bm',
  depthGroup: UiLayer.Ui,
};
