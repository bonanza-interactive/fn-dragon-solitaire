import {gfx} from '@apila/engine';
// import {GameConfig} from './config/config';
import {GameLayer} from './config/schemas';
import {CORE, GAME} from './game';
import {HiliteAnimation} from './hilite-animation';
import {Signal} from './util/signal';
import {assert} from './util/utils';
import {hexColor} from './util/utils-game';
import {getNode} from './util/utils-node';
import {GAMEFW, LOCALIZER} from './framework';

export const WINTABLE_COUNT_X = 20;
export const WINTABLE_WIN_X = 240;
export const WINTABLE_Y = 20;
export const WINTABLE_WINTEXT_Y = 48;
export const WINTABLE_DY = 43;
export const WINTABLE_WINTEXT_MAX_WIDTH = 180;
//const BET_GLOW_X = -6;
//const BET_GLOW_Y = 7;

type CombinationData = {
  selected: number;
  payout: {
    count: number;
    win: number;
  }[];
};

export class Paytable {
  public onVisibilityChanged: Signal<boolean>;

  private betLevel = 0;
  private selected = 0;
  private isFreespins = false;
  private hilite = -1;
  private matchCount = -1;

  private winGlowSprite: gfx.Sprite;
  private winGlowHilite: HiliteAnimation;

  private root: gfx.Empty;
  private countTexts: gfx.BitmapText[] = [];
  private winTexts: gfx.BitmapText[] = [];

  private readonly basegameCombinations: CombinationData[];
  private readonly freespinCombinations: CombinationData[];

  private readonly textColorDefault = hexColor(0, 0, 0.75);
  private readonly textColorHilite = hexColor(57, 1, 0.7);
  private tempNumber = 5;

  constructor(
    root: gfx.NodeProperties,
    basegameWincombinations: CombinationData[],
    freespinWincombinations: CombinationData[],
  ) {
    this.root = root;
    this.basegameCombinations = basegameWincombinations;
    this.freespinCombinations = freespinWincombinations;
    this.onVisibilityChanged = new Signal<boolean>();

    const contentRoot = getNode(root, 'paytable_content');

    const maxSelection = Math.max(this.tempNumber, this.tempNumber);

    for (let i = 0; i < maxSelection; ++i) {
      const countText = CORE.gfx.createBitmapText('basic_text');
      countText.position[0] = WINTABLE_COUNT_X;
      countText.position[1] = WINTABLE_Y + (maxSelection - i - 1) * WINTABLE_DY;
      countText.fontSize = 46;
      countText.pivot = [0.5, 0];
      countText.parent = contentRoot;
      countText.visible = false;
      countText.depthGroup = GameLayer.BehindCards + 1;
      this.countTexts.push(countText);

      const winText = CORE.gfx.createBitmapText('basic_text');
      winText.position[0] = WINTABLE_WIN_X;
      winText.position[1] =
        WINTABLE_WINTEXT_Y + (maxSelection - i - 1) * WINTABLE_DY;
      winText.fontSize = 46;
      winText.align = gfx.TextAlignment.RIGHT;
      winText.pivot = [0.5, 0.5];
      winText.parent = contentRoot;
      winText.visible = false;
      winText.depthGroup = GameLayer.BehindCards + 1;
      this.winTexts.push(winText);
    }
    this.setwinTextMaxSize(WINTABLE_WINTEXT_MAX_WIDTH);

    // win glow
    this.winGlowSprite = CORE.gfx.createSprite();
    this.winGlowSprite.image = 'kakkospipo_win_glow';
    this.winGlowSprite.glShader = 'sprite_alpha';
    this.winGlowSprite.glUniform.tint = [1, 1, 1, 1];
    this.winGlowSprite.parent = contentRoot;

    this.winGlowHilite = new HiliteAnimation(this.winGlowSprite);
    this.winGlowHilite.hilite(0.3, 1.0, 0.4, 0.0, true);

    this.winGlowSprite.visible = false;
  }

  public updateContentBetChanged(): void {
    this.updateContent(this.selected, this.isFreespins);
  }

  public updateContent(
    selected: number,
    isFreespins: boolean,
    hilite = -1,
  ): void {
    const bet = GAMEFW.state().bet;
    this.winGlowSprite.visible = false;

    if (isFreespins) {
      selected = this.freespinCombinations[0].selected;
    }

    if (
      this.betLevel === bet &&
      this.selected === selected &&
      this.isFreespins === isFreespins &&
      this.hilite === hilite
    ) {
      return;
    }

    this.betLevel = bet;
    this.selected = selected;
    this.isFreespins = isFreespins;
    this.hilite = hilite;

    for (let i = 0; i < this.countTexts.length; ++i) {
      this.countTexts[i].visible = false;
    }
    for (let i = 0; i < this.winTexts.length; ++i) {
      this.winTexts[i].visible = false;
    }

    const payout = this.getPayout();
    if (payout === undefined) {
      return;
    }

    assert(
      payout.length <= this.winTexts.length,
      'Not enough count text nodes for paytable!',
    );
    assert(
      payout.length <= this.countTexts.length,
      'Not enough win text nodes for paytable!',
    );
    for (let i = 0; i < payout.length; ++i) {
      const textIndex = i + (this.countTexts.length - payout.length);
      const color = hilite === i ? this.textColorHilite : this.textColorDefault;
      const opacity = 1;

      this.countTexts[textIndex].text = `{${color}}${payout[i].count}`;
      this.countTexts[textIndex].opacity = opacity;
      this.countTexts[textIndex].visible = true;

      const winsumText = LOCALIZER.money((this.betLevel * payout[i].win) / 100);

      this.winTexts[textIndex].text = `{${color}}${winsumText}`;
      this.setwinTextMaxSize(WINTABLE_WINTEXT_MAX_WIDTH);
      this.winTexts[textIndex].opacity = opacity;
      this.winTexts[textIndex].visible = true;
    }
  }

  private setwinTextMaxSize(maxWidth: number) {
    let smallestScale = 1;
    for (const winText of this.winTexts) {
      const size = winText.size[0];
      if (size > maxWidth) {
        const downsizedScale = maxWidth / size;
        smallestScale = Math.min(smallestScale, downsizedScale);
      }
    }
    for (const winText of this.winTexts) {
      winText.scale = [smallestScale, smallestScale];
    }
  }

  private getPayout():
    | {
        count: number;
        win: number;
      }[]
    | undefined {
    const allCombinations = this.isFreespins
      ? this.freespinCombinations
      : this.basegameCombinations;
    return allCombinations.find((e) => e.selected === this.selected)?.payout;
  }

  public refreshWintable(selected: number | undefined = undefined): void {
    this.winGlowSprite.visible = false;
    this.matchCount = -1;
    const count = selected === undefined ? GAME.cards.getHandSize() : selected;
    this.updateContent(count, this.isFreespins);
  }

  public hiliteWin(): void {
    const payout = this.getPayout();
    assert(payout !== undefined, 'Paytable payout is undefined!');

    this.matchCount = this.matchCount < 0 ? 1 : this.matchCount + 1;
    const winIndex = payout.findIndex((c) => c.count === this.matchCount);
    this.updateContent(this.selected, this.isFreespins, winIndex);

    if (winIndex === -1) {
      return;
    }

    /*
    const rowCount = this.countTexts.filter((t) => t.visible).length;
    const x = 0;
    const y = BET_GLOW_Y + (rowCount - winIndex - 1) * WINTABLE_DY;
    this.winGlowSprite.position = [x - 50, y];
    this.winGlowSprite.visible = true;
    */
  }

  public show(): void {
    if (!this.root.visible) {
      this.root.visible = true;
      this.onVisibilityChanged.emit(true);
    }
  }

  public hide(): void {
    if (this.root.visible) {
      this.root.visible = false;
      this.onVisibilityChanged.emit(false);
    }
  }

  public isVisible(): boolean {
    return this.root.visible;
  }

  public getSmallestCombinationCount(
    selected: number,
    isFreespins: boolean,
  ): number {
    const combinations = isFreespins
      ? this.freespinCombinations
      : this.basegameCombinations;
    const payout = combinations.find((e) => e.selected === selected)?.payout;
    return payout ? payout[0].count : 0;
  }

  public getPayoutWin(
    selected: number,
    matches: number,
    isFreespins: boolean,
  ): number {
    const combinations = isFreespins
      ? this.freespinCombinations
      : this.basegameCombinations;
    const payout = combinations.find((e) => e.selected === selected)?.payout;
    const win = payout
      ? payout.find((e) => e.count === matches)?.win
      : undefined;
    return win ?? 0;
  }
}
