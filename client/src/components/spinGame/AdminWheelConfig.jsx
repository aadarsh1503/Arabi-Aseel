import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Save, Settings, Upload, RefreshCw } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageToggle from '../AdminPanel/PageToggle';

const API_BASE = '/api/marketing'; 

const AdminWheelConfig = () => {
    const [items, setItems] = useState([]);
    const [config, setConfig] = useState({ win_percentage: 10, lose_percentage: 90 });
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [newItem, setNewItem] = useState({
        label: '',
        type: 'lose', // default
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
                lose_percentage: data.config.lose_percentage || 90
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            toast.error("Failed to load configuration data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Update Global Settings
    const handleConfigUpdate = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${API_BASE}/admin/config`, config, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Settings Updated Successfully!");
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    // Add New Item
    const handleAddItem = async (e) => {
        e.preventDefault();
        if(!newItem.image) return toast.error("Please upload an icon image");

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
            
            // Reset Form & Reload
            setNewItem({ label: '', type: 'lose', color: '#ffffff', text_color: '#000000', image: null });
            document.getElementById('fileInput').value = ""; // Reset file input
            toast.success("Item added successfully!");
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding item");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Item
    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`${API_BASE}/admin/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(items.filter(i => i.id !== id));
            toast.success("Item deleted successfully");
        } catch (error) {
            toast.error("Error deleting item");
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-slate-800">
             
            {/* Toast Container Configured */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div>
                <PageToggle activePage="spin_Game" />
            </div>
            
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="w-8 h-8 text-pink-600" />
                    Campaign Configuration
                </h1>
                <p className="text-slate-500 mt-1">Manage Spin Wheel Prizes, Odds, and Items.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: CONFIG & ADD FORM */}
                <div className="space-y-8 lg:col-span-1">
                    
                    {/* 1. Global Probability Settings */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-blue-500" /> Probability Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Winning Percentage (%)</label>
                                <input 
                                    type="number" 
                                    value={config.win_percentage} 
                                    onChange={(e) => setConfig({...config, win_percentage: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Losing Percentage (%)</label>
                                <input 
                                    type="number" 
                                    value={config.lose_percentage} 
                                    onChange={(e) => setConfig({...config, lose_percentage: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Note: Total logic is handled by backend distribution.</p>
                            </div>
                            <button onClick={handleConfigUpdate} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                <Save className="w-4 h-4" /> Save Odds
                            </button>
                        </div>
                    </div>

                    {/* 2. Add New Item Form */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-500"></div>
                        <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-pink-500" /> Add Wheel Item
                        </h2>
                        
                        <form onSubmit={handleAddItem} className="space-y-4">
                            {/* Label */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Label</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. Free Coffee"
                                    value={newItem.label} 
                                    onChange={(e) => setNewItem({...newItem, label: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-pink-500 outline-none"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Type (Result)</label>
                                <select 
                                    value={newItem.type} 
                                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white focus:border-pink-500 outline-none"
                                >
                                    <option value="lose">Lose (End Game)</option>
                                    <option value="prize">Prize (Win)</option>
                                    <option value="retry">Try Again (Re-spin)</option>
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    'Lose' & 'Prize' stop user from playing again. 'Try Again' allows 1 more spin.
                                </p>
                            </div>

                            {/* Colors */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Bg Color</label>
                                    <div className="flex items-center gap-2 border border-gray-200 p-1 rounded-md">
                                        <input 
                                            type="color" 
                                            value={newItem.color} 
                                            onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                        />
                                        <span className="text-xs text-gray-500">{newItem.color}</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Text Color</label>
                                    <div className="flex items-center gap-2 border border-gray-200 p-1 rounded-md">
                                        <input 
                                            type="color" 
                                            value={newItem.text_color} 
                                            onChange={(e) => setNewItem({...newItem, text_color: e.target.value})}
                                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                        />
                                        <span className="text-xs text-gray-500">{newItem.text_color}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Icon Image</label>
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
                                        <span className="text-sm text-gray-500">{newItem.image ? newItem.image.name : "Click to upload"}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 text-white font-bold py-3 rounded-lg shadow-md transform transition hover:-translate-y-0.5"
                            >
                                {isSubmitting ? 'Uploading...' : 'Add Item'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: ITEM LIST PREVIEW */}
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Active Items</h2>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{items.length} Segments</span>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                <p>No items found.</p>
                                <p className="text-sm">Add items from the left panel.</p>
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
                                            {item.type === 'retry' ? 'Try Again' : item.type}
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
                                                <div className="w-4 h-4 rounded-full border border-gray-300" style={{backgroundColor: item.color}} title="Background"></div>
                                                <div className="w-4 h-4 rounded-full border border-gray-300" style={{backgroundColor: item.text_color}} title="Text"></div>
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