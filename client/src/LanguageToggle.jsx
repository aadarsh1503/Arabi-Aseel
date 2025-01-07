import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = (lang) => {
    console.log(`Changing language to: ${lang}`); // Log the language change
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // Save selected language to local storage
  };

  return (
    <div>
      {currentLanguage === 'en' ? (
        <button onClick={() => toggleLanguage('ar')}>عربی</button>
      ) : (
        <button onClick={() => toggleLanguage('en')}>English</button>
      )}
    </div>
  );
};

export default LanguageToggle;
