import React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import './Hero.css'; // Importing custom CSS for the rotating circle
import i2 from "./i2.png"

const Hero = () => {
  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 }, // Start hidden and slightly below
    visible: { opacity: 1, y: 0 },   // Fully visible at original position
  };

  return (
    <div className="min-h-screen font-poppins relative bg-black bg-opacity-60">
      {/* Background Video for large screens */}
      <video
        autoPlay
        loop
        muted
        className="absolute left-0 w-full h-full object-cover z-[-1] hidden md:block"
      >
        <source src="https://videos.pexels.com/video-files/4255506/4255506-uhd_2732_1440_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Background Image for mobile screens */}
      <div className="absolute left-0 w-full h-full bg-cover bg-center z-[-1] md:hidden" style={{ backgroundImage: 'url(https://img.freepik.com/free-photo/restaurant-luxury-interior-design-dark-lightning_114579-2492.jpg?w=740&t=st=1728965397~exp=1728965997~hmac=c63e0f0c272ed15af9d7475674ede0bcaf7c253c8ee1f1e45efb556e3fd0e681)' }} />
      
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
            <span>+973 17772211</span>
          </span>
          <span className="flex items-center space-x-2">
            <i className="fa fa-envelope"></i>
            <span>Email: arabiaseelrest@gmail.com</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <i className="fa fa-map-marker-alt"></i>
          <span>Building 1320, Road 4149, Block 441, North Sehla, Bahrain</span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* First Logo - Hidden on Mobile */}
        
        {/* Second Logo - Centered on Mobile */}
        <motion.div 
          className="absolute lg:top-12 top-32 transform -translate-y-1/2 flex flex-col items-center"
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <img src={i2} alt="Small Logo" className="h-12 lg:h-72" />
        </motion.div>

    

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
