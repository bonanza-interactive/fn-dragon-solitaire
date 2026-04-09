import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';
// import {byAspectRatio} from '@apila/game-libraries/dist/node-schema';

import {anchorRelativeToParent} from '../../util/utils-schema';
import {CARD_LOCATION_PREFIX} from '../config';
import {GameLayer} from './common-schema';

const tableauX = (i: number): number => -590 + i * 195;

const kenoCardLocations: Partial<schema.NodeSchema>[] = [
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

const solitaireLeafAnchors: Partial<schema.NodeSchema>[] = [
  {
    name: 'sol_stock',
    if: {
      portrait: {
        scale: [0.75, 0.75],
        position: [-580, -840],
      },
      landscape: {
        scale: [0.75, 0.75],
        position: [-590, -580],
      },
    },
  },
  {
    name: 'sol_waste',
    if: {
      portrait: {
        scale: [0.75, 0.75],
        position: [-400, -840],
      },
      landscape: {
        scale: [0.75, 0.75],
        position: [-400, -580],
      },
    },
  },
  ...Array.from({length: 4}, (_, i) => ({
    name: `sol_foundation_${i}`,
    if: {
      portrait: {
        scale: [0.75, 0.75],
        position: [0 + i * 195, -840] as [number, number],
      },
      landscape: {
        scale: [0.75, 0.75],
        position: [0 + i * 195, -580] as [number, number],
      },
    },
  })),
  ...Array.from({length: 7}, (_, i) => ({
    name: `sol_tableau_${i}`,
    if: {
      portrait: {
        scale: [0.75, 0.75],
        position: [tableauX(i), -540] as [number, number],
      },
      landscape: {
        scale: [0.75, 0.75],
        position: [tableauX(i), -280] as [number, number],
      },
    },
  })),
];

function addCardPrefixes(
  nodes: Partial<schema.NodeSchema>[],
): asserts nodes is schema.NodeSchema[] {
  nodes.forEach((val) => {
    val.name = `${CARD_LOCATION_PREFIX}_${val.name}`;
    val.type = gfx.DrawableType.Empty;
  });
}

addCardPrefixes(kenoCardLocations);
addCardPrefixes(solitaireLeafAnchors);

export const SOLITAIRE_ROOT: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'solitaire_root',
  pivot: [0.5, 0.5],
  size: [1450, 1200],
  depthGroup: GameLayer.Cards,
  visible: true,
  children: [
    {
      name: 'solitaire_bg',
      type: gfx.DrawableType.Sprite,
      pivot: [0.5, 0.5],
      visible: true,

      if: {
        portrait: {
          image: 'basegame_card_base',
          // size: [900, 1400],
          scale: [1.68, 1.68],
          position: [0, -600],
        },

        landscape: {
          image: 'basegame_card_base',
          // size: [1600, 1100],
          scale: [1.74, 1.57],
          position: [0, -170],
        },
      },
    },

    ...solitaireLeafAnchors,
  ],
  if: {
    portrait: {
      scale: [0.9, 0.9],
      layout: (n, g) => {
        anchorRelativeToParent(g, 8 / 6, 8 / 4, 0.6, 0.7)(n, g);
      },
    },
    landscape: {
      scale: [1, 1],
      layout: (n, g) => {
        anchorRelativeToParent(g, 10 / 8, 16 / 8, 0.58, 0.62)(n, g);
      },
    },
    // portraitMobile: {
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 1.0,
    //       position: [0, 200],
    //       scale: [0.72, 0.72],
    //     },
    //     {
    //       aspectRatio: 1.78,
    //       position: [0, 170],
    //       scale: [0.68, 0.68],
    //     },
    //     {
    //       aspectRatio: 2.5,
    //       position: [0, 230],
    //       scale: [0.64, 0.64],
    //     },
    //   ]),
    // },
    // landscapeMobile: {
    //   layout: byAspectRatio([
    //     {
    //       aspectRatio: 5 / 4,
    //       position: [0, 120],
    //       scale: [0.82, 0.82],
    //     },
    //     {
    //       aspectRatio: 16 / 9,
    //       position: [0, 145],
    //       scale: [0.88, 0.88],
    //     },
    //   ]),
    // },
    // squareMobile: {
    //   position: [0, 160],
    //   scale: [0.7, 0.7],
    // },
  },
  // children: solitaireLeafAnchors,
};

export const CARD_NODES: schema.NodeSchema[] = [
  ...kenoCardLocations,
  SOLITAIRE_ROOT,
];
