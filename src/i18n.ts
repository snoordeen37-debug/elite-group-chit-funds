import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ta from './locales/ta.json';

// Retrieve saved language from localStorage or default to English ('en')
const savedLanguage =
  typeof window !== 'undefined'
    ? localStorage.getItem('elite_chit_lang') || 'en'
    : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ta: {
        translation: ta,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already protects against XSS attacks
    },
  });

// Persist language selection and keep the HTML lang attribute in sync
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('elite_chit_lang', lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
