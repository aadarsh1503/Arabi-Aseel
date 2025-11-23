// src/PageToggle.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PageToggle = ({ activePage }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Defined Tabs
  const tabs = [
    { id: 'menu', label: 'Menu', path: '/admin' },
    { id: 'chef', label: 'Chef', path: '/chef' },
    { id: 'spin_game', label: 'Spin_Game', path: '/spin-admin' }, // IDs are lowercase for safer matching
  ];

  const handleNavigate = (path, id) => {
    // Simple normalization for comparison
    if (id.toLowerCase() === String(activePage).toLowerCase()) return;
    navigate(path);
  };

  // --- THE FIX ---
  // 1. Normalize activePage to a string and lowercase it to prevent mismatch
  const currentId = String(activePage).toLowerCase();

  // 2. Find index. If activePage is 'Spin_Game', it will match 'spin_game' here.
  const activeIndex = tabs.findIndex((tab) => tab.id === currentId);

  // 3. Fallback: If logic fails, default to 0. But now it shouldn't fail for casing.
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  // 4. Calculate movement: 0% -> 100% -> 200%
  const translatePercentage = safeIndex * 100;
  
  // 5. Apply style manually to guarantee browser sees it
  const transformStyle = {
    transform: `translateX(${isRTL ? '-' : ''}${translatePercentage}%)`,
  };

  return (
    <div className="flex w-full justify-center  py-4">
      {/* Container */}
      <div className="relative flex h-12 w-full max-w-[24rem] items-center outline   rounded-full bg-white p-1.5 shadow-lg shadow-gray-200/50  border-gray-100 ">
        
        {/* The Brown Sliding Indicator */}
        <span
          className="absolute top-1.5 bottom-1.5 left-1
                     w-[calc(33.33%-0.25rem)] 
                     rounded-full bg-[#724F38] 
                     shadow-md 
                     transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={transformStyle}
          aria-hidden="true"
        />

        {/* Buttons */}
        {tabs.map((tab) => {
           const isActive = currentId === tab.id;
           return (
            <button
              key={tab.id}
              onClick={() => handleNavigate(tab.path, tab.id)}
              className={`relative z-10 w-1/3 rounded-full text-sm font-bold transition-colors duration-200
                ${
                  isActive
                    ? 'text-white' 
                    : 'text-black hover:text-gray-800 '
                }
              `}
            >
              {t(tab.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PageToggle;