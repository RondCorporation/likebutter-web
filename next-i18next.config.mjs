// next-i18next.config.mjs

import { i18n } from './i18n.config.mjs';

/** @type {import('next-i18next').UserConfig} */
const config = {
  i18n,
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export default config;
