import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Save, Settings, Upload, RefreshCw, Power, MapPin, Edit2, GripVertical, X, CheckCircle, AlertTriangle } from 'lucide-react'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import PageToggle from '../AdminPanel/PageToggle';

const BASEURL = import.meta.env.VITE_API_BASE_URL || '';

// --- DnD Imports ---
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Component ---
const SortableItem = ({ item, onDelete, onEdit, t }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
        >
            {/* Type Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider z-10 ${
                item.type === 'prize' ? 'bg-green-100 text-green-700' :
                item.type === 'lose' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
            }`}>
                {item.type === 'retry' ? t('admin_opt_retry') : 
                    item.type === 'prize' ? t('admin_opt_prize_simple') : 
                    t('admin_opt_lose_simple')}
            </div>

            {/* Drag Handle */}
            <div {...attributes} {...listeners} className="absolute top-2 left-2 p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 z-10 bg-white/50 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="p-6 flex flex-col items-center justify-center gap-3 flex-grow cursor-default">
                <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner relative"
                    style={{ backgroundColor: item.color }}
                >
                    <img src={item.image_url} alt={item.label} className="w-10 h-10 object-contain drop-shadow-sm" />
                </div>
                <h3 className="font-bold text-lg text-center text-slate-800 line-clamp-2">{item.label}</h3>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 p-3 flex justify-between items-center">
                <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full border border-gray-300 shadow-sm" style={{backgroundColor: item.color}} title={t('admin_bg_color')}></div>
                    <div className="w-5 h-5 rounded-full border border-gray-300 shadow-sm" style={{backgroundColor: item.text_color}} title={t('admin_text_color')}></div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onEdit(item)}
                        className="text-slate-500 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                        title={t('Edit')}
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(item.id)}
                        className="text-slate-500 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                        title={t('Delete')}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminWheelConfig = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [items, setItems] = useState([]);
    const [config, setConfig] = useState({ 
        win_percentage: 10, 
        lose_percentage: 90, 
        game_active: true,
        google_maps_api_key: ''
    });
    const [loading, setLoading] = useState(true);
    
    // Form & Edit State
    const [editId, setEditId] = useState(null); 
    const [newItem, setNewItem] = useState({
        label: '',
        type: 'lose', 
        color: '#ffffff',
        text_color: '#000000',
        image: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef(null); // Reference for scrolling

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Fetch Data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASEURL}/api/marketing/admin/config`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setItems(data.items);
            setConfig({
                win_percentage: data.config.win_percentage || 10,
                lose_percentage: data.config.lose_percentage || 90,
                game_active: data.config.game_active === 'false' ? false : true,
                google_maps_api_key: data.config.google_maps_api_key || '' 
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

    // --- Configuration Logic ---
    const handleConfigUpdate = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await fetch(`${BASEURL}/api/marketing/admin/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    win_percentage: config.win_percentage,
                    lose_percentage: config.lose_percentage,
                    google_maps_api_key: config.google_maps_api_key
                })
            });
            toast.success(t('toast_settings_updated'));
        } catch (error) {
            toast.error(t('toast_update_failed'));
        }
    };

    const toggleGame = async () => {
        const newState = !config.game_active;
        setConfig(prev => ({ ...prev, game_active: newState }));
        try {
            const token = localStorage.getItem('authToken');
            await fetch(`${BASEURL}/api/marketing/admin/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ game_active: newState })
            });
            toast.success(newState ? t('toast_game_live') : t('toast_game_closed'));
        } catch (error) {
            setConfig(prev => ({ ...prev, game_active: !newState }));
            toast.error(t('toast_toggle_failed'));
        }
    };

    // --- CRUD Logic ---

    // 1. Prepare Edit
    const handleEditClick = (item) => {
        setEditId(item.id);
        setNewItem({
            label: item.label,
            type: item.type,
            color: item.color,
            text_color: item.text_color,
            image: null 
        });
        
        // Smooth scroll to the form
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // 2. Cancel Edit
    const cancelEdit = () => {
        setEditId(null);
        setNewItem({ label: '', type: 'lose', color: '#ffffff', text_color: '#000000', image: null });
        if(document.getElementById('fileInput')) document.getElementById('fileInput').value = "";
    };

    // 3. Submit (Add or Update)
    const handleSubmitItem = async (e) => {
        e.preventDefault();
        if(!editId && !newItem.image) return toast.error(t('toast_upload_image')); 
        
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('label', newItem.label);
        formData.append('type', newItem.type);
        formData.append('color', newItem.color);
        formData.append('text_color', newItem.text_color);
        if(newItem.image) formData.append('image', newItem.image);

        const token = localStorage.getItem('authToken');

        try {
            if (editId) {
                await fetch(`${BASEURL}/api/marketing/admin/items/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                toast.success(t('Item Updated Successfully'));
            } else {
                await fetch(`${BASEURL}/api/marketing/admin/items`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                toast.success(t('toast_item_added'));
            }
            cancelEdit(); 
            fetchData();  
        } catch (error) {
            toast.error(error.response?.data?.message || t('toast_add_error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm(t('confirm_delete'))) return;
        try {
            const token = localStorage.getItem('authToken');
            await fetch(`${BASEURL}/api/marketing/admin/items/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setItems(items.filter(i => i.id !== id));
            toast.success(t('toast_item_deleted'));
        } catch (error) {
            toast.error(t('toast_delete_error'));
        }
    };

    // --- Drag and Drop Logic ---
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            const newOrder = arrayMove(items, oldIndex, newIndex);
            setItems(newOrder);

            try {
                const orderedIds = newOrder.map(item => item.id);
                const token = localStorage.getItem('authToken');
                await fetch(`${BASEURL}/api/marketing/admin/items/reorder`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ orderedIds })
                });
            } catch (error) {
                toast.error("Failed to save order");
            }
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">{t('loading_admin')}</div>;

    return (
        <div 
            className="min-h-screen bg-[#F8F9FC] p-6 font-sans text-slate-800"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <ToastContainer position={isRTL ? "top-left" : "top-right"} autoClose={3000} theme="light" rtl={isRTL} />
            <div dir='ltr'><PageToggle activePage="spin_Game" /></div>
            
            {/* --- HEADER --- */}
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                        <Settings className="w-6 h-6 text-[#724F38]" />
                        {t('admin_header_title')}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{t('admin_header_subtitle')}</p>
                </div>
                
                {/* Game Status Toggle */}
                {/* Game Status Toggle */}
<div className={`flex items-center gap-4 px-5 py-2 rounded-full border ${config.game_active ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} transition-all shadow-sm`}>
    {/* Status Text */}
    <span className={`text-sm font-bold uppercase tracking-wider ${config.game_active ? 'text-green-700' : 'text-red-700'}`}>
        {config.game_active ? t('admin_status_live_desc') : t('admin_status_closed_desc')}
    </span>

    {/* The Old Slider Toggle */}
    <div 
        onClick={toggleGame} 
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${config.game_active ? 'bg-green-500' : 'bg-gray-300'}`} 
        dir="ltr"
    >
        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${config.game_active ? 'translate-x-6' : ''}`}></div>
    </div>
</div>
            </header>

            {/* --- TOP ROW: GLOBAL CONFIGURATION --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col lg:flex-row items-end lg:items-center gap-6">
                    {/* Win/Lose Inputs */}
                    <div className="flex-1 w-full grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t('admin_win_pct')}</label>
                            <div className="relative">
                                <input type="number" value={config.win_percentage} onChange={(e) => setConfig({...config, win_percentage: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#724F38]" />
                                <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">{t('admin_lose_pct')}</label>
                            <div className="relative">
                                <input type="number" value={config.lose_percentage} onChange={(e) => setConfig({...config, lose_percentage: e.target.value})} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#724F38]" />
                                <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
                            </div>
                        </div>
                    </div>

                    {/* API Key */}
                    <div className="flex-[2] w-full">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Google Maps API Key</label>
                        <input type="text" placeholder="AIzaSy..." value={config.google_maps_api_key} onChange={(e) => setConfig({...config, google_maps_api_key: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white outline-none text-sm font-mono focus:ring-2 focus:ring-[#724F38]" />
                    </div>

                    {/* Save Button */}
                    <button onClick={handleConfigUpdate} className="w-full lg:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                        <Save className="w-4 h-4" /> {t('admin_btn_save_config')}
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT: SPLIT VIEW (FORM + LIST) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- LEFT COLUMN: STICKY FORM (Span 4) --- */}
                <div className="lg:col-span-4 sticky top-6 z-20">
                    <div ref={formRef} className={`bg-white rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${editId ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-200'}`}>
                        
                        {/* Form Header */}
                        <div className={`p-4 border-b ${editId ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'} flex justify-between items-center`}>
                            <h2 className={`font-bold flex items-center gap-2 ${editId ? 'text-blue-700' : 'text-slate-700'}`}>
                                {editId ? <Edit2 className="w-5 h-5"/> : <Plus className="w-5 h-5" />} 
                                {editId ? 'Editing Item' : t('admin_add_item_title')}
                            </h2>
                            {editId && (
                                <button onClick={cancelEdit} className="text-xs bg-white text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1">
                                    <X className="w-3 h-3"/> Cancel
                                </button>
                            )}
                        </div>
                        
                        {/* The Form */}
                        <form onSubmit={handleSubmitItem} className="p-5 space-y-5">
                            {/* Label */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('admin_label')}</label>
                                <input required type="text" placeholder={t('admin_placeholder_label')} value={newItem.label} onChange={(e) => setNewItem({...newItem, label: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#724F38] focus:ring-2 focus:ring-[#724F38]/20 outline-none transition-all" />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('admin_type_result')}</label>
                                <div className="relative">
                                    <select value={newItem.type} onChange={(e) => setNewItem({...newItem, type: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#724F38] outline-none appearance-none">
                                        <option value="lose">😢 {t('admin_opt_lose')}</option>
                                        <option value="prize">🎁 {t('admin_opt_prize')}</option>
                                        <option value="retry">🔄 {t('admin_opt_retry')}</option>
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none text-gray-400">▼</div>
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('admin_bg_color')}</label>
                                    <div className="flex items-center gap-2 border border-gray-200 p-2 rounded-lg bg-gray-50">
                                        <input type="color" value={newItem.color} onChange={(e) => setNewItem({...newItem, color: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
                                        <span className="text-xs font-mono text-gray-500" dir="ltr">{newItem.color}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('admin_text_color')}</label>
                                    <div className="flex items-center gap-2 border border-gray-200 p-2 rounded-lg bg-gray-50">
                                        <input type="color" value={newItem.text_color} onChange={(e) => setNewItem({...newItem, text_color: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
                                        <span className="text-xs font-mono text-gray-500" dir="ltr">{newItem.text_color}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                    {editId ? `${t('admin_icon_image')} (Optional)` : t('admin_icon_image')}
                                </label>
                                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 hover:border-[#724F38] transition-all text-center cursor-pointer group">
                                    <input id="fileInput" type="file" accept="image/*" onChange={(e) => setNewItem({...newItem, image: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="flex flex-col items-center pointer-events-none">
                                        <div className="bg-gray-100 p-3 rounded-full mb-2 group-hover:bg-[#724F38]/10 transition-colors">
                                           <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#724F38]" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 truncate max-w-[200px]">
                                            {newItem.image ? newItem.image.name : (editId ? 'Click to change image' : t('admin_click_upload'))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 ${editId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#724F38] hover:bg-[#5a3e2c]'}`}
                            >
                                {isSubmitting ? (
                                    <RefreshCw className="w-5 h-5 animate-spin"/> 
                                ) : (
                                    editId ? <><CheckCircle className="w-5 h-5"/> Update Item</> : <><Plus className="w-5 h-5"/> {t('admin_btn_add_item')}</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: ITEM LIST GRID (Span 8) --- */}
                <div className="lg:col-span-8">
                     <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-gray-400" />
                            {t('admin_active_items')}
                        </h2>
                        <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                            {items.length} {t('admin_segments')}
                        </span>
                     </div>

                     {items.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                <AlertTriangle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">{t('admin_no_items')}</h3>
                            <p className="text-gray-400 text-sm mt-1">Use the form on the left to add your first prize or loss segment.</p>
                        </div>
                     ) : (
                        <DndContext 
                            sensors={sensors} 
                            collisionDetection={closestCenter} 
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext 
                                items={items.map(i => i.id)} 
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {items.map((item) => (
                                        <SortableItem 
                                            key={item.id} 
                                            item={item} 
                                            onDelete={handleDelete}
                                            onEdit={handleEditClick}
                                            t={t}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                     )}
                </div>

            </div>
        </div>
    );
};

export default AdminWheelConfig;