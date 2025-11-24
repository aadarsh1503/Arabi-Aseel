import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertCircle, Lock } from 'lucide-react'; 

// --- IMPORT LOGOS HERE ---
// Ensure these images exist in your folder or update the path
import Logoen from "./Logoen.png"; // English Logo
import Logoar from "./Logoar.png"; // Arabic Logo (Placeholder for now)

const API_BASE = '/api/marketing';

const MarketingCampaign = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  const [gameState, setGameState] = useState('form');
  const [formData, setFormData] = useState({ name: '', mobile: '', place: '' });
  
  const [phoneCountry, setPhoneCountry] = useState({ countryCode: 'bh', dialCode: '973' });
  const [items, setItems] = useState([]); 
  
  // --- SPIN LOGIC STATE ---
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false); 
  const [isStopping, setIsStopping] = useState(false); 
  const [spinResultData, setSpinResultData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState('none'); 
  
  // --- NEW: Game Active State ---
  const [gameActive, setGameActive] = useState(true);

  const wheelRef = useRef(null);

  // --- TIMER STATE ---
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    setIsRTL(i18n.language === 'ar');
  }, [i18n.language]);

  // --- 3. COUNTDOWN & REDIRECT LOGIC ---
  useEffect(() => {
    let timerInterval;
    let redirectTimeout;

    if (gameState === 'result') {
      setCountdown(10);
      timerInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      redirectTimeout = setTimeout(() => {
        window.location.href = '/spin-the-game'; 
      }, 10000);
    }

    return () => {
      clearInterval(timerInterval);
      clearTimeout(redirectTimeout);
    };
  }, [gameState]);

  // --- VALIDATION LOGIC ---
  const validateMobileNumber = (fullNumber, countryData) => {
    const cleanNumber = fullNumber.replace(/\D/g, '');
    if (countryData.countryCode === 'bh') {
      if (cleanNumber.length !== 11) return false;
      if (!cleanNumber.startsWith('973')) return false;
      const localNumber = cleanNumber.slice(3);
      return /^[136]/.test(localNumber);
    }
    if (countryData.countryCode === 'in') {
      if (cleanNumber.length !== 12) return false;
      if (!cleanNumber.startsWith('91')) return false;
      const localNumber = cleanNumber.slice(2);
      return /^[6789]/.test(localNumber);
    }
    return cleanNumber.length >= 8;
  };

  const handleStartGame = async (e) => {
    e.preventDefault();
    const isValid = validateMobileNumber(formData.mobile, phoneCountry);

    if (!isValid) {
        let errorMsg = t('alert_invalid_mobile') || "Invalid Mobile Number";
        if (phoneCountry.countryCode === 'bh') {
            errorMsg = "Invalid Bahrain Number. Please enter exactly 8 digits (starting with 1, 3, or 6).";
        } else if (phoneCountry.countryCode === 'in') {
            errorMsg = "Invalid Indian Number. Please enter exactly 10 digits.";
        }
        toast.error(errorMsg);
        return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/start`, {
        name: formData.name,
        mobile: formData.mobile, 
        place: formData.place
      });
      setItems(res.data.items);
      setGameState('game');
    } catch (err) {
      if (err.response && err.response.status === 503) {
          setGameActive(false);
          toast.error("The campaign is currently closed.");
      } else {
          toast.error(err.response?.data?.message || "Error starting game");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 2. START SPIN ---
  const startSpin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsStopping(false);
    setSpinResultData(null);
    setTransitionStyle('none'); 

    try {
      const { data } = await axios.post(`${API_BASE}/spin`, {
        mobile: formData.mobile
      });
      setSpinResultData(data);
    } catch (err) {
      setIsSpinning(false);
      if (err.response && err.response.status === 503) {
        setGameActive(false);
        toast.error("The campaign has just closed.");
      } else {
        toast.error(err.response?.data?.message || "Error spinning wheel");
      }
    }
  };

  // --- 3. STOP SPIN (DECELERATION LOGIC) ---
  const stopSpin = () => {
    if (!spinResultData || isStopping) return;

    setIsStopping(true); 

    const wheel = wheelRef.current;
    let currentRotation = rotation;

    if (wheel) {
        const style = window.getComputedStyle(wheel);
        const matrix = new DOMMatrixReadOnly(style.transform);
        let angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
        if (angle < 0) angle += 360;
        
        const currentBase = rotation - (rotation % 360);
        currentRotation = currentBase + angle;
    }

    setRotation(currentRotation);
    
    const winningIndex = spinResultData.itemIndex;
    const segmentDegree = 360 / items.length;
    const landingAngle = (winningIndex * segmentDegree) + (segmentDegree / 2);
    
    const extraSpins = 4 * 360; 
    const decelerationTime = 5; 
    
    const targetRotation = currentRotation + extraSpins + (360 - (currentRotation % 360)) + (360 - landingAngle);
    
    setTimeout(() => {
        setTransitionStyle(`transform ${decelerationTime}s cubic-bezier(0.15, 0.85, 0.35, 1)`);
        setRotation(targetRotation);
    }, 50);

    setTimeout(() => {
      setIsSpinning(false);
      setIsStopping(false);
      
      if (spinResultData.canRetry) {
        toast.info(t('feedback_retry'));
      } else {
        setPrize(spinResultData.result);
        if(spinResultData.result.type === 'win') {
             toast.success(`Congratulations! You won ${spinResultData.result.label}`);
        } else {
             toast.warn("Better luck next time!");
        }
        setGameState('result');
      }
    }, (decelerationTime * 1000) + 50); 
  };

  const getWheelBackground = () => {
    if (!items.length) return '#ccc';
    const degree = 360 / items.length;
    let gradient = 'conic-gradient(';
    items.forEach((item, index) => {
        gradient += `${item.color} ${index * degree}deg ${(index + 1) * degree}deg`;
        if (index < items.length - 1) gradient += ', ';
    });
    gradient += ')';
    return gradient;
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handlePhoneChange = (value, country) => {
    setFormData({ ...formData, mobile: value });
    setPhoneCountry(country);
  };

  const themeColor = '#724F38'; 

  // --- RENDER: GAME CLOSED SCREEN ---
  if (!gameActive) {
    return (
        <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black pointer-events-none"></div>
             
             <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-800 z-10 animate-fade-in-up">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#724F38] mb-3">{t('header_title') || "SPIN & WIN"}</h1>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Campaign Currently Closed</h2>
                <p className="text-gray-500 mb-8 font-serif italic">
                    The spin wheel is currently disabled. Please join us again during our next special event!
                </p>
                
                <button 
                    onClick={() => window.location.reload()} 
                    className="w-full text-white font-bold py-3 rounded-md transition-all shadow-md uppercase tracking-widest text-sm hover:opacity-90"
                    style={{ backgroundColor: themeColor }}
                >
                    Refresh Status
                </button>
             </div>
        </div>
    );
  }

  // --- RENDER: ACTIVE GAME ---
  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      
      <ToastContainer 
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <style>{`
        @keyframes continuous-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-infinite {
          animation: continuous-spin 0.8s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black pointer-events-none"></div>

      <div className="w-full max-w-md mt-12 mb-20 bg-white rounded-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden relative z-10 border border-gray-800">
        
        <div className="bg-white pt-8 pb-4 px-6 text-center flex flex-col items-center">
           
           {/* --- CHANGED LOGO LOGIC HERE --- */}
           {isRTL ? (
             <img 
               src={Logoar} 
               alt="Arabic Logo" 
               className="w-24 h-auto mb-4  object-contain" 
             />
           ) : (
             <img 
               src={Logoen} 
               alt="English Logo" 
               className="w-32 h-auto mb-4  object-contain" 
             />
           )}
           {/* ------------------------------- */}

           <h1 className="text-3xl font-serif font-bold text-[#724F38] tracking-wide uppercase border-b-2 border-[#724F38] pb-2 inline-block">
             {t('header_title')}
           </h1>
           <p className="text-gray-500 text-sm mt-2 font-serif italic">{t('header_subtitle')}</p>
        </div>

        <div className="p-6 min-h-[400px] flex flex-col items-center justify-center bg-white">

          {gameState === 'form' && (
            <form dir='ltr' onSubmit={handleStartGame} className="w-full space-y-5 animate-fade-in">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-start">{t('label_name')}</label>
                <input required type="text" name="name" placeholder={t('placeholder_name')} value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:border-[#724F38] outline-none transition-all text-gray-800 placeholder-gray-400"/>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-start">{t('label_mobile')}</label>
                <div className="w-full" dir="ltr"> 
                  <PhoneInput 
                    country={'bh'} 
                    value={formData.mobile} 
                    onChange={handlePhoneChange}
                    enableSearch={true}
                    masks={{ bh: '.... ....', in: '..... .....' }}
                    inputStyle={{ width: '100%', height: '50px', fontSize: '16px', paddingLeft: '48px', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#1f2937' }}
                    buttonStyle={{ border: '1px solid #e5e7eb', borderRadius: '0.375rem 0 0 0.375rem', backgroundColor: '#fff' }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-start">{t('Your_Location')}</label>
                <input required type="text" name="place" placeholder={t('Your_Location')} value={formData.place} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:border-[#724F38] outline-none transition-all text-gray-800 placeholder-gray-400"/>
              </div>
              <button disabled={loading} type="submit" className="w-full text-white font-bold py-4 rounded-md transition-all transform active:scale-95 shadow-md mt-4 uppercase tracking-widest text-sm" style={{ backgroundColor: themeColor }}>
                {loading ? t('btn_preparing') : t('btn_start')}
              </button>
            </form>
          )}

          {gameState === 'game' && (
            items.length > 0 ? (
            <div className="relative w-full flex flex-col items-center justify-center py-4">
              
              <div className="absolute top-4 z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[45px] filter drop-shadow-md transform -translate-y-2" style={{ borderTopColor: themeColor }}></div>

              <div 
                ref={wheelRef}
                className={`mt-6 relative w-72 h-72 md:w-80 md:h-80 rounded-full border-[8px] border-[#2LogoarLogoara] shadow-2xl overflow-hidden bg-gray-100 
                  ${(isSpinning && !isStopping) ? 'animate-spin-infinite' : ''}`} 
                style={{ 
                    background: getWheelBackground(), 
                    transform: (isStopping || !isSpinning) ? `rotate(${rotation}deg)` : undefined,
                    transition: transitionStyle
                }}
              >
                  {items.map((item, index) => {
                      const angle = (360 / items.length) * index + (360 / items.length) / 2;
                      return (
                          <div key={item.id} className="absolute top-0 left-0 w-full h-full flex flex-col items-center pt-3" style={{ transform: `rotate(${angle}deg)` }}>
                              <div className="bg-white p-1 rounded-full shadow-md w-10 h-10 flex items-center justify-center mb-1">
                                  <img src={item.image_url} alt={item.label} className="w-7 h-7 object-contain" />
                              </div>
                              <span className="font-bold text-[10px] md:text-xs uppercase tracking-tight bg-white/80 px-1 rounded text-black shadow-sm">{item.label}</span>
                          </div>
                      );
                  })}
              </div>

              <div className="mt-10 w-full px-8">
                {!isSpinning ? (
                    <button 
                        onClick={startSpin} 
                        className={`w-full py-4 rounded-md text-lg font-bold text-white shadow-xl transform transition hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider border-b-4`}
                        style={{ backgroundColor: themeColor, borderColor: '#4a332a' }}
                    >
                        {t('btn_spin')}
                    </button>
                ) : (
                    <button 
                        onClick={stopSpin}
                        disabled={!spinResultData || isStopping} 
                        className={`w-full py-4 rounded-md text-lg font-bold text-white shadow-xl uppercase tracking-wider border-b-4 transition-colors`}
                        style={{ 
                            backgroundColor: (!spinResultData || isStopping) ? '#9ca3af' : '#dc2626', 
                            borderColor: (!spinResultData || isStopping) ? '#6b7280' : '#991b1b',
                            cursor: (!spinResultData || isStopping) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isStopping ? t('STOP') : t('STOP')}
                    </button>
                )}
              </div>
            </div>
            ) : (
              <div className="text-center text-[#724F38] font-serif italic">
                 {t('msg_kitchen_closed')}
              </div>
            )
          )}

          {gameState === 'result' && prize && (
            <div className="text-center animate-fade-in-up w-full py-6">
              <div className="mb-4 bg-gray-100 inline-block px-4 py-1 rounded-full">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Refreshes in: </span>
                <span className="text-[#dc2626] font-mono font-bold text-lg ml-1">{countdown}s</span>
              </div>

              {prize.type === 'lose' ? (
                <>
                    <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">{t('result_lose_title')}</h2>
                    <div className="bg-gray-50 rounded-full w-36 h-36 mx-auto flex items-center justify-center mb-8 border-4 border-dashed border-gray-300">
                        <img src={prize.image_url} alt="Lose" className="w-20 h-20 grayscale opacity-70" />
                    </div>
                </>
              ) : (
                <>
                    <h2 className="text-4xl font-serif font-bold text-[#724F38] mb-2">{t('result_win_title')}</h2>
                    <p className="text-gray-600 mb-6">{t('result_served')}</p>
                    <div className="relative mx-auto w-40 h-40 mb-6 flex items-center justify-center">
                        <div className="absolute inset-0 animate-spin-slow border-4 border-dashed rounded-full" style={{ borderColor: themeColor }}></div>
                        <div className="bg-[#fff8f5] rounded-full w-32 h-32 flex items-center justify-center shadow-inner">
                            <img src={prize.image_url} alt="Win" className="w-20 h-20 drop-shadow-lg transform hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-black uppercase tracking-widest mb-2">{prize.label}</h3>
                </>
              )}
              
              <div className="bg-black text-white p-4 rounded-md mt-6 shadow-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{t('label_reservation_id')}</p>
                  <span className="font-mono text-lg" dir="ltr">+{formData.mobile}</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 h-4 w-full border-t border-gray-100"></div>
      </div>
    </div>
  );
};

export default MarketingCampaign;