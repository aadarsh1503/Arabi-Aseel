// src/components/ItemModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX, FiLock, FiUnlock , FiChevronDown, FiPlus} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ItemModal = ({ showModal, onClose, editingItem, onSubmit, darkMode, categories, isLoading }) => {
  const initialFormState = {
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
    ],
    categoryOption: 'existing'
  };

  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [enSuggestions, setEnSuggestions] = useState([]);
  const [arSuggestions, setArSuggestions] = useState([]);
  const [showEnSuggestions, setShowEnSuggestions] = useState(false);
  const [showArSuggestions, setShowArSuggestions] = useState(false);
  const categoryWrapperRef = useRef(null);

  useEffect(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const categoryMap = new Map();
      categories.forEach(item => {
        if (item && item.category_name && item.category_name_ar) {
          const key = item.category_name.trim().toLowerCase();
          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              category_name: item.category_name.trim(),
              category_name_ar: item.category_name_ar.trim()
            });
          }
        }
      });
      setUniqueCategories(Array.from(categoryMap.values()));
    }
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(event.target)) {
        setShowEnSuggestions(false);
        setShowArSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showModal) {
      if (editingItem) {
        setForm({
          ...editingItem,
          category_name: editingItem.category_name || '',
          category_name_ar: editingItem.category_name_ar || '',
          key_name: editingItem.key_name || '',
          image_url: editingItem.image_url || '',
          price_type: editingItem.price_type || 'portion',
          price: { 
            Q: editingItem.price_q || '', 
            H: editingItem.price_h || '', 
            F: editingItem.price_f || '' 
          },
          price_per_portion: editingItem.price_per_portion || '',
          translations: editingItem.translations?.length ? editingItem.translations : initialFormState.translations,
          categoryOption: 'existing'
        });
        setPreviewUrl(editingItem.image_url || '');
      } else {
        setForm(initialFormState);
        setPreviewUrl('');
        setImageFile(null);
      }
      setFormErrors({});
      setShowEnSuggestions(false);
      setShowArSuggestions(false);
    }
  }, [editingItem, showModal]);

  const resetForm = () => {
    onClose();
  };
  
  const validateForm = () => {
    const errors = {};
    if (!form.category_name.trim()) errors.category_name = 'Category name (English) is required';
    if (!form.category_name_ar.trim()) errors.category_name_ar = 'Category name (Arabic) is required';
    
    if (form.price_type === 'portion') {
      if (!form.price.Q && !form.price.H && !form.price.F) errors.price = 'At least one price (Q/H/F) is required';
      if (form.price.Q && isNaN(form.price.Q)) errors.priceQ = 'Quarter price must be a number';
      if (form.price.H && isNaN(form.price.H)) errors.priceH = 'Half price must be a number';
      if (form.price.F && isNaN(form.price.F)) errors.priceF = 'Full price must be a number';
    } else {
      if (!form.price_per_portion) errors.price_per_portion = 'Per portion price is required';
      else if (isNaN(form.price_per_portion)) errors.price_per_portion = 'Per portion price must be a number';
    }
    
    form.translations.forEach((t, i) => {
      if (!t.name.trim()) errors[`translation_${i}_name`] = `${t.language.toUpperCase()} name is required`;
    });

    if (!editingItem && !imageFile) errors.image = 'An image upload is required for new items.';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*') || file.size > 2 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: 'Image must be a valid type and under 2MB.' }));
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryOption') {
      setForm(prev => ({ 
        ...prev, 
        categoryOption: value,
        category_name: value === 'new' ? '' : prev.category_name,
        category_name_ar: value === 'new' ? '' : prev.category_name_ar
      }));
      return;
    }
    
    if (name.startsWith('price.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, price: { ...prev.price, [key]: value } }));
    } else if (name.startsWith('translations.')) {
      const [_, index, field] = name.split('.');
      setForm(prev => {
        const updatedTranslations = [...prev.translations];
        updatedTranslations[index][field] = value;
        return { ...prev, translations: updatedTranslations };
      });
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    if (name === 'category_name' && form.categoryOption === 'existing') {
      if (value.trim()) {
        const filtered = uniqueCategories.filter(cat =>
          cat.category_name.toLowerCase().includes(value.toLowerCase())
        );
        setEnSuggestions(filtered);
        setShowEnSuggestions(filtered.length > 0);
      } else {
        setShowEnSuggestions(false);
      }
    } else if (name === 'category_name_ar' && form.categoryOption === 'existing') {
      if (value.trim()) {
        const filtered = uniqueCategories.filter(cat =>
          cat.category_name_ar.includes(value)
        );
        setArSuggestions(filtered);
        setShowArSuggestions(filtered.length > 0);
      } else {
        setShowArSuggestions(false);
      }
    }
  };

  const handleEnSuggestionSelect = (category) => {
    setForm(prev => ({
      ...prev,
      category_name: category.category_name,
      category_name_ar: category.category_name_ar
    }));
    setFormErrors(prev => ({ ...prev, category_name: undefined, category_name_ar: undefined }));
    setShowEnSuggestions(false);
    setShowArSuggestions(false);
  };

  const handleArSuggestionSelect = (category) => {
    setForm(prev => ({
      ...prev,
      category_name: category.category_name, // Update English field
      category_name_ar: category.category_name_ar
    }));
    setShowArSuggestions(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation failed", formErrors);
      return;
    }
    onSubmit(form, imageFile, editingItem?.menu_id);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
        <button 
          onClick={resetForm} 
          className={`absolute ${isRTL ? 'top-4 left-4' : 'top-4 right-4'} p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
        >
          <FiX size={24} />
        </button>
    
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {editingItem ? t('Editing_Item') : t('Add_New_Menu_Item')}
          </h2>
    
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Option Toggle */}
{/* Category Option Toggle */}
<div className="mb-6">
  <label className="block mb-3 font-medium text-lg">{t('Category_Type')}*</label>
  <div className="flex space-x-4">
    <button
      type="button"
      onClick={() => setForm(prev => ({ ...prev, categoryOption: 'existing' }))}
      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
        form.categoryOption === 'existing'
          ? `${darkMode ? 'border-purple-500 bg-purple-900/30' : 'border-purple-500 bg-purple-100'} shadow-md`
          : `${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`
      }`}
    >
      <FiChevronDown className={form.categoryOption === 'existing' ? 'text-purple-500' : ''} />
      <span>{t('Existing_Category')}</span>
    </button>
    <button
      type="button"
      onClick={() => setForm(prev => ({ ...prev, categoryOption: 'new' }))}
      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
        form.categoryOption === 'new'
          ? `${darkMode ? 'border-pink-500 bg-pink-900/30' : 'border-pink-500 bg-pink-100'} shadow-md`
          : `${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`
      }`}
    >
      <FiPlus className={form.categoryOption === 'new' ? 'text-pink-500' : ''} />
      <span>{t('New_Category')}</span>
    </button>
  </div>
</div>

            {/* Category Fields */}
            <div ref={categoryWrapperRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Category */}
              <div className="relative">
                <label className="block mb-2 font-medium">{t('Category_Name_English')}*</label>
                {form.categoryOption === 'existing' ? (
                  <div className="relative">
                    <div
                      className={`w-full p-3 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      } ${
                        formErrors.category_name ? 'border-red-500' : ''
                      } flex items-center justify-between cursor-pointer`}
                      onClick={() => setShowEnSuggestions(!showEnSuggestions)}
                    >
                      <span>{form.category_name || t('Select_Category')}</span>
                      <FiChevronDown className={`transition-transform duration-200 ${showEnSuggestions ? 'rotate-180' : ''}`} />
                    </div>
                    {showEnSuggestions && (
                      <ul className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}>
                        {uniqueCategories.map((cat, index) => (
                          <li
                            key={`en-${index}`}
                            onClick={() => handleEnSuggestionSelect(cat)}
                            className={`p-3 cursor-pointer ${
                              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            } border-b ${
                              darkMode ? 'border-gray-700' : 'border-gray-200'
                            } last:border-0`}
                          >
                            <div className="font-medium">{cat.category_name}</div>
                            <div className="text-sm opacity-70">{cat.category_name_ar}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <input
                    name="category_name"
                    value={form.category_name}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder={t('Enter_New_Category')}
                    className={`w-full p-3 rounded-lg border-2 ${
                      darkMode ? 'bg-gray-700 border-pink-500/50' : 'bg-white border-pink-300'
                    } ${
                      formErrors.category_name ? 'border-red-500' : 'focus:border-pink-500'
                    }`}
                    required
                  />
                )}
                {formErrors.category_name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.category_name}</p>
                )}
              </div>

              {/* Arabic Category */}
              <div className="relative">
  <label className="block mb-2 font-medium">{t('Category_Name_Arabic')}*</label>
  {form.categoryOption === 'existing' ? (
    <div className="relative">
      <div
        className={`w-full p-3 rounded-lg border-2 ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        } ${
          formErrors.category_name_ar ? 'border-red-500' : ''
        } flex items-center justify-between cursor-pointer`}
        onClick={() => setShowArSuggestions(!showArSuggestions)}
      >
        <span>{form.category_name_ar || t('Select_Category')}</span>
        <FiChevronDown className={`transition-transform duration-200 ${showArSuggestions ? 'rotate-180' : ''}`} />
      </div>
      {showArSuggestions && (
        <ul className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
          darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {uniqueCategories.map((cat, index) => (
            <li
              key={`ar-${index}`}
              onClick={() => handleArSuggestionSelect(cat)}
              className={`p-3 cursor-pointer ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } last:border-0`}
            >
              <div className="font-medium">{cat.category_name_ar}</div>
              <div className="text-sm opacity-70">{cat.category_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : (
    <input
      name="category_name_ar"
      value={form.category_name_ar}
      onChange={handleChange}
      autoComplete="off"
      placeholder={t('Enter_Arabic_Category')}
      className={`w-full p-3 rounded-lg border-2 ${
        darkMode ? 'bg-gray-700 border-pink-500/50' : 'bg-white border-pink-300'
      } ${
        formErrors.category_name_ar ? 'border-red-500' : 'focus:border-pink-500'
      }`}
      required
    />
  )}
  {formErrors.category_name_ar && (
    <p className="text-red-500 text-xs mt-1">{formErrors.category_name_ar}</p>
  )}
</div>

            </div>
  
            {/* Image Upload */}
            <div>
              <label className="block mb-2 font-medium">{t('Item_Image')}*</label>
              <div className="flex items-center space-x-4">
                <label className={`flex-1 p-3 rounded-lg border-2 ${
                  darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-white border-gray-300 hover:border-gray-400'
                } transition-colors duration-300 cursor-pointer text-center`}>
                  {imageFile ? t('File_Selected') : t('Choose_File')}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
              {previewUrl && (
                <div className="mt-4 flex justify-center">
                  <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-lg border mx-auto" />
                </div>
              )}
            </div>
  
            {/* Pricing Type */}
            <div className="mb-4">
              <label className="block mb-3 font-medium text-lg">{t('Pricing_Type')}*</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="price_type" 
                    value="portion" 
                    checked={form.price_type === 'portion'} 
                    onChange={handleChange} 
                    className="mr-2 ml-2 h-5 w-5 accent-purple-500" 
                  /> 
                  <span>{t('Q_H_F')}</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="price_type" 
                    value="per_portion" 
                    checked={form.price_type === 'per_portion'} 
                    onChange={handleChange} 
                    className="mr-2 ml-2 h-5 w-5 accent-pink-500" 
                  /> 
                  <span>{t('Per_Portion')}</span>
                </label>
              </div>
            </div>
  
            {/* Pricing Fields */}
            {form.price_type === 'portion' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-medium">{t('Quarter_Price')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">Q</span>
                    <input 
                      name="price.Q" 
                      value={form.price.Q} 
                      onChange={handleChange} 
                      placeholder={t('Placeholder_Quarter_Price')} 
                      className={`w-full p-3 pl-8 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      } ${
                        formErrors.priceQ ? 'border-red-500' : 'focus:border-purple-500'
                      } transition-colors duration-300`} 
                    />
                  </div>
                  {formErrors.priceQ && <p className="text-red-500 text-xs mt-1">{formErrors.priceQ}</p>}
                </div>
                <div>
                  <label className="block mb-2 font-medium">{t('Half_Price')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">H</span>
                    <input 
                      name="price.H" 
                      value={form.price.H} 
                      onChange={handleChange} 
                      placeholder={t('Placeholder_Half_Price')} 
                      className={`w-full p-3 pl-8 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      } ${
                        formErrors.priceH ? 'border-red-500' : 'focus:border-purple-500'
                      } transition-colors duration-300`} 
                    />
                  </div>
                  {formErrors.priceH && <p className="text-red-500 text-xs mt-1">{formErrors.priceH}</p>}
                </div>
                <div>
                  <label className="block mb-2 font-medium">{t('Full_Price')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">F</span>
                    <input 
                      name="price.F" 
                      value={form.price.F} 
                      onChange={handleChange} 
                      placeholder={t('Placeholder_Full_Price')} 
                      className={`w-full p-3 pl-8 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      } ${
                        formErrors.priceF ? 'border-red-500' : 'focus:border-purple-500'
                      } transition-colors duration-300`} 
                    />
                  </div>
                  {formErrors.priceF && <p className="text-red-500 text-xs mt-1">{formErrors.priceF}</p>}
                </div>
                {formErrors.price && <p className="text-red-500 text-xs col-span-3">{formErrors.price}</p>}
              </div>
            ) : (
              <div>
                <label className="block mb-2 font-medium">{t('Per_Portion_Price')}*</label>
                <input 
                  name="price_per_portion" 
                  value={form.price_per_portion} 
                  onChange={handleChange} 
                  className={`w-full p-3 rounded-lg border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } ${
                    formErrors.price_per_portion ? 'border-red-500' : 'focus:border-pink-500'
                  } transition-colors duration-300`} 
                  required 
                />
                {formErrors.price_per_portion && <p className="text-red-500 text-xs mt-1">{formErrors.price_per_portion}</p>}
              </div>
            )}
  
            {/* Translations */}
            {form.translations.map((translation, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border-2 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <h3 className="font-medium mb-3 text-lg">{translation.language.toUpperCase()} {t('Version')}*</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">{t('Name')}*</label>
                    <input 
                      name={`translations.${i}.name`} 
                      value={translation.name} 
                      onChange={handleChange} 
                      className={`w-full p-3 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      } ${
                        formErrors[`translation_${i}_name`] ? 'border-red-500' : 'focus:border-purple-500'
                      } transition-colors duration-300`} 
                      required 
                    />
                    {formErrors[`translation_${i}_name`] && <p className="text-red-500 text-xs mt-1">{formErrors[`translation_${i}_name`]}</p>}
                  </div>
                  <div>
                    <label className="block mb-2">{t('Description')}</label>
                    <textarea 
                      name={`translations.${i}.description`} 
                      value={translation.description} 
                      onChange={handleChange} 
                      rows={3} 
                      className={`w-full p-3 rounded-lg border-2 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      } focus:border-purple-500 transition-colors duration-300`} 
                    />
                  </div>
                </div>
              </div>
            ))}
  
            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <button 
                type="button" 
                onClick={resetForm} 
                disabled={isLoading} 
                className={`px-6 py-3 ml-2 rounded-xl border-2 ${
                  darkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                } transition-colors duration-300 ${isLoading ? 'opacity-50' : ''}`}
              >
                {t('Cancel')}
              </button>
              <button 
                type="submit" 
                disabled={isLoading} 
                className={`px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 transition-all duration-300 flex items-center justify-center min-w-[140px] ${
                  isLoading ? 'opacity-80' : 'shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  editingItem ? t('Update_Item') : t('Add_Item')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;