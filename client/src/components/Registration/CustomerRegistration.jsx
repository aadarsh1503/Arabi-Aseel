import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puff } from 'react-loader-spinner';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';

const BASEURL = import.meta.env.VITE_API_BASE_URL || '';

const CustomerRegistration = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locationObtainedRef = useRef(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address_title: '',
    building_number: '',
    address_city: '',
    address_block: '',
    latitude: null,
    longitude: null
  });

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationObtained, setLocationObtained] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [deniedMessage, setDeniedMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [defaultCountry, setDefaultCountry] = useState('bh');

  // Request location permission on component mount
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      requestLocationPermission();
    }, 500);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      toast.error('Geolocation is not supported by your browser');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    console.log('Requesting location permission...');
    setLocationLoading(true);
    
    // Clear any existing toasts
    toast.dismiss();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ SUCCESS: Location permission granted:', position.coords);
        const { latitude, longitude } = position.coords;
        
        // Mark that location was obtained successfully (using ref for immediate access)
        locationObtainedRef.current = true;
        setLocationObtained(true);
        
        // Clear any error toasts
        toast.dismiss();
        
        // Update form data with coordinates
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }));

        // Verify if location is in North Sehla
        verifyLocation(latitude, longitude);
      },
      (error) => {
        console.error('❌ ERROR: Geolocation error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Location obtained ref:', locationObtainedRef.current);
        
        // Wait a bit to see if success callback will be called
        setTimeout(() => {
          // Only handle error if location wasn't already obtained
          if (!locationObtainedRef.current) {
            console.log('Showing error message - location was not obtained');
            let errorMessage = 'Location access is required. ';
            
            switch(error.code) {
              case 1: // PERMISSION_DENIED
                errorMessage += 'Please allow location access in your browser settings and click "Try Again".';
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage += 'Location information is unavailable. Please check your device settings.';
                break;
              case 3: // TIMEOUT
                errorMessage += 'Location request timed out. Please try again.';
                break;
              default:
                errorMessage += 'An unknown error occurred.';
            }
            
            toast.error(errorMessage, { autoClose: false });
            setLocationLoading(false);
          } else {
            console.log('✅ Ignoring error - location was already obtained successfully');
          }
        }, 100); // Small delay to let success callback run first
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const verifyLocation = async (lat, lng) => {
    try {
      // Send coordinates to backend for polygon-based verification
      const verificationResponse = await fetch(`${BASEURL}/api/registration/verify-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng
        })
      });

      const verificationData = await verificationResponse.json();

      if (verificationData.valid) {
        setLocationVerified(true);
        
        // Fetch address from coordinates using reverse geocoding (English only)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
            {
              headers: {
                'User-Agent': 'ArabiAseelRestaurant/1.0'
              }
            }
          );
          const data = await response.json();
          
          if (data && data.address) {
            console.log('Address data:', data.address);
            
            // Extract address components (English only)
            const address = data.address;
            const city = address.city || address.town || address.village || address.county || '';
            const postalCode = address.postcode || '';
            
            // Auto-fill only city and postal code
            setFormData(prev => ({
              ...prev,
              address_city: city,
              address_block: postalCode
            }));
            
            toast.success(`Location verified in ${verificationData.areaName}!`, { autoClose: 3000 });
          }
        } catch (geoError) {
          console.error('Geocoding error:', geoError);
          toast.success(`Location verified in ${verificationData.areaName}!`, { autoClose: 3000 });
        }
        
        setLocationLoading(false);
        
        // Fetch country for phone input
        fetchCountryFromIP();
      } else {
        // Location is outside eligible areas
        setLocationDenied(true);
        // Don't set message here, we'll use translation in the component
        setLocationLoading(false);
      }
    } catch (error) {
      console.error('Location verification error:', error);
      setLocationDenied(true);
      // Don't set message here, we'll use translation in the component
      setLocationLoading(false);
    }
  };

  const fetchCountryFromIP = async () => {
    try {
      const response = await fetch(`${BASEURL}/api/registration/country`);
      const data = await response.json();
      if (data.success && data.countryCode) {
        setDefaultCountry(data.countryCode);
      }
    } catch (error) {
      console.log('Could not detect country, using default (Bahrain)');
    }
  };

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
      const response = await fetch(`${BASEURL}/api/registration/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setCouponData(data.data);
        toast.success('Registration successful! Check your email for your coupon.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while verifying location
  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <ToastContainer position="top-center" autoClose={5000} />
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <img 
              src={i18n.language === 'ar' 
                ? "https://res.cloudinary.com/ds1dt3qub/image/upload/v1771073039/Arabi_Aseel_Logo_Transparent-01_1_s1cd5c.png"
                : "https://res.cloudinary.com/ds1dt3qub/image/upload/v1770891895/Logoen-2PKGAsjj_tyv30d.png"
              }
              alt="Arabi Aseel" 
              className="h-24 mx-auto mb-4"
            />
            <Puff color="#724F38" height={60} width={60} wrapperClass="justify-center" />
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
              📍 {t('registration.requesting_location')}
            </h2>
            <p className="text-gray-600 mb-4">
              Please allow location access when prompted by your browser.
            </p>
            <div className="mt-6 text-sm text-gray-500 bg-amber-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Why we need your location:</p>
              <ul className="text-left space-y-1">
                <li>✓ To verify you're in an eligible service area</li>
                <li>✓ This offer is exclusive to {t('registration.north_sehla')}, {t('registration.south_sehla')}, {t('registration.jidhafs')}, {t('registration.bu_quwah')}, and {t('registration.saraiya')}</li>
                <li>✓ Your location is secure and only used for verification</li>
              </ul>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              <p>If you don't see a permission prompt, check your browser's location settings.</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={requestLocationPermission}
                className="flex-1 bg-[#724F38] text-white px-4 py-2 rounded-lg hover:bg-[#5a3d2c] transition-colors"
              >
                {t('registration.try_again')}
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                {t('registration.go_back_home')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show "Not Eligible" screen with animation
  if (locationDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <ToastContainer position="top-center" autoClose={5000} />
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
          <div className="mb-6">
            <img 
              src={i18n.language === 'ar' 
                ? "https://res.cloudinary.com/ds1dt3qub/image/upload/v1771073039/Arabi_Aseel_Logo_Transparent-01_1_s1cd5c.png"
                : "https://res.cloudinary.com/ds1dt3qub/image/upload/v1770891895/Logoen-2PKGAsjj_tyv30d.png"
              }
              alt="Arabi Aseel" 
              className="h-24 mx-auto mb-4"
            />
            
            {/* Animated Sad Emoji */}
            <div className="relative inline-block mb-4">
              <div className="text-8xl animate-bounce-slow">😔</div>
              
              {/* Pulsing Ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-red-400 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-red-600 mb-3 animate-slide-up">
              {t('registration.not_eligible')}
            </h2>
            <p className="text-xl font-semibold text-gray-800 mb-4 animate-slide-up-delay">
              {t('registration.outside_service_area')}
            </p>
            
            {/* Error Message */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 text-left animate-fade-in-delay">
              <p className="text-sm text-gray-700">
                {t('registration.location_not_eligible_message')}
              </p>
            </div>
            
            {/* Eligible Areas Info */}
            <div className="bg-amber-50 p-4 rounded-lg mb-6 text-left animate-fade-in-delay-2">
              <p className="font-semibold text-gray-800 mb-2">📍 {t('registration.eligible_service_areas')}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ {t('registration.north_sehla')} </li>
                <li>✓ {t('registration.south_sehla')} </li>
                <li>✓ {t('registration.jidhafs')} </li>
                <li>✓ {t('registration.jeblat_habshi')} </li>
                <li>✓ {t('registration.bu_quwah')} </li>
                <li>✓ {t('registration.saraiya')}</li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 animate-fade-in-delay-3">
              <button
                onClick={requestLocationPermission}
                className="flex-1 bg-[#724F38] text-white px-4 py-3 rounded-lg hover:bg-[#5a3d2c] transition-all hover:scale-105 font-semibold"
              >
                {t('registration.try_again')}
              </button>
              <a href='/'>
              <button
                
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-all hover:scale-105 font-semibold"
              >
                {t('registration.go_back_home')}
              </button>
              </a>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              {t('registration.error_message')}
            </p>
          </div>
        </div>
        
        {/* Add custom animations */}
        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes teardrop {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(80px) scale(0.5);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out 0.2s both;
          }
          
          .animate-slide-up-delay {
            animation: slide-up 0.6s ease-out 0.4s both;
          }
          
          .animate-fade-in-delay {
            animation: fade-in 0.6s ease-out 0.6s both;
          }
          
          .animate-fade-in-delay-2 {
            animation: fade-in 0.6s ease-out 0.8s both;
          }
          
          .animate-fade-in-delay-3 {
            animation: fade-in 0.6s ease-out 1s both;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          
          .animate-teardrop {
            animation: teardrop 1.5s ease-in infinite;
          }
        `}</style>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <img 
              src={i18n.language === 'ar' 
                ? "https://res.cloudinary.com/ds1dt3qub/image/upload/v1771073039/Arabi_Aseel_Logo_Transparent-01_1_s1cd5c.png"
                : "https://res.cloudinary.com/ds1dt3qub/image/upload/v1770891895/Logoen-2PKGAsjj_tyv30d.png"
              }
              alt="Arabi Aseel" 
              className="h-24 mx-auto mb-4"
            />
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('registration.congratulations')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('registration.registration_complete')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-4 border-dashed border-[#724F38] rounded-xl p-8 mb-6">
            <p className="text-sm text-gray-600 mb-2">{t('registration.your_coupon_code')}</p>
            <p className="text-4xl font-bold text-[#724F38] mb-4 tracking-wider font-mono">
              {couponData?.coupon_code}
            </p>
            <p className="text-xl font-semibold text-amber-700">
              {couponData?.coupon_type === 'BUY_1_GET_1' ? t('registration.buy_1_get_1') : t('registration.discount_50')}
            </p>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">{t('registration.how_to_use')}</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>{t('registration.step_1')}</li>
              <li>{t('registration.step_2')}</li>
              <li>{t('registration.step_3')}</li>
            </ol>
            <p className="text-sm text-gray-500 mt-4">
              <strong>Note:</strong> {t('registration.one_time_use')}
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {t('registration.terms_apply')}
          </p>

          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#724F38] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5a3d2c] transition-colors"
          >
            {t('registration.back_to_home')}
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
            {i18n.language === 'ar' ? (
              <img 
                src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1771074028/a2_1_ue9cc1.png"
                alt="Arabi Aseel" 
                className="h-32 mx-auto mb-4"
              />
            ) : (
              <img 
                src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1770893275/i2_3_uwu1gl.png"
                alt="Arabi Aseel" 
                className="h-48 mx-auto mb-"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{t('registration.exclusive_offer')}</h1>
            <p className="text-amber-100">{t('registration.register_get_coupon')}</p>
            <div className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {t('registration.limited_offer')}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('registration.full_name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('registration.placeholder_name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                />
              </div>

              {/* Mobile with Phone Input */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('registration.phone_number')} <span className="text-red-500">*</span>
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
                  {t('registration.email_address')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder={t('registration.placeholder_email')}
                />
              </div>

              {/* Address Title */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('registration.address_title')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address_title"
                  value={formData.address_title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder={t('registration.placeholder_address')}
                />
              </div>

              {/* Building/Apartment Number */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('registration.building_number')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="building_number"
                  value={formData.building_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder={t('registration.placeholder_building')}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('registration.city')} <span className="text-red-500">*</span>
                  {formData.address_city && <span className="text-xs text-green-600 ml-2">✓ Auto-filled</span>}
                </label>
                <input
                  type="text"
                  name="address_city"
                  value={formData.address_city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder="e.g., Manama, Sehla"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('registration.postal_code')} <span className="text-red-500">*</span>
                  {formData.address_block && <span className="text-xs text-green-600 ml-2">✓ Auto-filled</span>}
                </label>
                <input
                  type="text"
                  name="address_block"
                  value={formData.address_block}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#724F38] focus:border-transparent"
                  placeholder="e.g., 244713"
                />
              </div>

              {/* Location Coordinates (Read-only) */}
              {/* <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  ✅ Location Verified
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Latitude:</span>
                    <span className="ml-2 font-mono text-gray-800">{formData.latitude?.toFixed(6)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Longitude:</span>
                    <span className="ml-2 font-mono text-gray-800">{formData.longitude?.toFixed(6)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  📍 Your exact location has been captured and verified
                </p>
              </div> */}
            </div>

            {/* Important Note */}
            <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>📍 {t('registration.location_verified_title')}</strong> {t('registration.location_verified_message')}
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
                    <span className="ml-2">{t('registration.submitting')}</span>
                  </>
                ) : (
                  t('registration.register_now')
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
