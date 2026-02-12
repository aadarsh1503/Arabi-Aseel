// src/PageToggle.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PageToggle = ({ activePage }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // We don't need isRTL for the logic anymore because the container is forced 'ltr'

  const tabs = [
    { id: 'menu', label: 'Menu', path: '/admin' },
    { id: 'chef', label: 'Chef', path: '/chef' },
    { id: 'spin_game', label: 'Spin_Game', path: '/spin-admin' }, 
    { id: 'user_logs', label: 'User_Logs', path: '/admin/logs' },
    { id: 'registrations', label: 'Registrations', path: '/admin/registrations' },
    { id: 'database', label: 'Database', path: '/admin/database' },
  ];

  const handleNavigate = (path, id) => {
    if (id.toLowerCase() === String(activePage).toLowerCase()) return;
    navigate(path);
  };

  const currentId = String(activePage).toLowerCase();
  
  const activeIndex = tabs.findIndex((tab) => tab.id === currentId);
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  const translatePercentage = safeIndex * 100;
  
  // FIX: Removed the `${isRTL ? '-' : ''}` check. 
  // Since the parent is dir='ltr', we always want to move positive X (to the right).
  const transformStyle = {
    transform: `translateX(${translatePercentage}%)`,
  };

  return (
    <div dir='ltr' className="flex w-full justify-center py-4">
      <div dir='ltr' className="relative flex h-12 w-full max-w-[39rem] items-center outline rounded-full bg-white p-1.5 shadow-lg shadow-gray-200/50 border-gray-100">
        
        {/* The Brown Sliding Indicator */}
        <span
          dir='ltr'
          className="absolute top-1.5 bottom-1.5 left-3
                     w-[calc(16.666%-0.25rem)] 
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
              dir='ltr'
              key={tab.id}
              onClick={() => handleNavigate(tab.path, tab.id)}
              className={`relative z-10 w-1/6 rounded-full text-xs font-bold transition-colors duration-200
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