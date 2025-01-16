import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook from i18next
import i3 from "./i3.png";
import g1 from "./g1.png";
import "./f.css"
const Footer = () => {
  const { t,i18n  } = useTranslation(); // Initialize translation hook

  return (
    <>
      {/* First Footer */}
      <footer className="text-black   ">
        <div className="relative">
          {/* Footer Decoration Image */}

          {/* Image for large screens */}
          <img
            src={i3}
            alt={t('footer_large_image')}
            className="hidden lg:block absolute inset-0 w-full object-center lg:object-fill h-full  bg-black bg-opacity-0"
          />

          {/* Image for mobile screens */}
          <img
            src={g1}
            alt={t('footer_mobile_image')}
            className="block lg:hidden absolute inset-0 w-full object-center lg:object-fill h-full bg-black bg-opacity-0"
          />

          <div className="container font-serif text-white p-10 md:p-20 mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Us */}
            <div>
              <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('about_us')}</h4>
              <p className="text-sm mb-6">{t('about_us_description')}</p>

             
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('explore')}</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="/aboutUs">{t('about')}</a>
                </li>
                <li>
                  <a href="/contact">{t('contact')}</a>
                </li>
                <li>
                  <a href="#">{t('career')}</a>
                </li>
                <li>
                  <a href="#">{t('company_profile')}</a>
                </li>
                <li>
                  <a href="#">{t('help_center')}</a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('contact_info')}</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <i className="fas fa-map-marker-alt text-[#9b815d] mr-2"></i>
                  {t('address')}
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt text-[#9b815d] mr-2"></i>
                  +973 17772211
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope text-[#9b815d] mr-2"></i>
                  arabiaseelrest@gmail.com
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('newsletter')}</h4>
              <p className="text-sm mb-4">{t('newsletter_description')}</p>
              <form className="flex flex-col">
                <input
                  type="email"
                  className="bg-gray-700 text-white p-2 rounded mb-2"
                  placeholder={t('your_email')}
                />
                <div className="flex items-center mb-4">
            
  <input
    type="checkbox"
    id="checkbox"
   className="mr-2 appearance-none h-4 w-4 border-2 border-gray-300 rounded-sm checked:bg-yellow-500 checked:border-yellow-500 focus:ring-0 relative"
  />
  <p className="text-sm mr-2">{t('privacy_text')}</p>
</div>


<button className="bg-[#9b815d] text-white py-2 px-4 rounded hover:bg-[#7e6849] transition">
                  {/* Conditional Arrow Icon */}
                  {i18n.language === "ar" ? "←" : "→"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
      </footer>
    </>
  );
};

export default Footer;