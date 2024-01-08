// import {
//     defaultLocale,
//     loadTranslations,
//     locales,
//     translations,
// } from '$lib/translations';

import type { LayoutServerLoad } from './$types';

// {
// url,
// cookies,
// request,
// }
export const load = async function load() {
  // const { pathname } = url;
  // // Try to get the locale from cookie
  // let locale = (cookies.get('lang') || '').toLowerCase();
  // // Get user preferred locale
  // if (!locale) {
  //   locale = `${`${request.headers.get('accept-language')}`.match(
  //     /[A-Za-z]+?(?=-|_|,|;)/
  //   )}`.toLowerCase();
  // }
  // // Get defined locales
  // const supportedLocales = locales.get().map((l) => l.toLowerCase());
  // // Use default locale if current locale is not supported
  // if (!supportedLocales.includes(locale)) {
  //   locale = defaultLocale;
  // }
  // await loadTranslations(locale, pathname); // keep this just before the `return`
  // return {
  //   i18n: { locale, route: pathname },
  //   translations: translations.get(), // `translations` on server contain all translations loaded by different clients
  // };
} satisfies LayoutServerLoad;
