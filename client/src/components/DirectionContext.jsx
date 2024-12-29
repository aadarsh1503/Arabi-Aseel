import React, { createContext, useContext, useState, useEffect } from 'react';

const DirectionContext = createContext();

export const DirectionProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en'; // Default language is English
    });
    const [direction, setDirection] = useState(() => {
        return localStorage.getItem('direction') || 'ltr'; // Default direction is LTR
    });

    // Toggle language and direction based on selected language
    const toggleLanguageAndDirection = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);

        const newDirection = newLanguage === 'ar' ? 'rtl' : 'ltr';
        setDirection(newDirection);
        localStorage.setItem('direction', newDirection);

        document.documentElement.setAttribute('dir', newDirection); // Update page direction

        // Trigger Google Translate language change
        const selectElem = document.querySelector('#google_translate_element select');
        if (selectElem) {
            selectElem.value = newLanguage;
            selectElem.dispatchEvent(new Event('change', { bubbles: true })); // Trigger the event to switch language
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute('dir', direction); // Set direction on page load
    }, [direction]);

    return (
        <DirectionContext.Provider value={{ language, direction, toggleLanguageAndDirection }}>
            <div dir={direction}>{children}</div>
        </DirectionContext.Provider>
    );
};

export const useDirection = () => useContext(DirectionContext); // Custom hook to access context
