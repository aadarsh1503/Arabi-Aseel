import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useCategories } from '../../hooks/useCategories';
import FileUpload from '../UI/FileUpload';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProductForm = ({ product, onSubmit, onCancel, isLoading }) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState('');
  const [priceStructure, setPriceStructure] = useState({
    Q: '', H: '', F: '', S: '', M: '', L: '', portion: ''
  });

  useEffect(() => {
    if (product) {
      reset({
        categoryId: product.category_id,
        status: product.status,
        name_en: product.translations?.find(t => t.language === 'en')?.name || '',
        description_en: product.translations?.find(t => t.language === 'en')?.description || '',
        name_ar: product.translations?.find(t => t.language === 'ar')?.name || '',
        description_ar: product.translations?.find(t => t.language === 'ar')?.description || ''
      });
      setImagePreview(product.image_url || '');
      setPriceStructure(product.price || {
        Q: '', H: '', F: '', S: '', M: '', L: '', portion: ''
      });
    }
  }, [product, reset]);

  const handlePriceChange = (key, value) => {
    setPriceStructure(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setValue('image', file);
  };

  const submitHandler = (data) => {
    const price = Object.fromEntries(
      Object.entries(priceStructure).filter(([_, value]) => value !== '')
    );
    onSubmit({
      ...data,
      price,
      image: data.image || null,
      imageUrl: imagePreview
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Selection */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">Select a category</option>
              {categoriesLoading ? (
                <option>Loading categories...</option>
              ) : (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))
              )}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="available">Available</option>
              <option value="not_available">Not Available</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <FileUpload
              onFileUpload={handleImageUpload}
              preview={imagePreview}
              accept="image/*"
            />
          </div>

          {/* English Details */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">English Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
              <input
                {...register('name_en', { required: 'English name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
              {errors.name_en && (
                <p className="mt-1 text-sm text-red-600">{errors.name_en.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                {...register('description_en')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Arabic Details */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Arabic Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
              <input
                {...register('name_ar', { required: 'Arabic name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-right"
                dir="rtl"
              />
              {errors.name_ar && (
                <p className="mt-1 text-sm text-red-600">{errors.name_ar.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabic)</label>
              <textarea
                {...register('description_ar')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Price Structure */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Structure</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Q', 'H', 'F', 'S', 'M', 'L', 'portion'].map((size) => (
                <div key={size} className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {size === 'portion' ? 'Per Portion' : `Size ${size}`}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">BD</span>
                    </div>
                    <input
                      type="text"
                      value={priceStructure[size] || ''}
                      onChange={(e) => handlePriceChange(size, e.target.value)}
                      className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-12 pr-3 py-2 border-gray-300 rounded-md"
                      placeholder="0.000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoadingSpinner size="small" />
            ) : product ? (
              'Update Product'
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;