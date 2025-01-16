import React from 'react';
import { useTranslation } from 'react-i18next';
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";
import i5 from "./i5.jpg";
import i6 from "./i6.jpg";
import i7 from "./i7.jpg";
import i8 from "./i8.jpg";
import i9 from "./i9.jpg";

const MenuSection = () => {
    const { t,i18n } = useTranslation(); // Use i18next hook for translation
    const isRTL = i18n.language === 'ar'; // Check if the language is Arabic (RTL)
    const menuItems = [
        {
            id: 1,
            name: t('pizza_slice'),
            description: t('cheese_ham_pineapple'),
            price: '12.99',
            image: i2,
            category: 'Starter',
        },
        {
            id: 2,
            name: t('cheese_burger'),
            description: t('cheese_ham_pineapple'),
            price: '9.99',
            image: i3,
            category: 'Starter',
        },
        {
            id: 3,
            name: t('chicken_paradise'),
            description: t('cheese_ham_pineapple'),
            price: '15.99',
            image: i4,
            category: 'Starter',
        },
        {
            id: 4,
            name: t('shawarma'),
            description: t('cheese_ham_pineapple'),
            price: '8.99',
            image: i5,
            category: 'Starter',
        },
        {
            id: 5,
            name: t('salmon_steak'),
            description: t('cheese_ham_pineapple'),
            price: '12.99',
            image: i6,
            category: 'Main Course',
        },
        {
            id: 6,
            name: t("fries_mcdonalds"),
            description: t('cheese_ham_pineapple'),
            price: '9.99',
            image: i7,
            category: 'Main Course',
        },
        {
            id: 7,
            name: t('chocolate_chip'),
            description: t('cheese_ham_pineapple'),
            price: '15.99',
            image: i8,
            category: 'Main Course',
        },
        {
            id: 8,
            name: t('meatballs_pasta'),
            description: t('cheese_ham_pineapple'),
            price: '8.99',
            image: i9,
            category: 'Main Course',
        },
    ];

    return (
        <div className="bg-white py-10 max-w-6xl mx-auto px-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('starter')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.filter(item => item.category === 'Starter').map(item => (
                        <div
                            key={item.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-8">
                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-sm  text-gray-600 mt-2">BD {item.price}</p>
                                <button className="mt-4 text-sm font-medium text-brown hover:underline flex items-center">
                                {t('order_now')} 
<span className="ml-2 mr-2">
  {isRTL ? '←' : '→'}
</span>

                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('main_course')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.filter(item => item.category === 'Main Course').map(item => (
                        <div
                            key={item.id}
                            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-8">
                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <p className="text-sm text-gray-600 mt-2">BD {item.price}</p>
                                <button className="mt-4 text-sm font-medium text-brown hover:underline flex items-center">
                                    {t('order_now')} <span className="ml-2 mr-2">
  {isRTL ? '←' : '→'}
</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuSection;
