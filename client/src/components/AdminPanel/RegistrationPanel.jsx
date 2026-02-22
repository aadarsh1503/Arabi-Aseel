import React, { useState, useEffect } from 'react';
import { FiDownload, FiCheck, FiX, FiSearch, FiMoon, FiSun, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puff } from 'react-loader-spinner';
import * as XLSX from 'xlsx';
import PageToggle from './PageToggle';
import LogoutModal from './LogoutModal';
import { useAuth } from '../Authcontext/Authcontext';

const BASEURL = import.meta.env.VITE_API_BASE_URL || '';

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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASEURL}/api/registration/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setRegistrations(data.data);
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
      const token = localStorage.getItem('authToken');
      await fetch(`${BASEURL}/api/registration/${id}/use`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Coupon marked as used');
      fetchRegistrations();
    } catch (error) {
      toast.error('Failed to update coupon status');
    }
  };

  const deleteRegistration = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete registration for "${name}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('authToken');
        await fetch(`${BASEURL}/api/registration/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
      'Building Number': reg.building_number || '',
      'City': reg.address_city,
      'Postal Code': reg.address_block,
      'Latitude': reg.latitude,
      'Longitude': reg.longitude,
      'Google Maps': reg.latitude && reg.longitude ? `https://www.google.com/maps?q=${reg.latitude},${reg.longitude}` : '',
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
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASEURL}/api/registration/export/csv`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
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
    buy1Get1: registrations.filter(r => r.coupon_type === 'BUY_1_GET_1').length,
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
            <p className="text-sm text-gray-500">Buy 1 Get 1</p>
            <p className="text-2xl font-bold text-purple-600">{stats.buy1Get1}</p>
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
            <table className="w-full min-w-max table-auto">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Mobile</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Coupon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((reg) => (
                    <tr key={reg.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-sm max-w-[150px] truncate" title={reg.name}>
                          {reg.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm">📱 {reg.mobile}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm max-w-[180px] truncate" title={reg.email}>
                          {reg.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm max-w-[200px]">
                          <div className="truncate" title={reg.address_title}>{reg.address_title}</div>
                          {reg.building_number && (
                            <div className="text-gray-500 truncate" title={reg.building_number}>
                              🏢 {reg.building_number}
                            </div>
                          )}
                          <div className="text-gray-500 truncate">
                            {reg.address_city}, {reg.address_block}
                          </div>
                          {reg.latitude && reg.longitude && (
                            <a 
                              href={`https://www.google.com/maps?q=${reg.latitude},${reg.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mt-1"
                            >
                              📍 Map
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <code className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} px-2 py-1 rounded text-xs font-mono`}>
                          {reg.coupon_code}
                        </code>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          reg.coupon_type === 'BUY_1_GET_1' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {reg.coupon_type === 'BUY_1_GET_1' ? '🎁 B1G1' : '💰 50%'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {reg.is_used ? (
                          <div>
                            <span className="flex items-center text-green-600 text-sm font-semibold whitespace-nowrap">
                              <FiCheck className="mr-1" /> Used
                            </span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(reg.used_at).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="flex items-center text-orange-600 text-sm font-semibold whitespace-nowrap">
                            <FiX className="mr-1" /> Unused
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2 flex-nowrap">
                          {!reg.is_used && (
                            <button
                              onClick={() => markAsUsed(reg.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap"
                            >
                              Mark Used
                            </button>
                          )}
                          <button
                            onClick={() => deleteRegistration(reg.id, reg.name)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
                            title="Delete Registration"
                          >
                            <FiTrash2 size={12} /> Delete
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
