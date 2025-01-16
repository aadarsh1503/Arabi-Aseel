import React from 'react';
import { useTranslation } from 'react-i18next'; // Import i18next hook for translation

const OpeningHours = () => {
  const { t,i18n } = useTranslation(); // Use i18next translation hook
  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic (RTL)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen px-4 max-w-7xl mx-auto mt-6 lg:mt-16 relative gap-8">
      {/* Left Column: Video and RESTAN text */}
      <div className="relative flex flex-col justify-center items-center lg:items-start">
        {/* RESTAN Text */}
        <div className="absolute top-9 font-serif text-5xl lg:py-16 lg:text-7xl font-bold opacity-5 z-20">
        {t('ARABI_ASEEL')}
        </div>

        {/* Video - Visible on large screens only */}
        <video
          className="w-full lg:w-[150%] h-[300px] lg:h-[500px] rounded-md hidden lg:block" // Hidden on mobile, shown on large screens
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
          className="w-full h-auto rounded-md block lg:hidden" // Shown on mobile, hidden on large screens
          src="https://img.freepik.com/premium-vector/cartoon-chef-character-holding-silver-platter_1151483-34531.jpg?w=1060" // Replace with your desired image URL
          alt="Chef Character"
        />
      </div>

      {/* Right Column: Card and Image */}
      <div className="flex flex-col justify-between items-center  lg:-mt-4 lg:mr-24 lg:items-start lg:w-full">
        {/* Card Section */}
        <div className="relative z-10 shadow-custom lg:w-3/4 w-full bg-white  rounded-md p-6 mb-8 lg:mb-0">
          <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">{t('opening_hours')}</h2> {/* Translated title */}
          <p className="mb-6 text-gray-600 text-center lg:text-left">
            {t('relaxing_atmosphere')} {/* Translated description */}
          </p>

          {/* Opening Hours */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <p className="font-medium">{t('sunday_to_tuesday')}:</p>
              <p className="text-gray-600">10:00 - 09:00</p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <p className="font-medium">{t('wednesday_to_thursday')}:</p>
              <p className="text-gray-600">11:30 - 10:30</p>
            </div>

            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <p className="font-medium">{t('friday_saturday')}:</p>
              <p className="text-gray-600">10:30 - 12:00</p>
            </div>
          </div>

          {/* Contact Information */}
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
              <p className="text-lg font-serif font-semibold"> <span dir={isRTL ? "ltr" : "ltr"}>+973 17772211</span></p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-5/5">
          <img
            className="rounded-md w-full opacity-15 h-auto" // Set width to 100% and height auto for responsiveness
            src="https://wp.validthemes.net/restan/wp-content/uploads/2024/01/4-1.png"
            alt="Flower"
          />
        </div>
      </div>
    </div>
  );
};

export default OpeningHours;
