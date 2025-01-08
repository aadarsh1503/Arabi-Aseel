import { useState } from 'react';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // Import i18next hook for translations

const specials = {
  'MAIN-DISHES': [
    { id: 1, name: 'Sushi', price: '$56.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/13-1.jpg' },
    { id: 2, name: 'Salmon Fry', price: '$81.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/17-1.jpg' },
    { id: 3, name: 'Prawns Fry', price: '$31.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/16.jpg' }
  ],
  'SEA-FOOD': [
    { id: 1, name: 'Lobster', price: '$66.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/17-1.jpg' },
    { id: 2, name: 'Crab Soup', price: '$45.00', rating: 4, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/16.jpg' },
    { id: 3, name: 'Shrimp Stir Fry', price: '$38.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/14.jpg' }
  ],
  'DESSERTS': [
    { id: 1, name: 'Chocolate Cake', price: '$15.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/24-1.jpg' },
    { id: 2, name: 'Cheesecake', price: '$18.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/7-1.jpg' },
    { id: 3, name: 'Brownie Sundae', price: '$12.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/11-1.jpg' }
  ],
  'BEVERAGE': [
    { id: 1, name: 'Coffee', price: '$5.00', rating: 5, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/24-1.jpg' },
    { id: 2, name: 'Smoothie', price: '$8.00', rating: 4, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/6-1.jpg' },
    { id: 3, name: 'Orange Juice', price: '$6.00', rating: 4, image: 'https://wp.validthemes.net/restan/wp-content/uploads/2024/05/15-1.jpg' }
  ]
};

const SpecialsMenu = () => {
  const { t } = useTranslation(); // Use the translation hook
  const [activeTab, setActiveTab] = useState('MAIN-DISHES');

  return (
    <div className="container min-h-screen mx-auto max-w-6xl py-14 px-4">
      <h2 className="text-center text-4xl font-semibold mb-8 text-red-600">
        {t('specials_menu')} {/* Translation key */}
      </h2>
  
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="border-2 border-red-500 rounded-lg p-1 bg-white shadow-lg w-full max-w-lg">
          <div className="flex flex-col lg:flex-row lg:justify-between space-y-2 lg:space-y-0 lg:space-x-2">
            {['MAIN-DISHES', 'SEA-FOOD', 'DESSERTS', 'BEVERAGE'].map((category) => (
              <button
                key={category}
                className={`lg:flex-1 px-4 py-3 text-base lg:px-2 lg:py-3 lg:text-sm font-semibold transition-all duration-300 rounded-md ${
                  activeTab === category
                    ? 'bg-gradient-to-r from-yellow-400 to-red-500 text-white shadow-xl'
                    : 'bg-white text-red-600 hover:bg-yellow-100'
                }`}
                onClick={() => setActiveTab(category)}
              >
                {t(category.toLowerCase())} {/* Translation key */}
              </button>
            ))}
          </div>
        </div>
      </div>
  
      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {specials[activeTab].map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-44 object-cover lg:h-60 lg:w-96"
            />
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-bold text-red-600 text-left">
                  {t(item.name.toLowerCase().replace(' ', '_'))} {/* Translation key */}
                </h3>
                <span className="text-lg font-semibold text-yellow-500 text-right">{item.price}</span>
              </div>
              <div className="flex items-center justify-start mb-2">
                <FaStar className="text-yellow-400 mr-1 ml-1 " />
                <span className="text-red-600 text-sm ">{item.rating}.00</span>
                <span className="text-gray-500 mr-2 ml-2 text-xs">({t('reviews')})</span>
              </div>
              <p className="text-sm text-gray-700 text-left mb-3">
                {t('item_description')} {/* Translation key */}
              </p>
              <button className="flex items-center justify-start mt-4 py-1 px-3 bg-gradient-to-r from-red-400 to-yellow-500 text-white hover:from-red-500 hover:to-yellow-600 rounded-full transition duration-300 ease-in-out text-sm">
                <FaShoppingCart className="mr-2 ml-2" /> {t('add_to_cart')} {/* Translation key */}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialsMenu;
