import {gfx} from '@apila/engine';

import {Card} from './card';
import {
  CardName,
  SOLITAIRE_COLUMN_SPACING,
  SOLITAIRE_FOUNDATION_SPACING,
} from './config/config';
import {GameLayer} from './config/schemas';
import {IS_MOBILE_DEVICE} from './framework';

export const SOLITAIRE_DRAG_DEPTH_GROUP = GameLayer.Deck + 5;

export type SolitairePickMove = {
  from: string;
  to: string;
  count: number;
};

export type SolitaireCardNodeLocator = (
  name: CardName,
  index?: number,
) => gfx.Empty;

const klondikeDropTargetTos = new Set<string>([
  'FOUNDATION',
  'STACK_1',
  'STACK_2',
  'STACK_3',
  'STACK_4',
  'STACK_5',
  'STACK_6',
  'STACK_7',
]);

export function filterKlondikeDragMoves(
  moves: SolitairePickMove[],
): SolitairePickMove[] {
  return moves.filter((m) => klondikeDropTargetTos.has(m.to));
}

function minHorizontalGapWorld(
  locator: SolitaireCardNodeLocator,
  cardName: CardName,
  count: number,
  fallbackSpacing: number,
): number {
  const xs: number[] = [];
  for (let i = 0; i < count; i++) {
    const node = locator(cardName, i);
    if (node.worldVisibility) {
      xs.push(node.worldPosition[0]);
    }
  }
  if (xs.length < 2) {
    return IS_MOBILE_DEVICE ? fallbackSpacing * 0.8 : fallbackSpacing;
  }
  xs.sort((a, b) => a - b);
  let minGap = Infinity;
  for (let i = 1; i < xs.length; i++) {
    minGap = Math.min(minGap, xs[i] - xs[i - 1]);
  }
  return minGap < Infinity ? minGap : fallbackSpacing;
}

function tableauColumnSpacingWorld(locator: SolitaireCardNodeLocator): number {
  return minHorizontalGapWorld(
    locator,
    CardName.SolTableau,
    7,
    SOLITAIRE_COLUMN_SPACING,
  );
}

function foundationSlotSpacingWorld(locator: SolitaireCardNodeLocator): number {
  return minHorizontalGapWorld(
    locator,
    CardName.SolFoundation,
    4,
    SOLITAIRE_FOUNDATION_SPACING,
  );
}

function hitTestTableauColumnByWorldX(
  locator: SolitaireCardNodeLocator,
  worldX: number,
): string | null {
  const spacing = tableauColumnSpacingWorld(locator);
  const maxDx = spacing * 0.62;

  let bestCol = -1;
  let bestDist = Infinity;
  for (let col = 0; col < 7; col++) {
    const node = locator(CardName.SolTableau, col);
    if (!node.worldVisibility) {
      continue;
    }
    const cx = node.worldPosition[0];
    const d = Math.abs(worldX - cx);
    if (d < bestDist) {
      bestDist = d;
      bestCol = col;
    }
  }
  if (bestCol < 0 || bestDist > maxDx) {
    return null;
  }
  return `STACK_${bestCol + 1}`;
}

function pointHitsFoundationZone(
  locator: SolitaireCardNodeLocator,
  worldX: number,
  worldY: number,
): boolean {
  const spacing = foundationSlotSpacingWorld(locator);
  const maxDx = spacing * 0.52;
  const maxDy = IS_MOBILE_DEVICE ? 170 : 210;

  let bestDx = Infinity;
  for (let slot = 0; slot < 4; slot++) {
    const node = locator(CardName.SolFoundation, slot);
    if (!node.worldVisibility) {
      continue;
    }
    const w = node.worldPosition;
    if (Math.abs(worldY - w[1]) > maxDy) {
      continue;
    }
    bestDx = Math.min(bestDx, Math.abs(worldX - w[0]));
  }
  return bestDx <= maxDx && bestDx < Infinity;
}

export function hitTestKlondikeDropTarget(
  locator: SolitaireCardNodeLocator,
  cardWorldX: number,
  cardWorldY: number,
  pointerWorldX: number,
  pointerWorldY: number,
): string | null {
  const pointer: [number, number] = [pointerWorldX, pointerWorldY];
  for (let slot = 0; slot < 4; slot++) {
    const node = locator(CardName.SolFoundation, slot);
    if (node.worldVisibility && node.isInsideBoundingBox(pointer)) {
      return 'FOUNDATION';
    }
  }
  if (pointHitsFoundationZone(locator, pointerWorldX, pointerWorldY)) {
    return 'FOUNDATION';
  }
  if (pointHitsFoundationZone(locator, cardWorldX, cardWorldY)) {
    return 'FOUNDATION';
  }
  return hitTestTableauColumnByWorldX(locator, cardWorldX);
}

export type SolitaireDragLayoutSnapshot = {
  cards: Card[];
  startParents: (gfx.Empty | null)[];
  startLocalPos: [number, number][];
  startWorldPos: [number, number][];
  startDepth: number[];
};
