import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n'; // Import the i18n setup where language and direction are managed

const DirectionContext = createContext();

export const DirectionProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en'; // Default language is English
    });

    // Toggle language and direction based on selected language
    const toggleLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);

        // Change the language in i18n
        i18n.changeLanguage(newLanguage);
    };

    return (
        <DirectionContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </DirectionContext.Provider>
    );
};

export const useDirection = () => useContext(DirectionContext); // Custom hook to access context
