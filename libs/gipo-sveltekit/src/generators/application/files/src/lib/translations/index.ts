import I18n from 'sveltekit-i18n';

import lang from './lang.json';

export const defaultLocale = 'en';

const config = {
  // fallbackLocale: 'en',
  translations: {
    en: { lang },
    it: { lang },
  },
  loaders: [
    {
      locale: 'it',
      key: 'home',
      routes: ['/'],
      loader: async () => {
        const json = await import('./it/home.json');
        return json;
      },
    },
    {
      locale: 'en',
      key: 'home',
      routes: ['/'],
      loader: async () => {
        const json = await import('./en/home.json');
        return json;
      },
    },
  ],
};

export const {
  t,
  loading,
  locales,
  locale,
  loadTranslations,
  addTranslations,
  translations,
  setLocale,
  setRoute,
} = new I18n(config);

loading.subscribe(
  ($loading) =>
    $loading && console.log('Loading translations for the main instance...')
);
