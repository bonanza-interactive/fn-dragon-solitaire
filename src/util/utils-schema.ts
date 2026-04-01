import {gfx} from '@apila/engine';
import {Orientation, clamp} from '@apila/engine/dist/apila-gfx';
import {anim, schema} from '@apila/game-libraries';
import {Timeline} from '@apila/game-libraries/dist/game-animation';

import {CORE} from '../game';
import {AUTO_TICK} from '../main';
import {lerp, voidPromise, wait} from './utils';
import {getWorldSize, minMaxNormalize} from './utils-gfx';
import {getNode} from './utils-node';

function isNumberArray(
  size: unknown,
): size is [number, number, number, number] {
  return Array.isArray(size) && typeof size[0] === 'number';
}

export type MarginProperties = {
  /**
   * Margin values in screen space (left, top, right, bottom)
   */
  marginValues: [number, number, number, number];

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
  properties: MarginProperties,
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
    const left = Math.max(properties.marginValues[0] - containerPadding[0], 0);
    const top = Math.max(properties.marginValues[1] - containerPadding[1], 0);
    const right = Math.max(properties.marginValues[2] - containerPadding[0], 0);
    const bottom = Math.max(
      properties.marginValues[3] - containerPadding[1],
      0,
    );

    // Scale of the canvas before vs after including the margin values
    const canvasScale = [
      (canvasSize[0] - (left + right)) / canvasSize[0],
      (canvasSize[1] - (top + bottom)) / canvasSize[1],
    ];

    const nodeScale = Math.min(
      (worldSize[0] * canvasScale[0]) / boundingBoxSize[0],
      (worldSize[1] * canvasScale[1]) / boundingBoxSize[1],
    );

    // The padding amount between node and world area when
    // the node is scaled to fill the world area
    const worldPadding = [
      Math.max(worldSize[0] - boundingBoxSize[0] * nodeScale, 0) * 0.5,
      Math.max(worldSize[1] - boundingBoxSize[1] * nodeScale, 0) * 0.5,
    ];

    const worldScale = Math.min(
      worldSize[0] / canvasSize[0],
      worldSize[1] / canvasSize[1],
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
  properties: MarginProperties,
): schema.LayoutFunc<gfx.NodeProperties> {
  const layoutFunc = (n: gfx.NodeProperties, g: gfx.Gfx) =>
    CORE.messageQueue.pushMessage(() => margin(properties)(n, g));
  return layoutFunc;
}

export const fullscreen = (n: gfx.NodeProperties, g: gfx.Gfx) => {
  const worldSize = getWorldSize(g.layout);
  n.size = [worldSize[0], worldSize[1]];
};

export function anchorToParent(
  leftHorzNorm: number,
  topVertNorm: number,
  offset: [number, number] = [0, 0],
): schema.LayoutFunc<gfx.NodeProperties> {
  return schema.parentAnchorGeneral(
    undefined,
    undefined,
    leftHorzNorm,
    topVertNorm,
    true,
    true,
    offset,
  );
}

export function anchor(
  leftHorzNorm: number,
  topVertNorm: number,
  offset: [number, number] = [0, 0],
): schema.LayoutFunc<gfx.NodeProperties> {
  return schema.canvasAnchorGeneral(
    undefined,
    undefined,
    leftHorzNorm,
    topVertNorm,
    true,
    true,
    offset,
  );
}

export const minMaxNormalizeAspectRatioRange = (
  aspectRatioMin: number,
  aspectRatioMax: number,
  aspectRatio: number,
  orientation: Orientation,
) => {
  const orientationAdjustedAspectRatio =
    orientation === Orientation.Portrait ? 1 / aspectRatio : aspectRatio;

  return clamp(
    minMaxNormalize(
      orientationAdjustedAspectRatio,
      aspectRatioMin,
      aspectRatioMax,
    ),
    0,
    1,
  );
};

export function anchorRelativeToParent(
  g: gfx.Gfx,
  aspectMin: number,
  aspectMax: number,
  verticalPosMin: number,
  verticalPosMax: number,
): schema.LayoutFunc<gfx.NodeProperties> {
  const ratio = minMaxNormalizeAspectRatioRange(
    aspectMin,
    aspectMax,
    g.layout.aspectRatio,
    g.layout.orientation,
  );
  const y = lerp(verticalPosMin, verticalPosMax, ratio);
  return anchorToParent(0.5, y);
}

export async function moveNode(
  moveNode: gfx.NodeProperties,
  animationTimeSeconds: number,
  animationDelaySeconds = 0,
  nodeStart: gfx.NodeProperties,
  nodeTarget: gfx.NodeProperties,
): Promise<void> {
  await wait(animationDelaySeconds * 1000);

  const {promise: nodeMoved, resolve} = voidPromise();
  const timeline = new Timeline();
  AUTO_TICK.add(timeline);

  moveNode.parent = nodeStart.parent;
  moveNode.worldPosition = nodeStart.worldPosition;
  moveNode.scale = nodeStart.scale;

  timeline
    .animate(anim.OutQuad(0, 1), animationTimeSeconds, (t) => {
      const x = anim.easeLinear(
        nodeStart.worldPosition[0],
        nodeTarget.worldPosition[0],
        t,
      );
      const y = anim.easeLinear(
        nodeStart.worldPosition[1],
        nodeTarget.worldPosition[1],
        t,
      );
      const scale = anim.easeLinear(nodeStart.scale[0], nodeTarget.scale[0], t);
      moveNode.worldPosition = [x, y];
      moveNode.scale = [scale, scale];
    })
    .after(() => {
      AUTO_TICK.remove(timeline);
      resolve();
    });

  await nodeMoved;

  moveNode.parent = nodeTarget;
  moveNode.position = [0, 0];
  moveNode.scale = [1, 1];
}
