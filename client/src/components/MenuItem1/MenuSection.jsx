import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import g1 from "./g1.jpg"
import g2 from "./g2.jpg"
import g3 from "./g3.jpg"
import g4 from "./g4.jpeg"
import g5 from "./g5.webp"
import g6 from "./g6.webp"
import g7 from "./g7.jpg"
import g8 from "./g8.png"
import g9 from "./g9.jpg"
import g10 from "./g10.png"
import g11 from "./g11.jpeg"
import g12 from "./g12.jpg"
import g13 from "./g13.jpeg"
import g14 from "./g14.jpeg"
import g15 from "./g15.webp"
import g16 from "./g16.jpg"
import g17 from "./g17.avif"
import g18 from "./g18.avif"
import g19 from "./g19.jpg"
import g20 from "./g20.webp"
import g21 from "./g21.jpg"
import g22 from "./g22.jpg"
import g23 from "./g23.jpg"
import g24 from "./g24.webp"
import g25 from "./g25.webp"
import g26 from "./g26.jpg"
import g27 from "./g27.jpg"
import g28 from "./g28.jpg"
import g29 from "./g29.jpg"
import g30 from "./g30.jpg"
import g31 from "./g31.jpg"
import g32 from "./g32.jpg"
import g33 from "./g33.jpg"
import g34 from "./g34.webp"
import g35 from "./g35.jpg"
import g36 from "./g36.webp"
import g37 from "./g37.jpg"
import g38 from "./g38.webp"
import g39 from "./g39.jpg"
import g40 from "./g40.webp"
import g41 from "./g41.webp"
import g42 from "./g42.jpg"
import g43 from "./g43.jpg"
import g44 from "./g44.png"
import g45 from "./g45.avif"
import g46 from "./g46.jpg"
import g47 from "./g47.jpg"
import g48 from "./g48.webp"
import g49 from "./g49.webp"
import g50 from "./g50.jpg"
import g51 from "./g51.webp"
import g52 from "./g52.jpg"



const MenuSection = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    useEffect(() => {
        // Only close dropdown on language change
        setIsDropdownOpen(false);
    }, [i18n.language]);
    const menuCategories = [
        {
            "id": 1,
            "title": t('rice_chicken'),
            "items": [
              {
                "id": 101,
                "name": t('OUZI_RICE_CHICKEN'),
                "description": t('traditional_ouzi_with_chicken'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g1
              },
              {
                "id": 102,
                "name": t('BIRYANI_BAHRAINI_RICE_CHICKEN'),
                "description": t('bahraini_style_biryani'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g2
              },
              {
                "id": 103,
                "name": t('MADFOON_HASAVI_RICE_CHICKEN'),
                "description": t('hasawi_style_madfoon'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g3
              },
              {
                "id": 104,
                "name": t('MANDI_RICE_CHICKEN'),
                "description": t('yemeni_mandi_chicken'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g4
              },
              {
                "id": 105,
                "name": t('RICE_MADHABI_CHICKEN_GRILL'),
                "description":t('madhabi_grilled_chicken'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g5
              },
              {
                "id": 106,
                "name": t('MACHBOOS_RICE_CHICKEN'),
                "description": t('machboos_with_chicken'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g6
              },
              {
                "id": 107,
                "name": t('BUKHARI_RICE_CHICKEN'),
                "description": t('bukhari_with_chicken'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g7
              }
            ]
          },
          {
            "id": 2,
            "title": t('rice_only'),
            "items": [
              {
                "id": 201,
                "name": t('OUZI_RICE'),
                "description": t('ouzi_rice_only'),
                "price": { "portion": "0.700" },
                "image": g8
              },
              {
                "id": 202,
                "name": t('BIRYANI_RICE'),
                "description": t('biryani_rice_only'),
                "price": { "portion": "0.700" },
                "image": g9
              },
              {
                "id": 203,
                "name": t('MADFOON_RICE'),
                "description": t('madfoon_rice_only'),
                "price": { "portion": "0.700" },
                "image": g10
              },
              {
                "id": 204,
                "name": t('MANDI_RICE'),
                "description": t('mandi_rice_only'),
                "price": { "portion": "0.700" },
                "image": g11
              },
              {
                "id": 205,
                "name": t('MADHABI_RICE'),
                "description": t('madhbi_rice_only'),
                "price": { "portion": "0.700" },
                "image": g12
              },
              {
                "id": 206,
                "name": t('MACHBOOS_RICE'),
                "description": t('machboos_rice_only'),
                "price": { "portion": "0.700" },
                "image": g13
              },
              {
                "id": 207,
                "name": t('BUKHARI_RICE'),
                "description": t('bukhari_rice_only'),
                "price": { "portion": "0.700" },
                "image": g14
              }
            ]
          },
          {
            "id": 3,
            "title": t('mutton_beef'),
            "items": [
              {
                "id": 301,
                "name": t('OUZI_RICE_MUTTON_LAMB'),
                "description": t('ouzi_with_mutton'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g15
              },
              {
                "id": 302,
                "name": t('BIRYANI_BAHRAINI_RICE_MUTTON'),
                "description": t('bahraini_biryani_with_mutton'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g16
              },
              {
                "id": 303,
                "name": t('MACHBOOS_RICE_MUTTON'),
                "description": t('machboos_with_mutton'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g17
              },
              {
                "id": 304,
                "name": t('MADFOON_HASAVI_RICE_MUTTON'),
                "description": t('hasawi_madfoon_with_mutton'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g18
              },
              {
                "id": 305,
                "name": t('MANDI_RICE_MUTTON'),
                "description": t('mandi_with_mutton'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g21
              },
              {
                "id": 306,
                "name": t('WHITE_RICE_MUTTON'),
                "description": t('white_rice_with_mutton'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g19
              },
              {
                "id": 307,
                "name": t('BUKHARI_RICE_MUTTON_BEEF'),
                "description": t('bukhari_with_meat'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g20
              }
            ]
          },
          {
            "id": 4,
            "title": t('seafood'),
            "items": [
              {
                "id": 401,
                "name": t('FISH_SHARI_FRY_WHITE_RICE'),
                "description": t('fried_shari_fish'),
                "price": { "Q": "2.000", "H": "4.000", "F": "6.000" },
                "image": g22
              },
              {
                "id": 402,
                "name": t('FISH_SAFI_FRY_WHITE_RICE'),
                "description": t('fried_safi_fish'),
                "price": { "Q": "2.000", "H": "4.000", "F": "6.000" },
                "image": g23
              },
              {
                "id": 403,
                "name": t('RUBYAN_MACHBOOS_RICE'),
                "description": t('prawn_machboos'),
                "price": { "Q": "3.000", "H": "5.000", "F": "8.500" },
                "image": g24
              },
              {
                "id": 404,
                "name": t('FISH_SHAFI_MACHBOOS_RICE'),
                "description": t('shafi_fish_machboos'),
                "price": { "Q": "3.000", "H": "5.000", "F": "8.500" },
                "image": g25
              },
              {
                "id": 405,
                "name": t('SPECIAL_SALONA_FISH'),
                "description": t('special_fish_salona'),
                "price": { "Q": "3.000", "H": "5.000", "F": "8.500" },
                "image": g26
              }
            ]
          },
          {
            "id": 5,
            "title": t('special_rice'),
            "items": [
              {
                "id": 501,
                "name": t('SAFFRON_RICE_CHICKEN'),
                "description": t('saffron_infused_rice'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g27
              },
              {
                "id": 502,
                "name": t('CARROT_RICE_CHICKEN'),
                "description": t('carrot_infused_rice'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g28
              },
              {
                "id": 503,
                "name": t('BESHAWARI_RICE_CHICKEN'),
                "description": t('beshawari_rice_chicken'),
                "price": { "Q": "1.300", "H": "2.600", "F": "5.200" },
                "image": g29
              },
              {
                "id": 504,
                "name": t('SAFFRON_RICE_MUTTON_BEEF'),
                "description": t('saffron_rice_with_meat'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g30
              },
              {
                "id": 505,
                "name": t('CARROT_RICE_MUTTON_BEEF'),
                "description": t('carrot_rice_with_meat'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g31
              },
              {
                "id": 506,
                "name": t('BESHAWARI_RICE_MUTTON_BEEF'),
                "description": t('beshawari_rice_with_meat'),
                "price": { "Q": "1.800", "H": "3.600", "F": "7.200" },
                "image": g32
              }
            ]
          },
          {
            "id": 6,
            "title": t('salona_nashif'),
            "items": [
              {
                "id": 601,
                "name": t('SALONA_MUTTON'),
                "description": t('mutton_salona_description'),
                "price": { "S": "1.500", "M": "2.500", "L": "3.500" },
                "image": g33
              },
              {
                "id": 602,
                "name": t('MUTTON_NASHIF'),
                "description": t('mutton_nashif_description'),
                "price": { "S": "1.800", "M": "3.500", "L": "5.000" },
                "image": g34
              },
              {
                "id": 603,
                "name": t('SALONA_CHICKEN'),
                "description": t('chicken_salona_description'),
                "price": { "S": "1.200", "M": "2.500", "L": "3.300" },
                "image": g35
              },
              {
                "id": 604,
                "name": t('CHICKEN_NASHIF'),
                "description": t('chicken_nashif_description'),
                "price": { "S": "1.300", "M": "2.500", "L": "3.300" },
                "image": g36
              },
              {
                "id": 605,
                "name": t('SALONA_VEGETABLE'),
                "description": t('vegetable_salona_description'),
                "price": { "S": "0.900", "M": "1.600", "L": "2.700" },
                "image": g37
              }
            ]
          },
          {
            "id": 7,
            "title": t('drinks'),
            "items": [
              {
                "id": 701,
                "name": t('KINZA_COLA_250ML'),
                "description": t('cola_drink'),
                "price": { "portion": "0.300" },
                "image": g38
              },
              {
                "id": 702,
                "name": t('KINZA_CITRUS_250ML'),
                "description": t('citrus_drink'),
                "price": { "portion": "0.300" },
                "image": g39
              },
              {
                "id": 703,
                "name": t('KINZA_ORANGE_250ML'),
                "description": t('orange_drink'),
                "price": { "portion": "0.300" },
                "image": g40
              },
              {
                "id": 704,
                "name": t('WATER_400ML_SMALL'),
                "description": t('small_water'),
                "price": { "portion": "0.200" },
                "image": g44
              },
              {
                "id": 705,
                "name": t('WATER_800ML_BIG'),
                "description": t('big_water'),
                "price": { "portion": "0.300" },
                "image": g45
              },
              {
                "id": 706,
                "name": t('NADEC_ORANGE_JUICE_125ML'),
                "description": t('orange_juice'),
                "price": { "portion": "0.200" },
                "image": g41
              },
              {
                "id": 707,
                "name": t('NADEC_APPLE_JUICE_125ML'),
                "description": t('apple_juice'),
                "price": { "portion": "0.200" },
                "image": g42
              },
              {
                "id": 708,
                "name": t('FRESH_LABAN_180ML'),
                "description": t('fresh_laban'),
                "price": { "portion": "0.300" },
                "image": g43
              }
            ]
          },
          {
            "id": 8,
            "title": t('salads_appetizers'),
            "items": [
              {
                "id": 801,
                "name": t('ROCCA_SALAD'),
                "description": t('rocca_salad_description'),
                "price": { "S": "1.900", "M": "2.800", "L": "5.700" },
                "image": g46
              },
              {
                "id": 802,
                "name": t('TABULLA_SALAD'),
                "description": t('tabulla_salad_description'),
                "price": { "S": "1.000", "M": "2.000", "L": "3.000" },
                "image": g47
              },
              {
                "id": 803,
                "name": t('YOGURT_SALAD'),
                "description": t('yogurt_salad_description'),
                "price": { "S": "1.000", "M": "2.000", "L": "3.000" },
                "image": g49
              },
              {
                "id": 804,
                "name": t('HUMMUS'),
                "description": t('hummus_description'),
                "price": { "S": "0.500", "M": "1.000", "L": "1.500" },
                "image": g48
              }
            ]
          },
          {
            "id": 9,
            "title": t('special_salads'),
            "items": [
              {
                "id": 901,
                "name": t('GREEN_SALAD'),
                "description": t('green_salad_description'),
                "price": { "S": "1.000", "M": "2.000", "L": "3.000" },
                "image": g50
              },
              {
                "id": 902,
                "name": t('SPECIAL_FATTOUSH_SALAD'),
                "description": t('fattoush_salad_description'),
                "price": { "S": "1.000", "M": "2.000", "L": "3.000" },
                "image": g51
              }
            ]
          },
          {
            "id": 10,
            "title": t('soup'),
            "items": [
              {
                "id": 1001,
                "name": t('LENTIL_SOUP'),
                "description": t('lentil_soup_description'),
                "price": { "S": "1.000", "M": "2.000", "L": "3.000" },
                "image": g52
              }
            ]
          }
        
    ];

    const renderPrice = (priceObj) => {
        if (priceObj.portion) {
            return (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg inline-block">
                    {t('Per_Portion')} - BD {priceObj.portion}
                </div>
            );
        }
        return (
            <div className="flex gap-1 flex-wrap mt-3">
                {Object.entries(priceObj).map(([size, price]) => (
                    <div key={size} className="bg-white/90 backdrop-blur-sm text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-amber-100">
                        {size}: BD {price}
                    </div>
                ))}
            </div>
        );
    };
    
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
                menuCategories.find(cat => cat.id === selectedCategoryId)?.title || t('All_categories')
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
                    {category.title}
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
                            {menuCategories.find(cat => cat.id === selectedCategoryId)?.title}
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
                                                alt={item.name}
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
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {item.description}
                                        </p>
                                        {renderPrice(item.price)}
                                        <button
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
                                    {category.title}
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
                                                        alt={item.name}
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
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {item.description}
                                                </p>
                                                {renderPrice(item.price)}
                                                <button
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
        </div>
    );
};

export default MenuSection;