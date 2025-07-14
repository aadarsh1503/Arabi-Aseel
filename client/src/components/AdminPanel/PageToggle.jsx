// src/PageToggle.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * A futuristic, stylish toggle switch for navigating between Menu and Chef pages.
 * Features a sliding, glowing indicator and micro-interactions for a premium feel.
 * The design uses a vibrant red gradient against a sleek, dark/light background.
 *
 * @param {object} props - The component props.
 * @param {'menu' | 'chef'} props.activePage - The currently active page.
 */
const PageToggle = ({ activePage }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigate = (page) => {
    if (page === activePage) return;

    if (page === 'menu') {
      navigate('/admin');
    } else if (page === 'chef') {
      navigate('/chef');
    }
  };

  const buttonBaseClasses =
    'relative z-10 w-1/2 rounded-full py-2.5 text-center text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-900';

  return (
    <div className="relative flex w-64 items-center rounded-full bg-gray-200 p-1 shadow-inner dark:bg-black/20 dark:shadow-none">
      
      {/* The Sliding, Glowing Indicator */}
      <span
        className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] 
                   rounded-full bg-gradient-to-r from-red-600 to-rose-500 
                   shadow-md shadow-red-500/30
                   transition-transform duration-300 ease-in-out
                   ${activePage === 'chef' ? 'translate-x-full' : 'translate-x-0'}
                   
                  
                   w-[calc(50%-0.25rem)]
                   `}
        aria-hidden="true"
      />

      {/* Menu Button */}
      <button
        onClick={() => handleNavigate('menu')}
        className={`${buttonBaseClasses} ${
          activePage === 'menu'
            ? 'text-white'
            : 'text-gray-700 hover:text-black dark:text-black dark:hover:text-white'
        }`}
        aria-current={activePage === 'menu'}
      >
        {t('Menu')}
      </button>

      {/* Chef Button */}
      <button
        onClick={() => handleNavigate('chef')}
        className={`${buttonBaseClasses} ${
          activePage === 'chef'
            ? 'text-white'
            : 'text-gray-700 hover:text-black dark:text-black dark:hover:text-white'
        }`}
        aria-current={activePage === 'chef'}
      >
        {t('Chef')}
      </button>
    </div>
  );
};

export default PageToggle;