// src/AdminPanel.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { FiSearch, FiPlus, FiX, FiFilter, FiMoon, FiSun, FiGrid, FiList, FiLogOut, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puff } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import LogoutModal from './LogoutModal';
import ItemCard from './ItemCard';
import ItemModal from './ItemModal';
import { useTranslation } from 'react-i18next';
// Import the new components


// Toast Notification Configuration
const notify = {
  success: (message, darkMode) => toast.success(message, { theme: darkMode ? 'dark' : 'light' }),
  error: (message, darkMode) => toast.error(message, { theme: darkMode ? 'dark' : 'light' }),
  info: (message, darkMode) => toast.info(message, { theme: darkMode ? 'dark' : 'light' }),
  warning: (message, darkMode) => toast.warning(message, { theme: darkMode ? 'dark' : 'light' }),
};

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Modals and Forms
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Loading states for actions
  const [statusLoading, setStatusLoading] = useState(null);
  const [buttonLoading, setButtonLoading] = useState({ edit: null, delete: null, submit: false });
  
  const navigate = useNavigate();
  const hasShownToast = useRef(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Fetch initial data
  const fetchData = async () => {
    try {
      !hasShownToast.current && setLoading(true);
      const res = await axios.get('https://arabi-aseel-1.onrender.com/api/admin/menu');
      setItems(res.data);
      setCategories([...new Set(res.data.map(item => item.category_name))]);
      if (!hasShownToast.current) {
        notify.success('Menu loaded successfully', darkMode);
        hasShownToast.current = true;
      }
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError(err.message);
      if (!hasShownToast.current) {
        notify.error(`Failed to load menu: ${err.message}`, darkMode);
        hasShownToast.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Memoized filtered items
  const normalizeArabic = (str = '') =>
    str.replace(/\u0640/g, '') // Remove Tatweel (ـ)
       .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]/g, '') // Remove Arabic diacritics
  
  const filteredItems = useMemo(() => {
    return items
      .filter(item => selectedCategory === 'all' || item.category_name === selectedCategory)
      .filter(item => availabilityFilter === 'all' || item.status === availabilityFilter)
      .filter(item => {
        if (!searchQuery) return true;
        const query = normalizeArabic(searchQuery.toLowerCase());
        const enName = item.translations?.find(t => t.language.toLowerCase() === 'en')?.name?.toLowerCase() || '';
        const arName = normalizeArabic(item.translations?.find(t => t.language.toLowerCase() === 'ar')?.name?.toLowerCase() || '');
        return enName.includes(query) || arName.includes(query) || item.category_name?.toLowerCase().includes(query);
      });
  }, [items, searchQuery, selectedCategory, availabilityFilter]);
  
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notify.info('Logged out successfully', darkMode);
    navigate('/login');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setButtonLoading(prev => ({ ...prev, delete: id }));
      try {
        await axios.delete(`https://arabi-aseel-1.onrender.com/api/admin/menu/${id}`);
        notify.success('Item deleted successfully', darkMode);
        setItems(prev => prev.filter(item => item.menu_id !== id));
      } catch (error) {
        notify.error(`Failed to delete item: ${error.message}`, darkMode);
      } finally {
        setButtonLoading(prev => ({ ...prev, delete: null }));
      }
    }
  };

  const handleStatusToggle = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'not available' : 'available';
    setStatusLoading(itemId);
    setItems(prev => prev.map(item => item.menu_id === itemId ? { ...item, status: newStatus } : item));
    try {
      await axios.patch(`https://arabi-aseel-1.onrender.com/api/admin/menu/${itemId}/status`, { status: newStatus });
      notify.success('Status updated!', darkMode);
    } catch (error) {
      notify.error('Failed to update status. Reverting.', darkMode);
      setItems(prev => prev.map(item => item.menu_id === itemId ? { ...item, status: currentStatus } : item));
    } finally {
      setStatusLoading(null);
    }
  };
  
  const handleFormSubmit = async (form, imageFile, editingId) => {
    setButtonLoading(prev => ({ ...prev, submit: true }));
    const formData = new FormData();
    
    // Append all form data
    formData.append('category_name', form.category_name);
    formData.append('category_name_ar', form.category_name_ar);
    formData.append('price_type', form.price_type);
    formData.append('translations', JSON.stringify(form.translations));
    
    if (form.price_type === 'per_portion') {
        formData.append('price', JSON.stringify({ per_portion: form.price_per_portion }));
    } else {
        formData.append('price', JSON.stringify(form.price));
    }

    if (imageFile) {
        formData.append('image', imageFile);
    } else if (editingId) {
        formData.append('current_image_url', form.image_url);
    }

    try {
      if (editingId) {
        await axios.put(`https://arabi-aseel-1.onrender.com/api/admin/menu/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        notify.success('Item updated successfully', darkMode);
      } else {
        await axios.post('https://arabi-aseel-1.onrender.com/api/admin/menu', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        notify.success('Item added successfully', darkMode);
      }
      fetchData(); // Refetch all data to get the latest state
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      notify.error(`Failed to save item: ${error.response?.data?.message || error.message}`, darkMode);
    } finally {
      setButtonLoading(prev => ({ ...prev, submit: false }));
    }
  };
  
  const exportToExcel = () => {
    if (filteredItems.length === 0) {
      notify.warning('No data to export', darkMode);
      return;
    }
    const data = filteredItems.map(item => ({
      'Category (EN)': item.category_name, 'Category (AR)': item.category_name_ar,
      'Name (EN)': item.translations.find(t => t.language === 'en')?.name,
      'Name (AR)': item.translations.find(t => t.language === 'ar')?.name,
      'Price Type': item.price_type, 'Q Price': item.price_q, 'H Price': item.price_h, 'F Price': item.price_f,
      'Portion Price': item.price_per_portion, 'Status': item.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Menu");
    XLSX.writeFile(workbook, `Arabi_Aseel_Menu_${new Date().toISOString().slice(0, 10)}.xlsx`);
    notify.success('Export started', darkMode);
  };


  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <LogoutModal show={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onConfirm={handleLogout} darkMode={darkMode} />
      
      <ItemModal
        showModal={showModal}
        onClose={() => { setShowModal(false); setEditingItem(null); }}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        darkMode={darkMode}
        categories={categories}
        isLoading={buttonLoading.submit}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Menu Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')} className={`p-2  ml-4 rounded-full shadow transition-all hover:scale-110 ${darkMode ? 'bg-gray-700' : 'bg-white'}`} title={viewMode === 'grid' ? 'List View' : 'Grid View'}>
              {viewMode === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full shadow transition-all hover:scale-110 ${darkMode ? 'bg-gray-700' : 'bg-white'}`} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button onClick={exportToExcel} className="p-2 rounded-full bg-green-100 dark:bg-green-800 shadow hover:scale-110" title="Export to Excel">
              <FiDownload size={20} className="text-green-600 dark:text-green-300" />
            </button>
            <button onClick={() => setShowLogoutConfirm(true)} className="p-2 rounded-full bg-red-100 dark:bg-red-900 shadow hover:scale-110" title="Logout">
              <FiLogOut size={20} className="text-red-600 dark:text-red-300" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`sticky top-0 z-10 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg mb-6 p-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative"><FiSearch className="absolute left-3 top-3 text-gray-400" /><input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-10 pr-4 py-2 w-full rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-purple-500`} /></div>
            <div className="relative"><FiFilter className="absolute left-3 top-3 text-gray-400" /><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={`pl-10 pr-4 py-2 w-full rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-purple-500`}><option value="all">All Categories</option>{categories.map((cat) => {
 const matchedItem = items.find(item => item.category_name === cat);
  return (
    <option key={cat} value={cat}>
      {isRTL ? (matchedItem?.category_name_ar || cat) : cat}
    </option>
  );
})}</select></div>
            <div className="relative"><select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className={`pl-4 pr-10 py-2 w-full rounded-lg border appearance-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-purple-500`}><option value="all">All Availability</option><option value="available">Available</option><option value="not available">Not Available</option></select></div>
          </div>
        </div>
        
        <div className="flex justify-end mb-6">
          <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-pink-600">
            <FiPlus /><span>Add New Item</span>
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
            <div className="flex justify-center items-center h-64"><Puff color={darkMode ? "#a78bfa" : "#8b5cf6"} /></div>
        ) : error ? (
            <div className={`p-4 rounded-lg text-red-700 ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100'}`}>Error: {error}</div>
        ) : filteredItems.length === 0 ? (
            <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}><h3 className="text-xl font-medium">No items found</h3><p>Try adjusting your filters.</p></div>
        ) : (
<div className="space-y-8">
  {[...new Set(filteredItems.map(item => item.category_name))].map(category => {
    const categoryItem = filteredItems.find(item => item.category_name === category);

    return (
      <div key={category}>
        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${darkMode ? 'border-amber-200/30' : 'border-amber-200'}`}>
          {isRTL
            ? categoryItem?.category_name_ar || category
            : category}
        </h2>

        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-5'}>
          {filteredItems.filter(item => item.category_name === category).map(item => (
            <ItemCard 
              key={item.menu_id}
              item={item}
              viewMode={viewMode}
              darkMode={darkMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
              buttonLoading={buttonLoading}
              statusLoading={statusLoading}
            />
          ))}
        </div>
      </div>
    );
  })}
</div>

        )}
      </div>
    </div>
  );
};

export default AdminPanel;