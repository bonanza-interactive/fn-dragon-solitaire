import {fx} from '@apila/game-libraries';

type SoundParameters = {
  delay: number;
  delay_variance: number;
  fade: number;
  group: string;
  handle: string;
  index: number | 'next' | 'random';
  loop: boolean;
  loop_count: number;
  panning: number;
  rate: number;
  volume: number;
};

type Assets = keyof typeof assets;

type Modes = keyof typeof modes;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sound(asset: Assets, parameters?: Partial<SoundParameters>): any {
  return {target: 'sound', action: 'play', asset, ...parameters};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stopSound(asset: Assets, parameters?: any): any {
  return {target: 'sound', action: 'stop', asset, ...parameters};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function music(mode: Modes, parameters?: Partial<SoundParameters>): any {
  return {target: 'music', action: 'set_mode', mode, ...parameters};
}

const assets = {
  add_money: 'add_money',
  button_press: 'button_press',
  button_release: 'button_release',
  button_normal: 'button',
  payout: 'payout',
  reveal_cards: 'reveal_cards',
  select_cards: 'select_cards',
  set_bet_0: 'set_bet_0',
  set_bet_1: 'set_bet_1',
  set_bet_2: 'set_bet_2',
  set_bet_3: 'set_bet_3',
  set_bet_4: 'set_bet_4',
  set_volume: 'set_volume',
  super_round: 'super_round',

  basic_win_scrolling_loop: 'win_scroll_loop',
  win_scrolling_stop: 'win_scrolling_stop',
  win_big_rising: 'win_big_rising',
  end_win_text_appears_1: 'big_win_text_appear_1',
  end_win_text_appears_2: 'big_win_text_appear_2',
  win_scroll_end_small: 'win_scroll_end_small',
  win_scroll_end_big: 'win_scroll_end_big',
  win_small: ['win_small_1', 'win_small_2', 'win_small_3'],
  win_medium: ['win_medium_1', 'win_medium_2', 'win_medium_3'],
  win_big: 'win_big',
  win_highlight: 'win_highlight',

  //Keno page
  enter_game: 'enter_game',
  keno_mode_enter: 'keno_mode_enter',
  keno_card_select: [
    'keno_card_select_1',
    'keno_card_select_2',
    'keno_card_select_3',
    'keno_card_select_4',
    'keno_card_select_5',
    'keno_card_select_6',
  ],
  keno_unselect: [
    'keno_card_unselect_1',
    'keno_card_unselect_2',
    'keno_card_unselect_3',
  ],

  keno_select_max: 'keno_select_max',

  keno_auto_select: 'keno_auto_select',
  keno_to_hand: 'move_selected_cards_to_row',

  collect_cards: 'keno_remove_cards',
  stack_slide_left: 'stack_slide_left',
  stack_slide_right: 'stack_slide_right',
  card_deal: [
    'card_deal_1',
    'card_deal_2',
    'card_deal_3',
    'card_deal_4',
    'card_deal_5',
    'card_deal_6',
    'card_deal_7',
    'card_deal_8',
    'card_deal_9',
    'card_deal_10',
    'card_deal_11',
    'card_deal_12',
    'card_deal_13',
    'card_deal_14',
    'card_deal_15',
    'card_deal_16',
  ],

  card_win_1: 'card_win_1',
  card_win_2: 'card_win_2',
  card_win_3: 'card_win_3',
  card_win_4: 'card_win_4',
  card_win_5: 'card_win_5',
  card_win_6: 'card_win_6',

  dragon_activated: [
    'dragon_activated_1',
    'dragon_activated_2',
    'dragon_activated_3',
  ],
  dragon_fire_breath: 'dragon_fire_breath',
  dragon_multiplier_apply: 'dragon_fire_breath_multiplier_apply',
  anticipation_start: 'anticipation_start',

  //gamble page:
  gamble_enter: 'gamble_enter',
  gamble_pick: 'gamble_pick',
  gamble_lose: 'gamble_lose',
  gamble_win: 'gamble_win',
  gamble_deal_cards: 'gamble_deal_cards',
  gamble_flip_card: 'gamble_flip_card',
  swap_cards: ['swap_cards_1', 'swap_cards_2', 'swap_cards_3'],
  stack_shuffle_short: 'stack_shuffle_short',
  stack_shuffle_long: 'stack_shuffle_long',

  //freespin page
  freespin_enter: 'freespin_enter',
  freespin_ambience: 'ambience_fire_loop',
  freespin_exit: 'freespin_exit',
  dragon_panel_freespin_highlight: 'dragon_panel_freespin_highlight',
  dragon_panel_multiplier_highlight: 'dragon_panel_multiplier_highlight',

  //Music-fx is music but played as individual sound.
  music_fx_freespin_keno: 'music_free_keno',
  music_fx_freespin_game: 'music_free_game',
  music_fx_gamble_game: 'music_gamble',
};

const modes = {
  none: {
    keno_idle: 0,
    keno_active: 0,
    game_spinning: 0,
    game_winning: 0,
    gamble_query: 0,
  },

  keno_idle: {
    keno_idle: 1,
    keno_active: 0,
    game_spinning: 0,
    game_winning: 0,
    gamble_query: 0,
  },
  keno_active: {
    keno_idle: 1,
    keno_active: 1,
    game_spinning: 0,
    game_winning: 0,
    gamble_query: 0,
  },
  game_spinning: {
    keno_idle: 1,
    keno_active: 1,
    game_spinning: 1,
    game_winning: 0,
    gamble_query: 0,
  },
  game_winning: {
    keno_idle: 1,
    keno_active: 1,
    game_spinning: 1,
    game_winning: 1,
    gamble_query: 0,
  },
  gamble_query: {
    keno_idle: 1,
    keno_active: 1,
    game_spinning: 0,
    game_winning: 0,
    gamble_query: 1,
  },
};

export const FX_DEFS: fx.FxJsonFile = {
  handlers: {
    sound: {
      type: 'SoundHandler',
      assets: assets,
    },

    music: {
      type: 'MusicHandler',
      sync_bpm: 120,
      sync_hits_per_beat: 1,
      tracks: {
        keno_idle: 'music_base_keno_idle',
        keno_active: 'music_base_keno_active',
        game_spinning: 'music_base_spinning',
        game_winning: 'music_base_winning',
        gamble_query: 'music_base_gamble_query',
      },
      modes: modes,
    },
  },

  events: {
    //Musics
    music_mute_all: music('none', {fade: 0.5}),
    music_keno_idle: music('keno_idle', {fade: 0.5}),
    music_keno_active: music('keno_active', {fade: 0.5}),
    music_game_spinning: music('game_spinning', {fade: 1.5}),
    music_game_winning: music('game_winning', {fade: 0.5}),
    music_gamble_query: music('gamble_query', {fade: 1.5}),

    music_freespin_keno: [
      music('none', {fade: 2}),
      sound('music_fx_freespin_keno', {fade: 2, loop: true}),
    ],
    music_freespin_game: [
      music('none', {fade: 2}),
      stopSound('music_fx_freespin_keno', {fade: 2}),
      sound('music_fx_freespin_game', {fade: 2, loop: true}),
    ],
    music_gamble: [
      music('none', {fade: 2}),
      sound('music_fx_gamble_game', {fade: 2, loop: true}),
    ],

    //FX
    fx_button_ui: sound('button_normal'),
    fx_button_press: sound('button_press'),
    fx_button_release: sound('button_release'),

    //Un-used
    fx_add_money: sound('add_money'),

    //Gamble game
    fx_gamble_enter: sound('gamble_enter'),
    fx_gamble_pick: sound('gamble_pick'),
    fx_gamble_lose: sound('gamble_lose'),
    fx_gamble_win: sound('gamble_win'),
    fx_gamble_exit: [
      stopSound('music_fx_gamble_game', {fade: 0.5}),
      music('game_spinning', {fade: 0.5}),
    ],
    fx_swap_cards: sound('swap_cards'),
    fx_gamble_deal_cards: sound('gamble_deal_cards'),
    fx_gamble_flip_card: sound('gamble_flip_card'),

    fx_payout: sound('payout'),
    fx_reveal_cards: sound('reveal_cards'),
    fx_scroll_wins: sound('button_press'),

    fx_select_cards: sound('select_cards'),
    fx_set_bet_0: sound('set_bet_0'),
    fx_set_bet_1: sound('set_bet_1'),
    fx_set_bet_2: sound('set_bet_2'),
    fx_set_bet_3: sound('set_bet_3'),
    fx_set_bet_4: sound('set_bet_4'),

    fx_set_volume: sound('set_volume'),

    // win scroller
    fx_winsum_scrolling_start: sound('basic_win_scrolling_loop', {loop: true}),
    fx_winsum_noscroll: sound('win_small'),
    fx_winsum_small: sound('win_medium'),
    fx_winsum_big: sound('win_big'),
    fx_win_highlight: sound('win_highlight'),
    fx_winsum_scrolling_stop_small: [
      sound('win_scroll_end_small'),
      stopSound('basic_win_scrolling_loop', {fade: 0.05}),
    ],
    fx_winsum_scrolling_stop_big: [
      sound('win_scroll_end_big'),
      stopSound('win_big_rising', {fade: 0.2}),
      stopSound('basic_win_scrolling_loop', {fade: 0.05}),
    ],

    fx_winsum_stop_all: [
      stopSound('win_big_rising', {fade: 0.2}),
      stopSound('basic_win_scrolling_loop', {fade: 0.05}),
    ],

    fx_winsum_scrolling_bg_start: sound('win_big_rising'),
    fx_end_win_text_appears_0: sound('win_highlight'),
    fx_end_win_text_appears_1: sound('win_highlight'),
    fx_end_win_text_appears_2: sound('end_win_text_appears_1'),
    fx_end_win_text_appears_3: sound('end_win_text_appears_2'),

    //Keno-page
    fx_empty: [],
    fx_enter_game: sound('enter_game'),
    fx_keno_mode_enter: sound('keno_mode_enter'),
    fx_keno_card_select: sound('keno_card_select'),
    fx_keno_unselect: sound('keno_unselect'),
    fx_keno_select_max: sound('keno_select_max'),
    fx_keno_auto_select: sound('keno_auto_select'),
    fx_keno_to_hand: sound('keno_to_hand'),
    //Game page
    fx_collect_cards: sound('collect_cards'),
    fx_stack_slide_left: sound('stack_slide_left'),
    fx_stack_slide_right: sound('stack_slide_right'),
    fx_card_deal: sound('card_deal'),
    fx_card_win_1: sound('card_win_1'),
    fx_card_win_2: sound('card_win_2'),
    fx_card_win_3: sound('card_win_3'),
    fx_card_win_4: sound('card_win_4'),
    fx_card_win_5: sound('card_win_5'),
    fx_card_win_6: sound('card_win_6'),
    fx_dragon_activated: sound('dragon_activated'),
    fx_dragon_fire_breath: sound('dragon_fire_breath'),
    fx_dragon_multiplier_apply: sound('dragon_multiplier_apply'),

    fx_anticipation_start: sound('anticipation_start'),
    fx_stack_shuffle_short: sound('stack_shuffle_short'),
    fx_stack_shuffle_long: sound('stack_shuffle_long'),

    //freespin-page
    fx_freespin_enter: sound('freespin_enter'),
    fx_freespin_ambience: sound('freespin_ambience', {loop: true}),
    fx_freespin_exit: [
      sound('freespin_exit'),
      stopSound('music_fx_freespin_game', {fade: 3}),
      stopSound('freespin_ambience', {fade: 3}),
      music('gamble_query', {fade: 2}),
    ],
    fx_freespin_activation: sound('dragon_panel_freespin_highlight'),
    fx_multiplier_activation: sound('dragon_panel_multiplier_highlight'),
  },
};
