// src/PageToggle.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PageToggle = ({ activePage }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Defined Tabs - Added 'user_logs'
  const tabs = [
    { id: 'menu', label: 'Menu', path: '/admin' },
    { id: 'chef', label: 'Chef', path: '/chef' },
    { id: 'spin_game', label: 'Spin_Game', path: '/spin-admin' }, 
    { id: 'user_logs', label: 'User Logs', path: '/admin/logs' }, // New Tab
  ];

  const handleNavigate = (path, id) => {
    // Simple normalization for comparison
    if (id.toLowerCase() === String(activePage).toLowerCase()) return;
    navigate(path);
  };

  // --- Logic for Active State ---
  const currentId = String(activePage).toLowerCase();
  
  // Find index. If activePage is 'user_logs', it will match index 3.
  const activeIndex = tabs.findIndex((tab) => tab.id === currentId);

  // Fallback to 0 if not found
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  // Calculate movement: 0% -> 100% -> 200% -> 300%
  // (Moves relative to the indicator's own width)
  const translatePercentage = safeIndex * 100;
  
  const transformStyle = {
    transform: `translateX(${isRTL ? '-' : ''}${translatePercentage}%)`,
  };

  return (
    <div className="flex w-full justify-center py-4">
      {/* Container - slightly wider max-width to accommodate 4 items comfortably if needed */}
      <div className="relative flex h-12 w-full max-w-[32rem] items-center outline rounded-full bg-white p-1.5 shadow-lg shadow-gray-200/50 border-gray-100">
        
        {/* The Brown Sliding Indicator */}
        {/* UPDATED: Width changed from 33.33% to 25% for 4 items */}
        <span
          className="absolute top-1.5 bottom-1.5 left-1
                     w-[calc(25%-0.25rem)] 
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
              // UPDATED: Width changed from w-1/3 to w-1/4
              className={`relative z-10 w-1/4 rounded-full text-sm font-bold transition-colors duration-200
                ${
                  isActive
                    ? 'text-white' 
                    : 'text-black hover:text-gray-800'
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