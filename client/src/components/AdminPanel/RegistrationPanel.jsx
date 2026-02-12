import React, { useState, useEffect } from 'react';
import { FiDownload, FiCheck, FiX, FiSearch, FiMoon, FiSun, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { Puff } from 'react-loader-spinner';
import * as XLSX from 'xlsx';
import api from '../../api/axiosConfig';
import PageToggle from './PageToggle';
import LogoutModal from './LogoutModal';
import { useAuth } from '../Authcontext/Authcontext';

const RegistrationPanel = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    filterRegistrations();
  }, [searchQuery, filterStatus, registrations]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/registration/all');
      setRegistrations(response.data.data);
      toast.success('Registrations loaded successfully');
    } catch (error) {
      toast.error('Failed to load registrations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];

    // Filter by status
    if (filterStatus === 'used') {
      filtered = filtered.filter(reg => reg.is_used);
    } else if (filterStatus === 'unused') {
      filtered = filtered.filter(reg => !reg.is_used);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reg =>
        reg.name.toLowerCase().includes(query) ||
        reg.email.toLowerCase().includes(query) ||
        reg.coupon_code.toLowerCase().includes(query) ||
        reg.mobile.includes(query)
      );
    }

    setFilteredData(filtered);
  };

  const markAsUsed = async (id) => {
    try {
      await api.patch(`/registration/${id}/use`);
      toast.success('Coupon marked as used');
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to update coupon status');
    }
  };

  const deleteRegistration = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete registration for "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/registration/${id}`);
        toast.success('Registration deleted successfully');
        fetchRegistrations();
      } catch (error) {
        toast.error('Failed to delete registration');
        console.error(error);
      }
    }
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const data = filteredData.map(reg => ({
      'Name': reg.name,
      'Mobile': reg.mobile,
      'Email': reg.email,
      'Address Title': reg.address_title,
      'City': reg.address_city,
      'Block': reg.address_block,
      'Coupon Code': reg.coupon_code,
      'Coupon Type': reg.coupon_type,
      'Used': reg.is_used ? 'Yes' : 'No',
      'Used At': reg.used_at ? new Date(reg.used_at).toLocaleString() : '',
      'Registered At': new Date(reg.created_at).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `Registrations_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success('Export started');
  };

  const downloadCSV = async () => {
    try {
      const response = await api.get('/registration/export/csv', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registrations_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to download CSV');
    }
  };

  const stats = {
    total: registrations.length,
    used: registrations.filter(r => r.is_used).length,
    unused: registrations.filter(r => !r.is_used).length,
    freeMeal: registrations.filter(r => r.coupon_type === 'FREE_MEAL').length,
    discount: registrations.filter(r => r.coupon_type === 'DISCOUNT_50').length
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
          <PageToggle activePage="registrations" darkMode={darkMode} />
        </div>

        {/* Header Actions */}
        <div className="flex justify-end items-center mb-8 mt-0 lg:-mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full shadow transition-all hover:scale-110 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={exportToExcel}
              className="p-2 rounded-full bg-green-100 dark:bg-green-800 shadow hover:scale-110"
              title="Export to Excel"
            >
              <FiDownload size={20} className="text-green-600 dark:text-green-300" />
            </button>
            <button
              onClick={downloadCSV}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 shadow hover:scale-110"
              title="Download CSV"
            >
              <FiDownload size={20} className="text-blue-600 dark:text-blue-300" />
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900 shadow hover:scale-110"
              title="Logout"
            >
              <FiLogOut size={20} className="text-red-600 dark:text-red-300" />
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">Total Registrations</p>
            <p className="text-2xl font-bold text-[#724F38]">{stats.total}/100</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">Used Coupons</p>
            <p className="text-2xl font-bold text-green-600">{stats.used}</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">Unused Coupons</p>
            <p className="text-2xl font-bold text-orange-600">{stats.unused}</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">Free Meals</p>
            <p className="text-2xl font-bold text-purple-600">{stats.freeMeal}</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-sm text-gray-500">50% Discounts</p>
            <p className="text-2xl font-bold text-blue-600">{stats.discount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className={`sticky top-0 z-10 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg mb-6 p-4`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, coupon code, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-[#724F38]`}
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`pl-4 pr-10 py-2 w-full rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-[#724F38]`}
              >
                <option value="all">All Coupons</option>
                <option value="used">Used Coupons</option>
                <option value="unused">Unused Coupons</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Coupon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((reg) => (
                    <tr key={reg.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{reg.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">📱 {reg.mobile}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{reg.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{reg.address_title}</div>
                        <div className="text-sm text-gray-500">{reg.address_city}, Block {reg.address_block}</div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="bg-gray-100  text-white dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
                          {reg.coupon_code}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          reg.coupon_type === 'FREE_MEAL' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {reg.coupon_type === 'FREE_MEAL' ? '🍽️ Free Meal' : '💰 50% Off'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {reg.is_used ? (
                          <div>
                            <span className="flex items-center text-green-600 text-sm font-semibold">
                              <FiCheck className="mr-1" /> Used
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(reg.used_at).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="flex items-center text-orange-600 text-sm font-semibold">
                            <FiX className="mr-1" /> Unused
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {!reg.is_used && (
                            <button
                              onClick={() => markAsUsed(reg.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                            >
                              Mark Used
                            </button>
                          )}
                          <button
                            onClick={() => deleteRegistration(reg.id, reg.name)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors flex items-center gap-1"
                            title="Delete Registration"
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegistrationPanel;
