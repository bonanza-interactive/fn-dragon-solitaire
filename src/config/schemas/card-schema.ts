import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';

import {CARD_LOCATION_PREFIX} from '../config';

const cards: Partial<schema.NodeSchema>[] = [
  {
    name: 'discard_0',
    scale: [0.6, 0.6],
    if: {
      portrait: {
        position: [0, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [0, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: 'deck',
    if: {
      portrait: {position: [0, 0], layout: [schema.canvasAnchorLeft(-240)]},
      landscape: {position: [-3500, 0]},
    },
  },
];

function addCardPrefixes(
  cards: Partial<schema.NodeSchema>[],
): asserts cards is schema.NodeSchema[] {
  cards.forEach((val) => {
    val.name = `${CARD_LOCATION_PREFIX}_${val.name}`;
    val.type = gfx.DrawableType.Empty;
  });
}

addCardPrefixes(cards);

export const CARD_NODES = cards;
