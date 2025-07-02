// src/components/ItemModal.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

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
      // THIS IS THE CORRECTED LINE
      { language: 'ar', name: '', description: '' }
    ]
  };

  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (editingItem) {
      setForm({
        category_name: editingItem.category_name || '',
        category_name_ar: editingItem.category_name_ar || '',
        key_name: editingItem.key_name || '',
        image_url: editingItem.image_url || '',
        price_type: editingItem.price_type || 'portion',
        price: {
          Q: editingItem.price_q || '',
          H: editingItem.price_h || '',
          F: editingItem.price_f || '',
        },
        price_per_portion: editingItem.price_per_portion || '',
        translations: editingItem.translations?.length ? editingItem.translations : initialFormState.translations,
      });
      setPreviewUrl(editingItem.image_url || '');
    } else {
      setForm(initialFormState);
      setPreviewUrl('');
      setImageFile(null);
    }
    setFormErrors({});
  }, [editingItem, showModal]);

  const resetForm = () => {
    setImageFile(null);
    setPreviewUrl('');
    setFormErrors({});
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

    if (!editingItem && !imageFile) {
      errors.image = 'An image upload is required for new items.';
    }
    
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
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: undefined }));

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
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
        console.error("Validation failed", formErrors);
        // You might want a toast notification here for validation errors
        // For example: Object.values(formErrors).forEach(err => toast.error(err));
        return;
    }
    onSubmit(form, imageFile, editingItem?.menu_id);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
        <button onClick={resetForm} className={`absolute ${isRTL ? 'top-4 left-4' : 'top-4 right-4'}  p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}>
          <FiX size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {editingItem ? 'Editing Item' : 'Add New Menu Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium">Category Name (English)*</label>
                    <input list="category-options" name="category_name" value={form.category_name} onChange={handleChange} placeholder="e.g., Main Courses" className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${formErrors.category_name ? 'border-red-500' : ''}`} required />
                    {formErrors.category_name && <p className="text-red-500 text-xs mt-1">{formErrors.category_name}</p>}
                    <datalist id="category-options">
                        {categories.map((cat) => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Category Name (Arabic)*</label>
                    <input name="category_name_ar" value={form.category_name_ar} onChange={handleChange} placeholder="e.g., الأطباق الرئيسية" className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${formErrors.category_name_ar ? 'border-red-500' : ''}`} required />
                    {formErrors.category_name_ar && <p className="text-red-500 text-xs mt-1">{formErrors.category_name_ar}</p>}
                </div>
            </div>

            <div>
                <label className="block mb-1 font-medium">Item Image*</label>
                <div className="flex items-center space-x-4">
                    <label className={`flex-1 p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} cursor-pointer text-center`}>
                        {imageFile ? 'File Selected' : 'Choose File'}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>
                {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
                {previewUrl && <img src={previewUrl} alt="Preview" className="mt-4 h-32 object-contain rounded-lg border mx-auto" />}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-medium">Pricing Type*</label>
                <div className="flex space-x-4">
                    <label className="flex items-center "><input type="radio" name="price_type" value="portion" checked={form.price_type === 'portion'} onChange={handleChange} className="mr-2 ml-2" /> Q/H/F</label>
                    <label className="flex items-center"><input type="radio" name="price_type" value="per_portion" checked={form.price_type === 'per_portion'} onChange={handleChange} className="mr-2 ml-2" /> Per Portion</label>
                </div>
            </div>

            {form.price_type === 'portion' ? (
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Quarter Price</label>
                        <input name="price.Q" value={form.price.Q} onChange={handleChange} placeholder="e.g., 2.5" className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : ''} ${formErrors.priceQ ? 'border-red-500' : ''}`} />
                        {formErrors.priceQ && <p className="text-red-500 text-xs mt-1">{formErrors.priceQ}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Half Price</label>
                        <input name="price.H" value={form.price.H} onChange={handleChange} placeholder="e.g., 5.0" className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : ''} ${formErrors.priceH ? 'border-red-500' : ''}`} />
                        {formErrors.priceH && <p className="text-red-500 text-xs mt-1">{formErrors.priceH}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Full Price</label>
                        <input name="price.F" value={form.price.F} onChange={handleChange} placeholder="e.g., 10.0" className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : ''} ${formErrors.priceF ? 'border-red-500' : ''}`} />
                        {formErrors.priceF && <p className="text-red-500 text-xs mt-1">{formErrors.priceF}</p>}
                    </div>
                    {formErrors.price && <p className="text-red-500 text-xs col-span-3">{formErrors.price}</p>}
                </div>
            ) : (
                <div>
                    <label className="block mb-1 font-medium">Per Portion Price*</label>
                    <input name="price_per_portion" value={form.price_per_portion} onChange={handleChange} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : ''} ${formErrors.price_per_portion ? 'border-red-500' : ''}`} required />
                    {formErrors.price_per_portion && <p className="text-red-500 text-xs mt-1">{formErrors.price_per_portion}</p>}
                </div>
            )}

            {form.translations.map((t, i) => (
                <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="font-medium mb-2">{t.language.toUpperCase()} Version*</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block mb-1">Name*</label>
                            <input name={`translations.${i}.name`} value={t.name} onChange={handleChange} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : ''} ${formErrors[`translation_${i}_name`] ? 'border-red-500' : ''}`} required />
                            {formErrors[`translation_${i}_name`] && <p className="text-red-500 text-xs mt-1">{formErrors[`translation_${i}_name`]}</p>}
                        </div>
                        <div>
                            <label className="block mb-1">Description</label>
                            <textarea name={`translations.${i}.description`} value={t.description} onChange={handleChange} rows={3} className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`} />
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="flex justify-end space-x-3  pt-4">
              <button type="button" onClick={resetForm} disabled={isLoading} className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 ml-2' : 'bg-gray-200 hover:bg-gray-300 ml-2'} ${isLoading ? 'opacity-50' : ''}`}>
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="px-4 py-2  rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 flex items-center justify-center min-w-[120px]">
                {isLoading ? <div className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin"></div> : (editingItem ? 'Update Item' : 'Add Item')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;