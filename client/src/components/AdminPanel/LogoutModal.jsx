// src/components/LogoutModal.jsx
import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const LogoutModal = ({ show, onClose, onConfirm, darkMode }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiAlertTriangle className={`text-2xl mr-3 ml-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Confirm Logout</h3>
            </div>
            <button onClick={onClose} className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <FiX className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          </div>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to log out?
          </p>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className={`px-4 py-2 ml-3  rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4  py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-md">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;