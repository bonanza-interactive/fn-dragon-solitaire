import {gfx} from '@apila/engine';
import {DrawableType} from '@apila/engine/dist/apila-gfx';
import {schema} from '@apila/game-libraries';
import {byAspectRatio} from '@apila/game-libraries/dist/node-schema';

import {createLocalizedTextMeta} from '../../types';
import {anchorRelativeToParent, marginDeferred} from '../../util/utils-schema';
import {CARD_LOCATION_PREFIX} from '../config';
import {BACKGROUND} from './background-schema';
import {BUTTONS} from './buttons-schema';
import {CARD_NODES} from './card-schema';
import {GameLayer} from './common-schema';
import {FREESPIN_POPUP} from './freespin-popup-schema';
import {FREESPIN_TRANSITION} from './freespin-transition-schema';
import {TOP_ELEMENTS} from './top-elements-schema';
import {WIN_SCROLLER} from './win-scroller-schema';

export const BASE_GAME: schema.NodeSchema = {
  type: gfx.DrawableType.Empty,
  name: 'base_game_root',
  if: {initial: {visible: false}},
  children: [
    BACKGROUND,
    {
      type: DrawableType.Empty,
      name: 'margin_node',
      if: {
        landscape: {
          layout: marginDeferred({
            marginValues: [0, 340, 0, 300],
            minSize: [0, 2400],
            areaRect: ['margin_rect'],
            anchor: [0.5, 0.5],
            mode: 'container',
          }),
        },
        portrait: {
          layout: marginDeferred({
            marginValues: [0, 50, 0, 180],
            minSize: [600, 600],
            areaRect: ['margin_rect'],
            anchor: [0.5, 0.5],
            mode: 'container',
          }),
        },
        portraitMobile: {
          layout: (n, g) => {
            marginDeferred({
              marginValues: [0, g.layout.canvasPixelSize[1] * 0.09, 0, 200],
              minSize: [500, 500],
              areaRect: ['margin_rect'],
              anchor: [0.5, 0.5],
              mode: 'container',
            })(n, g);
          },
        },
        squareMobile: {
          layout: (n, g) => {
            marginDeferred({
              marginValues: [0, g.layout.canvasPixelSize[1] * 0.08, 0, 200],
              minSize: [400, 400],
              areaRect: ['margin_rect'],
              anchor: [0.5, 0.5],
              mode: 'container',
            })(n, g);
          },
        },
      },
      children: [
        {
          type: DrawableType.Sprite,
          name: 'margin_rect',
          image: 'white',
          visible: false,
          opacity: 0.2,
          pivot: [0.5, 0.5],
          depthGroup: 999,
          if: {
            landscape: {position: [0, 0], size: [2800, 1280]},
            portrait: {position: [0, 0], size: [1280, 1550]},
            landscapeMobile: {position: [0, 0], size: [2920, 1380]},
            portraitMobile: {position: [0, 0], size: [1280, 1500]},
          },
        },
        {type: DrawableType.Empty, name: 'margin_contents_target'},
        {
          type: DrawableType.Empty,
          name: 'margin_contents',
          children: [
            WIN_SCROLLER,
            FREESPIN_POPUP,
            FREESPIN_TRANSITION,
            {
              type: DrawableType.Empty,
              name: 'selection_info_root',
              if: {
                portrait: {position: [0.0, 700.0], scale: [1.5, 1.5]},
                landscape: {position: [0.0, 590.0], scale: [1.8, 1.8]},
                landscapeMobile: {position: [0.0, 600.0], scale: [2.0, 2.0]},
                portraitMobile: {position: [0.0, 700.0], scale: [1.5, 1.5]},
              },
              children: [
                {
                  type: DrawableType.Sprite,
                  name: 'selection_info_dimmer',
                  image: 'text_dimmer',
                  opacity: 0.4,
                  pivot: [0.5, 0.5],
                  position: [0, 2],
                  scale: [0.47, 0.7],
                  depthGroup: GameLayer.Foreground - 1,
                  if: {initial: {visible: false}},
                },
                {
                  type: gfx.DrawableType.BitmapText,
                  name: 'selection_info_text',
                  font: 'basic_text',
                  depthGroup: GameLayer.Foreground,
                  pivot: [0.5, 0.5],
                  meta: createLocalizedTextMeta({
                    localizationKey: 'selection_info',
                  }),
                  align: gfx.TextAlignment.CENTER,
                  lineHeightAdjust: -10,
                  if: {initial: {visible: false}},
                },
              ],
            },
            {
              type: gfx.DrawableType.Empty,
              name: 'play_area',
              size: [1080, 1080],
              pivot: [0.5, 0.5],
              if: {
                landscape: {position: [0, 0], scale: [1.5, 1.5]},
                portrait: {position: [0, 200], scale: [1.2, 1.2]},
                landscapeMobile: {position: [0, 0], scale: [1.4, 1.4]},
                portraitMobile: {position: [0, 200], scale: [1.0, 1.0]},
              },
              children: [
                TOP_ELEMENTS,
                BUTTONS,
                {
                  type: gfx.DrawableType.Empty,
                  name: 'card_root',
                  depthGroup: GameLayer.Cards,
                  position: [0, 20],
                  size: [1080, 1080],
                  pivot: [0.5, 0.5],
                  children: [
                    {
                      type: gfx.DrawableType.Empty,
                      name: 'selection_root',
                      position: [0, -50],
                      if: {
                        landscape: {scale: [0.95, 0.95], position: [0, -30]},
                        portrait: {scale: [1, 1]},
                        portraitMobile: {scale: [1.07, 1.07]},
                        landscapeMobile: {scale: [1.05, 1.05]},
                      },
                    },
                    {
                      type: gfx.DrawableType.Empty,
                      name: 'hand_root',
                      if: {
                        portrait: {
                          scale: [1, 1],
                          layout: (n, g) => {
                            anchorRelativeToParent(
                              g,
                              8 / 6, // Min aspect ratio
                              8 / 4, // Max aspect ratio
                              0.35, // Min vertical position
                              0.4, // Max vertical position
                            )(n, g);
                          },
                        },
                        landscape: {
                          scale: [1, 1],
                          layout: byAspectRatio([
                            {aspectRatio: 5 / 4, position: [0, -348]},
                            {aspectRatio: 16 / 9, position: [0, -270]},
                          ]),
                        },
                        portraitMobile: {
                          layout: byAspectRatio([
                            {
                              aspectRatio: 1.0,
                              position: [0, -120],
                              scale: [1, 1],
                            },
                            {
                              aspectRatio: 1.78,
                              position: [0, -180],
                              scale: [1, 1],
                            },
                            {
                              aspectRatio: 2.5,
                              position: [0, -220],
                              scale: [1, 1],
                            },
                          ]),
                        },
                        landscapeMobile: {
                          layout: byAspectRatio([
                            {
                              aspectRatio: 5 / 4,
                              position: [0, -280],
                              scale: [0.9, 0.9],
                            },
                            {
                              aspectRatio: 16 / 9,
                              position: [0, -240],
                              scale: [0.85, 0.85],
                            },
                          ]),
                        },
                      },
                    },
                    {
                      type: gfx.DrawableType.Empty,
                      name: 'table_root',
                      size: [1080, 1080],
                      pivot: [0.5, 0.5],
                      if: {
                        portrait: {
                          layout: (n, g) => {
                            anchorRelativeToParent(
                              g,
                              8 / 6, // Min aspect ratio
                              8 / 4, // Max aspect ratio
                              0.67, // Min vertical position
                              0.72, // Max vertical position
                            )(n, g);
                          },
                        },
                        landscape: {
                          layout: (n, g) => {
                            anchorRelativeToParent(
                              g,
                              10 / 8, // Min aspect ratio
                              16 / 8, // Max aspect ratio
                              0.6, // Min vertical position
                              0.6, // Max vertical position
                            )(n, g);
                          },
                        },
                        portraitMobile: {
                          layout: byAspectRatio([
                            {
                              aspectRatio: 1.0,
                              position: [0, 250],
                              scale: [1.05, 1.05],
                            },
                            {
                              aspectRatio: 1.78,
                              position: [0, 210],
                              scale: [0.95, 0.95],
                            },
                            {
                              aspectRatio: 2.5,
                              position: [0, 280],
                              scale: [0.95, 0.95],
                            },
                          ]),
                        },
                        landscapeMobile: {
                          layout: byAspectRatio([
                            {
                              aspectRatio: 5 / 4,
                              position: [0, 150],
                              scale: [0.92, 0.92],
                            },
                            {
                              aspectRatio: 16 / 9,
                              position: [0, 170],
                              scale: [1.05, 1.05],
                            },
                          ]),
                        },
                      },
                      children: [
                        {
                          type: gfx.DrawableType.Empty,
                          name: `${CARD_LOCATION_PREFIX}_table_deck`,
                          if: {
                            portrait: {position: [800, 0]},
                            landscape: {position: [691, 0]},
                            portraitMobile: {position: [1200, 0]},
                            landscapeMobile: {
                              position: [780, 0],
                              //layout: byAspectRatio([
                              //  {
                              //    aspectRatio: 1208 / 797,
                              //    position: [900, 0],
                              //  },
                              //  {
                              //    aspectRatio: 1461 / 797,
                              //    position: [980, 0],
                              //  },
                              //  {
                              //    aspectRatio: 1462 / 797,
                              //    position: [1350, 0],
                              //  },
                              //]),
                            },
                            square: {position: [1150, 0]},
                          },
                          children: [
                            {
                              type: gfx.DrawableType.Empty,
                              name: 'deck_root',
                              children: [
                                {
                                  type: gfx.DrawableType.Spine,
                                  name: 'deck_visual',
                                  skeleton: 'deck',
                                  depthGroup: GameLayer.Deck,
                                  pivot: [0.5, 0.5],
                                  position: [0.0, 356.0],
                                  glCullBackFaces: true,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: gfx.DrawableType.Empty,
                      name: 'gamble_root',
                      if: {
                        portrait: {position: [0, -150], scale: [1, 1]},
                        landscape: {position: [0, -120], scale: [1.1, 1.1]},
                        portraitMobile: {
                          layout: byAspectRatio([
                            {
                              aspectRatio: 1.0,
                              position: [0, -150],
                              scale: [1.6, 1.6],
                            },
                            {
                              aspectRatio: 1.78,
                              position: [0, -150],
                              scale: [1.2, 1.2],
                            },
                            {
                              aspectRatio: 2.5,
                              position: [0, -150],
                              scale: [1.2, 1.2],
                            },
                          ]),
                        },
                      },
                    },
                    ...CARD_NODES,
                  ],
                },
                {
                  type: gfx.DrawableType.Empty,
                  if: {
                    portrait: {scale: [1.5, 1.5], position: [0, 180]},
                    landscape: {scale: [1.3, 1.3], position: [0, 220]},
                    portraitMobile: {
                      layout: byAspectRatio([
                        {
                          aspectRatio: 1.0,
                          scale: [1.7, 1.7],
                          position: [0, 220],
                        },
                        {
                          aspectRatio: 1.78,
                          scale: [1.8, 1.8],
                          position: [0, 200],
                        },
                        {
                          aspectRatio: 2.5,
                          scale: [2.0, 2.0],
                          position: [0, 250],
                        },
                      ]),
                    },
                  },
                  children: [
                    {
                      type: gfx.DrawableType.BitmapText,
                      name: 'frame_text',
                      font: 'basic_text',
                      depthGroup: GameLayer.WinscrollText + 1,
                      pivot: [0.5, 0.5],
                      meta: createLocalizedTextMeta({
                        localizationKey: 'gamble_query',
                      }),
                      align: gfx.TextAlignment.CENTER,
                      if: {
                        initial: {
                          visible: false,
                          lineHeightAdjust: 0,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
