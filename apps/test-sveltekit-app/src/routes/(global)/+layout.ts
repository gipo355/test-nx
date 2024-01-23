// export const prerender = true;
// export const csr = false;
// export const ssr = false;

import { redirect } from '@sveltejs/kit';
// import { addTranslations, setLocale, setRoute } from '$lib/translations';

export const load = async function load({ url }) {
  if (url.pathname === '/login') {
    redirect(307, '/');
  }
  // const { i18n, translations } = data;
  // const { locale, route } = i18n;
  // addTranslations(translations);
  // await setRoute(route);
  // await setLocale(locale);
  // return i18n;
};
