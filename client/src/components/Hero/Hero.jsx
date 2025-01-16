import React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import './Hero.css'; // Importing custom CSS for the rotating circle
import i2 from "./i2.png";
import ar from "./ar.png";
import Navbar from "../RootLayout/Navbar/Navbar";
import ServiceSection from "../ServiceSection/ServiceSection";
import PromotionSection from "../PromotionSection/PromotionSection";
import SpecialsMenu from "../SpecialMenu/SpecialMenu";
import OpeningHours from "../OpeningHours/OpeningHours";
import ChefsSection from "../ChefSection/ChefSection";
import PopularCategories from "../PopularCategory/PopularCategory";
import OnlineOrderSection from "../OnlineOrderSection/OnlineOrderSection";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t, i18n } = useTranslation(); // Access translation function and language
  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic (RTL)
  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 }, // Start hidden and slightly below
    visible: { opacity: 1, y: 0 },   // Fully visible at original position
  };

  return (
    <div className="hero-container">
    <div
      className={`h-screen ${isRTL ? 'mt-[-142px]' : 'mt-[-115px]'} font-poppins bg-black bg-opacity-60`}
    >
      {/* Background Video for all screens */}
      <video
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 w-full h-full object-cover bg-opacity-0 z-[-1]"
      >
        <source
          src="https://videos.pexels.com/video-files/5780424/5780424-uhd_2560_1440_24fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 pt-1">
        {/* First Logo - Hidden on Mobile */}

        {/* Second Logo - Centered on Mobile */}
        <motion.div
          className="absolute lg:top-[100px] mb-8 top-32 transform -translate-y-1/2 flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
           {isRTL ? (
              <img
                src={ar} // RTL logo
                alt="RTL Logo"
                className="h-72 mt-0 lg:-mt-16 lg:h-[400px]"
              />
            ) : (
              <img
                src={i2} // LTR logo
                alt="LTR Logo"
                className="h-56 lg:h-72"
              />
            )}
        </motion.div>

          <motion.div
            className="absolute z-10 lg:top-[356px] rounded-full border-4 border-white w-40 h-40 sm:w-32 sm:h-32 lg:w-48 lg:h-48 -mt-28 flex top-2/3 sm:top-1/2 lg:mt-0 items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <span className="best-food-text p-4 text-center text-white text-sm sm:text-base lg:text-lg font-serif tracking-widest">
            {t("opening_soon")}
            </span>
          </motion.div>

          {/* Navigation Menu - Hidden on Mobile */}
        </div>
      </div>
      <PopularCategories />
      <ServiceSection />
      <PromotionSection />
      <SpecialsMenu />
      <OnlineOrderSection />
      <OpeningHours />
      <ChefsSection />
    </div>
  );
};

export default Hero;

