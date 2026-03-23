import * as rects from 'maxrects-packer';
import {gfx} from '@apila/engine';

type GlyphRect = {
  width: number;
  height: number;
  glyph: string;
  x: number;
  y: number;
};

/**
 * Parameters for atlased Webfont glyphs.
 */
export type AtlasOpts = {
  /**
   * Number of pixels to include between regions.
   */
  padOuter: number;
  /**
   * Number of pixels to include between a glyph's bounding box and its atlas
   * region.
   */
  padInner: [number, number];
  /**
   * Number of extra pixels to add between letters when rendering text.
   */
  letterSpaceAdjust: number;
  /**
   * Override line height with custom value; defaults to font height.
   */
  lineHeight: number;
  /**
   * Calculate a constant advance value for all number characters.
   */
  mononum: boolean;
};

function glyphBounds(
  builder: gfx.CanvasTextBuilder,
  font: gfx.CanvasFont,
  glyphs: string[]
): Array<GlyphRect> {
  builder.begin({font, text: ''});

  // Use CanvasTextBuilder to measure the bounding box of each individual
  // character. Note that the builder is unable to accurately measure overhang/
  // underhang, and thus some characters may partially reside outside the
  // calculated bounding box (this can be compensated for by increasing the
  // 'padInner' value).
  const result = glyphs
    .map((e) => builder.lineOrigins(e))
    .map((e) => e[0].bounds.max)
    .map((e, i) => ({
      x: 0,
      y: 0,
      width: Math.ceil(e[2]),
      height: Math.round(e[3]),
      glyph: glyphs[i],
    }));

  builder.discard();
  return result;
}

function glyphIsNumber(glyph: GlyphRect): boolean {
  return /\d+/.test(glyph.glyph);
}

export function atlasGlyphs(
  g: gfx.Gfx,
  builder: gfx.CanvasTextBuilder,
  resourceId: string,
  font: gfx.CanvasFont,
  glyphs: GlyphRect[],
  style: gfx.CanvasTextDrawFn[],
  opts?: Partial<AtlasOpts>
): object {
  // Find the widest number character in the set.
  const maxAdvance = Math.max(
    ...glyphs.filter(glyphIsNumber).map((e) => e.width)
  );

  // Extend glyph rects by padding value
  const [padInnerX = 0, padInnerY = 0] = opts?.padInner ?? [];
  glyphs = glyphs.map((e) => ({
    ...e,
    width: e.width + padInnerX,
    height: e.height + padInnerY,
  }));

  // Run packing algorithm
  const packer = new rects.MaxRectsPacker<GlyphRect>(
    2048,
    2048,
    opts?.padOuter ?? 0,
    {pot: false, allowRotation: false}
  );
  packer.addArray(glyphs);
  const bins = packer.bins;
  if (bins.length > 1) throw new Error('Glyphs do not fit into atlas');
  const bin = bins[0];

  // Render each glyph into its atlas region
  builder.begin([bin.width, bin.height]).font(font);
  for (const rect of bin.rects) {
    builder
      .pushState()
      .move(
        rect.x + Math.floor(padInnerX / 2),
        rect.y + Math.floor(padInnerY / 2)
      )
      .drawLines(rect.glyph, ...style)
      .popState();
  }

  builder.done(g, resourceId, {
    withImage: true,
    format: gfx.PixelFormat.RGBA8,
  });

  // Generate .bmfont data
  const spaceWidth = Math.ceil(builder.measure(' ')[0]);
  const mononum = opts?.mononum ?? true;

  return {
    glyphs: Object.fromEntries(
      bin.rects.map((e) => [
        e.glyph.charCodeAt(0),
        {
          left: e.x,
          top: e.y,
          w: e.width,
          h: e.height,
          // When mononum is enabled, the bearing value is used to center
          // glyphs horizontally in their atlas regions
          bearingX:
            glyphIsNumber(e) && mononum
              ? Math.max(
                  0,
                  Math.floor(
                    (maxAdvance - Math.ceil(builder.measure(e.glyph)[0])) / 2
                  )
                )
              : 0,
          bearingY: 0,
          // When mononum is enabled, all numbers are assigned the same
          // advance; otherwise, we use the value reported by Canvas
          advance:
            glyphIsNumber(e) && mononum
              ? maxAdvance
              : Math.ceil(builder.measure(e.glyph)[0]),
        },
      ])
    ),
    fontSize: font.heightPx,
    lineHeight: opts?.lineHeight ?? font.heightPx,
    spaceWidth,
    textureWidth: bin.width,
    textureHeight: bin.height,
    type: 'bitmap',
    kerningAdjust: {},
    majorVersion: 1,
    probeDiameter: 0,
    letterSpaceAdjust: opts?.letterSpaceAdjust ?? 0,
  };
}

/**
 * Render the provided characters into a texture and generate the
 * metadata that describes the resulting BitmapFont resource.
 * @param g
 * @param builder
 * @param resourceId id to use for the generated texture, image and bitmap font
 * resources
 * @param font
 * @param glyphs list of glyphs to render into the atlas
 * @param style
 * @param opts
 * @returns bitmap font data; use this when calling `Gfx.createBitmapFont`
 */
export function webfontToBitmapFont(
  g: gfx.Gfx,
  builder: gfx.CanvasTextBuilder,
  resourceId: string,
  font: gfx.CanvasFont,
  glyphs: string[],
  style: gfx.CanvasTextDrawFn[],
  atlasOpts?: Partial<AtlasOpts>
) {
  const rects = glyphBounds(builder, font, glyphs);
  const bmfont = atlasGlyphs(
    g,
    builder,
    resourceId,
    font,
    rects,
    style,
    atlasOpts
  );
  g.createBitmapFont(resourceId, resourceId, bmfont);
}
