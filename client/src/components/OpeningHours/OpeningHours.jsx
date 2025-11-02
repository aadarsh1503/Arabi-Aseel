import React from 'react';
import { useTranslation } from 'react-i18next';
import i2 from "./i2.png";
import a2 from "./a2.png"
const OpeningHours = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="grid grid-cols-1  lg:grid-cols-2 min-h-screen px-4 max-w-7xl mx-auto  relative gap-8">
      
      {/* Left Column */}
      <div className="relative flex flex-col justify-center items-center lg:items-start">
        
        {/* Logo ABOVE the video */}
        <div className="relative   flex justify-center lg:justify-start w-full">
  {/* English Logo */}
  {!isRTL && (
    <img
      src={i2}
      alt="English Logo"
      className="w-40 lg:w-64 relative top-0 lg:top-24 left-0 lg:left-32 opacity-70"
      style={{ filter: 'grayscale(100%) brightness(0.7)' }}
    />
  )}

  {/* Arabic Logo */}
  {isRTL && (
    <img
      src={a2}
      alt="Arabic Logo"
      className="w-40 lg:w-32 relative lg:right-56 right-0 top-0 lg:top-12  opacity-70"
      style={{ filter: 'grayscale(100%) brightness(0.7)' }}
    />
  )}
</div>




        {/* Video - Visible on large screens only */}
        <video
          className="w-full lg:w-[150%] h-[300px] lg:h-[500px] rounded-md hidden lg:block"
          src="https://videos.pexels.com/video-files/4253721/4253721-uhd_2732_1440_25fps.mp4"
          loop
          autoPlay
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>

        {/* Image - Visible on mobile screens only */}
        <img
          className="w-full h-auto rounded-md block lg:hidden"
          src="https://img.freepik.com/premium-vector/cartoon-chef-character-holding-silver-platter_1151483-34531.jpg?w=1060"
          alt="Chef Character"
        />
      </div>

      {/* Right Column */}
      <div className="flex flex-col justify-between items-center lg:mt-32 lg:mr-24 lg:items-start lg:w-full">
        
        {/* Card Section */}
        <div className="relative z-10 shadow-custom lg:w-3/4 w-full bg-white rounded-md p-6 mb-8 lg:mb-0">
          <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">{t('opening_hours')}</h2>
          <p className="mb-6 text-gray-600 text-center lg:text-left">
            {t('relaxing_atmosphere')}
          </p>

          {/* Opening Hours */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <p className="font-medium">{t('all_days')}:</p>
              <p className="text-gray-600">10:00 - 10:00</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex items-center mt-6">
            <div className="bg-gray-200 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 9l4-16l3 7h4" />
              </svg>
            </div>
            <div className="ml-4 mr-4">
              <p className="text-sm text-gray-500">{t('call_anytime')}</p>
              <p className="text-lg font-serif font-semibold">
  <span dir={isRTL ? "ltr" : "ltr"}>
    <a href="tel:+97317772211" className="hover:text-yellow-600 transition-colors duration-200">
      +973 17772211
    </a>
    {' / '}
    <a href="tel:+97333117441" className="hover:text-yellow-600 transition-colors duration-200">
      +973 33117441
    </a>
  </span>
</p>

            </div>
          </div>
        </div>

        {/* Bottom Decorative Image */}
        <div className="lg:w-5/5">
          <img
            className="rounded-md w-full opacity-15 h-auto"
            src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/4-1.png"
            alt="Flower"
          />
        </div>
      </div>
    </div>
  );
};

export default OpeningHours;
