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

// Update the document direction (ltr or rtl) based on the selected language
const updateDirection = (language) => {
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', direction); // Set direction on page load
};

// Set initial direction when i18n is initialized
updateDirection(savedLanguage);

// Listen for language change to update the direction dynamically
i18n.on('languageChanged', (lng) => {
  updateDirection(lng);
});

export default i18n;
