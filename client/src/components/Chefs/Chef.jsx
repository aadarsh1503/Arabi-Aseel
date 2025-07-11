import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext/Authcontext'; // Ensure this path is correct
import { Plus, Edit, Trash2, XCircle, UploadCloud, User, Star, ArrowLeft, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import "./login.css"; // Make sure this CSS file contains the 'animate-scale-in' animation

const API_URL = 'https://arabi-aseel-1.onrender.com/api/chefs';

// ===================================================================
//  1. HELPER COMPONENT: The Futuristic Admin Chef Card (Display)
// ===================================================================
const ChefDisplayCard = ({ chef, isRTL, onEdit, onDelete }) => (
    <div dir='ltr' className="group font-noto-serif relative text-center bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105">
        
        {/* The Glowing Orbital Image Frame */}
        <div className="relative w-48 h-48 mx-auto">
            {/* The Gradient Glow - appears on hover */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500"></div>
            
            {/* The Image Container */}
            <div className="relative w-full h-full rounded-full border-4 border-white shadow-md overflow-hidden">
                <img
                    src={chef.image_url}
                    alt={isRTL ? chef.name_ar : chef.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
        </div>

        {/* Text Content */}
        <div className="mt-6">
            <h3 className="text-2xl font-bold text-slate-800">{isRTL ? chef.name_ar : chef.name}</h3>
            <p className="mt-1 text-cyan-600 font-semibold">{isRTL ? chef.designation_ar : chef.designation}</p>
        </div>
        
        {/* Action Buttons with Glassmorphism Effect */}
        <div className="absolute inset-0 flex justify-center items-center space-x-4 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
            <button onClick={() => onEdit(chef)} className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transform transition-transform hover:scale-110" title="Edit Chef"><Edit size={20} /></button>
            <button onClick={() => onDelete(chef.id)} className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transform transition-transform hover:scale-110" title="Delete Chef"><Trash2 size={20} /></button>
        </div>
    </div>
);

// ===================================================================
//  2. HELPER COMPONENT: Skeleton Loader for the New Card
// ===================================================================
const ChefDisplayCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="w-48 h-48 mx-auto bg-slate-200 rounded-full"></div>
        <div className="mt-6 flex flex-col items-center space-y-3">
            <div className="h-7 w-40 bg-slate-200 rounded-md"></div>
            <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
        </div>
    </div>
);

// ===================================================================
//  3. HELPER COMPONENT: The Edit Modal
// ===================================================================
const EditChefModal = ({ chef, onClose, onSave, isLoading }) => {
    const { t } = useTranslation();
    
    const [name, setName] = useState(chef.name);
    const [designation, setDesignation] = useState(chef.designation);
    const [nameAr, setNameAr] = useState(chef.name_ar);
    const [designationAr, setDesignationAr] = useState(chef.designation_ar);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(chef.image_url);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        onSave(chef.id, { name, designation, name_ar: nameAr, designation_ar: designationAr }, image);
    };

    return (
        <div dir='ltr' className="fixed inset-0 font-noto-serif bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-lg transform transition-all">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{t('editChefDetails', 'Edit Chef Details')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('englishName', 'English Name')} className="w-full p-3 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder={t('arabicName', 'اسم (Arabic Name)')} dir="rtl" className="w-full p-3 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder={t('englishDesignation', 'English Designation')} className="w-full p-3 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" value={designationAr} onChange={(e) => setDesignationAr(e.target.value)} placeholder={t('arabicDesignation', 'المنصب (Arabic Designation)')} dir="rtl" className="w-full p-3 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div className="mt-6">
                    <p className="text-sm font-medium text-slate-600 mb-2 text-center">{t('updatePhotoOptional', 'Update Photo (Optional)')}</p>
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"/>
                    <input type="file" id="edit-file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    <label htmlFor="edit-file" className="text-sm text-cyan-600 font-semibold cursor-pointer text-center block hover:underline">{t('chooseNewImage', 'Choose a new image')}</label>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition">{t('cancel', 'Cancel')}</button>
                    <button onClick={handleSave} disabled={isLoading} className="px-5 py-2 rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 shadow-lg shadow-cyan-500/30 font-semibold transition">{isLoading ? t('saving', 'Saving...') : t('saveChanges', 'Save Changes')}</button>
                </div>
            </div>
        </div>
    );
};

// ===================================================================
//  4. MAIN COMPONENT: Chef
// ===================================================================
const Chef = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    // State Management
    const [chefs, setChefs] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [designationAr, setDesignationAr] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChef, setEditingChef] = useState(null);

    // State for Logout Confirmation Modal
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => { fetchChefs(); }, []);

    const fetchChefs = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(API_URL);
            setChefs(response.data);
        } catch (error) { toast.error(t('fetchChefsError', 'Failed to fetch chefs.')); } 
        finally { setIsFetching(false); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
    };
    
    const resetForm = () => {
        setName(''); setDesignation(''); setNameAr(''); setDesignationAr('');
        setImage(null); setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !designation || !nameAr || !designationAr || !image) {
            toast.warn(t('fillAllFieldsWarning', 'Please fill all fields and select an image.'));
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('designation', designation);
        formData.append('name_ar', nameAr);
        formData.append('designation_ar', designationAr);
        formData.append('image', image);
        setIsSubmitting(true);
        try {
            await axios.post(API_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success(t('chefAddedSuccess', 'Chef added successfully!'));
            resetForm();
            fetchChefs();
        } catch (error) { toast.error(t('addChefError', 'Failed to add chef.')); } 
        finally { setIsSubmitting(false); }
    };

    const handleUpdate = async (id, data, newImage) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('designation', data.designation);
        formData.append('name_ar', data.name_ar);
        formData.append('designation_ar', data.designation_ar);
        if (newImage) formData.append('image', newImage);
        setIsSubmitting(true);
        try {
            await axios.put(`${API_URL}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success(t('chefUpdatedSuccess', 'Chef updated successfully!'));
            fetchChefs();
            setIsModalOpen(false);
            setEditingChef(null);
        } catch (error) { toast.error(t('updateChefError', 'Failed to update chef.')); } 
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('deleteConfirmation', 'Are you sure you want to delete this chef?'))) {
            const originalChefs = [...chefs];
            setChefs(chefs.filter(chef => chef.id !== id));
            try {
                await axios.delete(`${API_URL}/${id}`);
                toast.success(t('chefDeletedSuccess', 'Chef deleted successfully!'));
            } catch (error) {
                toast.error(t('deleteChefError', 'Failed to delete chef. Reverting.'));
                setChefs(originalChefs);
            }
        }
    };

    const handleEditClick = (chef) => {
        setEditingChef(chef);
        setIsModalOpen(true);
    };
    
    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        // The logout function from useAuth will handle navigation
        logout();
    };

    return (
        <div dir={isRTL ? 'ltr' : 'ltr'} className={`min-h-screen font-noto-serif bg-slate-50 font-sans text-slate-800`}>
            {isModalOpen && editingChef && (
                <EditChefModal chef={editingChef} onClose={() => setIsModalOpen(false)} onSave={handleUpdate} isLoading={isSubmitting} />
            )}

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div 
                    dir='ltr'
                    className="fixed inset-0 font-noto-serif bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300"
                    onClick={() => setIsLogoutModalOpen(false)}
                >
                    <div 
                        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75"></div>
                            <div className="relative flex items-center justify-center w-full h-full bg-red-100 rounded-full">
                                <LogOut className="text-red-500" size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
                            {t('logoutConfirmTitle', 'Confirm Your Logout')}
                        </h2>
                        <p className="text-slate-600 text-center mb-8">
                            {t('logoutConfirmMessage', 'Are you sure you want to sign out?')}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setIsLogoutModalOpen(false)} 
                                className="px-5 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200/70 hover:bg-slate-300 transition-colors"
                            >
                                {t('stay', 'Stay')}
                            </button>
                            <button 
                                onClick={handleConfirmLogout} 
                                disabled={isLoggingOut} 
                                className="flex items-center justify-center px-5 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 shadow-lg shadow-red-500/30 transition-all transform hover:scale-105"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('loggingOut', 'Logging Out...')}
                                    </>
                                ) : (
                                    t('logOut', 'Log Out')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="container font-noto-serif mx-auto p-4 md:p-8">
                <header className="flex justify-between items-center mb-12">
                    <button onClick={() => navigate('/admin')} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors" title="Back to Admin Panel">
                        <ArrowLeft size={20} />
                        <span className="font-semibold hidden md:inline">{t('back', 'Back')}</span>
                    </button>
                    <h1 className="text-4xl md:text-5xl font-noto-serif font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent pb-2 text-center">
                        {t('chefsPageTitle', 'Manage Culinary Artists')}
                    </h1>
                    <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-500 bg-red-100 hover:bg-red-200 transition-colors" title="Logout">
                        <LogOut size={20} />
                        <span className="font-semibold hidden md:inline">{t('logout', 'Logout')}</span>
                    </button>
                </header>
                
                <div className={`max-w-3xl mx-auto font-noto-serif bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-lg shadow-slate-200/50 mb-16 ${isRTL ? 'text-right' : ''}`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-700">{t('addNewArtist', 'Add a New Artist')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="relative">
                                <User className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} text-slate-400`} size={20}/>
                                <input type="text" placeholder={t('chefsNameEn', "Chef's Name (EN)")} value={name} onChange={(e) => setName(e.target.value)} className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} />
                            </div>
                            <div className="relative">
                                <User className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-slate-400`} size={20}/>
                                <input type="text" placeholder={t('chefsNameAr', "اسم الشيف (AR)")} value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" className={`w-full ${isRTL ? 'pl-10 text-left' : 'pr-10 text-right'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} />
                            </div>
                            <div className="relative">
                                <Star className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} text-slate-400`} size={20}/>
                                <input type="text" placeholder={t('designationEn', 'Designation (EN)')} value={designation} onChange={(e) => setDesignation(e.target.value)} className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} />
                            </div>
                            <div className="relative">
                                <Star className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-slate-400`} size={20}/>
                                <input type="text" placeholder={t('designationAr', 'المنصب (AR)')} value={designationAr} onChange={(e) => setDesignationAr(e.target.value)} dir="rtl" className={`w-full ${isRTL ? 'pl-10 text-left' : 'pr-10 text-right'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} />
                            </div>
                        </div>
                        
                        <div>
                            {imagePreview ? ( <div className="relative w-40 h-40 mx-auto"><img src={imagePreview} alt="Preview" className="w-40 h-40 rounded-full object-cover shadow-lg"/><button type="button" onClick={() => { setImage(null); setImagePreview(''); if(fileInputRef.current) fileInputRef.current.value = null; }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"><XCircle size={20} /></button></div> ) : ( <label htmlFor="file-upload" className="relative block w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400 hover:bg-slate-50 transition-colors"><UploadCloud className="mx-auto h-12 w-12 text-slate-400"/><span className="mt-2 block text-sm font-semibold text-cyan-600">{t('uploadPhoto', 'Upload a Photo')}</span><span className="mt-1 block text-xs text-slate-500">{t('fileRequirements', 'PNG, JPG up to 10MB')}</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} ref={fileInputRef} accept="image/*"/></label> )}
                        </div>

                        <div className={`text-${isRTL ? 'left' : 'right'}`}>
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-8 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <Plus size={20} className={isRTL ? 'ml-2' : 'mr-2'} />{isSubmitting ? t('adding', 'Adding...') : t('addChef', 'Add Chef')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {isFetching ? (
                        Array.from({ length: 4 }).map((_, i) => <ChefDisplayCardSkeleton key={i} />)
                    ) : (
                        chefs.map((chef) => (
                            <ChefDisplayCard key={chef.id} chef={chef} isRTL={isRTL} onEdit={handleEditClick} onDelete={handleDelete} />
                        ))
                    )}
                </div>

                {!isFetching && chefs.length === 0 && (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-slate-700">{t('noChefsFound', 'No Chefs Found')}</h3>
                        <p className="text-slate-500 mt-2">{t('addFirstChef', 'Add the first culinary artist to get started!')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chef;