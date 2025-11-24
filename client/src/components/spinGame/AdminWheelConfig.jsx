import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Save, Settings, Upload, RefreshCw, Power } from 'lucide-react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useTranslation } from 'react-i18next';
import PageToggle from '../AdminPanel/PageToggle';
const API_BASE = '/api/marketing'; 

const AdminWheelConfig = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [items, setItems] = useState([]);
    const [config, setConfig] = useState({ win_percentage: 10, lose_percentage: 90, game_active: true });
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [newItem, setNewItem] = useState({
        label: '',
        type: 'lose', 
        color: '#ffffff',
        text_color: '#000000',
        image: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken'); 
            const configObj = { headers: { Authorization: `Bearer ${token}` } };
            
            const { data } = await axios.get(`${API_BASE}/admin/config`, configObj);
            setItems(data.items);
            setConfig({
                win_percentage: data.config.win_percentage || 10,
                lose_percentage: data.config.lose_percentage || 90,
                game_active: data.config.game_active === 'false' ? false : true 
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            toast.error(t('toast_load_error'));
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Update Global Settings (Odds)
    const handleConfigUpdate = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${API_BASE}/admin/config`, {
                win_percentage: config.win_percentage,
                lose_percentage: config.lose_percentage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(t('toast_settings_updated'));
        } catch (error) {
            toast.error(t('toast_update_failed'));
        }
    };

    // Toggle Game Status
    const toggleGame = async () => {
        const newState = !config.game_active;
        
        setConfig(prev => ({ ...prev, game_active: newState }));

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${API_BASE}/admin/config`, { game_active: newState }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(newState ? t('toast_game_live') : t('toast_game_closed'));
        } catch (error) {
            setConfig(prev => ({ ...prev, game_active: !newState }));
            toast.error(t('toast_toggle_failed'));
        }
    };

    // Add New Item
    const handleAddItem = async (e) => {
        e.preventDefault();
        if(!newItem.image) return toast.error(t('toast_upload_image'));

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('label', newItem.label);
        formData.append('type', newItem.type);
        formData.append('color', newItem.color);
        formData.append('text_color', newItem.text_color);
        formData.append('image', newItem.image);

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${API_BASE}/admin/items`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });
            
            setNewItem({ label: '', type: 'lose', color: '#ffffff', text_color: '#000000', image: null });
            document.getElementById('fileInput').value = ""; 
            toast.success(t('toast_item_added'));
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || t('toast_add_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Item
    const handleDelete = async (id) => {
        if(!window.confirm(t('confirm_delete'))) return;
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`${API_BASE}/admin/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(items.filter(i => i.id !== id));
            toast.success(t('toast_item_deleted'));
        } catch (error) {
            toast.error(t('toast_delete_error'));
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">{t('loading_admin')}</div>;

    return (
        <div 
            className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-slate-800"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
             
            <ToastContainer 
                position={isRTL ? "top-left" : "top-right"}
                autoClose={3000}
                theme="light"
                rtl={isRTL}
            />

            <div dir='ltr'>
                <PageToggle activePage="spin_Game" />
            </div>
            
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="w-8 h-8 text-pink-600" />
                    {t('admin_header_title')}
                </h1>
                <p className="text-slate-500 mt-1">{t('admin_header_subtitle')}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: CONFIG & ADD FORM */}
                <div className="space-y-8 lg:col-span-1">
                    
                    {/* 1. GAME STATUS TOGGLE */}
                    <div className={`${config.game_active ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} p-6 rounded-xl shadow-sm border transition-colors duration-300`}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className={`text-lg font-bold ${config.game_active ? 'text-green-800' : 'text-red-800'} flex items-center gap-2`}>
                                <Power className="w-5 h-5" /> {t('admin_game_status')}
                            </h2>
                            
                            {/* Toggle Switch UI - We keep LTR for switch mechanics or flip based on logic */}
                            <div 
                                onClick={toggleGame}
                                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${config.game_active ? 'bg-green-500' : 'bg-gray-300'}`}
                                dir="ltr" 
                            >
                                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${config.game_active ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </div>
                        <p className={`text-sm ${config.game_active ? 'text-green-700' : 'text-red-700'}`}>
                            {config.game_active 
                                ? t('admin_status_live_desc')
                                : t('admin_status_closed_desc')}
                        </p>
                    </div>

                    {/* 2. Global Probability Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-blue-500" /> {t('admin_prob_settings')}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">{t('admin_win_pct')}</label>
                                <input 
                                    type="number" 
                                    value={config.win_percentage} 
                                    onChange={(e) => setConfig({...config, win_percentage: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">{t('admin_lose_pct')}</label>
                                <input 
                                    type="number" 
                                    value={config.lose_percentage} 
                                    onChange={(e) => setConfig({...config, lose_percentage: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">{t('admin_backend_note')}</p>
                            </div>
                            <button onClick={handleConfigUpdate} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Save className="w-4 h-4" /> {t('admin_btn_save_odds')}
                            </button>
                        </div>
                    </div>

                    {/* 3. Add New Item Form */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-500"></div>
                        <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-pink-500" /> {t('admin_add_item_title')}
                        </h2>
                        
                        <form onSubmit={handleAddItem} className="space-y-4">
                            {/* Label */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('admin_label')}</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder={t('admin_placeholder_label')}
                                    value={newItem.label} 
                                    onChange={(e) => setNewItem({...newItem, label: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-pink-500 outline-none"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('admin_type_result')}</label>
                                <select 
                                    value={newItem.type} 
                                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white focus:border-pink-500 outline-none"
                                >
                                    <option value="lose">{t('admin_opt_lose')}</option>
                                    <option value="prize">{t('admin_opt_prize')}</option>
                                    <option value="retry">{t('admin_opt_retry')}</option>
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    {t('admin_type_hint')}
                                </p>
                            </div>

                            {/* Colors */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('admin_bg_color')}</label>
                                    <div className="flex items-center gap-2 border border-gray-200 p-1 rounded-md">
                                        <input 
                                            type="color" 
                                            value={newItem.color} 
                                            onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                        />
                                        <span className="text-xs text-gray-500" dir="ltr">{newItem.color}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('admin_text_color')}</label>
                                    <div className="flex items-center gap-2 border border-gray-200 p-1 rounded-md">
                                        <input 
                                            type="color" 
                                            value={newItem.text_color} 
                                            onChange={(e) => setNewItem({...newItem, text_color: e.target.value})}
                                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                        />
                                        <span className="text-xs text-gray-500" dir="ltr">{newItem.text_color}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">{t('admin_icon_image')}</label>
                                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                                    <input 
                                        id="fileInput"
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                        <span className="text-sm text-gray-500">{newItem.image ? newItem.image.name : t('admin_click_upload')}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 text-white font-bold py-3 rounded-lg shadow-md transform transition hover:-translate-y-0.5"
                            >
                                {isSubmitting ? t('admin_uploading') : t('admin_btn_add_item')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: ITEM LIST PREVIEW */}
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-xl font-bold text-slate-800">{t('admin_active_items')}</h2>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{items.length} {t('admin_segments')}</span>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                <p>{t('admin_no_items')}</p>
                                <p className="text-sm">{t('admin_add_instructions')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((item) => (
                                    <div key={item.id} className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                        {/* Type Badge */}
                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            item.type === 'prize' ? 'bg-green-100 text-green-700' :
                                            item.type === 'lose' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {item.type === 'retry' ? t('admin_opt_retry') : 
                                             item.type === 'prize' ? t('admin_opt_prize_simple') : 
                                             t('admin_opt_lose_simple')}
                                        </div>

                                        <div className="p-6 flex flex-col items-center justify-center gap-3">
                                            <div 
                                                className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner"
                                                style={{ backgroundColor: item.color }}
                                            >
                                                <img src={item.image_url} alt={item.label} className="w-10 h-10 object-contain drop-shadow-sm" />
                                            </div>
                                            <h3 className="font-bold text-lg text-center" style={{ color: '#333' }}>{item.label}</h3>
                                        </div>

                                        <div className="border-t border-gray-100 bg-gray-50 p-3 flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <div className="w-4 h-4 rounded-full border border-gray-300" style={{backgroundColor: item.color}} title={t('admin_bg_color')}></div>
                                                <div className="w-4 h-4 rounded-full border border-gray-300" style={{backgroundColor: item.text_color}} title={t('admin_text_color')}></div>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWheelConfig;