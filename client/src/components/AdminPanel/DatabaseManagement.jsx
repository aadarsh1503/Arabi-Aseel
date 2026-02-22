import React, { useState, useEffect } from 'react';
import { FiDownload, FiMoon, FiSun, FiLogOut, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from 'react-loader-spinner';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';
import PageToggle from './PageToggle';
import LogoutModal from './LogoutModal';
import { useAuth } from '../Authcontext/Authcontext';

const BASEURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DatabaseManagement = () => {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [version, setVersion] = useState('1.0.0');
  const [showVersionEdit, setShowVersionEdit] = useState(false);
  const { logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    fetchVersion();
  }, []);

  const fetchVersion = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASEURL}/api/settings/version`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVersion(data.version);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  const updateVersion = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${BASEURL}/api/settings/version`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ version })
      });
      toast.success(t('version_updated'));
      setShowVersionEdit(false);
    } catch (error) {
      toast.error(t('version_update_failed'));
    }
  };

  // Export all data as Excel
  const exportAllAsExcel = async () => {
    try {
      setLoading(true);
      toast.info(t('preparing_export'));
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASEURL}/api/database/export-all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const responseData = await response.json();
      const data = responseData.data;

      const workbook = XLSX.utils.book_new();

      // Add each table as a sheet
      Object.entries(data.tables).forEach(([tableName, tableData]) => {
        if (tableData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(tableData);
          XLSX.utils.book_append_sheet(workbook, worksheet, tableName.substring(0, 31)); // Excel sheet name limit
        }
      });

      // Add statistics sheet
      const statsSheet = XLSX.utils.json_to_sheet([data.statistics]);
      XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');

      XLSX.writeFile(workbook, `ArabiAseel_Complete_Database_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success(t('export_success'));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('export_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Puff color={darkMode ? "#a78bfa" : "#8b5cf6"} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      <LogoutModal 
        show={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={logout} 
        darkMode={darkMode} 
      />

      <div className="max-w-7xl mx-auto">
        <div dir='ltr'>
          <PageToggle activePage="database" darkMode={darkMode} />
        </div>

        {/* Header Actions */}
        <div className="flex justify-end items-center mb-8 mt-0 lg:-mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full shadow transition-all hover:scale-110 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900 shadow hover:scale-110"
            >
              <FiLogOut size={20} className="text-red-600 dark:text-red-300" />
            </button>
          </div>
        </div>

        {/* Version Management Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">⚙️ {t('version_management')}</h2>
            {!showVersionEdit && (
              <button
                onClick={() => setShowVersionEdit(true)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 /> {t('edit_version')}
              </button>
            )}
          </div>

          {showVersionEdit ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">{t('current_version')}</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  placeholder="1.0.0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={updateVersion}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <FiSave /> {t('save_version')}
                </button>
                <button
                  onClick={() => setShowVersionEdit(false)}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <FiX /> {t('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>{t('current_version')}:</strong> v{version}</p>
            </div>
          )}
        </div>

        {/* Export Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-8 mb-6`}>
          <div className="text-center">
            <div className="mb-6">
              <FiDownload className="mx-auto text-[#724F38]" size={64} />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">📊 {t('export_complete_database')}</h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {t('download_all_data')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">🍽️</div>
                <div className="font-semibold">{t('menu_items')}</div>
                <div className="text-sm text-gray-500">{t('all_dishes_prices')}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">🏷️</div>
                <div className="font-semibold">{t('categories')}</div>
                <div className="text-sm text-gray-500">{t('menu_categories')}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">👨‍🍳</div>
                <div className="font-semibold">{t('chefs')}</div>
                <div className="text-sm text-gray-500">{t('chef_profiles')}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">🎟️</div>
                <div className="font-semibold">{t('Registrations')}</div>
                <div className="text-sm text-gray-500">{t('customer_coupons')}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">🎡</div>
                <div className="font-semibold">{t('spin_logs')}</div>
                <div className="text-sm text-gray-500">{t('game_history')}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">{t('statistics')}</div>
                <div className="text-sm text-gray-500">{t('summary_data')}</div>
              </div>
            </div>

            <button
              onClick={exportAllAsExcel}
              disabled={loading}
              className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold mx-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FiDownload size={24} />
              {loading ? t('preparing_export') : t('download_database_excel')}
            </button>

            <p className="text-sm text-gray-500 mt-4">
              {t('excel_note')}
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className="text-xl font-bold mb-4">ℹ️ {t('whats_included')}</h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>{t('menu_items')}:</strong> {t('menu_items_desc')}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>{t('categories')}:</strong> {t('categories_desc')}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>{t('chefs')}:</strong> {t('chefs_desc')}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>{t('Registrations')}:</strong> {t('registrations_desc')}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>{t('spin_logs')}:</strong> {t('spin_logs_desc')}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>{t('statistics')}:</strong> {t('statistics_desc')}
              </div>
            </div>
          </div>
        </div>

        {/* Version Footer */}
        <div className="bg-black text-center mt-8 py-4 rounded-lg">
          <p className="text-white text-sm">
            {t('restaurant_name')} v{version}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagement;
