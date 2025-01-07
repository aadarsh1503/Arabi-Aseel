import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

// Get the saved language from local storage or explicitly default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

// If no language is saved in local storage, save 'en' as the default
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'en');
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: savedLanguage, // Use saved language as the initial language
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
