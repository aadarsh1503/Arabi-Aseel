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
import LanguageToggle from "../../../LanguageToggle";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState("bg-opacity-0");
  const [isRTL, setIsRTL] = useState(i18n.language === "ar");

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

  useEffect(() => {
    setIsRTL(i18n.language === "ar");
  }, [i18n.language]);

  const menuItems = [
    { icon: <FaHome className="mr-2" />, text: t("home"), route: "/" },
    { icon: <FaFileAlt className="mr-2" />, text: t("about_us"), route: "/aboutUs" },
    { icon: <FaUtensils className="mr-2" />, text: t("menu"), route: "/menu" },
    { icon: <FaShoppingCart className="mr-2" />, text: t("shop"), route: "" },
    { icon: <FaComments className="mr-2" />, text: t("contact"), route: "/contact" },
  ];

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div
      className={`relative z-50 bg-black bg-opacity-60 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <nav
        className={`text-white left-0 w-full shadow-lg top-10 z-30 ${navbarStyle}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex max-w-7xl mx-auto justify-between items-center">
          <img src={i2} alt="Logo" className="h-24" />
          {isMobile ? (
            <div
              onClick={handleToggleMenu}
              className="cursor-pointer text-xl z-30 ml-4"
            >
              {isMenuOpen ? <span>✕</span> : <span>☰</span>}
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-6 text-base font-semibold">
              <ul className="flex space-x-6 bg-opacity-100">
                {menuItems.map((item, index) => (
                  <li key={index} className="relative group p-2">
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
                  </li>
                ))}
              </ul>
              <div className="ml-6">
                <LanguageToggle />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
