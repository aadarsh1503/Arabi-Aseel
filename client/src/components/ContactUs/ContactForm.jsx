import React, { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numbers
    if (name === 'phone') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://arabiaseel.com/send_to_a_mail.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ...formData,
          to: 'info@arabiaseel.com'
        })
      });

      if (response.ok) {
        setShowThankYou(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        
        // Hide thank you message after 5 seconds
        setTimeout(() => {
          setShowThankYou(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }

    // Simulate API request delay
// setTimeout(() => {
//   setShowThankYou(true);
//   setFormData({
//     name: '',
//     phone: '',
//     email: '',
//     message: ''
//   });

//   setTimeout(() => {
//     setShowThankYou(false);
//   }, 5000);

//   setIsSubmitting(false);
// }, 1000); // simulate 1s delay

  };

  return (
    <section className="bg-white py-12 px-4 mt-10 sm:px-6 lg:px-8 relative">
     {showThankYou && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="relative bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
      
      {/* ❌ Close Button */}
      <button
        onClick={() => setShowThankYou(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>

      <h3 className="text-2xl font-bold text-yellow-600 mb-4">Thank You!</h3>
      <p className="text-gray-700">Your message has been sent successfully.</p>
      <p className="text-gray-700">We'll get back to you soon.</p>
    </div>
  </div>
)}

      
      <div className="max-w-2xl shadow-custom rounded-xl p-4 mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm uppercase text-yellow-600 tracking-wide">
            {t('keep_in_touch')}
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('send_us_a_message')}
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder={t('name')}
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder={t('phone')}
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <textarea
            rows="5"
            name="message"
            placeholder={t('your_message')}
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          ></textarea>
          <div className="">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center justify-center bg-brown text-white px-6 py-3 rounded-lg hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <AiOutlineSend className="mr-2 ml-2 mt-1" />
              {isSubmitting ? t('sending') : t('get_in_touch')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;