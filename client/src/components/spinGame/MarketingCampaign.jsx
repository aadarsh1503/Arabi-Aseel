import React, { useState, useEffect, useRef } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Lock, Zap, ChevronRight, Sparkles } from 'lucide-react'; 
import "./m.css"
// --- IMPORT LOGOS HERE ---
import Logoen from "./Logoen.png";
import Logoar from "./Logoar.png";

const BASEURL = import.meta.env.VITE_API_BASE_URL || '';

const MarketingCampaign = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  const [gameState, setGameState] = useState('form');
  const [formData, setFormData] = useState({ name: '', mobile: '', place: '' });
  
  // Use state to store items so we can render them dynamically
  const [items, setItems] = useState([]); 
  const [phoneCountry, setPhoneCountry] = useState({ countryCode: 'bh', dialCode: '973' });
  
  // --- SPIN LOGIC STATE ---
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false); 
  const [isStopping, setIsStopping] = useState(false); 
  const [spinResultData, setSpinResultData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState('none'); 
  
  const [gameActive, setGameActive] = useState(true);
  const wheelRef = useRef(null);
  const [countdown, setCountdown] = useState(10);

  // --- THEME CONSTANTS ---
  const primaryColor = '#724F38'; 
  const metallicGradient = `linear-gradient(135deg, #724F38 0%, #a0785a 50%, #724F38 100%)`;

  useEffect(() => {
    setIsRTL(i18n.language === 'ar');
  }, [i18n.language]);

  // --- FETCH CONFIG ---
  useEffect(() => {
    const fetchConfig = async () => {
        try {
            const res = await fetch(`${BASEURL}/api/marketing/config`);
            const data = await res.json();
            if (data) {
                setGameActive(data.game_active);
            }
        } catch (error) {
            console.error("Error fetching config", error);
        }
    };
    fetchConfig();
  }, []);

  // --- TIMER ---
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

  // --- VALIDATION ---
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

  // --- START GAME (GET ITEMS) ---
  const handleStartGame = async (e) => {
    e.preventDefault();
    const isValid = validateMobileNumber(formData.mobile, phoneCountry);

    if (!isValid) {
        toast.error(t('alert_invalid_mobile') || "Invalid Mobile Number");
        return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASEURL}/api/marketing/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile, 
          place: formData.place
        })
      });
      const data = await res.json();
      // SAVE ITEMS FROM BACKEND HERE
      setItems(data.items);
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

  // --- SPIN ACTIONS ---
  const startSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsStopping(false);
    setSpinResultData(null);
    setTransitionStyle('none'); 

    try {
      const response = await fetch(`${BASEURL}/api/marketing/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobile: formData.mobile })
      });
      const data = await response.json();
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

  // --- STOP SPIN (FIXED LOGIC) ---
  const stopSpin = () => {
    if (!spinResultData || isStopping) return;
    setIsStopping(true);

    const wheel = wheelRef.current;
    let currentRotation = rotation;

    if (wheel) {
        // Calculate current angle from the spinning wheel
        const style = window.getComputedStyle(wheel);
        const matrix = new DOMMatrixReadOnly(style.transform);
        let angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
        if (angle < 0) angle += 360;
        
        // Snap to the nearest full rotation to ensure smooth calculation
        const currentBase = rotation - (rotation % 360);
        currentRotation = currentBase + angle;
    }

    setRotation(currentRotation);
    
    const winningIndex = spinResultData.itemIndex;
    const segmentDegree = 360 / items.length;
    
    // Calculate the angle to land on the specific prize
    // We subtract segmentDegree/2 to center the pointer on the segment
    const landingAngle = (winningIndex * segmentDegree) + (segmentDegree / 2);
    
    // --- FIXED PHYSICS HERE (FROM REFERENCE CODE) ---
    // 1. Distance: Spin 5 times (5 * 360).
    const extraSpins = 5 * 360; 
    
    // 2. Time: 6 seconds allows for a long, smooth deceleration.
    const decelerationTime = 6; 
    
    const targetRotation = currentRotation + extraSpins + (360 - (currentRotation % 360)) + (360 - landingAngle);
    
    // Small delay to let the DOM update the 'currentRotation' before applying the transition
    setTimeout(() => {
        // Use ease-out instead of cubic-bezier to prevent initial speed-up
        setTransitionStyle(`transform ${decelerationTime}s ease-out`);
        setRotation(targetRotation);
    }, 20);

    setTimeout(() => {
      setIsSpinning(false);
      setIsStopping(false);
      
      if (spinResultData.canRetry) {
        toast.info(t('feedback_retry'));
      } else {
        setPrize(spinResultData.result);
        if(spinResultData.result.type === 'win' || spinResultData.result.type === 'prize') {
             toast.success(`System Alert: Prize Won - ${spinResultData.result.label}`);
        } else {
             toast.warn("System Alert: No Prize Detected");
        }
        setGameState('result');
      }
    }, (decelerationTime * 1000) + 100); 
  };

  const getWheelBackground = () => {
    if (!items.length) return '#e5e7eb';
    const degree = 360 / items.length;
    let gradient = 'conic-gradient(';
    items.forEach((item, index) => {
        // Use color from backend, default to grey if missing
        const color = item.color || (index % 2 === 0 ? '#f3f4f6' : '#ffffff'); 
        gradient += `${color} ${index * degree}deg ${(index + 1) * degree}deg`;
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

  // --- RENDER ---
  if (!gameActive) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
             <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-xl text-center max-w-md w-full z-10">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">SYSTEM LOCKED</h1>
                <p className="text-gray-500 mb-8">Campaign Currently Closed</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="w-full text-white font-bold py-4 rounded-xl shadow-lg uppercase tracking-widest text-sm"
                    style={{ background: metallicGradient }}
                >
                    REFRESH
                </button>
             </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#724F38] selection:text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      
      <ToastContainer position="top-center" theme="light" transition={Bounce} />

      <style>{`
        @keyframes continuous-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-infinite {
          animation: continuous-spin 0.6s linear infinite;
        }
        .bg-grid-pattern {
           background-image: radial-gradient(#724F38 1px, transparent 1px);
           background-size: 24px 24px;
        }
        .glass-panel {
           background: rgba(255, 255, 255, 0.75);
           backdrop-filter: blur(20px);
           -webkit-backdrop-filter: blur(20px);
           border: 1px solid rgba(255, 255, 255, 0.9);
           box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
        }
        .input-tech {
           background: rgba(255, 255, 255, 0.6);
           border: 1px solid #e5e7eb;
           transition: all 0.3s ease;
        }
        .input-tech:focus {
           background: white;
           border-color: ${primaryColor};
           box-shadow: 0 0 0 4px rgba(114, 79, 56, 0.1);
        }
        .wheel-shadow {
           box-shadow: 
             inset 0 0 20px rgba(0,0,0,0.1),
             0 20px 40px rgba(0,0,0,0.15),
             0 0 0 8px #ffffff;
        }
      `}</style>

      {/* Background FX */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
      
      <div className="w-full max-w-xl glass-panel rounded-3xl overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="pt-10 pb-2 px-8 flex flex-col items-center text-center">
           {isRTL ? (
             <img src={Logoar} alt="Arabic Logo" className="w-28 h-auto mb-6 object-contain drop-shadow-sm" />
           ) : (
             <img src={Logoen} alt="English Logo" className="w-32 h-auto mb-6 object-contain drop-shadow-sm" />
           )}
           <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter uppercase mb-1">
             {t('header_title') || "SPIN & WIN"}
           </h1>
           <div className="h-1 w-16 rounded-full mb-3" style={{ background: metallicGradient }}></div>
        </div>

        <div className="p-6 md:p-8 min-h-[400px] flex flex-col items-center justify-center relative">

          {gameState === 'form' && (
            <form dir='ltr' onSubmit={handleStartGame} className="w-full space-y-5 animate-fade-in">
              <div className="group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block pl-1 text-start">{t('label_name')}</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-tech w-full px-4 py-4 rounded-xl outline-none text-gray-800 font-medium" placeholder={t('placeholder_name')}/>
              </div>
              
              <div className="group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block pl-1 text-start">{t('label_mobile')}</label>
                <div className="w-full" dir="ltr"> 
                  <PhoneInput 
                    country={'bh'} 
                    value={formData.mobile} 
                    onChange={handlePhoneChange}
                    enableSearch={true}
                    masks={{ bh: '.... ....', in: '..... .....' }}
                    containerClass="!border-none"
                    inputClass="!w-full !h-[58px] !bg-[rgba(255,255,255,0.6)] !border-gray-200 !rounded-xl !text-gray-800 !text-base !font-medium focus:!bg-white focus:!border-[#724F38]"
                    buttonClass="!bg-white/50 !border-gray-200 !rounded-l-xl"
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block pl-1 text-start">{t('Your_Location')}</label>
                <input required type="text" name="place" value={formData.place} onChange={handleInputChange} className={`input-tech w-full ${isRTL ? 'pl-4 pr-4' : 'pr-4 pl-4'} py-4 rounded-xl outline-none text-gray-800 font-medium`} placeholder={t('Your_Location') || "City, Region"} />
              </div>

              <button disabled={loading} type="submit" className="w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-4 uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:brightness-110" style={{ background: metallicGradient }}>
                {loading ? "Processing..." : t('btn_start')} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {gameState === 'game' && (
            items.length > 0 ? (
            <div className="relative w-full flex flex-col items-center justify-center py-2 animate-fade-in">
              
              {/* POINTER */}
              <div className="absolute top-0 z-30 transform translate-y-2 drop-shadow-xl">
                  <div className="w-12 h-14 bg-white clip-path-polygon flex items-center justify-center" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)', background: metallicGradient }}>
                    <div className="w-3 h-3 bg-white rounded-full mt-[-10px]"></div>
                  </div>
              </div>

              {/* WHEEL CONTAINER */}
              <div className="relative p-2 rounded-full border border-gray-200 bg-white shadow-2xl">
                  <div 
                    ref={wheelRef}
                    className={`relative w-[330px] h-[330px] md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white ring-1 ring-gray-100 wheel-shadow
                      ${(isSpinning && !isStopping) ? 'animate-spin-infinite' : ''}`} 
                    style={{ 
                        background: getWheelBackground(), 
                        transform: (isStopping || !isSpinning) ? `rotate(${rotation}deg)` : undefined,
                        transition: transitionStyle
                    }}
                  >
                    {/* ITEMS MAPPING */}
                    {items.map((item, index) => {
                        const segmentAngle = 360 / items.length;
                        const rotateAngle = segmentAngle * index + (segmentAngle / 2);

                        return (
                            <div 
                                key={item.id || index} 
                                className="absolute top-0 left-1/2 w-16 -ml-8 h-[50%] flex flex-col items-center justify-start pt-5"
                                style={{ 
                                    transformOrigin: 'bottom center',
                                    transform: `rotate(${rotateAngle}deg)`,
                                    zIndex: 10
                                }}
                            >
                                {/* ITEM CONTENT */}
                                <div className="flex flex-col items-center gap-1">
                                    {/* Image Container */}
                                    <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm w-10 h-10 flex items-center justify-center transform transition-transform">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.label} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400">?</span>
                                        )}
                                    </div>
                                    
                                    {/* Label */}
                                    <span className="
                                        font-bold text-[9px] uppercase tracking-wide 
                                        bg-white/80 px-2 py-0.5 rounded text-gray-900 
                                        shadow-sm text-center leading-tight
                                        max-w-[70px] whitespace-normal break-words
                                    ">
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                  </div>
                  
                  {/* CENTER HUB */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 border-gray-50 z-20">
                     <div className="w-10 h-10 rounded-full opacity-80" style={{ background: metallicGradient }}></div>
                  </div>
              </div>

              {/* CONTROLS */}
              <div className="mt-10 w-full px-4">
                {!isSpinning ? (
                    <button 
                        onClick={startSpin} 
                        className="w-full py-4 rounded-2xl text-lg font-black text-white shadow-xl transform transition hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-3 group"
                        style={{ background: metallicGradient }}
                    >
                        <span>{t('btn_spin')}</span>
                        <Zap className="w-5 h-5 group-hover:text-yellow-300" />
                    </button>
                ) : (
                    <button 
                        onClick={stopSpin}
                        disabled={!spinResultData || isStopping} 
                        className={`w-full py-4 rounded-2xl text-lg font-black text-white shadow-lg uppercase tracking-widest transition-all
                            ${(!spinResultData || isStopping) ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}`}
                    >
                        {isStopping ? t('STOP') : t('STOP')}
                    </button>
                )}
              </div>
            </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                 <p className="text-gray-500 font-medium">{t('msg_kitchen_closed')}</p>
              </div>
            )
          )}

          {gameState === 'result' && prize && (
            <div className="text-center animate-fade-in-up w-full py-2">
              <div className="mb-6 inline-flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Auto Reset: </span>
                <span className="text-gray-900 font-mono font-bold text-sm w-4">{countdown}</span>
              </div>

              {prize.type === 'lose' ? (
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('result_lose_title')}</h2>
                    <div className="w-24 h-24 mx-auto flex items-center justify-center mb-4 opacity-50 grayscale">
                        <img src={prize.image_url} alt="Lose" className="w-full h-full object-contain" />
                    </div>
                </div>
              ) : (
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-200 blur-[60px] opacity-20 rounded-full"></div>
                    <h2 className="text-3xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#724F38] to-[#9c7b66]">
                        {t('result_win_title')}
                    </h2>
                    <div className="relative mx-auto w-48 h-48 mb-6 flex items-center justify-center z-10">
                        <div className="absolute inset-0 border-2 border-dashed border-[#724F38]/30 rounded-full animate-spin-slow"></div>
                        <div className="bg-white rounded-full w-36 h-36 flex items-center justify-center shadow-lg">
                            <img src={prize.image_url} alt="Win" className="w-24 h-24 object-contain" />
                        </div>
                        <div className="absolute top-0 right-4 animate-bounce">
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative z-10">
                        <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">{prize.label}</h3>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingCampaign;