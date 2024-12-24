import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import {
  FaHome,
  FaFileAlt,
  FaUtensils,
  FaBlog,
  FaShoppingCart,
  FaComments,
} from "react-icons/fa";
import "font-awesome/css/font-awesome.min.css";
import i2 from "./i2.png"; // Import logo

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobileScreen = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkMobileScreen();
    window.addEventListener("resize", checkMobileScreen);
    return () => {
      window.removeEventListener("resize", checkMobileScreen);
    };
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const menuItems = [
    {
      icon: <FaHome className="mr-2" />,
      text: "Home",
      route: "/",
    },
    {
      icon: <FaFileAlt className="mr-2" />,
      text: "About Us",
     route:'/aboutUs'
    },
    {
      icon: <FaUtensils className="mr-2" />,
      text: "Menu",
          route:'/menu-1'
    },
   
    {
      icon: <FaShoppingCart className="mr-2" />,
      text: "Shop",
      dropdown: [
        { text: "Shop", route: "/shop-new-arrivals" },
        { text: "Shop Single", route: "/shop-best-sellers" },
        { text: "Cart", route: "/shop-best-sellers" },
        { text: "Checkout", route: "/shop-best-sellers" },
      ],
    },
    {
      icon: <FaComments className="mr-2" />,
      text: "Contact",
      route: "/contact",
    },
  ];

  return (
    <div className="relative z-50">
      {/* Contact Info Bar */}
      <div className="bg-black max-w-7xl mx-auto bg-opacity-0">
        <div className="text-white py-2 px-4 flex justify-between items-center text-base md:text-base ">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaPhoneAlt />
              <span>+973 17772211</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaEnvelope />
              <span>arabiaseelrest@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt />
            <span>
              Building 1320, Road 4149, Block 441, North Sehla, Bahrain
            </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="text-white bg-black bg-opacity-0 left-0 w-full shadow-lg top-10 z-30">
        {/* Logo and Menu Icon */}
        <div className="flex max-w-7xl mx-auto justify-between items-center ">
          <img src={i2} alt="MyApp Logo" className="h-24" />
          {isMobile ? (
            <div
              onClick={handleToggleMenu}
              className="cursor-pointer text-xl"
              style={{ zIndex: 30 }}
            >
              {isMenuOpen ? <span>✕</span> : <span>☰</span>}
            </div>
          ) : (
            <ul className="hidden text-white bg-opacity-100 lg:flex space-x-6 text-base font-semibold">
              {menuItems.map((item, index) => (
                <li key={index} className="relative group p-2">
                  {item.route ? (
                    <a
                      href={item.route}
                      className="hover:text-yellow-500 cursor-pointer flex items-center"
                    >
                      {item.icon}
                      {item.text}
                    </a>
                  ) : (
                    <>
                      <div className="hover:text-yellow-500 cursor-pointer flex items-center">
                        {item.icon}
                        {item.text}
                      </div>
                      {item.dropdown && (
                        <div className="absolute hidden group-hover:block p-4 mt-2 flex-col z-50 bg-white text-black lg:w-[220px] -ml-2 rounded shadow-lg">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <li key={idx} className="relative group">
                              <a
                                href={dropdownItem.route}
                                className="hover:text-yellow-500 w-full px-4 py-3 flex justify-between items-center"
                              >
                                {dropdownItem.text}
                                {dropdownItem.dropdown && <span>▶</span>}
                              </a>
                              {/* Nested dropdown (with group hover) */}
                              {dropdownItem.dropdown && (
                                <div className="absolute hidden group-hover:block p-4 mt-2 flex-col z-50 bg-white text-black lg:w-[256px] left-full top-0 rounded shadow-lg">
                                  {dropdownItem.dropdown.map((nestedItem, nestedIdx) => (
                                    <li key={nestedIdx} className="hover:text-yellow-500 px-4 py-3">
                                      <a href={nestedItem.route}>{nestedItem.text}</a>
                                    </li>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Menu Items */}
        {isMobile && isMenuOpen && (
          <div
            className="bg-white transition-transform duration-[2s] transform py-6 rounded-lg shadow-lg"
            style={{
              position: "absolute",
              top: "56px",
              left: 0,
              width: "100%",
              zIndex: 10,
            }}
          >
            <ul className="flex flex-col items-center space-y-4">
              {menuItems.map((item, index) => (
                <li key={index} className="flex flex-col items-start w-full">
                  <div className="hover:text-yellow-500 cursor-pointer text-lg font-semibold flex items-center space-x-2">
                    {item.icon}
                    {item.text}
                  </div>
                  {item.dropdown && (
                    <ul className="ml-4 mt-2">
                      {item.dropdown.map((dropdownItem, idx) => (
                        <li key={idx} className="hover:text-yellow-500 px-2 py-1">
                          <a href={dropdownItem.route}>{dropdownItem.text}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
