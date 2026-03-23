export const enum GameLayer {
  Background = 40,
  Paytable = 50,
  Logo = 51,
  Gamble = 60,
  Cards = 80,
  Foreground = 100,

  // symbol uses multiple depthgroups to sort symbols. following value is the
  // maximum value used in depthgroups
  Symbol = 200,

  BigWinEffect = 400,
  CoinAnimation = 410,
  WinscrollText = 420,

  DimLayer = 320,
  GambleGame = 450,
}

export const enum UiLayer {
  UiGamble = 500,
  Ui = 510,
  FreespinPopup = 511,
}
