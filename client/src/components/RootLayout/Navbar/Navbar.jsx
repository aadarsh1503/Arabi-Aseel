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
import LanguageSwitcher from "../../LanguageSwticher/LanguageSwitcher";
import LanguageToggle from "../../../LanguageToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState("bg-opacity-0");

  useEffect(() => {
    if (
      window.location.pathname === "/menu" ||
      window.location.pathname === "/contact" ||
      window.location.pathname === "/aboutUs"
    ) {
      setNavbarStyle("bg-opacity-100 bg-black");
    } else {
      setNavbarStyle("bg-opacity-0");
    }
  }, []);

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
      route: "/aboutUs",
    },
    {
      icon: <FaUtensils className="mr-2" />,
      text: "Menu",
      route: "/menu",
    },
    {
      icon: <FaShoppingCart className="mr-2" />,
      text: "Shop",
      route: "",
    },
    {
      icon: <FaComments className="mr-2" />,
      text: "Contact",
      route: "/contact",
    },
  ];

  return (
    <div className="relative z-50 bg-black bg-opacity-60" >
      
      {/* Navbar */}
      <nav
        className={`text-white left-0 w-full shadow-lg top-10 z-30 ${navbarStyle}`}
      >
       <div className="flex max-w-7xl mx-auto justify-between items-center">
  {/* Logo */}
  <img src={i2} alt="MyApp Logo" className="h-24" />
  
  {/* Menu */}
  {isMobile ? (
    <div
      onClick={handleToggleMenu}
      className="cursor-pointer text-xl z-30 ml-4"
    >
      {isMenuOpen ? <span>✕</span> : <span>☰</span>}
    </div>
  ) : (
    <div className="hidden lg:flex items-center space-x-6 text-base font-semibold">
      {/* Menu Items */}
      <ul className="flex space-x-6 bg-opacity-100">
        {menuItems.map((item, index) => (
          <li key={index} className="relative group p-2">
            {item.route ? (
              <a
                href={item.route}
                className={`cursor-pointer flex items-center ${
                  window.location.pathname === item.route
                    ? "text-yellow-500"
                    : "hover:text-yellow-500"
                }`}
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
                        </a>
                      </li>
                    ))}
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      
      {/* Language Switcher */}
      <div className="ml-6">
        <LanguageToggle />
      </div>
    </div>
  )}
</div>

      

        {/* Mobile Slide-In Menu */}
        {isMobile && (
          <div
            className={`fixed top-0 left-0 h-full bg-black text-white w-3/4 transform transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } z-40`}
          >
            <ul className="flex flex-col items-start space-y-4 mt-6 px-4">
              {menuItems.map((item, index) => (
                <li key={index} className="w-full">
                  <a
                    href={item.route || "#"}
                    className={`flex items-center space-x-2 py-2 text-lg font-semibold ${
                      window.location.pathname === item.route
                        ? "text-yellow-500"
                        : "hover:text-yellow-500"
                    }`}
                  >
                    {item.icon}
                    {item.text}
                  </a>
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
