import {core, gfx} from '@apila/engine';
import {Color, Physics, Slot} from '@apila/spine';
import {isMobileAndroidFirefox, isMobileiOSFirefox, wait} from '../util/utils';

import {Background} from '../background';
import {registerButton} from '../button-state-handler';
import {CardChangeButtons} from '../card-change-buttons';
import {CardPickGui} from '../card-pick-gui';
import {Cards} from '../cards';
import {
  CARD_BACK,
  // GameConfig,
  miscConfig,
  rankAnimationNames,
  suitSkinNames,
} from '../config/config';
import {BASE_GAME, LOADING_SCREEN} from '../config/schemas';
import {DragonPanel} from '../dragon-panel';
import {FrameText} from '../frame-text';
import {GAMEFW, IS_MOBILE_DEVICE, LOCALIZER} from '../framework';
import {FreespinPopup} from '../freespin-popup';
import {FreespinTransition} from '../freespin-transition';
import {CORE, GAME} from '../game';
import {Loader} from '../loader';
import {AUTO_TICK, CLIENT_STATE} from '../main';
import {onLayoutChanged} from '../node-storage';
import {ParticlePlayer} from '../particle-player';
import {Paytable} from '../Paytable';
import {PaytableButton} from '../paytable-button';
import {AutocompleteButton} from '../autocomplete-button';
import {AnyState, State} from '../state-machine';
import {TopElementsMover} from '../top-elements-mover';
import {MetaType, isMeta} from '../types';
import {BackendUtil} from '../util/backend-util';
import {showPopup} from '../util/popup';
import {ReelGameKitLayout, getReelGameKitLayout} from '../util/utils-gfx';
import {
  DFSChildIterator,
  getBitmapText,
  getNode,
  getSpine,
  getSprite,
  isSprite,
} from '../util/utils-node';
import {AtlasOpts, webfontToBitmapFont} from '../webfont/atlas';
import {FONT, FONT_STYLE} from '../webfont/config';
import {WebfontSprite} from '../webfont/sprite';
import {WinScroll} from '../win-scroll';
import {CarouselIntro} from './CarouselIntro';
import {PreloadDone} from './PreloadDone';

export class Preload extends State {
  private loader = new Loader();

  public async run(): Promise<AnyState> {
    GAMEFW.loadStart();
    const restoreState = BackendUtil.restoreGameState();
    if (restoreState) {
      CLIENT_STATE.restore(
        restoreState.roundState,
        restoreState.bet,
        restoreState.recoveryStep,
      );
    }

    CLIENT_STATE.replay = BackendUtil.replayData;
    CLIENT_STATE.bet = BackendUtil.replayData?.bet ?? CLIENT_STATE.bet;

    const formats = (await core.supportedFormats()).filter(
      (f) =>
        !((isMobileAndroidFirefox() || isMobileiOSFirefox()) && f === 'ogg'),
    );

    const bundle = await core
      .loadData<core.Bundle>(GAMEFW.settings().assetsUrl + this.bundleName())
      .then(async (r) =>
        core.resolveURLs(
          r,
          GAMEFW.settings().assetsUrl,
          core.preferFormats(formats),
        ),
      )
      .catch((e) => {
        if (process.env.NODE_ENV === 'development') {
          showPopup(('Could not load bundle: ' + e) as string);
        }
        throw e;
      });

    // Load assets
    const loadingStartTime = performance.now();
    await this.loadInitialAssets(bundle);
    await this.loadGameAssets(bundle);

    GAME.canvasTextBuilder = new gfx.CanvasTextBuilder();
    this.handleFontOverride();
    this.generateWebfontAtlases();

    this.loadDelayedAssets(bundle);

    // Loading done, continue with game component initialization.
    this.loadGameSchema();
    this.loadUISchema();

    this.initGameComponents();
    this.addAutoTickComponents();
    this.initUiComponents();

    const layout = getReelGameKitLayout(CORE.gfx.layout);
    onLayoutChanged(GAME.nodeStorage, layout);
    CORE.gfx.addLayoutChanged((layout) => {
      onLayoutChanged(GAME.nodeStorage, getReelGameKitLayout(layout));
    });

    const showIntro = !BackendUtil.replayData && !restoreState;
    const waitUserInput = miscConfig.preloadConfirmation && !showIntro;

    // Loading should take at least 2 seconds, so wait the remaining time
    const timeTaken = performance.now() - loadingStartTime;
    if (timeTaken < 2000) {
      await wait(2000 - timeTaken);
    }

    await GAMEFW.loadComplete(waitUserInput);

    GAME.entered = true;

    const roundData = restoreState
      ? {
          roundState: restoreState.roundState,
          bet: restoreState.bet,
        }
      : undefined;

    return showIntro
      ? new CarouselIntro(roundData)
      : new PreloadDone(roundData);
  }

  private loadLoadingScreenSchema() {
    GAME.nodeStorage.loading = GAME.nodeSchemaLoader.load(
      CORE.gfx,
      LOADING_SCREEN,
    );
    GAME.nodeStorage.loading.nodes.root.parent = GAME.nodeStorage.stage.root;
  }

  private loadGameSchema() {
    const scaledRootNode = CORE.gfx.createEmpty();

    GAME.nodeStorage.baseGame = GAME.nodeSchemaLoader.load(CORE.gfx, BASE_GAME);

    GAME.nodeStorage.baseGame.nodes.root.parent = scaledRootNode;

    const updateGameScale = (layout: ReelGameKitLayout) => {
      scaledRootNode.scale = [layout.worldScale, layout.worldScale];
    };

    updateGameScale(getReelGameKitLayout(CORE.gfx.layout));
    CORE.gfx.addLayoutChanged((layout) => {
      updateGameScale(getReelGameKitLayout(layout));
    });
    scaledRootNode.parent = GAME.nodeStorage.stage.root;
  }

  private loadUISchema() {
    //GAME.nodeStorage.uiGamble = GAME.nodeSchemaLoader.load(CORE.gfx, UI_GAMBLE);
    //GAME.nodeStorage.uiGamble.nodes.root.parent = gambleExtraNode;
  }

  private handleFontOverride(): void {
    const fontOverride = LOCALIZER.get('_font_override');
    if (fontOverride !== '_font_override') {
      for (const key in FONT) {
        FONT[key as keyof typeof FONT].family = fontOverride;
      }
    }
  }

  private generateWebfontAtlases() {
    const moneyChars = Array.from(
      'listMoneyChars' in LOCALIZER
        ? LOCALIZER.listMoneyChars()
        : `0123456789€,.!?:'`,
    );

    const atlasOpts: Partial<AtlasOpts> = {
      padOuter: 2,
      padInner: [6, 4],
    };

    // Scroller money font
    webfontToBitmapFont(
      CORE.gfx,
      GAME.canvasTextBuilder,
      'windisplay_bigwin_sum',
      FONT.windisplayMoney,
      moneyChars,
      FONT_STYLE.windisplayMoney,
      {...atlasOpts, padInner: [6, 14]},
    );

    // Basic font for winsums and some texts
    webfontToBitmapFont(
      CORE.gfx,
      GAME.canvasTextBuilder,
      'basic_text',
      FONT.basic,
      Array.from(LOCALIZER.listChars()),
      FONT_STYLE.basic,
      {...atlasOpts},
    );

    // Basic font for winsums and some texts
    webfontToBitmapFont(
      CORE.gfx,
      GAME.canvasTextBuilder,
      'basic_text_big',
      FONT.basicBig,
      Array.from(LOCALIZER.listChars()),
      FONT_STYLE.basic,
      {...atlasOpts},
    );
  }

  private renderCardImageAtlas(): void {
    type AtlasImage = {
      id: string;
      size: [number, number];
      uvRect: [number, number, number, number];
    };

    const atlasStage = CORE.gfx.createStage();
    const atlasSize: [number, number] = [2048, 4096];
    const padding: [number, number] = [2, 2];
    let atlasX = 0;
    let atlasY = 0;
    let rowHeight = 0;

    const suitCount = 4;
    const rankCount = 13;
    const skeleton = IS_MOBILE_DEVICE ? 'loke_cards_mobile' : 'loke_cards';

    const images: AtlasImage[] = [];
    for (let i = 0; i < rankCount * suitCount + 1; ++i) {
      let skin = '';
      let animation = '';

      if (i === CARD_BACK) {
        animation = 'back';
      } else {
        const suit = Math.floor(i / rankCount);
        const rank = i % rankCount;
        skin = suitSkinNames[suit];
        animation = rankAnimationNames[rank];
      }

      const spine = CORE.gfx.createSpine(skeleton, {
        parent: atlasStage.root,
        skin,
      });

      spine.state.setAnimation(0, animation);
      spine.update(0, Physics.none);

      const skeletonOffset: [number, number] = [
        spine.skeleton.data.x,
        spine.skeleton.data.y,
      ];
      const skeletonSize: [number, number] = [
        spine.skeleton.data.width,
        spine.skeleton.data.height,
      ];
      const cellSize: [number, number] = [
        skeletonSize[0] + 2 * padding[0],
        skeletonSize[1] + 2 * padding[1],
      ];

      const dropShadow: Slot = spine.skeleton.findSlot('drop_shadow');
      if (dropShadow !== null) {
        dropShadow.color = new Color(1, 1, 1, 0);
      }

      if (atlasX + cellSize[0] > atlasSize[0]) {
        if (atlasY + cellSize[1] > atlasSize[1]) {
          // NOTE: If thrown, increase atlasSize
          throw new Error('Symbol atlas too small');
        }
        atlasX = 0;
        atlasY += rowHeight;
        rowHeight = 0;
      }

      // Position so that top-left is at (atlasX, atlasY)
      spine.position = [
        atlasX + padding[0] - skeletonOffset[0] + 10,
        atlasY + padding[1] - skeletonOffset[1] - 18,
      ];

      const uvRect: AtlasImage['uvRect'] = [
        (atlasX + padding[0]) / atlasSize[0],
        (atlasY + padding[1]) / atlasSize[1],
        (atlasX + padding[0] + skeletonSize[0]) / atlasSize[0],
        (atlasY + padding[1] + skeletonSize[1]) / atlasSize[1],
      ];
      images.push({
        id: `card_atlas_image_${i}`,
        size: skeletonSize,
        uvRect,
      });

      atlasX += cellSize[0];
      rowHeight = Math.max(rowHeight, cellSize[1]);
    }

    // add sprites
    atlasX = 0;
    atlasY += rowHeight;
    const atlasSpites = ['drop_shadow'];
    for (const spriteName of atlasSpites) {
      const sprite = CORE.gfx.createSprite({
        image: spriteName,
        parent: atlasStage.root,
      });

      const spriteSize: [number, number] = [sprite.size[0], sprite.size[1]];
      const cellSize: [number, number] = [
        spriteSize[0] + 2 * padding[0],
        spriteSize[1] + 2 * padding[1],
      ];

      if (atlasX + cellSize[0] > atlasSize[0]) {
        if (atlasY + cellSize[1] > atlasSize[1]) {
          // NOTE: If thrown, increase atlasSize
          throw new Error('Symbol atlas too small');
        }
        atlasX = 0;
        atlasY += rowHeight;
        rowHeight = 0;
      }

      // Position so that top-left is at (atlasX, atlasY)
      sprite.position = [atlasX + padding[0], atlasY + padding[1]];

      const uvRect: AtlasImage['uvRect'] = [
        (atlasX + padding[0]) / atlasSize[0],
        (atlasY + padding[1]) / atlasSize[1],
        (atlasX + padding[0] + spriteSize[0]) / atlasSize[0],
        (atlasY + padding[1] + spriteSize[1]) / atlasSize[1],
      ];
      images.push({
        id: 'card_atlas_' + spriteName,
        size: spriteSize,
        uvRect,
      });

      atlasX += cellSize[0];
      rowHeight = Math.max(rowHeight, cellSize[1]);
    }

    // Generate atlas texture and images
    const atlasId = 'card_atlas';
    CORE.gfx.createRenderTarget(
      atlasId,
      atlasSize[0],
      atlasSize[1],
      [0, 0, ...atlasSize],
      true,
      false,
      [0, 0, 0, 0],
      {
        magFilter: gfx.Filter.LINEAR,
        minFilter: gfx.Filter.LINEAR,
        wrapS: gfx.WrapMode.CLAMP,
        wrapT: gfx.WrapMode.CLAMP,
      },
    );
    CORE.gfx.renderOffscreen(atlasStage, atlasId, {
      viewPort: [0, 0, ...atlasSize],
    });
    for (const image of images) {
      CORE.gfx.createImage(image.id, atlasId, image.size, image.uvRect);
    }

    // Cleanup
    CORE.gfx.destroyStage(atlasStage);
  }

  private initGameComponents() {
    const baseGameRoot = GAME.nodeStorage.baseGame.nodes.root;

    GAME.baseGameFrameText = new FrameText(
      getBitmapText(baseGameRoot, 'frame_text'),
    );

    GAME.cards = new Cards(getNode(baseGameRoot, 'card_root'));

    const bgSpine = getSpine(baseGameRoot, 'background');
    GAME.background = new Background(bgSpine);

    const dragonSpine = getSpine(baseGameRoot, 'dragon_panel');
    GAME.dragonPanel = new DragonPanel(dragonSpine);

    const fsPopupRoot = getNode(baseGameRoot, 'freespin_popup_root');
    GAME.freespinPopup = new FreespinPopup(fsPopupRoot);

    const fsTransitionRoot = getNode(baseGameRoot, 'freespin_transition_root');
    GAME.freespinTransition = new FreespinTransition(fsTransitionRoot);

    GAME.cardPickGui = new CardPickGui(baseGameRoot);
    GAME.cardChangeButtons = new CardChangeButtons(baseGameRoot);
    const tempPaytable = [
      {
        selected: 2,
        payout: [
          {
            count: 1,
            winFactor: 50,
          },
          {
            count: 2,
            winFactor: 650,
          },
        ],
      },
    ];
    const basegameWincombinations = tempPaytable.map((e) => ({
      selected: e.selected,
      payout: e.payout.map((p) => ({
        count: p.count,
        win: p.winFactor,
      })),
    }));

    const freespinWincombinations = tempPaytable.map((e) => ({
      selected: e.selected,
      payout: e.payout.map((p) => ({
        count: p.count,
        win: p.winFactor,
      })),
    }));

    GAME.paytable = new Paytable(
      getNode(baseGameRoot, 'paytable_content'),
      basegameWincombinations,
      freespinWincombinations,
    );

    const wintableButton = getSprite(baseGameRoot, 'wintable_button');
    GAME.paytableButton = new PaytableButton(wintableButton);
    // GAME.autoComplete = new AutoCompleteButton(autoCompleteButton)

    GAME.particlePlayer = new ParticlePlayer();
    GAME.winScroll = new WinScroll(getNode(baseGameRoot, 'scroller-root'));
    GAME.topElementsMover = new TopElementsMover(baseGameRoot);

    const paytableCountHeader = new WebfontSprite(
      GAME.canvasTextBuilder,
      getSprite(baseGameRoot, 'paytable_count_header'),
      FONT.paytableBasic,
      FONT_STYLE.basic,
    );
    paytableCountHeader.text = LOCALIZER.get('paytable_count');
    paytableCountHeader.setMaxSize([190, 250]);

    const paytableWinHeader = new WebfontSprite(
      GAME.canvasTextBuilder,
      getSprite(baseGameRoot, 'paytable_win_header'),
      FONT.paytableBasic,
      FONT_STYLE.basic,
    );
    paytableWinHeader.text = LOCALIZER.get('paytable_win');
    paytableWinHeader.setMaxSize([190, 250]);

    // Align scales to smallest scale
    const countScale = paytableCountHeader.sprite.scale[0];
    const winScale = paytableWinHeader.sprite.scale[0];
    const minScale = Math.min(countScale, winScale);
    paytableWinHeader.sprite.scale = [minScale, minScale];
    paytableCountHeader.sprite.scale = [minScale, minScale];
  }

  private initUiComponents() {
    const uiGambleRoot = GAME.nodeStorage.baseGame;
    for (const node of DFSChildIterator(uiGambleRoot.nodes.root)) {
      const meta = uiGambleRoot.metaCache.get(node.name);
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

    GAME.cardChangeButtons.register('return_to_selection', true);
    GAME.cardChangeButtons.register('swap_selected', true);
    GAME.autocompleteButton = new AutocompleteButton();
  }

  private addAutoTickComponents() {
    AUTO_TICK.add(GAME.cards);
    AUTO_TICK.add(GAME.winScroll);
    AUTO_TICK.add(GAME.freespinPopup);
  }

  private bundleName(): string {
    const platform = IS_MOBILE_DEVICE ? 'mobile' : 'desktop';
    const bundle = LOCALIZER.get('_asset_bundle');
    return `assets.${bundle}.${platform}.json`;
  }

  private loadInitialAssets = async (bundle: core.ResourceDownloadParams[]) => {
    await this.loader.loadGroup('initial', this.bundleName(), bundle, true);
  };

  private loadGameAssets = async (bundle: core.ResourceDownloadParams[]) => {
    const groups = IS_MOBILE_DEVICE ? ['common', 'mobile'] : ['common'];
    const totalDownloadBytes = bundle
      .filter(core.selectGroups(...groups))
      .reduce(core.countResourceBytes, 0);
    let currentDownloadBytes = 0;
    const onPreloadProgress = (size: number): void => {
      currentDownloadBytes += size;
      GAMEFW.loadUpdate(
        Math.min(currentDownloadBytes / (totalDownloadBytes || 1), 1),
      );
    };
    for (const group of groups) {
      await this.loader.loadGroup(
        group,
        this.bundleName(),
        bundle,
        true,
        onPreloadProgress,
      );
    }
  };

  /**
   * Start loading game assets that are to be used later.
   */
  private loadDelayedAssets = async (bundle: core.ResourceDownloadParams[]) => {
    // Download any additional schemas in the background so that they are
    // most likely downloaded when needed. Statemachine & IntermediateLoader
    // handle the loading process if assets are not ready when changing state.
    await this.loader.loadGroup(
      'images-bonus',
      this.bundleName(),
      bundle,
      false,
    );
  };
}
