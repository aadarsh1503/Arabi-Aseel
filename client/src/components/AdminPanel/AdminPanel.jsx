import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiAlertTriangle, FiFilter, FiMoon, FiSun, FiGrid, FiList, FiLogOut, FiDownload } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puff } from 'react-loader-spinner';
import { redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const AdminPanel = ({ onLogout }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [statusLoading, setStatusLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState('latest');
  const [suggestions, setSuggestions] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState({
    edit: null,
    delete: null,
    submit: false
  });
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();


  // Toggle language for a specific item
  const toggleLanguage = (menuId) => {
    setCategoryLanguage(prev => ({
      ...prev,
      [menuId]: prev[menuId] === 'en' ? 'ar' : 'en'
    }));
  };
  // Form state with validation
  const [form, setForm] = useState({
    category_name: '',
    category_name_ar: '',
    key_name: '',
    image_url: '',
    price: { Q: '', H: '', F: '' },
    price_type: 'portion',
    price_per_portion: '',
    translations: [
      { language: 'en', name: '', description: '' },
      { language: 'ar', name: '', description: '' }
    ]
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categoryLanguage, setCategoryLanguage] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    notify.info('Logged out successfully');
    navigate('/login');
  };

  // Configure toast notifications
  const notify = {
    success: (message) => toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: darkMode ? 'dark' : 'light',
    }),
    error: (message) => toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: darkMode ? 'dark' : 'light',
    }),
    info: (message) => toast.info(message, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: darkMode ? 'dark' : 'light',
    }),
    warning: (message) => toast.warning(message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: darkMode ? 'dark' : 'light',
    })
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!form.category_name.trim()) {
      errors.category_name = 'Category name (English) is required';
    }
    
    if (form.price_type === 'portion') {
      if (!form.price.Q && !form.price.H && !form.price.F) {
        errors.price = 'At least one price (Q/H/F) is required';
      } else {
        if (form.price.Q && isNaN(form.price.Q)) errors.priceQ = 'Quarter price must be a number';
        if (form.price.H && isNaN(form.price.H)) errors.priceH = 'Half price must be a number';
        if (form.price.F && isNaN(form.price.F)) errors.priceF = 'Full price must be a number';
      }
    } else {
      if (!form.price_per_portion) {
        errors.price_per_portion = 'Per portion price is required';
      } else if (isNaN(form.price_per_portion)) {
        errors.price_per_portion = 'Per portion price must be a number';
      }
    }
    
    form.translations.forEach((translation, index) => {
      if (!translation.name.trim()) {
        errors[`translation_${index}_name`] = `${translation.language.toUpperCase()} name is required`;
      }
    });
    
    if (!editingId && !imageFile && !form.image_url) {
      errors.image = 'Either upload an image or provide an image URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch initial data
  const hasShownToast = useRef(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://arabi-aseel-1.onrender.com/api/admin/menu');
      const data = res.data;
      
      setItems(data);
      setFilteredItems(data);
      setCategories([...new Set(data.map(item => item.category_name))]);
      
      if (!hasShownToast.current) {
        notify.success('Menu loaded successfully');
        hasShownToast.current = true;
      }
    } catch (err) {
      console.error("Error fetching data:", err.message);
      if (!hasShownToast.current) {
        notify.error(`Failed to load menu: ${err.message}`);
        hasShownToast.current = true;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...items];
    
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category_name === selectedCategory);
    }
    
    if (availabilityFilter !== 'all') {
      result = result.filter(item => item.status === availabilityFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.key_name?.toLowerCase().includes(query)) ||
        (item.category_name?.toLowerCase().includes(query)) ||
        item.translations?.some(t => 
          t.name?.toLowerCase().includes(query) || 
          t.description?.toLowerCase().includes(query)
        )
      );
    }
    
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => (a.price_q || 0) - (b.price_q || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price_q || 0) - (a.price_q || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.key_name.localeCompare(b.key_name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.key_name.localeCompare(a.key_name));
        break;
      case 'latest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      default:
        break;
    }
    
    setFilteredItems(result);
  }, [items, selectedCategory, availabilityFilter, searchQuery, sortOption]);

  // Search suggestions
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`https://arabi-aseel-1.onrender.com/api/admin/menu/search?query=${searchQuery}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        notify.error('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        notify.error('Image size should be less than 2MB');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name.startsWith('price.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, price: { ...prev.price, [key]: value } }));
      setFormErrors(prev => ({ ...prev, [`price${key}`]: undefined }));
    } else if (name.startsWith('translations.')) {
      const [_, index, field] = name.split('.');
      setForm(prev => {
        const updatedTranslations = [...prev.translations];
        updatedTranslations[index][field] = value;
        return { ...prev, translations: updatedTranslations };
      });
      setFormErrors(prev => ({ ...prev, [`translation_${index}_${field}`]: undefined }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setForm({
      category_name: '',
      category_name_ar: '',
      key_name: '',
      image_url: '',
      price: { Q: '', H: '', F: '' },
      price_type: 'portion',
      price_per_portion: '',
      translations: [
        { language: 'en', name: '', description: '' },
        { language: 'ar', name: '', description: '' }
      ]
    });
    setEditingId(null);
    setImageFile(null);
    setPreviewUrl('');
    setShowModal(false);
    setFormErrors({});
    setButtonLoading({
      edit: null,
      delete: null,
      submit: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Object.values(formErrors).forEach(error => {
        notify.warning(error);
      });
      return;
    }
    
    setButtonLoading(prev => ({ ...prev, submit: true }));
    
    try {
      const formData = new FormData();
      formData.append('category_name', form.category_name);
      formData.append('category_name_ar', form.category_name_ar || '');
      formData.append('key_name', form.key_name);
      formData.append('price_type', form.price_type);
      
      if (form.price_type === 'per_portion') {
        formData.append('price', JSON.stringify({ 
          per_portion: form.price_per_portion 
        }));
      } else {
        formData.append('price', JSON.stringify({ 
          Q: form.price.Q, 
          H: form.price.H, 
          F: form.price.F 
        }));
      }
      
      formData.append('translations', JSON.stringify(form.translations));
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.image_url && !editingId) {
        formData.append('image_url', form.image_url);
      } else if (editingId) {
        formData.append('current_image_url', form.image_url);
      }

      if (editingId) {
        await axios.put(
          `https://arabi-aseel-1.onrender.com/api/admin/menu/${editingId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        notify.success('Item updated successfully ✏️');
      } else {
        await axios.post(
          'https://arabi-aseel-1.onrender.com/api/admin/menu',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        notify.success('Item added successfully ✅');
      }

      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
      notify.error(`Failed to save item: ${error.response?.data?.message || error.message}`);
    } finally {
      setButtonLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setButtonLoading(prev => ({ ...prev, delete: id }));
      notify.info('Deleting item... 🚮');
      
      try {
        await axios.delete(`https://arabi-aseel-1.onrender.com/api/admin/menu/${id}`);
        await fetchData();
        if (editingId === id) resetForm();
        notify.success('Item deleted successfully 🗑️');
      } catch (error) {
        console.error('Error deleting item:', error);
        notify.error(`Failed to delete item: ${error.message}`);
      } finally {
        setButtonLoading(prev => ({ ...prev, delete: null }));
      }
    }
  };

  const handleEdit = (item) => {
    setForm({
      category_name: item.category_name,
      category_name_ar: item.category_name_ar || '',
      key_name: item.key_name,
      image_url: item.image_url,
      price_type: item.price_type || 'portion',
      price: { 
        Q: item.price_q, 
        H: item.price_h, 
        F: item.price_f,
        per_portion: item.price_per_portion 
      },
      price_per_portion: item.price_per_portion || '',
      translations: item.translations.map(t => ({
        language: t.language,
        name: t.name,
        description: t.description
      }))
    });
    setEditingId(item.menu_id);
    setPreviewUrl(item.image_url || '');
    setShowModal(true);
    setFormErrors({});
  };

  const handleStatusToggle = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'not available' : 'available';
    setStatusLoading(itemId);
    notify.info('Updating status...');
  
    setItems(prevItems =>
      prevItems.map(item =>
        item.menu_id === itemId ? { ...item, status: newStatus } : item
      )
    );
  
    try {
      await axios.patch(`https://arabi-aseel-1.onrender.com/api/admin/menu/${itemId}/status`, {
        status: newStatus,
      });
      notify.success('Status updated!');
    } catch (error) {
      console.error('Failed to update status:', error);
      notify.error('Failed to update status. Reverting.');
      setItems(prevItems =>
        prevItems.map(item =>
          item.menu_id === itemId ? { ...item, status: currentStatus } : item
        )
      );
    } finally {
      setStatusLoading(null);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.key_name);
    setSuggestions([]);
  };

  // Export to Excel function
  const exportToExcel = () => {
    if (filteredItems.length === 0) {
      notify.warning('No data to export');
      return;
    }

    try {
      // Prepare data for export
      const data = filteredItems.map(item => ({
        'Category (EN)': item.category_name,
        'Category (AR)': item.category_name_ar || '',
        'Name (EN)': item.translations.find(t => t.language === 'en')?.name || '',
        'Name (AR)': item.translations.find(t => t.language === 'ar')?.name || '',
        'Description (EN)': item.translations.find(t => t.language === 'en')?.description || '',
        'Description (AR)': item.translations.find(t => t.language === 'ar')?.description || '',
        'Price Type': item.price_type === 'per_portion' ? 'Per Portion' : 'Q/H/F',
        'Quarter Price': item.price_q || '',
        'Half Price': item.price_h || '',
        'Full Price': item.price_f || '',
        'Per Portion Price': item.price_per_portion || '',
        'Status': item.status === 'available' ? 'Available' : 'Not Available',
        'Created At': new Date(item.created_at).toLocaleString(),
        'Image URL': item.image_url || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Menu Items");
      
      // Generate file name with current date
      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `Arabi_Aseel_Menu_${dateStr}.xlsx`);
      
      notify.success('Export started successfully');
    } catch (error) {
      console.error('Export failed:', error);
      notify.error('Failed to export data');
    }
  };

  return (
    <div dir='ltr' className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        style={{ zIndex: 9999 }}
      />
      
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl flex flex-col items-center`}>
            <Puff
              height={80}
              width={80}
              radius={1}
              color={darkMode ? "#a78bfa" : "#8b5cf6"}
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <p className="mt-4 text-lg font-medium">
              {editingId ? 'Updating item...' : 'Processing your request...'}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Menu Admin Panel
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} shadow transition-all hover:scale-110`}
              title={viewMode === 'grid' ? 'List View' : 'Grid View'}
            >
              {viewMode === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} shadow transition-all hover:scale-110`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={exportToExcel}
              className={`p-2 rounded-full ${darkMode ? 'bg-green-800 hover:bg-green-700' : 'bg-green-100 hover:bg-green-200'} shadow transition-all hover:scale-110`}
              title="Export to Excel"
            >
              <FiDownload size={20} className={darkMode ? 'text-green-300' : 'text-green-600'} />
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`p-2 rounded-full ${darkMode ? 'bg-red-900 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'} shadow transition-all hover:scale-110`}
              title="Logout"
            >
              <FiLogOut size={20} className={darkMode ? 'text-red-300' : 'text-red-600'} />
            </button>
            {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center   backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiAlertTriangle className={`text-2xl mr-3 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-500'
                  }`} />
                  <h3 className={`text-xl font-bold ${
                    darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    Confirm Logout
                  </h3>
                </div>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <FiX className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>

              {/* Body */}
              <p className={`mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Are you sure you want to log out? Any unsaved changes may be lost.
              </p>

              {/* Footer */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-all shadow-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>

        <div className={`sticky top-0 z-10 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg mb-6 p-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              {suggestions.length > 0 && (
                <div className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer hover:${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <div className="font-medium">{item.key_name}</div>
                      <div className="text-sm opacity-70">{item.category_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative">
  <select
    value={availabilityFilter}
    onChange={(e) => setAvailabilityFilter(e.target.value)}
    className={`pl-4 pr-10 py-2 w-full rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500`}
  >
    <option value="all">All Availability</option>
    <option value="available">Available Only</option>
    <option value="not available">Not Available Only</option>
  </select>
</div>
          </div>
        </div>

        {/* Add Item Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-pink-600 transition-all"
          >
            <FiPlus />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Status Bar */}
        <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex justify-between items-center`}>
          <div>
            Showing <span className="font-bold">{filteredItems.length}</span> items
            {selectedCategory !== 'all' && (
              <span> in <span className="font-bold">{selectedCategory}</span></span>
            )}
            {searchQuery && (
              <span> matching <span className="font-bold">"{searchQuery}"</span></span>
            )}
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-8 shadow-inner">
            <Puff
              height={80}
              width={80}
              radius={1}
              color={darkMode ? "#a78bfa" : "#8b5cf6"}
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <p className="mt-4 text-lg font-medium text-purple-600 dark:text-purple-300">
              Loading menu items...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please wait while we fetch the latest data
            </p>
          </div>
        )}

        {error && (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-100'} text-red-700 ${darkMode ? 'text-red-100' : 'text-red-700'}`}>
            Error loading data: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h3 className="text-xl font-medium mb-2">No items found</h3>
            <p className="opacity-70">Try adjusting your filters or add a new item</p>
          </div>
        )}

        {/* Items Grid/List */}
        {filteredItems.length > 0 && (
  <div className="space-y-8">
    {/* Group items by category */}
    {[...new Set(filteredItems.map(item => item.category_name))]
      .filter(category => 
        filteredItems.some(item => item.category_name === category)
      )
      .map(category => (
        <div key={category}>
          {/* Category Heading */}
          <h2 className={`text-2xl font-bold mb-4 pb-2 border-b ${
  darkMode ? 'border-amber-200/30' : 'border-amber-200'
}`}>
  {isRTL && category.category_name_ar 
    ? category.category_name_ar 
    : category}
</h2>

          {/* Items Grid */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-5'}>
            
            {filteredItems
              .filter(item => item.category_name === category)
              .map(item => (
                <div
                  key={item.menu_id}
                  className={`rounded-xl overflow-hidden border transition-all duration-300
                    ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                    ${viewMode === 'list' ? 'flex' : ''} 
                    ${item.status === 'not available' ? 'opacity-60 saturate-50' : ''}
                    shadow-sm hover:shadow-md`}
                >
              {/* Image */}
              {item.image_url && (
                <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full'} relative`}>
                  <img
                    src={item.image_url}
                    alt={item.key_name}
                    className={`w-full ${viewMode === 'list' ? 'h-full' : 'h-48'} object-cover`}
                  />
                </div>
              )}
              
              {/* Content */}
              <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''} flex flex-col`}>
                {/* Header with language toggle */}
                <div className="flex justify-between items-center gap-2 mb-3">
                  
                <div className={`px-2.5 py-1 text-sm rounded-full 
  ${darkMode ? 'bg-purple-900/80 text-purple-200' : 'bg-[#724F38] text-white'}`}>
  Category: {categoryLanguage[item.menu_id] === 'en' 
    ? item.category_name 
    : item.category_name_ar || item.category_name}
</div>
                  {/* Language toggle button */}
                  <button 
                    onClick={() => toggleLanguage(item.menu_id)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors
                      ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                      text-xs font-medium`}
                    title={`Switch to ${categoryLanguage[item.menu_id] === 'en' ? 'Arabic' : 'English'}`}
                  >
                    {categoryLanguage[item.menu_id] === 'en' ? 'AR' : 'EN'}
                  </button>
                </div>
                
                {/* Rest of the content remains the same */}
                {/* Prices */}
                {item.price_type === 'per_portion' ? (
 <span className="inline-block w-fit px-2.5 mb-4 py-1 text-sm rounded-full bg-[#724F38] text-white">
 Per Portion: BHD {item.price_per_portion}
</span>

) : (
  <div className="flex flex-wrap mb-4 gap-2"> {/* FLEX ROW ADDED */}
    {item.price_q && (
      <span className="px-2.5 py-1 text-sm rounded-full bg-[#724F38] text-white">
        Q: BHD {item.price_q}
      </span>
    )}
    {item.price_h && (
      <span className="px-2.5 py-1 text-sm rounded-full bg-[#724F38] text-white">
        H: BHD {item.price_h}
      </span>
    )}
    {item.price_f && (
      <span className="px-2.5 py-1 text-sm rounded-full bg-[#724F38] text-white">
        F: BHD {item.price_f}
      </span>
    )}
  </div>
)}

                {/* Details */}
                <div className="mb-4 break-words">
                  <span className={`font-medium ${darkMode ? 'text-gray-200 text-sm' : 'text-gray-700 text-sm'}`}>
                    Name:
                  </span> {item.translations.find(t => t.language === 'en')?.name || 'N/A'}
                 
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'} `}>
                    <span className={`font-medium  ${darkMode ? 'text-gray-200' : 'text-gray-700'} `}>
                      Description:
                    </span> {item.translations.find(t => t.language === 'en')?.description || 'N/A'}
                  </p>
                  
                  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
                    <h4 className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                      Arabic Details
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Name:</span> {item.translations.find(t => t.language === 'ar')?.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} `}>
                      <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description:</span> {item.translations.find(t => t.language === 'ar')?.description}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className={`mt-auto flex justify-end space-x-2 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-2">
    <button
      onClick={() => handleStatusToggle(item.menu_id, item.status)}
      disabled={statusLoading === item.menu_id}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
        item.status === 'available' ? 'bg-green-500' : 'bg-gray-600'
      } ${statusLoading === item.menu_id ? 'cursor-not-allowed' : ''}`}
      title={item.status === 'available' ? 'Mark as Not Available' : 'Mark as Available'}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          item.status === 'available' ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {statusLoading === item.menu_id && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-3 h-3 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
    <span className={`text-xs font-medium ${item.status === 'available' ? 'text-green-400' : 'text-gray-400'}`}>
      {item.status === 'available' ? 'Live' : 'Hidden'}
    </span>
  </div>
                  <button
                    onClick={() => handleEdit(item)}
                    disabled={buttonLoading.edit === item.menu_id}
                    className={`p-2 rounded-lg transition-colors
                      ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                      ${buttonLoading.edit === item.menu_id ? 'cursor-not-allowed opacity-70' : ''}`}
                    title="Edit"
                  >
                    {buttonLoading.edit === item.menu_id ? (
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiEdit2 size={18} className={`${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.menu_id)}
                    disabled={buttonLoading.delete === item.menu_id}
                    className={`p-2 rounded-lg transition-colors
                      ${darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'}
                      ${buttonLoading.delete === item.menu_id ? 'cursor-not-allowed opacity-70' : ''}`}
                    title="Delete"
                  >
                    {buttonLoading.delete === item.menu_id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiTrash2 size={18} className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`} />
                    )}
                  </button>
                </div>
              </div>
              </div>
              ))}
          </div>
        </div>
      ))}
  </div>
)}

        {/* Add/Edit Modal */}
        {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <button
        onClick={resetForm}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <FiX size={24} />
      </button>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          {editingId ? `Editing Item` : 'Add New Menu Item'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block mb-1 font-medium">Category Name (English)*</label>
              <input
                list="category-options"
                name="category_name"
                value={form.category_name}
                onChange={handleChange}
                placeholder="English category name"
                className={`w-full p-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } ${formErrors.category_name ? 'border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
              {formErrors.category_name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.category_name}</p>
              )}
              <datalist id="category-options">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Category Name (Arabic)*</label>
              <input
                name="category_name_ar"
                placeholder="Arabic category name"
                value={form.category_name_ar}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } ${formErrors.category_name_ar ? 'border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
              {formErrors.category_name_ar && (
                <p className="text-red-500 text-xs mt-1">{formErrors.category_name_ar}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Item Image*</label>
            {!editingId && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {editingId ? 'Change image (optional)' : 'Upload an image or provide URL'}
              </p>
            )}
            <div className="flex items-center space-x-4">
              <label className={`flex-1 p-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } cursor-pointer text-center`}>
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {/* <span className="text-gray-500 dark:text-gray-400">or</span>
              <input
                type="text"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="Image URL"
                className={`flex-1 p-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } ${formErrors.image ? 'border-red-500' : ''}`}
              /> */}
            </div>
            {formErrors.image && (
              <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>
            )}
            
            {(previewUrl || form.image_url) && (
              <div className="mt-4">
                <img
                  src={previewUrl || form.image_url}
                  alt="Preview"
                  className="h-32 object-contain rounded-lg border mx-auto"
                />
                {imageFile && (
                  <p className="text-center text-sm mt-1">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Pricing Type*</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="price_type"
                  value="portion"
                  checked={form.price_type === 'portion'}
                  onChange={() => setForm({...form, price_type: 'portion'})}
                  className="mr-2"
                  required
                />
                Quarter/Half/Full
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="price_type"
                  value="per_portion"
                  checked={form.price_type === 'per_portion'}
                  onChange={() => setForm({...form, price_type: 'per_portion'})}
                  className="mr-2"
                  required
                />
                Per Portion
              </label>
            </div>
            {formErrors.price_type && (
              <p className="text-red-500 text-xs mt-1">{formErrors.price_type}</p>
            )}
          </div>
          
          {form.price_type === 'portion' ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Quarter Price*</label>
                <input
                  name="price.Q"
                  value={form.price.Q}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } ${formErrors.priceQ ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.priceQ && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.priceQ}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Half Price*</label>
                <input
                  name="price.H"
                  placeholder="Price"
                  value={form.price.H}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } ${formErrors.priceH ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.priceH && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.priceH}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Full Price*</label>
                <input
                  name="price.F"
                  placeholder="Price"
                  value={form.price.F}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } ${formErrors.priceF ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.priceF && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.priceF}</p>
                )}
              </div>
              {(formErrors.price && !form.price.Q && !form.price.H && !form.price.F) && (
                <p className="text-red-500 text-xs col-span-3">{formErrors.price}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-medium">Per Portion Price*</label>
              <input
                name="price_per_portion"
                value={form.price_per_portion}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                } ${formErrors.price_per_portion ? 'border-red-500' : ''}`}
                required
              />
              {formErrors.price_per_portion && (
                <p className="text-red-500 text-xs mt-1">{formErrors.price_per_portion}</p>
              )}
            </div>
          )}
          
          {form.translations.map((t, i) => (
            <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="font-medium mb-2">{t.language.toUpperCase()} Version*</h3>
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Name*</label>
                  <input
                    name={`translations.${i}.name`}
                    placeholder={`Name (${t.language})`}
                    value={t.name}
                    onChange={handleChange}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } ${formErrors[`translation_${i}_name`] ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors[`translation_${i}_name`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors[`translation_${i}_name`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-1">Description*</label>
                  <textarea
                    name={`translations.${i}.description`}
                    placeholder={`Description (${t.language})`}
                    value={t.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    } ${formErrors[`translation_${i}_description`] ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors[`translation_${i}_description`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors[`translation_${i}_description`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={buttonLoading.submit}
              className={`px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } ${buttonLoading.submit ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={buttonLoading.submit}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 flex items-center justify-center min-w-[120px]"
            >
              {buttonLoading.submit ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : editingId ? (
                'Update Item'
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default AdminPanel;