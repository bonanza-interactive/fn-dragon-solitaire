import {gfx} from '@apila/engine';
import {CanvasFontConfig} from './config';
import {CORE} from '../game';

let UNIQUE_ID = 0;
const DEBUG = false;

/**
 * A wrapper for `gfx.Sprite`s which renders text strings into the images
 * displayed by them.
 *
 * Manages resource creation/cleanup when text contents are altered.
 */
export class WebfontSprite {
  private readonly resourceId: string;
  private _text?: string;
  private align: CanvasTextAlign;
  private lineSpacing: number;
  private _style: gfx.CanvasTextDrawFn[];
  private pad: number;
  private debugMaxSizeVisualizer: gfx.Sprite | undefined;

  private maxSize?: gfx.VectorT;

  /**
   *
   * @param builder builder instance to use for rendering; must be in a
   * finished/uninitialized state
   * @param sprite node to use for text display
   * @param font font resource config
   * @param style list of functions used for rendering text
   * @param opts
   *   **align** alignment to use when rendering multi-line text </br>
   *   **lineSpacing** extra space to include between lines </br>
   *   **pad** extend the calculated image size (which is based on the input
   *   string's bounding box) by this amount in all directions
   */
  constructor(
    private builder: gfx.CanvasTextBuilder,
    public sprite: gfx.Sprite,
    private font: CanvasFontConfig,
    style: gfx.CanvasTextDrawFn[],
    opts?: Partial<{align: CanvasTextAlign; lineSpacing: number; pad: number}>,
  ) {
    this.resourceId = `webfont-canvas-${UNIQUE_ID++}`;
    this.align = opts?.align ?? 'left';
    this.lineSpacing = opts?.lineSpacing ?? 0;
    this.pad = opts?.pad ?? font.pad ?? 0;
    this._style = style;

    CORE.gfx.addLayoutChanged(this.checkTextSize.bind(this));
    if (DEBUG) {
      this.debugMaxSizeVisualizer = CORE.gfx.createSprite({
        image: 'white',
        parent: sprite.parent,
        opacity: 0.5,
        depthGroup: sprite.depthGroup,
        name: sprite.name + '-maxsize-debug-box',
      });
    }
  }

  set visible(visible: boolean) {
    this.sprite.visible = visible;
  }

  get visible(): boolean {
    return this.sprite.visible;
  }

  set opacity(opacity: number) {
    this.sprite.opacity = opacity;
  }

  get opacity(): number {
    return this.sprite.opacity;
  }

  set text(text: string) {
    if (text === this._text) return;

    if (this._text !== undefined) {
      this.sprite.image = '';
      CORE.gfx.destroyImage(this.resourceId);
      CORE.gfx.destroyTexture(this.resourceId);
    }

    this.builder
      .begin(
        {text, font: this.font},
        {
          extraLineSpacing: this.lineSpacing,
          padLTRB: [this.pad, this.pad, this.pad, this.pad],
        },
      )
      .align(this.align)
      .drawLines(text, ...this._style)
      .done(CORE.gfx, this.resourceId, {withImage: true});

    this.sprite.image = this.resourceId;
    this._text = text;

    this.checkTextSize();
  }

  set parent(n: gfx.NodeProperties) {
    this.sprite.parent = n;
  }

  set scale(scale: gfx.VectorT) {
    this.sprite.scale = scale;
    this.checkTextSize();
  }

  get scale(): gfx.VectorT {
    return this.sprite.scale;
  }

  set position(position: gfx.VectorT) {
    this.sprite.position = position;
  }

  get position(): gfx.VectorT {
    return this.sprite.position;
  }

  set style(s: gfx.CanvasTextDrawFn[]) {
    this._style = s;
  }

  public setMaxSize(maxSize: gfx.VectorT): void {
    this.maxSize = maxSize;
    this.checkTextSize();
  }

  private checkTextSize(): void {
    if (this.debugMaxSizeVisualizer && this.maxSize) {
      this.debugMaxSizeVisualizer.size = [this.maxSize[0], this.maxSize[1]];

      this.debugMaxSizeVisualizer.position = [
        this.sprite.position[0],
        this.sprite.position[1],
      ];
      this.debugMaxSizeVisualizer.pivot = [
        this.sprite.pivot[0],
        this.sprite.pivot[1],
      ];
    }
    const scaledSize = [
      this.sprite.size[0] * this.sprite.scale[0],
      this.sprite.size[1] * this.sprite.scale[0],
    ];

    if (
      this.maxSize &&
      (scaledSize[0] > this.maxSize[0] || scaledSize[1] > this.maxSize[1])
    ) {
      const scaleMultiX = this.maxSize[0] / scaledSize[0];
      const scaleMultiY = this.maxSize[1] / scaledSize[1];

      const scaleMulti = Math.min(scaleMultiX, scaleMultiY);
      this.sprite.scale = [
        this.sprite.scale[0] * scaleMulti,
        this.sprite.scale[1] * scaleMulti,
      ];
    }
  }
}

export function convertGfxAlign(a: gfx.TextAlignment): CanvasTextAlign {
  switch (a) {
    case gfx.TextAlignment.LEFT:
      return 'left';
    case gfx.TextAlignment.CENTER:
      return 'center';
    case gfx.TextAlignment.RIGHT:
      return 'right';
    default:
      return 'left';
  }
}
