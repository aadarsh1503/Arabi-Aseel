import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.svg';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
    { path: '/categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', label: 'Categories' },
    { path: '/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Products' },
  ];

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="hidden md:flex md:flex-shrink-0"
    >
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-amber-600">
          <img className="h-8 w-auto" src={logo} alt="Arabiaseel" />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${
                    location.pathname === item.path
                      ? 'text-amber-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;