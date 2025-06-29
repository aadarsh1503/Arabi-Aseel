import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import { PlusIcon } from '@heroicons/react/outline';
import ProductForm from '../ProductForm/ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const addProduct = (productData) => {
    setProducts(prev => [...prev, { id: Date.now(), ...productData }]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (productData) => {
    setIsLoading(true);
    try {
      if (currentProduct) {
        updateProduct(currentProduct.id, productData);
      } else {
        addProduct(productData);
      }
      setIsFormOpen(false);
    } catch (e) {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <Button
          onClick={handleAddProduct}
          icon={<PlusIcon className="h-5 w-5 mr-2" />}
        >
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : (
        <ProductList 
          products={products} 
          onEdit={handleEditProduct} 
          onDelete={deleteProduct} 
        />
      )}

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <ProductForm
          product={currentProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </motion.div>
  );
};

export default Products;
