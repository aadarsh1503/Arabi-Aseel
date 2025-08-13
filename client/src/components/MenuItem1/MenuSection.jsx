import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import "./menu.css"

// A simple Search Icon component
const SearchIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const MenuSection = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // State for data and loading
    const [menuCategories, setMenuCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filtering and search
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State for the modal
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState('F');
    const [showModal, setShowModal] = useState(false);
    const [itemCount, setItemCount] = useState(1);
    const [isSearchVisible, setIsSearchVisible] = useState(false); // <-- Add this
    const searchInputRef = useRef(null); // <-- And add this

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                setLoading(true);
                const res = await axios.get('https://arabi-aseel-1.onrender.com/api/admin/menu');
                const rawData = res.data;
        
                const availableItems = rawData.filter(item => item.status === 'available');
                const categoriesMap = {};
                    
                availableItems.forEach(item => {
                    if (!categoriesMap[item.category_id]) {
                        categoriesMap[item.category_id] = {
                            id: item.category_id,
                            enTitle: item.category_name,
                            arTitle: item.category_name_ar || item.category_name,
                            items: []
                        };
                    }
                    
                    categoriesMap[item.category_id].items.push({
                        categoryId: item.category_id,
                        id: item.menu_id,
                        name: item.translations.find(t => t.language === 'en')?.name || '',
                        arName: item.translations.find(t => t.language === 'ar')?.name || '',
                        description: item.translations.find(t => t.language === 'en')?.description || '',
                        arDescription: item.translations.find(t => t.language === 'ar')?.description || '',
                        price: { Q: item.price_q, H: item.price_h, F: item.price_f },
                        price_type: item.price_type,
                        price_per_portion: item.price_per_portion,
                        image: item.image_url
                    });
                });
                
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
    }, [i18n.language]);

    // Memoized filtering logic for performance
    const filteredItems = useMemo(() => {
        let items = menuCategories.flatMap(category => category.items);
        if (selectedCategoryId) {
            items = items.filter(item => item.categoryId === selectedCategoryId);
        }
        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(lowercasedQuery) ||
                item.arName.toLowerCase().includes(lowercasedQuery)
            );
        }
        return items;
    }, [selectedCategoryId, searchQuery, menuCategories]);


    useEffect(() => {
        if (isSearchVisible) {
            // A small delay is needed to allow the element to be rendered and visible
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isSearchVisible]);
    const renderPrice = (item) => {
        if (item.price_type === 'per_portion' && item.price_per_portion) {
            return (
                <div className="flex gap-1 flex-wrap mt-3">
                    <div className="bg-white/90 backdrop-blur-sm text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-amber-100">
                    {t('per_portion')} : BHD {item.price_per_portion}
                    </div>
                </div>
            );
        } else if (item.price) {
            const availablePrices = Object.entries(item.price).filter(([_, price]) => price);
            return (
                <div className="flex gap-1 flex-wrap mt-3">
                    {availablePrices.map(([size, price]) => (
                         <div key={size} className="bg-white/90 backdrop-blur-sm text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-amber-100">
                            {size}: BHD {price}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const handleOrderNow = (item) => {
        setSelectedItem(item);
        if(item.price_type === 'per_portion') {
            setQuantity('portion');
        } else {
            const availableSizes = Object.keys(item.price).filter(size => item.price[size]);
            setQuantity(availableSizes[0] || 'F');
        }
        setShowModal(true);
        setItemCount(1);
    };

    const handleAddToCart = (itemWithDetails) => {
        console.log('Added to cart:', itemWithDetails);
        setShowModal(false);
        setItemCount(1);
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-red-500 text-lg">Error loading menu: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent mb-4">
                    {t('our_menu')}
                </h1>
               
                <div className="mt- flex justify-center">
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                </div>
            </div>
            
  
            <div className="sticky top-0 z-40 mt-0 lg:-mt-6  backdrop-blur-md py-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main flex container for the two separate panels */}
                    <div className="flex flex-col md:flex-row items-center  gap-4">

                        {/* Panel 1: Categories Section (Left) - CORRECTED */}
                        <div className="w-full md:w-auto bg-gray-50/70 rounded-2xl p-3 border border-gray-200/80 shadow-sm overflow-hidden">
                            <div className={`flex items-center space-x-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {/* All Categories Button */}
                                <button
                                    onClick={() => setSelectedCategoryId(null)}
                                    className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap
                                        ${!selectedCategoryId 
                                            ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md' 
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'}`
                                    }
                                >
                                    {t('All_categories')}
                                </button>
                                {/* Individual Category Buttons */}
                                {menuCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategoryId(category.id)}
                                        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap
                                            ${selectedCategoryId === category.id 
                                                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md' 
                                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'}`
                                            }
                                    >
                                        {isRTL ? category.arTitle : category.enTitle}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Panel 2: Animated Search Section (Right) - TRULY SEPARATED */}
                        <div className="w-full md:w-auto flex justify-start">
                            <div className="flex items-center justify-start h-[52px] space-x-2"> {/* Fixed height container with space */}
                                
                                {/* The Expanding Search Bar - Now it expands from the right */}
                                <div 
                                    className={`relative flex items-center transition-all duration-500 ease-in-out
                                        ${isSearchVisible ? 'w-64 sm:w-72 opacity-100' : 'w-0 opacity-0'}`}
                                >
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
                                        <SearchIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={t('search_items') + '...'}
                                        value={searchQuery}
                                        onBlur={() => { if (!searchQuery) setIsSearchVisible(false); }}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-[52px] bg-white border-2 border-amber-400 rounded-full pl-12 pr-10 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                    />
                                    <button 
                                        onClick={() => setIsSearchVisible(false)}
                                        aria-label="Close search"
                                        className="absolute right-0 inset-y-0 flex items-center pr-3 text-gray-400 hover:text-amber-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                
                                {/* The Search Icon Button - Now a separate element */}
                                <button 
                                    onClick={() => setIsSearchVisible(true)}
                                    aria-label={t('search_items')}
                                    className={`flex-shrink-0 h-[52px] w-[52px] flex items-center justify-center bg-white rounded-full text-amber-600 hover:bg-amber-50 border border-gray-200 shadow-sm transition-all duration-300 ease-in-out
                                        ${isSearchVisible ? 'opacity-0 scale-75 w-0 pointer-events-none' : 'opacity-100 scale-100 w-[52px]'}`}
                                >
                                    <SearchIcon className="w-6 h-6" />
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ======================================= */}
            {/* ==       Main Menu Content Area      == */}
            {/* ======================================= */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map(item => (
                            <div 
                                key={item.id} 
                                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={isRTL ? item.arName : item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                            {isRTL ? item.arName : item.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 break-words line-clamp-3">
                                            {isRTL ? item.arDescription : item.description}
                                        </p>
                                    </div>
                                    <div className="mt-auto">
                                        {renderPrice(item)}
                                        {/* <button
                                            onClick={() => handleOrderNow(item)}
                                            className="mt-4 w-full bg-[#724F38] bg-gradient-to-r hover:from-amber-600 hover:to-amber-700 text-white py-2.5 rounded-lg font-bold transition-all duration-300 hover:shadow-md flex justify-center items-center"
                                        >
                                            {t('order_now')}
                                            <span className={`inline-block ml-2 transition-transform duration-300 ${isRTL ? "transform rotate-180 ml-0 mr-2" : ""}`}>→</span>
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-gray-50 rounded-2xl">
                        <h3 className="text-2xl font-bold text-gray-800">{t('no_items_found')}</h3>
                        <p className="text-gray-600 mt-2">{t('try_adjusting_filters')}</p>
                    </div>
                )}
            </main>

            {/* Order Modal (Unchanged) */}
            {showModal && selectedItem && (
                 <div className="fixed inset-0 z-50 overflow-y-auto">
                 <div className="flex items-center font-noto-serif justify-center min-h-screen px-4 text-center">
                     <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                         <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                     </div>
                     <div className={`inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                         <div className="relative px-6 pt-6 pb-2">
                             <div className="flex justify-between items-start">
                                 <h3 className="text-3xl font-serif font-bold text-gray-800">{isRTL ? selectedItem.arName : selectedItem.name}</h3>
                                 <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors duration-200" onClick={() => setShowModal(false)}>
                                     <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                 </button>
                             </div>
                             <div className="mt-4 border-b border-gray-100"></div>
                         </div>
                         <div className="px-6 py-4">
                             <div className="flex flex-col md:flex-row gap-8">
                                 <div className="w-full md:w-2/5">
                                     <div className="h-64 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 shadow-inner">
                                         {selectedItem.image ? (
                                             <img src={selectedItem.image} alt={isRTL ? selectedItem.arName : selectedItem.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center"><svg className="w-16 h-16 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div>
                                         )}
                                     </div>
                                 </div>
                                 <div className="w-full md:w-3/5 break-words">
                                     <p className="text-gray-600 text-base leading-relaxed mb-6">{isRTL ? selectedItem.arDescription : selectedItem.description}</p>
                                     <div className="mb-6">
                                         <label className="block text-sm font-medium text-gray-700 mb-3">{t('select_quantity')}</label>
                                         {selectedItem.price_type === 'per_portion' ? (
                                             <div className="grid grid-cols-1 gap-3">
                                                 <div className="py-3 px-4 bg-amber-50 border-2 border-amber-400 text-amber-700 shadow-md rounded-lg">
                                                     <span className="block font-medium">{t('per_portion')}</span>
                                                     <span className="block text-xs mt-1 text-amber-600 font-semibold">BHD {selectedItem.price_per_portion}</span>
                                                 </div>
                                             </div>
                                         ) : (
                                             <div className="grid grid-cols-3 gap-3">
                                                 {Object.entries(selectedItem.price || {}).filter(([_, price]) => price).map(([size, price]) => (
                                                     <button key={size} onClick={() => { setQuantity(size); setItemCount(1); }} className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${quantity === size ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'}`}>
                                                         <span className="block font-medium">{size === 'F' ? t('full') : size === 'H' ? t('half') : size === 'Q' ? t('quarter') : size}</span>
                                                         <span className="block text-xs mt-1 text-amber-600 font-semibold">BHD {price}</span>
                                                     </button>
                                                 ))}
                                             </div>
                                         )}
                                     </div>
                                     <div className="mb-6">
                                         <label className="block text-sm font-medium text-gray-700 mb-3">{t('quantity')}</label>
                                         <div className="flex items-center w-32">
                                             <button onClick={() => setItemCount(prev => Math.max(1, prev - 1))} className="bg-gray-100 px-4 py-2 rounded-l-lg text-gray-600 hover:bg-gray-200 transition-colors">
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                                             </button>
                                             <div className="bg-gray-50 px-4 py-2 text-center flex-grow font-medium text-gray-800">{itemCount}</div>
                                             <button onClick={() => setItemCount(prev => Math.min(10, prev + 1))} className="bg-gray-100 px-4 py-2 rounded-r-lg text-gray-600 hover:bg-gray-200 transition-colors">
                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                             </button>
                                         </div>
                                     </div>
                                     <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                         <div className="flex justify-between items-center mb-2">
                                             <span className="text-sm font-medium text-gray-700">{selectedItem.price_type === 'per_portion' ? `${itemCount} × ${t('per_portion')}` : `${itemCount} × ${quantity === 'F' ? t('full') : quantity === 'H' ? t('half') : quantity === 'Q' ? t('quarter') : quantity}`}</span>
                                             <span className="text-sm font-semibold text-gray-900">BHD {((selectedItem.price_type === 'per_portion' ? selectedItem.price_per_portion : selectedItem.price[quantity]) * itemCount).toFixed(3)}</span>
                                         </div>
                                         <div className="flex justify-between items-center pt-3 border-t border-amber-200">
                                             <span className="text-lg font-semibold text-gray-900">{t('total')}</span>
                                             <span className="text-xl font-bold text-amber-700">BHD {((selectedItem.price_type === 'per_portion' ? selectedItem.price_per_portion : selectedItem.price[quantity]) * itemCount).toFixed(3)}</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                             <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium">{t('cancel')}</button>
                             <button type="button" onClick={() => {
                                 const total = selectedItem.price_type === 'per_portion' ? selectedItem.price_per_portion * itemCount : selectedItem.price[quantity] * itemCount;
                                 handleAddToCart({ ...selectedItem, selectedSize: quantity, quantity: itemCount, totalPrice: total.toFixed(3) });
                             }} className="px-6 py-3 bg-[#724F38] rounded-lg text-white hover:bg-[#5a3c2a] transition-colors duration-200 font-medium shadow-md hover:shadow-lg">{t('add_to_cart')}</button>
                         </div>
                     </div>
                 </div>
             </div>
            )}
        </div>
    );
};

export default MenuSection;