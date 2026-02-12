import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosConfig";
import i3 from "./i3.png";
import g1 from "./g1.png";
import "./f.css";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState('1.0.0');

  useEffect(() => {
    fetchVersion();
  }, []);

  const fetchVersion = async () => {
    try {
      const response = await api.get('/settings/version');
      setVersion(response.data.version);
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage(t('invalid_email') || 'Please enter a valid email.');
      setTimeout(() => setMessage(''), 3000); // ⏱️ Hide message after 3 sec
      return;
    }
  
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('list', 'VilFsWXO5bEaoHra0XWIXw');
      formData.append('subform', 'yes');
      formData.append('hp', '');
  
      await fetch('https://send.alzyara.com/subscribe', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
  
      setMessage(t('thank_you_subscribed') || 'Thank you for subscribing!');
      setEmail('');
  
      setTimeout(() => setMessage(''), 3000); // ⏱️ Hide message after 3 sec
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage(t('subscription_error') || 'Subscription failed. Try again.');
  
      setTimeout(() => setMessage(''), 3000); // ⏱️ Hide message after 3 sec
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <footer className="text-black">
        <div className="relative">
          <img
            src={i3}
            alt={t('footer_large_image')}
            className="hidden lg:block absolute inset-0 w-full object-center lg:object-fill h-full bg-black bg-opacity-0"
          />
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
              <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('explore')}</h4>
              <ul className="text-sm space-y-2">
                <li><a href="/">{t('home')}</a></li>
                <li><a href="/aboutUs">{t('about')}</a></li>
                <li><a href="/contact">{t('contact')}</a></li>
                <li><a href="/menu">{t('menu')}</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('contact_info')}</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <i className="fas fa-map-marker-alt text-[#9b815d] mr-2"></i>
                  <a href="https://www.google.com/maps/place/Arabiaseel+Kitchen/@26.2015165,50.5328398,17z/data=!4m15..." className="hover:underline" target="_blank" rel="noopener noreferrer">
                    {t('address')}
                  </a>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt text-[#9b815d] mr-2"></i>
                  <div className="flex space-x-1 text-sm" dir={isRTL ? 'ltr' : 'ltr'}>
                    <a href="tel:+97317772211" className="hover:underline">+973 17772211</a>
                    <span>/</span>
                    <a href="tel:+97333117441" className="hover:underline">+973 33117441</a>
                  </div>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope text-[#9b815d] mr-2"></i>
                  <a href="mailto:info@arabiaseel.com" className="hover:underline">
                    info@arabiaseel.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg mt-0 lg:mt-20 font-bold mb-4">{t('newsletter')}</h4>
              <p className="text-sm mb-4">{t('newsletter_description')}</p>
              <form className="flex flex-col" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded mb-2"
                  placeholder={t('your_email')}
                  required
                />
                <button
                  type="submit"
                  className="bg-[#724f38] text-white py-2 px-4 rounded hover:bg-[#7e6849] transition"
                  disabled={loading}
                >
                  {loading ? t('subscribing') || 'Subscribing...' : (i18n.language === "ar" ? "←" : "→")}
                </button>
                {message && <p className="text-xs mt-2 text-white">{message}</p>}
              </form>
            </div>
          </div>
        </div>
        
        {/* Version Footer */}
        <div className="bg-black text-center py-4 border-t border-gray-700">
          <p className="text-white text-sm">
            {t('restaurant_name')} v{version}
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
