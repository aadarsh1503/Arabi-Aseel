import React, { useEffect, useState } from 'react';
import i2 from "./i2.png"
import "./LanguageSwitcher.css";
import { useDirection } from '../DirectionContext';


const LanguageSwitcher = () => {
    const { toggleLanguageAndDirection } = useDirection();
    const [loading, setLoading] = useState(false); // State to manage loader visibility

    useEffect(() => {
        const existingScript = document.getElementById('google-translate-script');
        if (!existingScript) {
            const googleTranslateScript = document.createElement('script');
            googleTranslateScript.id = 'google-translate-script';
            googleTranslateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

            googleTranslateScript.onload = () => {
                console.log("Google Translate script loaded successfully.");
            };

            googleTranslateScript.onerror = (error) => {
                console.error("Failed to load Google Translate script:", error);
            };

            document.body.appendChild(googleTranslateScript);
        } else {
            console.log("Google Translate script already loaded.");
        }

        window.googleTranslateElementInit = () => {
            try {
                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                }, 'google_translate_element');
                console.log("Google Translate initialized.");
            } catch (error) {
                console.error("Error initializing Google Translate:", error);
            }
        };
    }, []);

    const handleLanguageChange = (lang) => {
        try {
            toggleLanguageAndDirection(lang);
            console.log(`Language switched to: ${lang}`);
            setLoading(true); // Show loader
            setTimeout(() => {
                window.location.reload(); // Refresh the page after 3 seconds
            }, 500);
        } catch (error) {
            console.error("Error changing language:", error);
        }
    };

    return (
        <div className="language-switcher  flex gap-2 ">
            {loading && (
                <div className="loader-overlay">
                    <div className="loader-image">
                        <img
                            src={i2} // Replace with your image URL
                            alt="Loading"
                        />
                    </div>
                </div>
            )}
            <div id="google_translate_element"></div>
            <img
                src="https://t3.ftcdn.net/jpg/00/66/61/74/360_F_66617490_w7bC64aJjLgIJc4iBRN1QawdvhV9SVuF.jpg"
                alt="Switch to Arabic"
                onClick={() => handleLanguageChange('ar')}
                className="cursor-pointer w-12 h-auto"
            />
            <img
                src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                alt="Switch to English"
                onClick={() => handleLanguageChange('en')}
                className="cursor-pointer w-12 h-auto"
            />
        </div>
    );
};

export default LanguageSwitcher;
