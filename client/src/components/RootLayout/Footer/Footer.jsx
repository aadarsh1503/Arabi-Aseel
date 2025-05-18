import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook from i18next
import i3 from "./i3.png";
import g1 from "./g1.png";
import "./f.css"
const Footer = () => {
  const { t,i18n  } = useTranslation(); // Initialize translation hook
  const isRTL = i18n.language === 'ar'; // Check if the language is Arabic (RTL)
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
            <div className="lg:ml-20 lg:mr-20 mr-0 ml-0">
              <h4 className="text-lg mt-0 lg:mt-20  font-bold mb-4">{t('explore')}</h4>
              <ul className="text-sm space-y-2">
              <li>
                  <a href="/">{t('home')}</a>
                </li>
                <li>
                  <a href="/aboutUs">{t('about')}</a>
                </li>
                <li>
                  <a href="/contact">{t('contact')}</a>
                </li>
                <li>
                  <a href="/menu">{t('menu')}</a>
                </li>
                {/* <li>
                  <a href="#">{t('company_profile')}</a>
                </li>
                <li>
                  <a href="#">{t('help_center')}</a>
                </li> */}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
  <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('contact_info')}</h4>
  <ul className="text-sm space-y-2">
    {/* Address */}
    <li className="flex items-center">
      <i className="fas fa-map-marker-alt text-[#9b815d] mr-2"></i>
      <a
        href="https://www.google.com/maps/place/Arabiaseel+Kitchen/@26.2015165,50.5328398,17z/data=!4m15!1m8!3m7!1s0x3e49afc54b8b1169:0xcb06c2186a95290a!2sArabiaseel+Kitchen!8m2!3d26.201529!4d50.5328325!10e5!16s%2Fg%2F11mcq4rk30!3m5!1s0x3e49afc54b8b1169:0xcb06c2186a95290a!8m2!3d26.201529!4d50.5328325!16s%2Fg%2F11mcq4rk30?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoASAFQAw%3D%3D"
        className=" hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('address')}
      </a>
    </li>

    {/* Phone */}
    <li className="flex items-center">
  <i className="fas fa-phone-alt text-[#9b815d] mr-2"></i>
  <div className="flex space-x-1 text-sm" dir={isRTL ? 'ltr' : 'ltr'}>
    <a href="tel:+97317772211" className="hover:underline">+973 17772211</a>
    <span>/</span>
    <a href="tel:+97333117441" className="hover:underline">+973 33117441</a>
  </div>
</li>


    {/* Email */}
    <li className="flex items-center">
      <i className="fas fa-envelope text-[#9b815d] mr-2"></i>
      <a
        href="mailto:info@arabiaseel.com"
        className=" hover:underline"
      >
        info@arabiaseel.com
      </a>
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
                {/* <div className="flex items-center mb-4">
            
  <input
    type="checkbox"
    id="checkbox"
   className="mr-2 appearance-none h-4 w-4 border-2 border-gray-300 rounded-sm checked:bg-yellow-500 checked:border-yellow-500 focus:ring-0 relative"
  />
  <p className="text-sm mr-2">{t('privacy_text')}</p>
</div> */}


<button className="bg-[#724f38] text-white py-2 px-4 rounded hover:bg-[#7e6849] transition">
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