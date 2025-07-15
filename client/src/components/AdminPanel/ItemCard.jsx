// src/components/ItemCard.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import "./card.css"
import { useTranslation } from 'react-i18next';
import "./a.css"
const ItemCard = ({ item, viewMode, darkMode, onEdit, onDelete, onStatusToggle, buttonLoading, statusLoading }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [currentLang, setCurrentLang] = useState(isRTL ? 'ar' : 'en');

  useEffect(() => {
    setCurrentLang(isRTL ? 'ar' : 'en');
  }, [isRTL]);

  const {
    menu_id,
    image_url,
    category_name,
    category_name_ar,
    price_type,
    price_q,
    price_h,
    price_f,
    price_per_portion,
    translations,
    status
  } = item;

  const name = translations.find(t => t.language === currentLang)?.name || translations.find(t => t.language === 'en')?.name;
  const description = translations.find(t => t.language === currentLang)?.description || translations.find(t => t.language === 'en')?.description;
  const category = currentLang === 'ar' ? category_name_ar : category_name;

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all duration-300
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        ${viewMode === 'list' ? 'flex' : ''} 
        ${status === 'not available' ? 'opacity-60 saturate-50' : ''}
        shadow-sm hover:shadow-md`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {image_url && (
        <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full'} relative`}>
          <img
            src={image_url}
            alt={name}
            className={`w-full ${viewMode === 'list' ? 'h-full' : 'h-48'} object-cover`}
          />
        </div>
      )}

      <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''} flex flex-col`}>
        {/* <div className="flex justify-between items-center gap-2 mb-3">
          <div className={`px-2.5 py-1 text-sm rounded-full ${darkMode ? 'bg-purple-900/80 text-purple-200' : 'bg-[#724F38] text-white'}`}>
            {category}
          </div>
        </div> */}

        {price_type === 'per_portion' ? (
          <span className="inline-block w-fit px-2.5 mb-4 py-1 text-sm rounded-full bg-[#724F38] text-white">
            Per Portion: BHD {price_per_portion}
          </span>
        ) : (
          <div className="flex flex-wrap mb-4 gap-2">
            {price_q && <span className="px-2.5 py-1 text-sm rounded-full bg-[#724F38] text-white">Q: BHD {price_q}</span>}
            {price_h && <span className="px-2.5 py-1 text-sm rounded-full bg-[#724F38] text-white">H: BHD {price_h}</span>}
            {price_f && <span className="px-2.5 py-1 text-sm rounded-full bg-[#724F38] text-white">F: BHD {price_f}</span>}
          </div>
        )}

        <div className="mb-4 break-words flex-grow">
          <h3 className="font-bold text-lg mb-1">{name}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description || 'No description available.'}</p>
        </div>

        {/* <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
          <h4 className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
            Arabic Details
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Name:</span> {item.translations.find(t => t.language === 'ar')?.name}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} `}>
            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description:</span> {item.translations.find(t => t.language === 'ar')?.description}
          </p>
        </div> */}

        <div dir='ltr' className={`mt-auto flex justify-between items-center pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStatusToggle(menu_id, status)}
              disabled={statusLoading === menu_id}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${status === 'available' ? 'bg-green-500' : 'bg-gray-600'}`}
              title={status === 'available' ? 'Mark as Not Available' : 'Mark as Available'}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${status === 'available' ? 'translate-x-6' : 'translate-x-1'}`} />
              {statusLoading === menu_id && <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div></div>}
            </button>
            <span className={`
  inline-flex items-center justify-center
  px-3 py-1 rounded-full
  text-xs font-bold tracking-wider
  transition-all duration-300
  ${status === 'available' 
    ? 'bg-green-900/20 text-green-800 glow-green-pulse' 
    : 'bg-gray-900/20 text-gray-500'}
  rtl:flex-row-reverse
`}>
  {status === 'available' ? (
    <>
      <span className="relative flex h-2 w-2 me-2 rtl:ms-2 rtl:me-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#724F38] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>LIVE</span>
    </>
  ) : (
    <span className="flex items-center">
      <span className="w-2 h-2 me-2 mr-2 rtl:me-2 rounded-full bg-gray-500"></span>
      HIDDEN
    </span>
  )}
</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => onEdit(item)} disabled={buttonLoading.edit === menu_id} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 hover:text-purple-300 text-gray-200 ' : 'hover:bg-gray-400 hover:text-purple-900 text-gray-800'}`} title="Edit">
              {buttonLoading.edit === menu_id ? <div className="w-4 h-4 border-2 border-purple-500  border-t-transparent rounded-full animate-spin"></div> : <FiEdit2 size={18} className="  hover:text-purple-600 " />}
            </button>
            <button onClick={() => onDelete(menu_id)} disabled={buttonLoading.delete === menu_id} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100'}`} title="Delete">
              {buttonLoading.delete === menu_id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <FiTrash2 size={18} className="text-red-500 dark:text-red-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;