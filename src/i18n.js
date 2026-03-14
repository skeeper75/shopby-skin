import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import resourceKr from './constants/i18n/kr';

const resources = {
  ko: resourceKr,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'ko',
    debug: true,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
