import {gfx} from '@apila/engine';
import {ScaleImage} from './scale-image';
import {CORE} from './game';
import {HiliteAnimation} from './hilite-animation';
import {MoveAnimation} from './move-animation';
import {hexColor} from './util/utils-game';
import {getNode} from './util/utils-node';
import {LOCALIZER} from './framework';
import {computeWinCents} from './util/win-amount';

const WINTABLE_WINSUM_Y = 20;
const WINTABLE_DESCRIPTION_Y = 47;
const WINTABLE_DY = 44.5;
const BET_GLOW_X = -6;
const BET_GLOW_Y = 7;
const BET_COORDS = [280, 496, 712, 928];
const WINTABLE_COMBINATION_NAME_X = 0;
const WINTABLE_COMBINATION_WIN_X = 480;
const WINTABLE_COMBINATION_WIN_DX = 216;
const WINTABLE_SUM_MAX_SIZE = 200;
const WINTABLE_DESCRIPTION_MAX_SIZE = 260;

export class Paytable {
  private winsumElements: gfx.BitmapText[][] = [];
  private winsumMultipliers: number[] = [];

  private betLevels: number[];
  private betLevel = 0;
  private multiplier = 1;
  private multiplierAsked = 1;
  private betColumns: number;
  private betLevelColumn = 0;

  private betColor: string;
  private betColorSprite: gfx.Sprite;

  private betGlow: string;
  private betGlowSprite: gfx.Sprite;
  private betGlowScaler: ScaleImage;
  private betGlowMover: MoveAnimation;
  private betGlowHilite: HiliteAnimation;

  private winGlow: string;
  private winGlowSprite: gfx.Sprite;
  private winGlowHilite: HiliteAnimation;

  constructor(
    root: gfx.NodeProperties,
    betLevels: number[],
    wincombinations: {
      rank: string;
      multiplier: number;
    }[]
  ) {
    const contentRoot = getNode(root, 'paytable_content');
    this.betColor = 'bet_color';
    this.betColorSprite = CORE.gfx.createSprite();
    this.betColorSprite.image = this.betColor;
    this.betColorSprite.parent = contentRoot;

    this.betLevels = betLevels;
    this.betColumns = Math.min(this.betLevels.length, BET_COORDS.length);

    const color = hexColor(0, 0, 0.75);

    const descriptions: {text: gfx.BitmapText; scale: number}[] = [];
    for (let i = 0; i < wincombinations.length; i++) {
      const text = CORE.gfx.createBitmapText('basic_text');
      text.position[0] = WINTABLE_COMBINATION_NAME_X;
      text.position[1] = WINTABLE_DESCRIPTION_Y + i * WINTABLE_DY;
      text.fontSize = 42;
      text.pivot = [0, 0.5];
      text.parent = contentRoot;

      const key = wincombinations[i].rank;
      text.text = `{${color}}${LOCALIZER.get(key)}`;

      // Set maximum size for text
      const size = text.size[0];

      let scale = 1;
      if (size > WINTABLE_DESCRIPTION_MAX_SIZE) {
        scale = WINTABLE_DESCRIPTION_MAX_SIZE / size;
      }
      descriptions.push({text, scale: scale});
    }
    const smallestScale = Math.min(...descriptions.map((e) => e.scale));
    if (smallestScale < 1) {
      for (const {text} of descriptions) {
        text.scale = [smallestScale, smallestScale];
      }
    }
    for (let j = 0; j < this.betColumns; j++) {
      const winsumElementColumn: gfx.BitmapText[] = [];

      for (let i = 0; i < wincombinations.length; i++) {
        const text = CORE.gfx.createBitmapText('basic_text');
        text.position[0] =
          WINTABLE_COMBINATION_WIN_X + j * WINTABLE_COMBINATION_WIN_DX;
        text.position[1] = WINTABLE_WINSUM_Y + i * WINTABLE_DY;
        text.fontSize = 42;
        text.pivot = [1, 0];
        text.parent = contentRoot;

        winsumElementColumn.push(text);
      }

      this.winsumElements.push(winsumElementColumn);
    }

    this.winsumMultipliers = wincombinations.map((e) => e.multiplier);

    // bet column glow
    this.betGlow = 'bet_glow';
    this.betGlowSprite = CORE.gfx.createSprite();
    this.betGlowSprite.image = this.betGlow;
    this.betGlowSprite.parent = contentRoot;

    this.betGlowScaler = new ScaleImage(this.betGlowSprite);
    this.betGlowMover = new MoveAnimation(this.betGlowSprite);
    this.betGlowHilite = new HiliteAnimation(this.betGlowSprite);

    // win glow
    this.winGlow = 'win_glow';
    this.winGlowSprite = CORE.gfx.createSprite();
    this.winGlowSprite.image = this.winGlow;
    this.winGlowSprite.parent = contentRoot;

    this.winGlowHilite = new HiliteAnimation(this.winGlowSprite);
    this.winGlowHilite.hilite(0.3, 1.0, 0.4, 0.0, true);

    this.winGlowSprite.visible = false;
  }

  public setSuperround(multiplier: number): void {
    this.multiplierAsked = multiplier;
  }

  public updateWinsums(bet: number): void {
    if (this.betLevel === bet && this.multiplier === this.multiplierAsked) {
      return;
    }

    this.refreshWintable();

    this.betLevel = bet;
    this.multiplier = this.multiplierAsked;
    const targetBetIndex = this.betLevels.findIndex((e) => e === this.betLevel);

    if (targetBetIndex > this.betLevelColumn + (this.betColumns - 1)) {
      this.betLevelColumn = targetBetIndex - (this.betColumns - 1);
    } else if (targetBetIndex < this.betLevelColumn) {
      this.betLevelColumn = targetBetIndex;
    }

    for (let k = 0; k < this.betColumns; k++) {
      const j = k + this.betLevelColumn;

      let color;
      let opacity = 1;

      for (let i = 0; i < this.winsumElements[k].length; i++) {
        if (bet === this.betLevels[j]) {
          this.betGlowSprite.visible = true;
          this.betGlowSprite.position = [
            BET_COORDS[k] + BET_GLOW_X,
            BET_GLOW_Y,
          ];
          color = hexColor(48, 1 - i / this.winsumElements[k].length, 1);
          this.betColorSprite.opacity = 0.2 + (j / this.betLevels.length) * 0.8;
          this.betColorSprite.position = [
            BET_COORDS[k] + BET_GLOW_X,
            BET_GLOW_Y,
          ];
        } else {
          color = hexColor(0, 0, 0.75);
          opacity = 0.5;
        }

        const winsumText = LOCALIZER.money(
          computeWinCents(
            this.betLevels[j],
            this.winsumMultipliers[i] * this.multiplier
          )
        );

        this.winsumElements[k][i].text = `{${color}}${winsumText}`;
        this.winsumElements[k][i].opacity = opacity;

        // Set maximum size for text
        const size = this.winsumElements[k][i].size[0];

        let scale = 1;
        if (size > WINTABLE_SUM_MAX_SIZE) {
          scale = WINTABLE_SUM_MAX_SIZE / size;
        }
        this.winsumElements[k][i].scale = [scale, scale];
      }
    }
  }

  public refreshWintable(): void {
    this.betGlowSprite.scale = [1, 1];
    this.betGlowSprite.opacity = 1;
    this.betGlowSprite.visible = true;
    this.betGlowSprite.position[1] = BET_GLOW_Y;
    this.winGlowSprite.visible = false;
  }

  public hiliteWins(winIndex: number): void {
    this.winGlowSprite.visible = true;
    const x = this.betGlowSprite.position[0];
    const y = BET_GLOW_Y + winIndex * WINTABLE_DY + (winIndex < 4 ? 0 : 1);
    this.betGlowScaler.scale(1.0, 1.0, 1.0, 0.1, 0.2, 0.0); //, false);
    this.betGlowMover.move(x, BET_GLOW_Y, x, y + 18, 0.2);
    this.betGlowHilite.hilite(1, 0, 0.1, 0.2);
    this.winGlowSprite.position = [x - 30, y];
  }
}
