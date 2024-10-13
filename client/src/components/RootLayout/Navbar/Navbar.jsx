import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"; // Importing React Icons
import { FaHome, FaFileAlt, FaUtensils, FaBlog, FaShoppingCart, FaComments } from "react-icons/fa"; // Additional icons for menu
import "font-awesome/css/font-awesome.min.css"; // Ensure Font Awesome is imported

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the screen is mobile size
  const checkMobileScreen = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
  };

  useEffect(() => {
    checkMobileScreen();
    window.addEventListener("resize", checkMobileScreen);
    return () => {
      window.removeEventListener("resize", checkMobileScreen);
    };
  }, []);

  // Toggle Menu
  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  if (!isMobile) return null; // Render nothing on larger screens

  return (
    <nav className="mobile-navbar bg-white text-black fixed top-0 left-0 w-full z-20 shadow-lg">
      {/* Mobile Menu Icon */}
      <div className="flex justify-between items-center p-4 bg-white">
        <img 
          src="https://wp.validthemes.net/restan/wp-content/uploads/2024/02/logo-1.png" // Replace with your image path
          alt="MyApp Logo" 
          className="h-8" // Adjust height as needed
        />
        <div 
          onClick={handleToggleMenu} 
          className="cursor-pointer text-2xl mr-4" // Added margin-right for spacing
          style={{ zIndex: 30 }} // Ensures the icon is above other elements
        >
          {isMenuOpen ? (
            <span>✕</span> // Close icon
          ) : (
            <span>☰</span> // Open icon
          )}
        </div>
      </div>

      {/* Menu Items including Contact Info */}
      <div 
        className={`bg-white transition-transform duration-[2s] transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} py-6 rounded-lg shadow-lg`} 
        style={{ position: 'absolute', top: '56px', left: 0, width: '100%', zIndex: 10 }} // Positioning menu below the navbar
      >
        {/* Menu Links with Icons */}
        <ul className={`flex flex-col items-center space-y-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <li className="flex items-center hover:text-yellow-500 cursor-pointer text-lg font-semibold">
            <FaHome className="mr-2" /> Home
          </li>
          <li className="flex items-center hover:text-yellow-500 cursor-pointer text-lg font-semibold">
            <FaFileAlt className="mr-2" /> Pages
          </li>
          <li className="flex items-center hover:text-yellow-500 cursor-pointer text-lg font-semibold">
            <FaUtensils className="mr-2" /> Menu
          </li>
          <li className="flex items-center hover:text-yellow-500 cursor-pointer text-lg font-semibold">
            <FaBlog className="mr-2" /> Blog
          </li>
          <li className="flex items-center hover:text-yellow-500 cursor-pointer text-lg font-semibold">
            <FaShoppingCart className="mr-2" /> Shop
          </li>
          <li className="flex items-center hover:text-yellow-500 cursor-pointer text-lg font-semibold">
            <FaComments className="mr-2" /> Contact
          </li>
        </ul>

        {/* Contact Info Section inside Menu */}
        <div className="border-t border-gray-600 mt-6 pt-4 px-4 space-y-2 text-center">
          <h3 className="text-lg font-bold">Contact Us</h3>
          <div className="flex items-center justify-center space-x-2">
            <FaPhoneAlt />
            <span>+4733378901</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <FaEnvelope />
            <span>food@restan.com</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <FaMapMarkerAlt />
            <span>175 10th Street, Berlin</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
