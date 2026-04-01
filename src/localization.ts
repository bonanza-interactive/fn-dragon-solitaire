import {loc} from '@apila/game-libraries';

import {
  TranslationVariableMap,
  Translations,
  TranslationsMap,
} from './config/translations';

//import { LocalizedTextMeta } from './types';

const ns = (translations: Translations): {translations: loc.Resources} => ({
  translations: translations as loc.Resources,
});

export class Localization {
  private cherry: loc.CherryIntl<Translations>;
  private variableMap: TranslationVariableMap = {
    winsum: '0.0',
    gamble: '0.0',
    max_multiplier: '100',
    freespin_spins: '0',
    selection_amount: '2-6',
  };
  constructor(
    translations: TranslationsMap,
    options: loc.CherryOptions = {
      locale: 'fi-FI',
      resources: {
        'fi-FI': ns(translations.fi_FI),
        'en-GB': ns(translations.en_GB),
        'sv-SE': ns(translations.sv_SE),
      },
      logLevel: loc.CherryLogLevel.ERROR,
    },
  ) {
    this.cherry = loc.create<Translations>();
    this.cherry.init(options);
  }

  // public bindNodes(textNodes: BitmapText[]) {
  //   textNodes.forEach((n) => {
  //     const meta = uiRoot.metaCache.get(node.name);
  //     this.cherry.m(n, meta.localizationKey)
  //   });
  // }

  /**
   * Automanage ManagedText object so that whenever the locale
   * changes the o.text is updated accordingly.
   * It is safe to attach object multiple times,
   * but only the latest call to an object is the effective one.
   * @param o
   * @param options
   */
  public bind(
    o: loc.ManagedText,
    localizationKey: keyof Translations,
    options?: loc.TranslatorOptions | undefined,
  ) {
    if (localizationKey) {
      this.cherry.m(o, localizationKey, this.variableMap, options);
    }
  }

  /**
   * Removes automanaged ManagedText object. This should be called
   * if object (for example gfx bitmaptext is removed).
   * @param o
   */
  public unbind(o: loc.ManagedText) {
    this.cherry.d(o);
  }

  public translate(
    o: loc.ManagedText,
    localizationKey: keyof Translations,
    options?: loc.TranslatorOptions | undefined,
  ) {
    o.text = this.cherry.t(localizationKey, this.variableMap, options);
    return o.text;
  }

  public formatValue(
    value: number,
    contextType?: loc.MoneyContextType,
    formatOptions?: loc.MoneyFormatOptions,
  ) {
    return this.cherry.formatMoney(value, contextType, formatOptions);
  }

  public setLocale(locale: 'fi-FI' | 'sv-SE' | 'en-GB') {
    this.cherry.locale = locale;
  }

  public updateVariable(key: keyof TranslationVariableMap, value: string) {
    this.variableMap[key] = value;
  }
}
