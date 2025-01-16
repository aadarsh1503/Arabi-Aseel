import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppStore, faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next'; // Import i18next hook for translation
import i1 from "./i1.png"
import i2 from "./i2.png"
const OnlineOrderSection = () => {
  const { t ,i18n} = useTranslation(); // Initialize translation hook
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="flex flex-col lg:flex-row mb-10 lg:mb-0 items-center rounded-xl max-w-6xl mx-auto justify-center bg-black text-white py-16 px-8 relative">
      {/* Left Side Image Section */}
      <div className="relative flex-1 flex justify-center items-center order-2 lg:order-1">
      <div className="relative lg:mt-0 mt-4">
      {/* Main Phone Image */}
      <img
        src={isRTL ? i2 : i1}
        alt="Main Phone"
        className="w-64 lg:w-[500px] drop-shadow-xl"
      />
    </div>
      </div>

      {/* Right Side Text and Buttons Section */}
      <div className="flex-1 lg:pl-1 text-center lg:text-left order-1 lg:order-2">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4">{t('ready_to_order')}</h2>
        <p className="text-gray-400 mb-8">
          {t('order_description')}
        </p>
        <div className="flex justify-center lg:justify-start space-x-6 rtl:space-x-reverse">
        <button className="bg-white hover:bg-black hover:text-white mt-1 outline-white outline text-black py-1 lg:px-8 px-6 rounded-full h-11 font-semibold flex items-center justify-center lg:w-[180px]">
  <span className="ml-2 mr-2 mt-1">
    {/* App Store Icon */}
    <FontAwesomeIcon icon={faAppStore} className="w-5 h-5" />
  </span>
  {t('app_store')}
</button>

          <button className="bg-brown text-white hover:bg-white hover:text-black lg:py-1   py-1 rounded-full font-semibold flex h-12 items-center justify-center lg:w-[180px]">
            <span className="ml-1 mr-1 mt-1">
              {/* Play Store Icon */}
              <FontAwesomeIcon icon={faGooglePlay} className="w-5 h-5" />
            </span>
            {t('play_store')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineOrderSection;
