import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { Puff } from 'react-loader-spinner';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from '../../api/axiosConfig';

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address_title: '',
    address_city: '',
    address_block: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [defaultCountry, setDefaultCountry] = useState('bh'); // Default to Bahrain

  // Fetch country from IP on component mount
  useEffect(() => {
    const fetchCountryFromIP = async () => {
      try {
        const response = await api.get('/registration/country');
        if (response.data.success && response.data.countryCode) {
          setDefaultCountry(response.data.countryCode);
        }
      } catch (error) {
        console.log('Could not detect country, using default (Bahrain)');
      }
    };
    
    fetchCountryFromIP();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/registration/register', formData);
      
      if (response.data.success) {
        setSuccess(true);
        setCouponData(response.data.data);
        toast.success('Registration successful! Check your email for your coupon.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <img 
              src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1770891895/Logoen-2PKGAsjj_tyv30d.png" 
              alt="Arabi Aseel" 
              className="h-24 mx-auto mb-4"
            />
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Congratulations!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your registration is complete. We've sent your exclusive coupon to your email.
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-4 border-dashed border-[#724F38] rounded-xl p-8 mb-6">
            <p className="text-sm text-gray-600 mb-2">YOUR COUPON CODE</p>
            <p className="text-4xl font-bold text-[#724F38] mb-4 tracking-wider font-mono">
              {couponData?.coupon_code}
            </p>
            <p className="text-xl font-semibold text-amber-700">
              {couponData?.coupon_type === 'FREE_MEAL' ? '🍽️ FREE MEAL' : '💰 50% FLAT DISCOUNT'}
            </p>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">How to Use Your Coupon:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Visit Arabi Aseel Restaurant in North Sehla</li>
              <li>Show this coupon code to our staff</li>
              <li>Enjoy your exclusive offer!</li>
            </ol>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Note:</strong> This coupon is valid for one-time use only.
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#724F38] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5a3d2c] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#724F38] text-white p-8 text-center">
            <img 
              src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1770893275/i2_3_uwu1gl.png" 
              alt="Arabi Aseel" 
              className="h-48 mx-auto mb-"
            />
            <h1 className="text-3xl font-bold mb-2">Exclusive Offer</h1>
            <p className="text-amber-100">Register now and get a FREE MEAL or 50% DISCOUNT coupon</p>
            <div className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Limited to first 100 customers only!
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Mobile with Phone Input */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={defaultCountry}
                  value={formData.mobile}
                  onChange={(phone) => setFormData({ ...formData, mobile: phone })}
                  inputProps={{
                    name: 'mobile',
                    required: true,
                  }}
                  containerClass="phone-input-container"
                  inputClass="phone-input-field"
                  buttonClass="phone-input-button"
                  dropdownClass="phone-input-dropdown"
                  searchClass="phone-input-search"
                  enableSearch={true}
                  disableSearchIcon={false}
                  containerStyle={{
                    width: '100%',
                  }}
                  inputStyle={{
                    width: '100%',
                    height: '48px',
                    fontSize: '16px',
                    paddingLeft: '48px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                  }}
                  buttonStyle={{
                    borderRadius: '8px 0 0 8px',
                    border: '1px solid #d1d5db',
                    borderRight: 'none',
                  }}
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Address Title */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Address / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_title"
                  value={formData.address_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder="e.g., Home, Villa 105, Building 500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_city"
                  value={formData.address_city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder="North Sehla"
                />
              </div>

              {/* Block */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Block <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_block"
                  value={formData.address_block}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder="e.g., 1234"
                />
              </div>
            </div>

            {/* Important Note */}
            <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>📍 Important:</strong> This offer is exclusively for residents of North Sehla area. 
                We will verify your location automatically based on your internet connection. 
                If you're outside the eligible area, your registration will not be accepted.
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#724F38] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#5a3d2c] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Puff color="#ffffff" height={24} width={24} />
                    <span className="ml-2">Verifying Location...</span>
                  </>
                ) : (
                  'Register & Get Your Coupon'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            By registering, you agree to receive promotional emails from Arabi Aseel Restaurant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
