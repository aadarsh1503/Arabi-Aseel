import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "./menu.css"
const MenuSection = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [menuCategories, setMenuCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('F');
    const [showModal, setShowModal] = useState(false);
    const [itemCount, setItemCount] = useState(1);
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                // const res = await axios.get('https://arabi-aseel-1.onrender.com/api/admin/menu');
                const rawData = res.data;
        
                // 1. Filter out any items that are NOT available
                const availableItems = rawData.filter(item => item.status === 'available');
        
                // 2. Build the categories map using ONLY the available items
                const categoriesMap = {};
                
                availableItems.forEach(item => { // <-- CORRECT: Loop over filtered items
                    // If the category for this item doesn't exist in our map yet, create it.
                    if (!categoriesMap[item.category_id]) {
                        categoriesMap[item.category_id] = {
                            id: item.category_id,
                            title: isRTL && item.category_name_ar ? item.category_name_ar : item.category_name,
                            enTitle: item.category_name,
                            arTitle: item.category_name_ar || item.category_name,
                            items: [] // Initialize with an empty items array
                        };
                    }
                    
                    // 3. Push the current available item into its corresponding category
                    categoriesMap[item.category_id].items.push({
                        // The id in your component was 'item.id', but from the API it seems to be 'item.menu_id'
                        // Please double-check which is correct for your setup. I'll use menu_id.
                        id: item.menu_id, 
                        name: item.translations.find(t => t.language === 'en')?.name || '',
                        arName: item.translations.find(t => t.language === 'ar')?.name || '',
                        description: item.translations.find(t => t.language === 'en')?.description || '',
                        arDescription: item.translations.find(t => t.language === 'ar')?.description || '',
                        price: {
                            ...(item.price_q && { Q: item.price_q }),
                            ...(item.price_h && { H: item.price_h }),
                            ...(item.price_f && { F: item.price_f })
                        },
                        image: item.image_url
                    });
                });
                
                // 4. Convert the map to an array and set the state
                const transformedCategories = Object.values(categoriesMap);
                setMenuCategories(transformedCategories);
        
            } catch (err) {
                console.error("Error fetching menu data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, [isRTL]); // Add isRTL as dependency to re-fetch when language changes

    useEffect(() => {
        // Only close dropdown on language change
        setIsDropdownOpen(false);
    }, [i18n.language]);

    
    const renderPrice = (priceObj) => {
        if (!priceObj || Object.keys(priceObj).length === 0) {
            return null;
        }
        
        return (
            <div className="flex gap-1 flex-wrap mt-3">
                {Object.entries(priceObj).map(([size, price]) => (
                    <div key={size} className="bg-white/90 backdrop-blur-sm text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-amber-100">
                        {size}: BHD {price}
                    </div>
                ))}
            </div>
        );
    };

    const handleOrderNow = (item) => {
        setSelectedItem(item);
        // Set default quantity to the first available size
        const availableSizes = Object.keys(item.price);
        setQuantity(availableSizes[0] || 'F');
        setShowModal(true);
    };

    const calculateTotal = () => {
        if (!selectedItem || !selectedItem.price) return 0;
        return selectedItem.price[quantity] || 0;
    };

    const handleAddToCart = (itemWithDetails) => {
        // Here you would typically add to cart
        console.log('Added to cart:', itemWithDetails);
        setShowModal(false);
        setItemCount(1); // Reset count after adding to cart
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="text-red-500 text-lg">Error loading menu: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent mb-4">
                    {t('our_menu')}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {t('menu_subtitle')}
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                </div>
            </div>
    
            {/* Category Selector */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md py-4 mb-12 border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="relative w-full">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="block mx-auto md:w-64 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                        >
                            <span className="font-medium text-gray-700">
                                {selectedCategoryId ? 
                                    (isRTL 
                                        ? menuCategories.find(cat => cat.id === selectedCategoryId)?.arTitle 
                                        : menuCategories.find(cat => cat.id === selectedCategoryId)?.enTitle) || t('All_categories')
                                    : t('All_categories')}
                            </span>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform inline-block ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-1 w-full md:w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                <button
                                    onClick={() => {
                                        setSelectedCategoryId(null);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 hover:bg-amber-50 ${!selectedCategoryId ? 'bg-amber-100 text-amber-700' : 'text-gray-700'}`}
                                >
                                    {t('All_categories')}
                                </button>
                                {menuCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setSelectedCategoryId(category.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 hover:bg-amber-50 ${selectedCategoryId === category.id ? 'bg-amber-100 text-amber-700' : 'text-gray-700'}`}
                                    >
                                        {isRTL ? category.arTitle : category.enTitle}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
    
            {/* Menu Items */}
            <div className="max-w-6xl mx-auto">
                {selectedCategoryId ? (
                    <>
                        {/* Single Category View */}
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-2 border-b border-amber-200">
                            {isRTL 
                                ? menuCategories.find(cat => cat.id === selectedCategoryId)?.arTitle 
                                : menuCategories.find(cat => cat.id === selectedCategoryId)?.enTitle}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {menuCategories.find(cat => cat.id === selectedCategoryId)?.items?.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={isRTL ? item.arName : item.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
    
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                            {isRTL ? item.arName : item.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {isRTL ? item.arDescription : item.description}
                                        </p>
                                        {renderPrice(item.price)}
                                        <button
                                            onClick={() => handleOrderNow(item)}
                                            className="mt-4 w-full bg-[#724F38] bg-gradient-to-r hover:from-amber-600 hover:to-amber-700 text-white py-2.5 rounded-lg font-bold transition-all duration-300 hover:shadow-md flex justify-center items-center"
                                        >
                                            {t('order_now')}
                                            <span
                                                className={`inline-block ml-2 transition-transform duration-300 ${
                                                    isRTL ? "transform rotate-180 ml-0 mr-2 mt-2" : ""
                                                }`}
                                            >
                                                →
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* All Categories View */}
                        {menuCategories.map((category, index) => (
                            <div key={category.id} className="mb-12">
                                <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-2 border-b border-amber-200">
                                    {isRTL ? category.arTitle : category.enTitle}
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                    {category.items?.map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={isRTL ? item.arName : item.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                                                        <svg className="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            </div>
    
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                                    {isRTL ? item.arName : item.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 break-words line-clamp-3">
                                                    {isRTL ? item.arDescription : item.description}
                                                </p>
                                                {renderPrice(item.price)}
                                                <button
                                                    onClick={() => handleOrderNow(item)}
                                                    className="mt-4 w-full bg-[#724F38] bg-gradient-to-r hover:from-amber-600 hover:to-amber-700 text-white py-2.5 rounded-lg font-bold transition-all duration-300 hover:shadow-md flex justify-center items-center"
                                                >
                                                    {t('order_now')}
                                                    <span
                                                        className={`inline-block ml-2 transition-transform duration-300 ${
                                                            isRTL ? "transform rotate-180 ml-0 mr-2 mt-2" : ""
                                                        }`}
                                                    >
                                                        →
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {index < menuCategories.length - 1 && (
                                    <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent my-8"></div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Order Modal */}
            {showModal && selectedItem && (
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center font-noto-serif justify-center min-h-screen px-4 text-center">
            {/* Backdrop with subtle blur */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
                    onClick={() => setShowModal(false)}
                ></div>
            </div>
            
            {/* Modal container with smooth scale animation */}
            <div 
                className={`inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${isRTL ? 'text-right' : 'text-left'}`}
            >
                {/* Header with elegant close button */}
                <div className="relative px-6 pt-6 pb-2">
                    <div className="flex justify-between items-start">
                        <h3 className="text-3xl font-serif font-bold text-gray-800">
                            {isRTL ? selectedItem.arName : selectedItem.name}
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            onClick={() => setShowModal(false)}
                        >
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Divider */}
                    <div className="mt-4 border-b border-gray-100"></div>
                </div>
                
                {/* Content area */}
                <div className="px-6 py-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image section */}
                        <div className="w-full md:w-2/5">
                            <div className="h-64 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 shadow-inner">
                                {selectedItem.image ? (
                                    <img
                                        src={selectedItem.image}
                                        alt={isRTL ? selectedItem.arName : selectedItem.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-16 h-16 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Details section */}
                        <div className="w-full md:w-3/5 break-words">
                            <p className="text-gray-600 text-base leading-relaxed mb-6">
                                {isRTL ? selectedItem.arDescription : selectedItem.description}
                            </p>
                            
                            {/* Size selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    {t('select_quantity')}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.entries(selectedItem.price || {}).map(([size, price]) => (
                                        <button
                                            key={size}
                                            onClick={() => {
                                                setQuantity(size);
                                                setItemCount(1);
                                            }}
                                            className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                                quantity === size
                                                    ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-md'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'
                                            }`}
                                        >
                                            <span className="block font-medium">
                                                {size === 'F' ? t('full') : 
                                                 size === 'H' ? t('half') : 
                                                 size === 'Q' ? t('quarter') : size}
                                            </span>
                                            <span className="block text-xs mt-1 text-amber-600 font-semibold">
                                                BHD {price}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Quantity selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    {t('quantity')}
                                </label>
                                <div className="flex items-center w-32">
                                    <button
                                        onClick={() => setItemCount(prev => Math.max(1, prev - 1))}
                                        className="bg-gray-100 px-4 py-2 rounded-l-lg text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <div className="bg-gray-50 px-4 py-2 text-center flex-grow font-medium text-gray-800">
                                        {itemCount}
                                    </div>
                                    <button
                                        onClick={() => setItemCount(prev => Math.min(5, prev + 1))}
                                        className="bg-gray-100 px-4 py-2 rounded-r-lg text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Price summary */}
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {itemCount} × {quantity === 'F' ? t('full') : 
                                                      quantity === 'H' ? t('half') : 
                                                      quantity === 'Q' ? t('quarter') : quantity}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        BHD {(selectedItem.price[quantity] * itemCount).toFixed(3)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-amber-200">
                                    <span className="text-lg font-semibold text-gray-900">{t('total')}</span>
                                    <span className="text-xl font-bold text-amber-700">
                                        BHD {(selectedItem.price[quantity] * itemCount).toFixed(3)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Action buttons */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            handleAddToCart({
                                ...selectedItem,
                                selectedSize: quantity,
                                quantity: itemCount,
                                totalPrice: (selectedItem.price[quantity] * itemCount).toFixed(3)
                            });
                        }}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
                    >
                        {t('add_to_cart')}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            console.log('Order placed:', {
                                item: selectedItem,
                                size: quantity,
                                quantity: itemCount,
                                total: (selectedItem.price[quantity] * itemCount).toFixed(3)
                            });
                            setShowModal(false);
                        }}
                        className="px-6 py-3 bg-[#724F38] rounded-lg text-white hover:bg-[#5a3c2a] transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                        {t('order_now')}
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default MenuSection;