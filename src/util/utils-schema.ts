import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {CORE} from '../game';
import {getWorldSize, minMaxNormalize} from './utils-gfx';
import {getNode} from './utils-node';
import {GAMEFW, IS_MOBILE_DEVICE} from '../framework';

// aspect ratio to start adding extra margin
const ASPECT_RATIO_MIN = 0.4;
const ASPECT_RATIO_MAX = 1.0;
// how much extra margin to add
const EXTRA_MARGIN_COEFFICIENT = 0.22;

export function marginLTRB() {
  if (CORE && CORE.gfx && GAMEFW) {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const normalizedAspectRatio = minMaxNormalize(
      aspectRatio,
      ASPECT_RATIO_MIN,
      ASPECT_RATIO_MAX
    );
    const needExtraMargin =
      IS_MOBILE_DEVICE &&
      CORE.gfx.layout.orientation === gfx.Orientation.Portrait &&
      normalizedAspectRatio > 0;

    const margins = {left: 0, right: 0, top: 0, bottom: 0};
    const [w, h] = CORE.gfx.layout.canvasPixelSize;
    margins.left = w * 0.05;
    margins.right = w * 0.05;
    if (needExtraMargin) {
      margins.bottom =
        h * 0.15 + h * normalizedAspectRatio * EXTRA_MARGIN_COEFFICIENT;
    } else {
      margins.bottom = h * 0.15;
    }
    return margins;
  } else {
    return {top: 0, right: 0, bottom: 0, left: 0};
  }
}

function isNumberArray(
  size: unknown
): size is [number, number, number, number] {
  return Array.isArray(size) && typeof size[0] === 'number';
}

export type MarginProperties = {
  /**
   * Margin values in screen space
   */
  marginValues: {top: number; right: number; bottom: number; left: number};

  /**
   * Node area rectangle in world space
   * to which the margin values are applied to.
   * Take either numbers (width, height, x, y) or node name array
   * If node names are given, the area rectangle
   * is calculated from node bounding boxes
   */
  areaRect: [number, number, number, number] | string[];

  /**
   * Normalized canvas X/Y coordinates to use as anchor.
   * Used to align this node to specified location if after
   * margin calculations there is room left to move.
   */
  anchor?: [number, number];

  /**
   * Defines if the final margin values are calculated from the container or
   * the canvas size (as in adding border black boxes or not)
   */
  mode?: 'container' | 'canvas';

  /**
   * Minimum and maximum size of the final node size
   */
  minSize?: [number, number];
  maxSize?: [number, number];
};

/**
 * A layout function that scales the node according to the
 * margin values.
 *
 * Useful in situations where you want to
 * keep the node area out of the way of the user interface.
 *
 */
export function margin(
  properties: MarginProperties
): schema.LayoutFunc<gfx.NodeProperties> {
  const layoutFunc = (n: gfx.NodeProperties, g: gfx.Gfx) => {
    n.worldScale = [1, 1];
    n.worldPosition = [0, 0];

    const worldSize = getWorldSize(g.layout);
    const centerPosition = [0, 0];
    const boundingBoxSize: [number, number] = [0, 0];

    if (isNumberArray(properties.areaRect)) {
      boundingBoxSize[0] = properties.areaRect[0];
      boundingBoxSize[1] = properties.areaRect[1];
      centerPosition[0] = properties.areaRect[2];
      centerPosition[1] = properties.areaRect[3];
    } else {
      const boundingBox = [0, 0, 0, 0];

      for (const nodeStr of properties.areaRect) {
        const node = getNode(n, nodeStr);
        const nodeBoundingBox = node.worldBoundingBox;

        // Merge node bounding boxes
        for (let i = 0; i < 8; i += 2) {
          boundingBox[0] = Math.min(boundingBox[0], nodeBoundingBox[i]);
          boundingBox[1] = Math.min(boundingBox[1], nodeBoundingBox[i + 1]);
          boundingBox[2] = Math.max(boundingBox[2], nodeBoundingBox[i]);
          boundingBox[3] = Math.max(boundingBox[3], nodeBoundingBox[i + 1]);
        }
      }
      centerPosition[0] = (boundingBox[0] + boundingBox[2]) * 0.5;
      centerPosition[1] = (boundingBox[1] + boundingBox[3]) * 0.5;

      boundingBoxSize[0] = Math.abs(boundingBox[2] - boundingBox[0]);
      boundingBoxSize[1] = Math.abs(boundingBox[3] - boundingBox[1]);
    }

    const containerSize =
      properties.mode === 'canvas'
        ? g.layout.canvasPixelSize.slice(0, 2)
        : g.layout.containerSize.slice(0, 2);

    const canvasSize = [
      g.layout.canvasPixelSize[0],
      g.layout.canvasPixelSize[1],
    ];

    if (properties.minSize) {
      canvasSize[0] = Math.max(canvasSize[0], properties.minSize[0]);
      canvasSize[1] = Math.max(canvasSize[1], properties.minSize[1]);

      containerSize[0] = Math.max(containerSize[0], properties.minSize[0]);
      containerSize[1] = Math.max(containerSize[1], properties.minSize[1]);
    }
    if (properties.maxSize) {
      canvasSize[0] = Math.min(canvasSize[0], properties.maxSize[0]);
      canvasSize[1] = Math.min(canvasSize[1], properties.maxSize[1]);

      containerSize[0] = Math.min(containerSize[0], properties.maxSize[0]);
      containerSize[1] = Math.min(containerSize[1], properties.maxSize[1]);
    }

    // The padding amount between container and canvas area
    // a.i the black borders
    const containerPadding = [
      Math.abs(containerSize[0] - canvasSize[0]) * 0.5,
      Math.abs(containerSize[1] - canvasSize[1]) * 0.5,
    ];

    // Margin values after removing padding amount
    const left = Math.max(
      properties.marginValues.left - containerPadding[0],
      0
    );
    const top = Math.max(properties.marginValues.top - containerPadding[1], 0);
    const right = Math.max(
      properties.marginValues.right - containerPadding[0],
      0
    );
    const bottom = Math.max(
      properties.marginValues.bottom - containerPadding[1],
      0
    );

    // Scale of the canvas before vs after including the margin values
    const canvasScale = [
      (canvasSize[0] - (left + right)) / canvasSize[0],
      (canvasSize[1] - (top + bottom)) / canvasSize[1],
    ];

    const nodeScale = Math.min(
      (worldSize[0] * canvasScale[0]) / boundingBoxSize[0],
      (worldSize[1] * canvasScale[1]) / boundingBoxSize[1]
    );

    // The padding amount between node and world area when
    // the node is scaled to fill the world area
    const worldPadding = [
      Math.max(worldSize[0] - boundingBoxSize[0] * nodeScale, 0) * 0.5,
      Math.max(worldSize[1] - boundingBoxSize[1] * nodeScale, 0) * 0.5,
    ];

    const worldScale = Math.min(
      worldSize[0] / canvasSize[0],
      worldSize[1] / canvasSize[1]
    );

    // Calculate the offset value from margins.
    // Apply anchor here as well.

    const anchor = properties.anchor ?? [0.5, 0.5];

    const nodeOffset = [
      (left * worldScale - worldPadding[0]) * (1.0 - anchor[0]) +
        (worldPadding[0] - right * worldScale) * anchor[0],
      (top * worldScale - worldPadding[1]) * (1.0 - anchor[1]) +
        (worldPadding[1] - bottom * worldScale) * anchor[1],
    ];

    n.worldScale = [nodeScale, nodeScale];
    n.worldPosition = [
      nodeOffset[0] - centerPosition[0] * nodeScale,
      nodeOffset[1] - centerPosition[1] * nodeScale,
    ];
  };

  return layoutFunc;
}

/**
 * Deferred margin layout function. Called on start of frame rendering.
 *
 * Use this if the margin node size depends on child nodes.
 */

export function marginDeferred(
  properties: MarginProperties
): schema.LayoutFunc<gfx.NodeProperties> {
  const layoutFunc = (n: gfx.NodeProperties, g: gfx.Gfx) =>
    CORE.messageQueue.pushMessage(() => margin(properties)(n, g));
  return layoutFunc;
}

export const fullscreen = (n: gfx.NodeProperties, g: gfx.Gfx) => {
  const worldSize = getWorldSize(g.layout);
  n.size = [worldSize[0], worldSize[1]];
};

export function anchor(
  leftHorzNorm: number,
  topVertNorm: number,
  offset: [number, number] = [0, 0]
): schema.LayoutFunc<gfx.NodeProperties> {
  return schema.canvasAnchorGeneral(
    undefined,
    undefined,
    leftHorzNorm,
    topVertNorm,
    true,
    true,
    offset
  );
}
