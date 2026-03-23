import {Const, gfx} from '@apila/engine';
import {anim} from '@apila/game-libraries';

import {layoutConfig} from '../config/config';
import {CORE, GAME} from '../game';
import {AUTO_TICK} from '../main';
import {IS_MOBILE_DEVICE} from '../framework';

export type ReelGameKitLayout = Const<gfx.Layout> & {
  readonly worldScale: number;
  readonly worldScaleVector: ArrayLike<number>;
  readonly worldTopLeft: ArrayLike<number>;
  readonly worldVisibleSize: ArrayLike<number>;
  readonly isMobileDevice: boolean;
};

export function getWorldPosition(
  anchor: gfx.VectorT,
  layout: ReelGameKitLayout
): gfx.VectorT {
  return [
    layout.worldTopLeft[0] + anchor[0] * layout.worldVisibleSize[0],
    layout.worldTopLeft[1] + anchor[1] * layout.worldVisibleSize[1],
  ];
}

export function getWorldSize(layout: Const<gfx.Layout>) {
  let aspectRatio = 0;
  let worldWidth = 0;
  let worldHeight = 0;

  const screenWidth = layout.canvasPixelSize[0];
  const screenHeight = layout.canvasPixelSize[1];

  if (layout.orientation === gfx.Orientation.Portrait) {
    aspectRatio = screenHeight / screenWidth;
    worldWidth = layout.reference.portraitWidthInWorldUnits;
    worldHeight = aspectRatio * worldWidth;
  } else {
    aspectRatio = screenWidth / screenHeight;
    worldHeight = layout.reference.landscapeHeightInWorldUnits;
    worldWidth = aspectRatio * worldHeight;
  }

  return [worldWidth, worldHeight];
}

export const getReelGameKitLayout = (
  layout: Const<gfx.Layout>
): ReelGameKitLayout => {
  const worldScale = getWorldScale(layout);

  const worldSize = getWorldSize(layout);

  const worldTopLeft: ArrayLike<number> = [
    -worldSize[0] / 2,
    -worldSize[1] / 2,
  ];
  const worldBottomRight: ArrayLike<number> = [
    worldSize[0] / 2,
    worldSize[1] / 2,
  ];
  const worldVisibleSize = [
    worldBottomRight[0] - worldTopLeft[0],
    worldBottomRight[1] - worldTopLeft[1],
  ];

  const isMobileDevice = IS_MOBILE_DEVICE;

  return {
    ...layout,
    worldScale,
    worldScaleVector: [worldScale, worldScale],
    worldTopLeft,
    worldVisibleSize,
    isMobileDevice,
  };
};

export function minMaxNormalize(
  value: number,
  min: number,
  max: number
): number {
  return (value - min) / (max - min);
}

/**
 *
 * @param layout
 * @returns 0 for no scale reduction (default to maximum aspect ratio),
 * 1 for maximum scale reduction (minimum aspect ratio)
 */
export function getWorldScaleReductionFactor(
  layout: Const<gfx.Layout>
): number {
  const defaultAspectRatio = layoutConfig.aspectRatioDefault;
  const minAspectRatio = layoutConfig.aspectRatioMin;

  const aspectRatio =
    layout.orientation === gfx.Orientation.Portrait
      ? layout.canvasPixelSize[1] / layout.canvasPixelSize[0]
      : layout.canvasPixelSize[0] / layout.canvasPixelSize[1];

  const scaleFactor = gfx.clamp(
    1 - minMaxNormalize(aspectRatio, minAspectRatio, defaultAspectRatio),
    0,
    1
  );
  return scaleFactor;
}

export function getWorldScale(layout: Const<gfx.Layout>): number {
  const maximumSize =
    layout.orientation === gfx.Orientation.Portrait
      ? layoutConfig.portrait.worldMaxWidth
      : layoutConfig.landscape.worldMaxHeight;
  const minimumSize =
    layout.orientation === gfx.Orientation.Portrait
      ? layoutConfig.portrait.worldMinWidth
      : layoutConfig.landscape.worldMinHeight;

  const scaleFactor = getWorldScaleReductionFactor(layout);
  const maxScaleReduction = (maximumSize - minimumSize) / maximumSize;
  const scaleReduction = scaleFactor * maxScaleReduction;
  const worldScale = 1 - scaleReduction;

  return worldScale;
}

export class InterpolatedPosition {
  public node: gfx.Empty;
  private start: {position: gfx.VectorT};
  private end: {position: gfx.VectorT};
  public value = 0;

  constructor(
    node: gfx.Empty,
    deck: {position: gfx.VectorT},
    card: {position: gfx.VectorT}
  ) {
    this.node = node;
    this.start = deck;
    this.end = card;
  }

  public update(): void {
    this.node.position = this.interpolate();
  }

  private interpolate(): gfx.VectorT {
    const x =
      this.start.position[0] -
      this.value * (this.start.position[0] - this.end.position[0]);
    const y =
      this.start.position[1] -
      this.value * (this.start.position[1] - this.end.position[1]);
    return [x, y];
  }
}

export function dimNode(
  node: gfx.Sprite,
  time: number,
  from: number,
  to: number
): void {
  node.visible = true;
  const tl = new anim.Timeline();
  tl.animate(anim.Linear(from, to), time, anim.Property(node, 'opacity')).after(
    () => {
      AUTO_TICK.remove(tl);
      if (to < 0.0001) {
        node.visible = false;
      }
    }
  );
  AUTO_TICK.add(tl);
}

export function createGaussinBlurTexture(
  stage: gfx.Stage,
  texSize: [number, number],
  texIdStr: string,
  g: gfx.Gfx
) {
  const worldSize = getWorldSize(g.layout);

  const texId = texIdStr;
  const texId2 = texIdStr + '_2';
  const texImgId = texIdStr + '_img';

  if (!g.resourceExists(gfx.ResourceType.RenderTarget, texId)) {
    g.createRenderTarget(
      texId2,
      texSize[0],
      texSize[1],
      [
        -worldSize[0] * 0.5,
        -worldSize[1] * 0.5,
        worldSize[0] * 0.5,
        worldSize[1] * 0.5,
      ],
      false,
      true,
      [0, 0, 0, 0],
      {}
    );

    g.createRenderTarget(
      texId,
      texSize[0],
      texSize[1],
      [
        -worldSize[0] * 0.5,
        -worldSize[1] * 0.5,
        worldSize[0] * 0.5,
        worldSize[1] * 0.5,
      ],
      false,
      false,
      [0, 0, 0, 0],
      {}
    );

    g.createImage(
      texImgId,
      texId2,
      [worldSize[0], worldSize[1]],
      [0, 0, 1.0, 1.0]
    );
  } else {
    g.modifyRenderTarget(texId2, texSize[0], texSize[1], [
      -worldSize[0] * 0.5,
      -worldSize[1] * 0.5,
      worldSize[0] * 0.5,
      worldSize[1] * 0.5,
    ]);

    g.modifyRenderTarget(texId, texSize[0], texSize[1], [
      -worldSize[0] * 0.5,
      -worldSize[1] * 0.5,
      worldSize[0] * 0.5,
      worldSize[1] * 0.5,
    ]);
  }

  g.renderOffscreen(stage, texId2);

  const blurStage = g.createStage();
  const blurSprite = g.createSprite();

  blurSprite.parent = blurStage.root;
  blurSprite.pivot = [0.5, 0.5];
  blurSprite.image = texImgId;
  blurSprite.glShader = 'gaussian_blur';
  blurSprite.glUniform.bgTexSize = texSize;

  g.renderOffscreen(blurStage, texId);

  g.destroyStage(blurStage);
}

export function showSuperRoundText(): void {
  const from = CORE.gfx.normalizedCanvasToWorld(0.5, 1);
  const to = CORE.gfx.normalizedCanvasToWorld(0.5, 0.5);

  GAME.superRoundText.move(from[0], from[1], to[0], to[1], 0.5);
  GAME.superRoundText.pulse(1.0, 1.2, 0.2, 0.5);
  GAME.superRoundText.hilite(1.0, 0.0, 1.0, 2.8);
}
