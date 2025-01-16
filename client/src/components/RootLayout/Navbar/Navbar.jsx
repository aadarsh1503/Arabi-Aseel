import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaFileAlt,
  FaUtensils,
  FaShoppingCart,
  FaComments,
} from "react-icons/fa";

import i2 from "./i2.png";
import ar from "./ar.png";
import LanguageToggle from "../../../LanguageToggle";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(i18n.language === "ar");

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
  const [navbarStyle1, setNavbarStyle1] = useState("bg-opacity-0");
  useEffect(() => {
    if (
      window.location.pathname === "/menu" ||
      window.location.pathname === "/contact" ||
      window.location.pathname === "/aboutUs"
    ) {
      setNavbarStyle1("bg-opacity-100 bg-brown");
    } else {
      setNavbarStyle1("bg-opacity-0");
    }
  }, []);

  useEffect(() => {
    setIsRTL(i18n.language === "ar");
  }, [i18n.language]);

  const menuItems = [
    { icon: <FaHome className="mr-2 ml-2" />, text: t("home"), route: "/" },
    { icon: <FaFileAlt className="mr-2 ml-2" />, text: t("about_us"), route: "/aboutUs" },
    { icon: <FaUtensils className="mr-2 ml-2" />, text: t("menu"), route: "/menu" },
   
    { icon: <FaComments className="mr-2 ml-2" />, text: t("contact"), route: "/contact" },
  ];

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={`relative z-50 bg-black bg-opacity-60 ${isRTL ? "text-right" : "text-left"}`}>
    {/* Top Bar */}
    <div className={`bg-black bg-opacity-0 text-white text-sm py-2 ${navbarStyle1}`}>
      <div className="max-w-7xl mx-auto flex space-x-4 items-center px-4">
        <div className="flex items-center space-x-2">
          <AiOutlinePhone className="lg:text-lg text-xs  ml-2 " />
          <span dir={isRTL ? "ltr" : "ltr"}>+973 17772211</span>
        </div>
        <div className="flex items-center space-x-2">
          <AiOutlineMail className="lg:text-lg text-  ml-2" />
          <span>arabiaseelrest@gmail.com</span>
        </div>
      </div>
    </div>
      {/* Main Navbar */}
      <nav
        className={`text-white left-0 w-full shadow-lg top-0 z-30 ${navbarStyle}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex max-w-7xl mx-auto justify-between items-center">
        {isRTL ? (
    <img
      src={ar}
      alt="RTL Logo"
      className="h-32 -mt-5 w-32"
    />
  ) : (
    <img
      src={i2}
      alt="LTR Logo"
      className="h-20  w-20"
    />
  )}
          <div
            onClick={handleToggleMenu}
            className={`lg:hidden cursor-pointer text-xl z-30 absolute ${isRTL ? "left-4" : "right-4"}`}
          >
            {isMenuOpen ? <span></span> : <span>☰</span>}
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-base font-semibold">
            <ul className="flex space-x-6 bg-opacity-100">
              {menuItems.map((item, index) => (
                <li key={index} className="relative group p-2">
                  <a
                    href={item.route}
                    className={`cursor-pointer flex items-center ${
                      window.location.pathname === item.route
                        ? "text-yellow-500"
                        : "hover:text-brown"
                    }`}
                  >
                    {item.icon}
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
            <div className="ml-6">
              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-black bg-opacity-90 z-40 transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-3/4`}
      >
        {/* Cross icon inside the menu */}
        <div className="flex justify-between items-center w-full p-6">
          <span className="text-white text-2xl font-semibold">Menu</span>
          <div
            className="text-white text-2xl cursor-pointer"
            onClick={() => setIsMenuOpen(false)} // Close menu on click
          >
            ✕
          </div>
        </div>

        {/* Menu items */}
        <div className="flex flex-col items-start justify-center h-full space-y-6 text-white p-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.route}
              className="text-xl font-medium flex items-center hover:text-yellow-500"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              {item.icon}
              {item.text}
            </a>
          ))}
          <div className="mt-6">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
