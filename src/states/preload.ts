import {core, gfx} from '@apila/engine';
import {Background} from '../background';
import {Button} from '../button';
import {Chips} from '../chips';
import {SuperText} from '../super-text';
import {registerButton} from '../button-state-handler';
import {Cards} from '../cards';
import {miscConfig} from '../config/config';
import {BASE_GAME, UI_COMMON_ROOT} from '../config/schemas';
import {FrameText} from '../frame-text';
import {CORE, GAME} from '../game';
import {Loader} from '../loader';
import {AUTO_TICK, CLIENT_STATE} from '../main';
import {onLayoutChanged} from '../node-storage';
import {AnyState, State} from '../state-machine';
import {MetaType, isMeta} from '../types';
import {ReelGameKitLayout, getReelGameKitLayout} from '../util/utils-gfx';
import {
  DFSChildIterator,
  getBitmapText,
  getNode,
  getSprite,
  isSprite,
} from '../util/utils-node';
import {WinScroll} from '../win-scroll';
import {PreloadDone} from './preload-done';
import {showPopup} from '../util/popup';
import {GAMEFW, LOCALIZER} from '../framework';
import {BackendUtil} from '../util/backend-util';
import {isMobileAndroidFirefox, wait} from '../util/utils';
import {CarouselIntro} from './carousel-intro';
import {AtlasOpts, webfontToBitmapFont} from '../webfont/atlas';
import {FONT, FONT_STYLE} from '../webfont/config';
import {Waste} from '../waste';
import {anim} from '@apila/game-libraries';
// import {GambleButtons} from '../gamble-buttons';

export class Preload extends State {
  private loader = new Loader();
  private timeline = new anim.Timeline();

  public async run(): Promise<AnyState> {
    GAMEFW.loadStart();
    const restoreState = BackendUtil.restoreGameState();
    if (restoreState) {
      CLIENT_STATE.restore(
        restoreState.roundState,
        restoreState.bet,
        restoreState.recoveryStep
      );
    }

    CLIENT_STATE.replay = BackendUtil.replayData;
    CLIENT_STATE.bet = BackendUtil.replayData?.bet ?? CLIENT_STATE.bet;

    const formats = (await core.supportedFormats()).filter(
      (f) => !(isMobileAndroidFirefox() && f === 'ogg')
    );

    const baseUrl = GAMEFW.settings().assetsUrl;
    const bundle = await core
      .loadData<core.Bundle>(baseUrl + this.bundleName())
      .then(async (r) =>
        core.resolveURLs(r, baseUrl, core.preferFormats(formats))
      )
      .catch((e) => {
        if (process.env.NODE_ENV === 'development') {
          showPopup(('Could not load bundle: ' + e) as string);
        }
        throw e;
      });

    const layout = getReelGameKitLayout(CORE.gfx.layout);
    onLayoutChanged(GAME.nodeStorage, layout);

    // Start loading assets.
    const loadingStartTime = performance.now();
    await this.loadGameAssets(bundle);

    GAME.canvasTextBuilder = new gfx.CanvasTextBuilder();
    this.generateWebfontAtlases();

    // Loading done, continue with game component initialization.
    this.loadGameSchema();
    this.loadUISchema();

    this.initGameComponents();
    this.addAutoTickComponents();

    CORE.gfx.addLayoutChanged((layout) => {
      if (isMobileAndroidFirefox()) {
        setTimeout(() => {
          onLayoutChanged(GAME.nodeStorage, getReelGameKitLayout(layout));
        }, 10);
      } else {
        onLayoutChanged(GAME.nodeStorage, getReelGameKitLayout(layout));
      }
    });

    // Start loading assets that are not needed immediately.
    this.loadDelayedAssets(bundle);

    this.initUiComponents();

    onLayoutChanged(GAME.nodeStorage, layout);
    // Everything is loaded. Game is ready

    const showIntro = !BackendUtil.replayData && !restoreState;
    const waitUserInput =
      miscConfig.preloadConfirmation &&
      !showIntro &&
      restoreState !== undefined;

    // Loading should take at least 2 seconds, so wait the remaining time
    const timeTaken = performance.now() - loadingStartTime;
    if (timeTaken < 2000) {
      await wait(2000 - timeTaken);
    }

    await GAMEFW.loadComplete(waitUserInput);

    GAME.entered = true;

    const roundData = restoreState
      ? {
          round: restoreState.roundState,
          bet: restoreState.bet,
        }
      : undefined;

    return showIntro
      ? new CarouselIntro(roundData)
      : new PreloadDone(roundData);
  }

  private generateWebfontAtlases() {
    const moneyChars = Array.from(
      'listMoneyChars' in LOCALIZER
        ? LOCALIZER.listMoneyChars()
        : `0123456789€,.!?:'`
    );

    const atlasOpts: Partial<AtlasOpts> = {
      padOuter: 2,
      padInner: [4, 4],
    };

    // Scroller money font
    webfontToBitmapFont(
      CORE.gfx,
      GAME.canvasTextBuilder,
      'windisplay_bigwin_sum',
      FONT.windisplayMoney,
      moneyChars,
      FONT_STYLE.windisplayMoney,
      {...atlasOpts, padInner: [6, 14]}
    );

    // Basic font for winsums and some texts
    webfontToBitmapFont(
      CORE.gfx,
      GAME.canvasTextBuilder,
      'basic_text',
      FONT.basic,
      Array.from(LOCALIZER.listChars()),
      FONT_STYLE.basic,
      {...atlasOpts, padInner: [6, 6]}
    );
  }

  private loadGameSchema() {
    const scaledRootNode = CORE.gfx.createEmpty();
    GAME.nodeStorage.baseGame = GAME.nodeSchemaLoader.load(CORE.gfx, BASE_GAME);
    GAME.nodeStorage.baseGame.nodes.root.parent = scaledRootNode;

    const updateGameScale = (layout: ReelGameKitLayout) => {
      scaledRootNode.scale = [layout.worldScale, layout.worldScale];
    };

    CORE.gfx.addLayoutChanged((layout) => {
      updateGameScale(getReelGameKitLayout(layout));
    });

    updateGameScale(getReelGameKitLayout(CORE.gfx.layout));
    scaledRootNode.parent = GAME.nodeStorage.stage.root;
  }

  private loadUISchema() {
    GAME.nodeStorage.uiCommon = GAME.nodeSchemaLoader.load(
      CORE.gfx,
      UI_COMMON_ROOT
    );
    GAME.nodeStorage.uiCommon.nodes.root.parent = GAME.nodeStorage.stage.root;
  }

  private initGameComponents() {
    const baseGame = GAME.nodeStorage.baseGame;
    const uiCommon = GAME.nodeStorage.uiCommon;

    GAME.baseGameFrameText = new FrameText(
      getBitmapText(baseGame.nodes.root, 'frame_text')
    );

    const superTextSprite = getSprite(baseGame.nodes.root, 'super_round_text');
    GAME.superRoundText = new SuperText(superTextSprite);
    GAME.cards = new Cards(getNode(baseGame.nodes.root, 'card_root'));
    GAME.waste = new Waste(
      getNode(baseGame.nodes.root, 'card_root'),
      this.timeline
    );
    GAME.chips = new Chips(baseGame.nodes.root);

    GAME.superBack = new Background(baseGame.nodes.root);

    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-expect-error
    // const wincombinations = GameConfig.gameConfig.paytable.map((e) => ({
    //   rank: e.rank,
    //   multiplier: e.winFactor,
    // }));

    // GAME.paytable = new Paytable(
    //   getNode(baseGame.nodes.root, 'paytable_root'),
    //   GAMEFW.settings().game.bets,
    //   wincombinations
    // );

    // todo: temp swap button
    GAME.swapButton = new Button('swap_button');
    GAME.swapButton.parent = getNode(
      baseGame.nodes.root,
      'temp_swap_button_root'
    );
    GAME.swapButton.visible = false;

    // GAME.gambleButtons = new GambleButtons(baseGame.nodes.root);

    GAME.winScroll = new WinScroll(
      getNode(uiCommon.nodes.root, 'scroller-root')
    );
  }

  private initUiComponents() {
    const baseGameRoot = GAME.nodeStorage.baseGame;
    for (const node of DFSChildIterator(baseGameRoot.nodes.root)) {
      const meta = baseGameRoot.metaCache.get(node.name);
      if (!isMeta(meta, MetaType.Button)) continue;
      if (!isSprite(node)) continue;

      registerButton({
        node,
        meta,
        state: {
          active: true,
          hover: false,
          pressed: false,
          highlight: false,
        },
      });
    }
  }

  private addAutoTickComponents() {
    AUTO_TICK.add(GAME.cards);
    AUTO_TICK.add(GAME.superBack);
    AUTO_TICK.add(GAME.winScroll);
  }

  private bundleName(): string {
    const platform = GAMEFW.settings().isMobile ? 'mobile' : 'desktop';
    const bundle = LOCALIZER.get('_asset_bundle');
    return `assets.${bundle}.${platform}.json`;
  }

  private loadGameAssets = async (bundle: core.ResourceDownloadParams[]) => {
    const groups = ['common'];
    const totalDownloadBytes = bundle
      .filter(core.selectGroups(...groups))
      .reduce(core.countResourceBytes, 0);
    let currentDownloadBytes = 0;
    const onPreloadProgress = (size: number): void => {
      currentDownloadBytes += size;
      GAMEFW.loadUpdate(
        Math.min(currentDownloadBytes / (totalDownloadBytes || 1), 1)
      );
    };
    for (const group of groups) {
      await this.loader.loadGroup(
        group,
        this.bundleName(),
        bundle,
        true,
        onPreloadProgress
      );
    }
  };

  /**
   * Start loading game assets that are to be used later.
   */
  private loadDelayedAssets = async (
    _bundle: core.ResourceDownloadParams[]
  ) => {};
}
