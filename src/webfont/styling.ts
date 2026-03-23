import {gfx} from '@apila/engine';

/**
 * Store the current Canvas state into stack
 */
export function pushState(ctx: CanvasRenderingContext2D) {
  ctx.save();
}

/**
 * Restore the state of the Canvas from the top of the stack, and pop the
 * stack
 */
export function popState(ctx: CanvasRenderingContext2D) {
  ctx.restore();
}

/**
 * Render text as filled letters
 * @param opts
 *  **fill** use a constant color for letters; if left undefined, the current
 *  Canvas fill state is used instead
 */
export function DrawFilledText(
  opts?: Partial<{fill: string; innerShadow: boolean}>
): gfx.CanvasTextDrawFn {
  return (
    ctx: CanvasRenderingContext2D,
    builder: gfx.CanvasTextBuilder,
    box: gfx.CanvasTextBox
  ) => {
    ctx.save();

    if (opts?.innerShadow) {
      ctx.globalCompositeOperation = 'destination-atop';
      ctx.shadowColor = 'transparent';
    }

    if (opts?.fill) ctx.fillStyle = opts.fill;
    ctx.textBaseline = builder.metrics.baseline;

    const {x, y, line} = box;
    ctx.fillText(line, x, y);

    ctx.restore();
  };
}

/**
 * Render text as outlined letters
 * @param opts
 *  **fill** use a constant color for letters; if left undefined, the current
 *  Canvas fill state is used instead </br>
 *  **width** width of the outline in pixels </br>
 *  **lineJoin** rounding type used in line joints
 */
export function DrawOutlineText(
  opts?: Partial<{
    fill: string;
    width: number;
    lineJoin: CanvasLineJoin;
    drawUnder: boolean;
  }>
): gfx.CanvasTextDrawFn {
  return (
    ctx: CanvasRenderingContext2D,
    builder: gfx.CanvasTextBuilder,
    box: gfx.CanvasTextBox
  ) => {
    ctx.save();

    if (opts?.drawUnder) ctx.globalCompositeOperation = 'destination-over';
    if (opts?.fill) ctx.strokeStyle = opts.fill;
    if (opts?.width != null) ctx.lineWidth = opts.width;
    if (opts?.lineJoin) ctx.lineJoin = opts.lineJoin;
    ctx.textBaseline = builder.metrics.baseline;

    const {x, y, line} = box;
    ctx.strokeText(line, x, y);
    ctx.restore();
  };
}

/**
 * Configure Canvas drop shadow state.
 *
 * After this function has been invoked, subsequent draws will apply a drop
 * shadow effect using the provided configuration.
 * @param opts
 */
export function SetupCanvasShadow(
  opts: Partial<CanvasShadowStyles>
): gfx.CanvasTextDrawFn {
  return (ctx: CanvasRenderingContext2D, builder: gfx.CanvasTextBuilder) => {
    ctx.shadowBlur = opts.shadowBlur
      ? opts.shadowBlur * builder.resolutionScale
      : ctx.shadowBlur;
    ctx.shadowColor = opts.shadowColor ?? ctx.shadowColor;
    ctx.shadowOffsetX = opts.shadowOffsetX
      ? opts.shadowOffsetX * builder.resolutionScale
      : ctx.shadowOffsetX;
    ctx.shadowOffsetY = opts.shadowOffsetY
      ? opts.shadowOffsetY * builder.resolutionScale
      : ctx.shadowOffsetY;
  };
}

/**
 * Configure Canvas inner drop shadow state.
 *
 * After this function has been invoked, subsequent draws will apply an inner drop
 * shadow effect using the provided configuration.
 * @param opts
 */
export function SetupCanvasInnerShadow(
  opts?: Partial<CanvasShadowStyles>
): gfx.CanvasTextDrawFn {
  return (
    ctx: CanvasRenderingContext2D,
    builder: gfx.CanvasTextBuilder,
    box: gfx.CanvasTextBox
  ) => {
    ctx.textBaseline = builder.metrics.baseline;

    const {x, y, line} = box;

    ctx.globalCompositeOperation = 'xor';

    ctx.shadowBlur = opts?.shadowBlur
      ? opts.shadowBlur * builder.resolutionScale
      : ctx.shadowBlur;
    ctx.shadowColor = opts?.shadowColor ?? ctx.shadowColor;
    ctx.shadowOffsetX = opts?.shadowOffsetX
      ? opts.shadowOffsetX * builder.resolutionScale
      : ctx.shadowOffsetX;
    ctx.shadowOffsetY = opts?.shadowOffsetY
      ? opts.shadowOffsetY * builder.resolutionScale
      : ctx.shadowOffsetY;

    ctx.fillStyle = ctx.shadowColor;
    ctx.fillText(line, x, y);
  };
}

export type GradientStop = [offset: number, color: string];

/**
 * Specify which bounding box relative coordinates apply to.
 *
 * For `line-content`, (0,0) is the top-left corner of the box which bounds
 * the contents of a given line of text, and (1,1) is the bottom-right corner
 * of said box.
 *
 * For `line`, x=0 is the left-edge of the first letter, x=1 is the left-edge
 * of the last letter plus its advance. y=0 is the bottom of the previous line,
 * y=1 is the top of the next line.
 *
 * For `canvas`, (0,0) is the top-left edge of the Canvas, (1,1) is its
 * bottom-right corner.
 */
export type CanvasDrawBounds = 'line-content' | 'line' | 'canvas';

function resolveBounds(
  ctx: CanvasRenderingContext2D,
  line: gfx.CanvasTextBox,
  bounds?: CanvasDrawBounds
): [number, number, number, number] {
  return bounds === 'line-content'
    ? line.bounds.content
    : bounds === 'line'
      ? line.bounds.max
      : canvasRectToLocal(ctx);
}

/**
 * Configure Canvas fill/stroke to use a gradient.
 *
 * After this function has been invoked, subsequent draws will receive their
 * color values from the configured gradient.
 *
 * @note See {@link CanvasDrawBounds} for more information on how input
 * coordinates are applied.
 *
 * @param x0 left-edge of the rectangle where the gradient is in effect
 * @param y0 top-edge of the rectangle where the gradient is in effect
 * @param x1 right-edge of the rectangle where the gradient is in effect
 * @param y1 bottom-edge of the rectangle where the gradient is in effect
 * @param stops gradient definition
 * @param opts
 *  **bounds** specifies how input coordinates are interpreted </br>
 *  **padLTRB** extra pixels to add to the edges of the input rectangle
 */
export function SetupLinearGradient(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: GradientStop[],
  opts?: Partial<{
    bounds: CanvasDrawBounds;
    padLTRB: [number, number, number, number];
  }>
): gfx.CanvasTextDrawFn {
  return (
    ctx: CanvasRenderingContext2D,
    builder: gfx.CanvasTextBuilder,
    line: gfx.CanvasTextBox
  ) => {
    const [x, y, w, h] = resolveBounds(ctx, line, opts?.bounds);

    const {padLTRB = [0, 0, 0, 0]} = opts ?? {};

    const grad = ctx.createLinearGradient(
      x + x0 * w - padLTRB[0],
      y + y0 * h - padLTRB[1],
      x + x1 * w + padLTRB[2],
      y + y1 * h + padLTRB[3]
    );

    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }

    ctx.fillStyle = grad;
    ctx.strokeStyle = grad;
  };
}

export function SetupRadialGradient(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number,
  stops: GradientStop[],
  opts?: Partial<{
    bounds: CanvasDrawBounds;
  }>
): gfx.CanvasTextDrawFn {
  return (
    ctx: CanvasRenderingContext2D,
    builder: gfx.CanvasTextBuilder,
    line: gfx.CanvasTextBox
  ) => {
    const [x, y, w, h] = resolveBounds(ctx, line, opts?.bounds);

    const grad = ctx.createRadialGradient(
      x + x0 * w,
      y + y0 * h,
      r0 * Math.min(w, h) * 0.5,
      x + x1 * w,
      y + y1 * h,
      r1 * Math.min(w, h) * 0.5
    );

    for (const [offset, color] of stops) {
      grad.addColorStop(offset, color);
    }

    ctx.fillStyle = grad;
    ctx.strokeStyle = grad;
  };
}

/**
 * Render bounding boxes of text lines.
 *
 * The bounds corresponding to `line-content` of {@link CanvasDrawBounds} are
 * drawn in red, the bounds corresponding to `line` of {@link CanvasDrawBounds}
 * are drawn in yellow.
 */
export function drawTextBounds(
  ctx: CanvasRenderingContext2D,
  _: unknown,
  box: gfx.CanvasTextBox
): void {
  const {bounds} = box;

  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'red';
  ctx.strokeRect(...bounds.content);
  ctx.strokeStyle = 'yellow';
  ctx.strokeRect(...bounds.max);
  ctx.restore();
}

function canvasRectToLocal(
  ctx: CanvasRenderingContext2D
): [number, number, number, number] {
  const origin = ctx
    .getTransform()
    .inverse()
    .transformPoint(new DOMPoint(0, 0));
  const dim = ctx
    .getTransform()
    .inverse()
    .transformPoint(new DOMPoint(ctx.canvas.width, ctx.canvas.height));
  return [origin.x, origin.y, dim.x, dim.y];
}
