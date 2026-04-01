export type Translations = {
  loading_progress: string;
  loading_complete: string;
  freespin_counter_description: string;
  freespin_winsum_description: string;
  button_play: string;
  button_payout: string;
  button_menu: string;
  button_paytable: string;
  button_gamble: string;
  button_collect: string;
  freespin_popup_content_1: string;
  freespin_popup_content_2: string;
  gamestudioLogo: string;
  selection_info: string;
  gamble_query: string;
  gamble_info: string;
  gamble_win: string;
  gamble_lose: string;
  gamble_win_exceeds_max: string;
  basegame_win_exceeds_max: string;
  win_scroll_level_0: string;
  win_scroll_level_1: string;
  win_scroll_level_2: string;
  win_scroll_level_3: string;
  paytable_count: string;
  paytable_win: string;
  loader_info: string;
};

export type TranslationsMap = {
  fi_FI: Translations;
  en_GB: Translations;
  sv_SE: Translations;
};

export const TRANSLATIONS: TranslationsMap = {
  fi_FI: {
    loading_progress: '{ffffff}ladataan...',
    loading_complete: '{233c06}KÄYNNISTÄ',
    freespin_counter_description: '{15383f}vapaapelit',
    freespin_winsum_description: '{15383f}voitot yhteensä',
    button_play: 'Pelaa',
    button_payout: 'Voiton-\nmaksu',
    button_menu: 'Peli-\nvalikko',
    button_paytable: 'Voitto-\ntaulu',
    button_gamble: 'Tuplaa',
    button_collect: 'Voitot\ntalteen',
    freespin_popup_content_1: `VOITIT ${v('freespin_spins')}`,
    freespin_popup_content_2: 'VAPAAPELIÄ',
    gamestudioLogo: 'game_studio_logo_fi',
    selection_info: `Valitse ${v('selection_amount')} korttia`,
    gamble_query:
      '{e2ad8d}Voitit {ff9a17}{{winsum}}{e2ad8d}. Tuplaa tai\n' +
      'ota voitot talteen.',
    gamble_info:
      '{e2ad8d}Voitat {ff9a17}{{gamble}}{e2ad8d} jos löydät\n' +
      'arvoltaan suuremman kortin.',
    gamble_win: '{e2ad8d}Voitit {ff9a17}{{winsum}}{e2ad8d}!',
    gamble_lose: '{e2ad8d}Ei voittoa. Parempi onni ensi kerralla.',
    gamble_win_exceeds_max:
      '{dcdcdc}Voitit {ffcb00}{{winsum}}{dcdcdc}!\n' +
      'Voitto on liian iso tuplattavaksi.',
    basegame_win_exceeds_max:
      '{dcdcdc}Onneksi olkoon! Voitit {ffcb00}{{winsum}}{dcdcdc}.\n' +
      'Voitto on liian iso tuplattavaksi.',
    win_scroll_level_0: 'ISO VOITTO',
    win_scroll_level_1: 'MEGAVOITTO',
    win_scroll_level_2: 'JÄTTIVOITTO',
    win_scroll_level_3: 'EEPPINEN VOITTO',
    paytable_count: 'Osumia',
    paytable_win: 'Voitto',
    loader_info:
      '{e2ad8d}Lohikäärmekortti voi jopa ' +
      '{ffe260}{{max_multiplier}}{e2ad8d}-kertaistaa voittosi.',
  },
  sv_SE: {
    loading_progress: '{ffffff}spelet startas...',
    loading_complete: '{233c06}STARTA',
    freespin_counter_description: '{15383f}frispel',
    freespin_winsum_description: '{15383f}vinster',
    button_play: 'Spela',
    button_payout: 'Utbetal-\nning',
    button_menu: 'Spelmeny',
    button_paytable: 'Vinstplan',
    button_collect: 'Ta\nvinsten',
    button_gamble: 'Dubbla',
    freespin_popup_content_1: `Du har vunnit ${v('freespin_spins')}`,
    freespin_popup_content_2: 'frispel!',
    gamestudioLogo: 'game_studio_logo_en',
    selection_info: `Välj ${v('selection_amount')} kort`,
    gamble_query:
      '{e2ad8d}Du vann {ff9a17}{{winsum}}{e2ad8d}.\n' +
      'Dubbla eller ta vinsten.',
    gamble_info:
      '{e2ad8d}Du vinner {ff9a17}{{gamble}}{e2ad8d} om du hittar\n' +
      'ett kort med högre värde.',
    gamble_win: '{e2ad8d}Du vann {ff9a17}{{winsum}}{e2ad8d}!',
    gamble_lose: '{e2ad8d}Ingen vinst. Bättre tur nästa gång.',
    gamble_win_exceeds_max:
      '{dcdcdc}Du vann {ffcb00}{{winsum}}{dcdcdc}!\n' +
      'Vinsten är för stor att dubbla.',
    basegame_win_exceeds_max:
      '{dcdcdc}Gratulerar! Du vann {ffcb00}{{winsum}}{dcdcdc}.\n' +
      'Vinsten är för stor att dubbla.',
    win_scroll_level_0: 'STOR VINST',
    win_scroll_level_1: 'MEGAVINST',
    win_scroll_level_2: 'SUPERVINST',
    win_scroll_level_3: 'EPIC VINST',
    paytable_count: 'Träffar',
    paytable_win: 'Vinst',
    loader_info:
      '{e2ad8d}Drakkortet kan multiplicera din vinst' +
      ' upp till {ffe260}{{max_multiplier}}x{e2ad8d}.',
  },
  en_GB: {
    loading_progress: '{ffffff}loading...',
    loading_complete: '{233c06}START',
    freespin_counter_description: '{15383f}free games left',
    freespin_winsum_description: '{15383f}wins',
    button_play: 'Play',
    button_payout: 'Pay out',
    button_menu: 'Game menu',
    button_paytable: 'Paytable',
    button_gamble: 'Gamble',
    button_collect: 'Collect',
    freespin_popup_content_1: `You won ${v('freespin_spins')}`,
    freespin_popup_content_2: 'free games!',
    gamestudioLogo: 'game_studio_logo_en',
    selection_info: `Choose ${v('selection_amount')} cards`,
    gamble_query:
      '{e2ad8d}You won {ff9a17}{{winsum}}{e2ad8d}.\n' +
      'Gamble or collect wins.',
    gamble_info:
      '{e2ad8d}You win {ff9a17}{{gamble}}{e2ad8d} if you find\n' +
      'a higher-valued card.',
    gamble_win: '{e2ad8d}You won {ff9a17}{{winsum}}{e2ad8d}!',
    gamble_lose: '{e2ad8d}No win. Better luck next time.',
    gamble_win_exceeds_max:
      '{dcdcdc}You won {ffcb00}{{winsum}}{dcdcdc}!\nWin is too big to gamble.',
    basegame_win_exceeds_max:
      '{dcdcdc}Congratulations! You won {ffcb00}{{winsum}}{dcdcdc}.' +
      '\nWin is too big to gamble.',
    win_scroll_level_0: 'BIG WIN',
    win_scroll_level_1: 'MEGA WIN',
    win_scroll_level_2: 'ULTRA WIN',
    win_scroll_level_3: 'EPIC WIN',
    paytable_count: 'Hits',
    paytable_win: 'Win',
    loader_info:
      '{e2ad8d}Dragon Card can multiply your win ' +
      'up to {ffe260}{{max_multiplier}}x{e2ad8d}.',
  },
};

export type TranslationVariableMap = {
  winsum: string;
  gamble: string;
  max_multiplier: string;
  freespin_spins: string;
  selection_amount: string;
};

function v(key: keyof TranslationVariableMap): string {
  return `{{${key}}}`;
}
