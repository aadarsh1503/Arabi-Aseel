import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';

// Import your logo if it's local, or assume it's in public folder
// import logo from './i2.png'; 

const API_BASE = 'http://localhost:5000/api/marketing'; // Ensure this matches your backend URL

const MarketingCampaign = () => {
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  // --- LOGIC STATE ---
  const [gameState, setGameState] = useState('form'); // 'form' | 'game' | 'result'
  const [formData, setFormData] = useState({ name: '', mobile: '', place: '' }); 
  const [items, setItems] = useState([]); 
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Update RTL state when language changes
  useEffect(() => {
    setIsRTL(i18n.language === 'ar');
  }, [i18n.language]);

  // --- RESET GAME LOGIC (Fix for Multiple Plays) ---
  const resetGame = () => {
    setPrize(null);
    setRotation(0); // Optional: keep rotation or reset
    setFeedbackMessage('');
    // We keep the items loaded so we can go straight to game
    setGameState('game'); 
  };

  // --- 1. Register & Start Game ---
  const handleStartGame = async (e) => {
    e.preventDefault();
    
    if (!formData.mobile || formData.mobile.length < 8) {
        alert(t('alert_invalid_mobile'));
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
      alert(err.response?.data?.message || "Error starting game");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Spin Logic ---
  const spinWheel = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setFeedbackMessage('');

    try {
      const { data } = await axios.post(`${API_BASE}/spin`, {
        mobile: formData.mobile
      });

      const winningIndex = data.itemIndex;
      const wonItem = data.result;

      const segmentDegree = 360 / items.length;
      const randomSpins = 5 * 360; 
      const landingAngle = (winningIndex * segmentDegree) + (segmentDegree / 2); 
      const targetRotation = randomSpins + (360 - landingAngle); 
      const newRotation = rotation + targetRotation + ((360 - (rotation % 360)) % 360);
      
      setRotation(newRotation);

      setTimeout(() => {
        setIsSpinning(false);
        if (data.canRetry) {
          setFeedbackMessage(t('feedback_retry'));
        } else {
          setPrize(wonItem);
          setGameState('result');
        }
      }, 4000); 

    } catch (err) {
      setIsSpinning(false);
      alert(err.response?.data?.message || "Error spinning wheel");
    }
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
  const handlePhoneChange = (value) => setFormData({ ...formData, mobile: value });

  // --- STYLES ---
  const themeColor = '#724F38'; 

  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 font-sans relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black pointer-events-none"></div>

      <div className="w-full max-w-md mt-12 mb-20 bg-white rounded-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden relative z-10 border border-gray-800">
        
        {/* Header Section */}
        <div className="bg-white pt-8 pb-4 px-6 text-center flex flex-col items-center">
           <img 
             src="i2.png" 
             alt="Logo" 
             className="w-32 h-auto mb-4 brightness-0 filter object-contain" 
           />
           <h1 className="text-3xl font-serif font-bold text-[#724F38] tracking-wide uppercase border-b-2 border-[#724F38] pb-2 inline-block">
             {t('header_title')}
           </h1>
           <p className="text-gray-500 text-sm mt-2 font-serif italic">{t('header_subtitle')}</p>
        </div>

        <div className="p-6 min-h-[400px] flex flex-col items-center justify-center bg-white">

          {/* STEP 1: DETAILS FORM */}
          {gameState === 'form' && (
            <form dir='ltr' onSubmit={handleStartGame} className="w-full space-y-5 animate-fade-in">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-start">{t('label_name')}</label>
                <input 
                  required 
                  type="text" 
                  name="name" 
                  placeholder={t('placeholder_name')} 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:border-[#724F38] outline-none transition-all text-gray-800 placeholder-gray-400"
                  style={{ '--tw-ring-color': themeColor }}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-start">{t('label_mobile')}</label>
                <div className="w-full" dir="ltr"> 
                  <PhoneInput 
                    country={'bh'} 
                    value={formData.mobile} 
                    onChange={handlePhoneChange}
                    enableSearch={true}
                    inputStyle={{ 
                      width: '100%', 
                      height: '50px', 
                      fontSize: '16px', 
                      paddingLeft: '48px', 
                      borderRadius: '0.375rem', 
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb',
                      color: '#1f2937',
                      textAlign: 'left'
                    }}
                    buttonStyle={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.375rem 0 0 0.375rem', 
                      backgroundColor: '#fff' 
                    }}
                    dropdownStyle={{ color: '#000' }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-start">{t('label_city')}</label>
                <input 
                  required 
                  type="text" 
                  name="place" 
                  placeholder={t('placeholder_city')} 
                  value={formData.place} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:border-[#724F38] outline-none transition-all text-gray-800 placeholder-gray-400"
                  style={{ '--tw-ring-color': themeColor }}
                />
              </div>
              
              <button 
                disabled={loading} 
                type="submit" 
                className="w-full text-white font-bold py-4 rounded-md transition-all transform active:scale-95 shadow-md mt-4 uppercase tracking-widest text-sm"
                style={{ backgroundColor: themeColor }}
              >
                {loading ? t('btn_preparing') : t('btn_start')}
              </button>
            </form>
          )}

          {/* STEP 2: THE GAME */}
          {gameState === 'game' && (
            items.length > 0 ? (
            <div className="relative w-full flex flex-col items-center justify-center py-4">
              
              {feedbackMessage && (
                <div className="absolute -top-6 z-30 bg-[#724F38] text-white px-6 py-2 rounded-full shadow-lg animate-bounce font-serif italic border-2 border-white text-center">
                    {feedbackMessage}
                </div>
              )}
              
              {/* Wheel Pointer */}
              <div 
                className="absolute top-4 z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[45px] filter drop-shadow-md transform -translate-y-2"
                style={{ borderTopColor: themeColor }}
              ></div>

              {/* The Wheel */}
              <div className="mt-6 relative w-72 h-72 md:w-80 md:h-80 rounded-full border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] bg-gray-100"
                   style={{ background: getWheelBackground(), transform: `rotate(${rotation}deg)` }}>
                  {items.map((item, index) => {
                      const angle = (360 / items.length) * index + (360 / items.length) / 2;
                      return (
                          <div key={item.id} className="absolute top-0 left-0 w-full h-full flex flex-col items-center pt-3" style={{ transform: `rotate(${angle}deg)` }}>
                              <div className="bg-white p-1 rounded-full shadow-md w-10 h-10 flex items-center justify-center mb-1">
                                  <img src={item.image_url} alt={item.label} className="w-7 h-7 object-contain" />
                              </div>
                              <span className="font-bold text-[10px] md:text-xs uppercase tracking-tight bg-white/80 px-1 rounded text-black shadow-sm">
                                {item.label}
                              </span>
                          </div>
                      );
                  })}
              </div>

              {/* Spin Button */}
              <div className="mt-10 w-full px-8">
                <button 
                    onClick={spinWheel} 
                    disabled={isSpinning} 
                    className={`w-full py-4 rounded-md text-lg font-bold text-white shadow-xl transform transition hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider border-b-4`}
                    style={{ 
                        backgroundColor: isSpinning ? '#9ca3af' : themeColor,
                        borderColor: isSpinning ? '#6b7280' : '#4a332a',
                        cursor: isSpinning ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSpinning ? t('btn_spinning') : (feedbackMessage ? t('btn_spin_again') : t('btn_spin'))}
                </button>
              </div>
            </div>
            ) : (
              <div className="text-center text-[#724F38] font-serif italic">
                 {t('msg_kitchen_closed')} <br/> {t('msg_no_prizes')}
              </div>
            )
          )}

          {/* STEP 3: RESULT */}
          {gameState === 'result' && prize && (
            <div className="text-center animate-fade-in-up w-full py-6">
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

              {/* NEW: Play Again Button */}
              {/* <button 
                onClick={resetGame}
                className="mt-8 w-full border-2 border-[#724F38] text-[#724F38] font-bold py-3 rounded-md transition-all hover:bg-[#724F38] hover:text-white uppercase tracking-widest text-sm"
              >
                {t('btn_spin_again') || "Spin Again"}
              </button> */}
            </div>
          )}

        </div>
        
        {/* Footer Decor */}
        <div className="bg-gray-50 h-4 w-full border-t border-gray-100"></div>
      </div>
    </div>
  );
};

export default MarketingCampaign;