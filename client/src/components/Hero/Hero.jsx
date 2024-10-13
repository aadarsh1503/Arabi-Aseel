import React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import './Hero.css'; // Importing custom CSS for the rotating circle


const Hero = () => {
  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 }, // Start hidden and slightly below
    visible: { opacity: 1, y: 0 },   // Fully visible at original position
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-60 relative">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="https://videos.pexels.com/video-files/4255506/4255506-uhd_2732_1440_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Top bar with contact info */}
      <motion.div 
        className="text-white py-2 px-4 flex justify-between items-center relative z-10 hidden md:flex"
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.2 }} // Control duration and delay
      >
        <div className="flex space-x-4">
          <span className="flex items-center space-x-2">
            <i className="fa fa-phone"></i>
            <span>+4733378901</span>
          </span>
          <span className="flex items-center space-x-2">
            <i className="fa fa-envelope"></i>
            <span>Email: food@restan.com</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <i className="fa fa-map-marker-alt"></i>
          <span>175 10th Street, Office 375 Berlin, De 21562</span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* First Logo - Hidden on Mobile */}
        <motion.div 
          className="absolute top-0 left-0 p-4 hidden md:block"
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <img src="https://wp.validthemes.net/restan/wp-content/uploads/2024/02/logo-1.png" alt="Restan Logo" className="h-24 lg:h-48" />
        </motion.div>

        {/* Second Logo - Centered on Mobile */}
        <motion.div 
          className="absolute lg:top-12 top-32 transform -translate-y-1/2 flex flex-col items-center"
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <img src="https://wp.validthemes.net/restan/wp-content/uploads/2024/02/logo-light-1.png" alt="Small Logo" className="h-12 lg:h-24" />
        </motion.div>

        <motion.h1 
          className="text-4xl sm:text-6xl lg:text-8xl lg:-mt-44 -mt-28 font-bold text-white"
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          RESTAURANT
        </motion.h1>

        <motion.div 
          className="absolute z-10 rounded-full border-4 border-white w-40 h-40 sm:w-32 sm:h-32 lg:w-48 lg:h-48 -mt-28 flex top-2/3 sm:top-1/2 lg:mt-0 items-center justify-center"
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <span className="best-food-text p-4 text-center text-white text-sm sm:text-base lg:text-lg font-serif tracking-widest">
            BEST FOOD SINCE 1985
          </span>
        </motion.div>

        {/* Navigation Menu - Hidden on Mobile */}
        <motion.nav 
          className="absolute bottom-16 flex justify-center space-x-8 text-white text-lg hidden md:flex"
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Pages</a>
          <a href="#" className="hover:underline">Menu</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Shop</a>
          <a href="#" className="hover:underline">Contact</a>
        </motion.nav>
      </div>
    </div>
  );
};

export default Hero;
