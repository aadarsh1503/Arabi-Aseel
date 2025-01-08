import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i2 from './i2.jpg';
import i3 from './i3.jpg';
import i1 from './i1.png';

const RestaurantSection = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  useEffect(() => {
    setIsRTL(i18n.language === 'ar');
  }, [i18n.language]);

  return (
    <section className="bg-white py-12">
      {isRTL ? (
        // RTL Layout
        <div dir="rtl" className="flex flex-wrap items-center justify-between">
          {/* Right Side Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-2/4 order-last lg:order-first">
            <img src={i2} alt="Serving Food" className="w-full lg:h-[500px] object-cover" />
            <img src={i3} alt="Serving Drinks" className="w-full h-full object-cover" />
          </div>

          {/* Left Side Content */}
          <div className="p-8 mt-16 ml-0  lg:ml-[303px] max-w-sm mx-auto lg:w-1/2">
            <div className="lg:h-[472px] lg:mr-[-96px] shadow-[0_1px_6px_0_rgba(0,0,0,0.3)] bg-white  lg:w-[700px] z-0 lg:mt-0 p-16 relative">
              <img
                src={i1}
                alt="Small Image"
                className="absolute top-[-50px] left-0 w-64 h-32 object-cover border-4 border-white"
              />
              <h5 className="text-lg text-gray-700 z-50 p-1 font-semibold uppercase mb-2">
                {t('about_us')}
              </h5>
              <h2 className="text-5xl font-poppins text-gray-900 mb-4">
                {t('invite')}
              </h2>
              <p className="text-gray-600 mb-6">{t('description')}</p>
              <a href="/aboutUs">
                <button className="bg-brown text-white px-6 py-2 text-lg rounded-lg hover:bg-yellow-600 transition">
                  {t('discover_more')}
                </button>
              </a>
            </div>
          </div>
        </div>
      ) : (
        // LTR Layout
        <div dir="ltr" className="flex flex-wrap items-center justify-between">
          {/* Left Side Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-2/4">
            <img src={i2} alt="Serving Food" className="w-full lg:h-[500px] object-cover" />
            <img src={i3} alt="Serving Drinks" className="w-full h-full object-cover" />
          </div>

          {/* Right Side Content */}
          <div className="p-8 mt-16 max-w-sm mx-auto lg:w-1/2">
            <div className="lg:h-[472px] shadow-[0_1px_6px_0_rgba(0,0,0,0.3)] -ml-10 lg:-ml-64 bg-white lg:w-[700px] z-0 lg:mt-0 p-16 relative">
              <img
                src={i1}
                alt="Small Image"
                className="absolute top-[-50px] right-0 w-64 h-32 object-cover border-4 border-white"
              />
              <h5 className="text-lg text-gray-700 z-50 p-1 lg:mt-0 mt-6 font-semibold uppercase mb-2">
                {t('about_us')}
              </h5>
              <h2 className="text-5xl font-poppins text-gray-900 mb-4">
                {t('invite')}
              </h2>
              <p className="text-gray-600 mb-6">{t('description')}</p>
              <a href="/aboutUs">
                <button className="bg-brown text-white px-6 py-2 text-lg rounded-lg hover:bg-yellow-600 transition">
                  {t('discover_more')}
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RestaurantSection;
