import {gfx} from '@apila/engine';
import {schema} from '@apila/game-libraries';
import {CARD_LOCATION_PREFIX} from '../config';

const CARD_IMAGE_W = 229;
const CARD_IMAGE_H = 337;

const cards: Partial<schema.NodeSchema>[] = [
  {
    name: 'discard_0',
    if: {
      portrait: {
        position: [-480, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [-480, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: 'discard_1',
    if: {
      portrait: {
        position: [-240, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [-240, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: 'discard_2',
    if: {
      portrait: {position: [0, 0], layout: [schema.canvasAnchorBottom(-400)]},
      landscape: {position: [0, 0], layout: [schema.canvasAnchorBottom(-400)]},
    },
  },
  {
    name: 'discard_3',
    if: {
      portrait: {position: [240, 0], layout: [schema.canvasAnchorBottom(-400)]},
      landscape: {
        position: [240, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: 'discard_4',
    if: {
      portrait: {position: [480, 0], layout: [schema.canvasAnchorBottom(-400)]},
      landscape: {
        position: [480, 0],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
   {
    name: 'waste_0',
    if: {
      portrait: {position: [-500, -300], layout: [schema.canvasAnchorBottom(-400)]},
      landscape: {
        position: [-920, 0],
        // layout: [schema.canvasAnchorBottom(570)],
      },
    },
   },
   {
    name: 'deck',
    if: {
      portrait: {position: [0, 0], layout: [schema.canvasAnchorLeft(-240)]},
      landscape: {position: [0, 0], layout: [schema.canvasAnchorLeft(-240)]},
    },
    },
    {
    name: 'stack_0',
    if: { landscape: { position: [-600, 0] } }
    },
    {
    name: 'stack_1',
    if: { landscape: { position: [-400, 0] } }
    },
    {
    name: 'stack_2',
     if: { landscape: { position: [-200, 0] } }
    },
   {
     name: 'stack_3',
     if: { landscape: { position: [0, 0] } }
   },
   {
      name: 'stack_4',
      if: { landscape: { position: [200, 0] } }
   },
  {
     name: 'stack_5',
     if: { landscape: { position: [400, 0] } }
  },
   {
      name: 'stack_6',
      if: { landscape: { position: [600, 0] } }
  },
  {
    name: 'stack_left_0',
    if: {
      portrait: {position: [-180, 420], scale: [1.3, 1.3]},
      landscape: {position: [0, 0], scale: [1, 1]},
    },
  },
  {
    name: 'stack_left_1',
    if: {
      portrait: {position: [-180, 472], scale: [1.3, 1.3]},
      landscape: {position: [0, 35], scale: [1, 1]},
    },
  },
  {
    name: 'stack_left_2',
    if: {
      portrait: {position: [-180, 524], scale: [1.3, 1.3]},
      landscape: {position: [0, 70], scale: [1, 1]},
    },
  },
  {
    name: 'stack_left_discard',
    if: {
      portrait: {
        position: [-180, 0],
        scale: [1.3, 1.3],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [0, 0],
        scale: [1, 1],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: 'stack_right_0',
    if: {
      portrait: {position: [180, 420], scale: [1.3, 1.3]},
      landscape: {position: [240, 0], scale: [1, 1]},
    },
  },
  {
    name: 'stack_right_1',
    if: {
      portrait: {position: [180, 472], scale: [1.3, 1.3]},
      landscape: {position: [240, 35], scale: [1, 1]},
    },
  },
  {
    name: 'stack_right_2',
    if: {
      portrait: {position: [180, 524], scale: [1.3, 1.3]},
      landscape: {position: [240, 70], scale: [1, 1]},
    },
  },
  {
    name: 'stack_right_discard',
    if: {
      portrait: {
        position: [180, 0],
        scale: [1.3, 1.3],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [240, 0],
        scale: [1, 1],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: 'hand_0',
    pivot: [0.5, 0.5],
    size: [CARD_IMAGE_W, CARD_IMAGE_H],
    if: {
      portrait: {position: [-480, 0]},
      landscape: {position: [-480, 0]},
    },
  },
  {
    name: 'hand_1',
    pivot: [0.5, 0.5],
    size: [CARD_IMAGE_W, CARD_IMAGE_H],
    if: {
      portrait: {position: [-240, 0]},
      landscape: {position: [-240, 0]},
    },
  },
  {
    name: 'hand_2',
    pivot: [0.5, 0.5],
    size: [CARD_IMAGE_W, CARD_IMAGE_H],
    if: {
      portrait: {position: [0, 0]},
      landscape: {position: [0, 0]},
    },
  },
  {
    name: 'hand_3',
    pivot: [0.5, 0.5],
    size: [CARD_IMAGE_W, CARD_IMAGE_H],
    if: {
      portrait: {position: [240, 0]},
      landscape: {position: [240, 0]},
    },
  },
  {
    name: 'hand_4',
    pivot: [0.5, 0.5],
    size: [CARD_IMAGE_W, CARD_IMAGE_H],
    if: {
      portrait: {position: [480, 0]},
      landscape: {position: [480, 0]},
    },
  },
  {
    name: '4OAK_reserve_0',
    if: {
      portrait: {position: [-480, 0]},
      landscape: {position: [-800, 0]},
    },
  },
  {
    name: '4OAK_reserve_1',
    if: {
      portrait: {position: [-450, 0]},
      landscape: {position: [-770, 0]},
    },
  },
  {
    name: '4OAK_reserve_2',
    if: {
      portrait: {position: [-420, 0]},
      landscape: {position: [-740, 0]},
    },
  },
  {
    name: '4OAK_reserve_3',
    if: {
      portrait: {position: [-390, 0]},
      landscape: {position: [-710, 0]},
    },
  },
  {
    name: '4OAK_hand_0',
    if: {
      portrait: {position: [-450, 500], scale: [1.25, 1.25]},
      landscape: {position: [-360, 0], scale: [1, 1]},
    },
  },
  {
    name: '4OAK_hand_1',
    if: {
      portrait: {position: [-150, 500], scale: [1.25, 1.25]},
      landscape: {position: [-120, 0], scale: [1, 1]},
    },
  },
  {
    name: '4OAK_hand_2',
    if: {
      portrait: {position: [150, 500], scale: [1.25, 1.25]},
      landscape: {position: [120, 0], scale: [1, 1]},
    },
  },
  {
    name: '4OAK_hand_3',
    if: {
      portrait: {position: [450, 500], scale: [1.25, 1.25]},
      landscape: {position: [360, 0], scale: [1, 1]},
    },
  },
  {
    name: '4OAK_discard_0',
    if: {
      portrait: {
        position: [-450, 0],
        scale: [1.25, 1.25],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [-360, 0],
        scale: [1, 1],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: '4OAK_discard_1',
    if: {
      portrait: {
        position: [-150, 0],
        scale: [1.25, 1.25],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [-120, 0],
        scale: [1, 1],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: '4OAK_discard_2',
    if: {
      portrait: {
        position: [150, 0],
        scale: [1.25, 1.25],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [120, 0],
        scale: [1, 1],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: '4OAK_discard_3',
    if: {
      portrait: {
        position: [450, 0],
        scale: [1.25, 1.25],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [360, 0],
        scale: [1, 1],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
  {
    name: 'gamble_hand',
    if: {
      portrait: {position: [0, 150], scale: [1.3, 1.3]},
      landscape: {position: [0, 0], scale: [1, 1]},
    },
  },
  {
    name: 'gamble_discard',
    if: {
      portrait: {
        position: [0, 0],
        scale: [1.3, 1.3],
        layout: [schema.canvasAnchorBottom(-400)],
      },
      landscape: {
        position: [0, 0],
        scale: [1, 1],
        layout: [schema.canvasAnchorBottom(-400)],
      },
    },
  },
];

function addCardPrefixes(
  cards: Partial<schema.NodeSchema>[]
): asserts cards is schema.NodeSchema[] {
  cards.forEach((val) => {
    val.name = `${CARD_LOCATION_PREFIX}_${val.name}`;
    val.type = gfx.DrawableType.Empty;
  });
}

addCardPrefixes(cards);

export const CARD_NODES = cards;
