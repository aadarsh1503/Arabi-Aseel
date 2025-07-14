import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authcontext/Authcontext'; // Ensure this path is correct
import { Plus, Edit, Trash2, XCircle, UploadCloud, User, Star, ArrowLeft, LogOut, CheckCircle, AlertTriangle, Info, ShieldCheck, Crop } from 'lucide-react'; // ShieldCheck and Crop added
import { useTranslation } from 'react-i18next';
import "./login.css"; // Make sure this CSS file contains the 'animate-scale-in' animation
import PageToggle from '../AdminPanel/PageToggle';

// New imports for image cropping
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


const API_URL = 'https://arabi-aseel-1.onrender.com/api/chefs';

// ===================================================================
// HELPER: Futuristic Toast Content
// ===================================================================
const ToastContent = ({ message, IconComponent, iconColor }) => (
    <div className="flex items-center font-sans">
        <IconComponent className={`mr-3 ${iconColor}`} size={24} />
        <span className="font-semibold">{message}</span>
    </div>
);

// ===================================================================
// HELPER: The Futuristic Admin Chef Card (Display)
// ===================================================================
const ChefDisplayCard = ({ chef, isRTL, onEdit, onDelete }) => (
    <div dir='ltr' className="group font-noto-serif relative text-center bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-105">
        <div className="relative w-56 h-56 mx-auto">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500"></div>
            <div className="relative w-full h-full rounded-full border-4 border-white shadow-md overflow-hidden">
                <img src={chef.image_url} alt={isRTL ? chef.name_ar : chef.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
        </div>
        <div className="mt-6">
            <h3 className="text-2xl font-bold text-slate-800">{isRTL ? chef.name_ar : chef.name}</h3>
            <p className="mt-1 text-cyan-600 font-semibold">{isRTL ? chef.designation_ar : chef.designation}</p>
        </div>
        <div className="absolute inset-0 flex justify-center items-center space-x-4 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
            <button onClick={() => onEdit(chef)} className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transform transition-transform hover:scale-110" title="Edit Chef"><Edit size={20} /></button>
            <button onClick={() => onDelete(chef.id)} className="p-4 bg-white/20 text-white rounded-full hover:bg-white/30 transform transition-transform hover:scale-110" title="Delete Chef"><Trash2 size={20} /></button>
        </div>
    </div>
);

// ===================================================================
// HELPER: Skeleton Loader
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
// NEW HELPER: Image Cropping Modal
// ===================================================================
const ImageCropModal = ({ src, onClose, onCropComplete }) => {
    const { t } = useTranslation();
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!src) {
            setCrop(undefined);
            setCompletedCrop(null);
        }
    }, [src]);

    function onImageLoad(e) {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height),
            width,
            height
        );
        setCrop(crop);
    }

    async function handleConfirmCrop() {
        if (!completedCrop || !imgRef.current) {
            toast.error("Invalid crop selection.");
            return;
        }

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        canvas.width = Math.floor(completedCrop.width * scaleX);
        canvas.height = Math.floor(completedCrop.height * scaleY);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            const croppedFile = new File([blob], "cropped_image.jpeg", { type: "image/jpeg" });
            onCropComplete(croppedFile);
        }, 'image/jpeg', 0.95);
    }

    if (!src) return null;

    return (
        <div dir='ltr' className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[70] p-4 font-noto-serif">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-2xl transform transition-all animate-scale-in">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{t('cropImage', 'Crop Your Image')}</h2>
                <p className="text-slate-600 mb-6">{t('cropImageInstruction', 'Adjust the selection to a 16:9 ratio for the best fit.')}</p>
                <div className='max-h-[60vh] overflow-y-auto bg-slate-200/50 rounded-lg p-2'>
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={16 / 9}
                        minWidth={160}
                        minHeight={90}
                    >
                        <img ref={imgRef} src={src} onLoad={onImageLoad} alt="Crop" style={{ maxHeight: '70vh' }} />
                    </ReactCrop>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition">{t('cancel', 'Cancel')}</button>
                    <button onClick={handleConfirmCrop} className="flex items-center px-5 py-2 rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/30 font-semibold transition">
                        <Crop size={18} className="mr-2"/> {t('confirmCrop', 'Confirm Crop')}
                    </button>
                </div>
            </div>
        </div>
    );
};


// ===================================================================
// HELPER: Edit Modal
// ===================================================================
const EditChefModal = ({ chef, onClose, onSave, isLoading }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(chef.name);
    const [designation, setDesignation] = useState(chef.designation);
    const [nameAr, setNameAr] = useState(chef.name_ar);
    const [designationAr, setDesignationAr] = useState(chef.designation_ar);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(chef.image_url);

    // State for crop modal
    const [cropSrc, setCropSrc] = useState(null);

    const handleImageInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCropSrc(reader.result);
            reader.readAsDataURL(file);
             e.target.value = null; // Reset input
        }
    };

    const handleCropComplete = (croppedImageFile) => {
        if (croppedImageFile) {
            setImage(croppedImageFile);
            setImagePreview(URL.createObjectURL(croppedImageFile));
        }
        setCropSrc(null); // Close crop modal
    };


    const handleSave = () => {
        if (!name || !designation || !nameAr || !designationAr) {
             toast.warn(<ToastContent message={t('fillAllFieldsWarning')} IconComponent={AlertTriangle} iconColor="text-white" />);
             return;
        }
        onSave(chef.id, { name, designation, name_ar: nameAr, designation_ar: designationAr }, image);
    };

    return (
        <>
            <ImageCropModal 
                src={cropSrc}
                onClose={() => setCropSrc(null)}
                onCropComplete={handleCropComplete}
            />
            <div dir='ltr' className="fixed inset-0 font-noto-serif bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-lg transform transition-all animate-scale-in">
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
                        <input type="file" id="edit-file" className="hidden" onChange={handleImageInputChange} accept="image/*" />
                        <label htmlFor="edit-file" className="text-sm text-cyan-600 font-semibold cursor-pointer text-center block hover:underline">{t('chooseNewImage', 'Choose a new image')}</label>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <button onClick={onClose} className="px-5 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition">{t('cancel', 'Cancel')}</button>
                        <button onClick={handleSave} disabled={isLoading} className="px-5 py-2 rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 shadow-lg shadow-cyan-500/30 font-semibold transition">{isLoading ? t('saving', 'Saving...') : t('saveChanges', 'Save Changes')}</button>
                    </div>
                </div>
            </div>
        </>
    );
};

// ===================================================================
// NEW HELPER: The "SEXY FUTURISTIC" Confirmation Modal
// ===================================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading, chefData, isRTL }) => {
    const { t } = useTranslation();
    if (!isOpen || !chefData) return null;

    return (
        <div dir='ltr' className="fixed inset-0 font-noto-serif bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60]" onClick={onClose}>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full animate-ping opacity-75"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg">
                        <ShieldCheck className="text-white" size={36} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">{t('confirmNewArtistTitle', 'Confirm New Chef')}</h2>
                <p className="text-slate-600 text-center mb-8">{t('confirmNewArtistMessage', 'Please review the details below before saving.')}</p>
                
                <div className="bg-slate-100/70 p-6 rounded-xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img src={chefData.imagePreview} alt="Preview" className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white" />
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-slate-700">{chefData.name}</h3>
                            <p className="text-cyan-600 font-semibold">{chefData.designation}</p>
                            <hr className="my-2 border-slate-200"/>
                            <h3 className="text-xl font-bold text-slate-700" dir="rtl">{chefData.name_ar}</h3>
                            <p className="text-cyan-600 font-semibold" dir="rtl">{chefData.designation_ar}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button onClick={onClose} disabled={isLoading} className="px-5 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200/70 hover:bg-slate-300 transition-colors disabled:opacity-50">
                        {t('cancel', 'Cancel')}
                    </button>
                    <button onClick={onConfirm} disabled={isLoading} className="flex items-center justify-center px-5 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{t('saving', 'Saving...')}</>
                        ) : (
                            <> <CheckCircle size={20} className="mr-2"/> {t('confirmAndAdd', 'Confirm & Add')} </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===================================================================
// MAIN COMPONENT: Chef
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
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingChefData, setPendingChefData] = useState(null);

    // New state for the crop modal in the main "add" form
    const [cropSrc, setCropSrc] = useState(null);
  
    useEffect(() => { fetchChefs(); }, []);

    const fetchChefs = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(API_URL);
            setChefs(response.data);
        } catch (error) { 
            toast.error(<ToastContent message={t('fetchChefsError', 'Failed to fetch chefs.')} IconComponent={AlertTriangle} iconColor="text-white" />);
        } finally { 
            setIsFetching(false); 
        }
    };
    
    // Updated image handler to trigger the crop modal
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCropSrc(reader.result);
            reader.readAsDataURL(file);
        }
    };
    
    // Handler for when cropping is complete
    const handleCropComplete = (croppedImageFile) => {
        if (croppedImageFile) {
            setImage(croppedImageFile);
            setImagePreview(URL.createObjectURL(croppedImageFile));
        }
        setCropSrc(null); // Close crop modal
    };


    const resetForm = () => {
        setName(''); setDesignation(''); setNameAr(''); setDesignationAr('');
        setImage(null); setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !designation || !nameAr || !designationAr || !image) {
            toast.warn(<ToastContent message={t('fillAllFieldsWarning', 'Please fill all fields and select an image.')} IconComponent={AlertTriangle} iconColor="text-white" />);
            return;
        }
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('designation', designation);
        formData.append('name_ar', nameAr);
        formData.append('designation_ar', designationAr);
        formData.append('image', image);
        
        setPendingChefData({ formData, name, name_ar: nameAr, designation, designation_ar: designationAr, imagePreview });
        setIsConfirmModalOpen(true);
    };

    const handleConfirmAndSave = async () => {
        if (!pendingChefData) return;
        setIsSubmitting(true);

        const promise = axios.post(API_URL, pendingChefData.formData, { headers: { 'Content-Type': 'multipart/form-data' } });

        toast.promise(promise, {
            pending: { render: () => <ToastContent message={t('addingChefPending', 'Adding new Chef...')} IconComponent={Info} iconColor="text-white"/>, icon: false },
            success: { render: () => <ToastContent message={t('chefAddedSuccess', 'Chef added successfully!')} IconComponent={CheckCircle} iconColor="text-white"/>, icon: "🎉" },
            error: { render: () => <ToastContent message={t('addChefError', 'Failed to add Chef.')} IconComponent={XCircle} iconColor="text-white"/>, icon: "🔥" }
        });

        try {
            await promise;
            resetForm();
            fetchChefs();
        } catch (error) {
        } finally {
            setIsSubmitting(false);
            setIsConfirmModalOpen(false);
            setPendingChefData(null);
        }
    };

    const handleUpdate = async (id, data, newImage) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('designation', data.designation);
        formData.append('name_ar', data.name_ar);
        formData.append('designation_ar', data.designation_ar);
        if (newImage) formData.append('image', newImage);
        
        setIsSubmitting(true);
        const promise = axios.put(`${API_URL}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.promise(promise, {
            pending: { render: () => <ToastContent message={t('updatingChefPending', 'Updating details...')} IconComponent={Info} iconColor="text-white"/>, icon: false },
            success: { render: () => <ToastContent message={t('chefUpdatedSuccess', 'Chef updated successfully!')} IconComponent={CheckCircle} iconColor="text-white"/>, icon: "🚀" },
            error: { render: () => <ToastContent message={t('updateChefError', 'Failed to update Chef.')} IconComponent={XCircle} iconColor="text-white"/>, icon: "💥" }
        });

        try {
            await promise;
            fetchChefs();
            setIsModalOpen(false);
            setEditingChef(null);
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('deleteConfirmation', 'Are you sure you want to delete this chef?'))) {
            const promise = axios.delete(`${API_URL}/${id}`);
            toast.promise(promise, {
                pending: { render: () => <ToastContent message={t('deletingChefPending', 'Deleting Chef...')} IconComponent={Info} iconColor="text-white"/> },
                success: { render: () => <ToastContent message={t('chefDeletedSuccess', 'Chef deleted successfully!')} IconComponent={Trash2} iconColor="text-white"/> },
                error: { render: () => <ToastContent message={t('deleteChefError', 'Failed to delete Chef.')} IconComponent={XCircle} iconColor="text-white"/> }
            });
            try {
                await promise;
                fetchChefs();
            } catch (error) {}
        }
    };

    const handleEditClick = (chef) => {
        setEditingChef(chef);
        setIsModalOpen(true);
    };
    
    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        logout();
    };
    
    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen font-noto-serif bg-slate-50 font-sans text-slate-800`}>
            <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

            {/* Centralized Crop Modal for "Add" form */}
            <ImageCropModal 
                src={cropSrc}
                onClose={() => setCropSrc(null)}
                onCropComplete={handleCropComplete}
            />

            {isModalOpen && editingChef && (
                <EditChefModal chef={editingChef} onClose={() => setIsModalOpen(false)} onSave={handleUpdate} isLoading={isSubmitting} />
            )}

            <ConfirmationModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmAndSave}
                isLoading={isSubmitting}
                chefData={pendingChefData}
                isRTL={isRTL}
            />

            {isLogoutModalOpen && (
                <div  className="fixed inset-0 font-noto-serif bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60]" onClick={() => setIsLogoutModalOpen(false)}>
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75"></div>
                            <div className="relative flex items-center justify-center w-full h-full bg-red-100 rounded-full">
                                <LogOut className="text-red-500" size={32} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">{t('logoutConfirmTitle', 'Confirm Your Logout')}</h2>
                        <p className="text-slate-600 text-center mb-8">{t('logoutConfirmMessage', 'Are you sure you want to sign out?')}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setIsLogoutModalOpen(false)} className="px-5 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200/70 hover:bg-slate-300 transition-colors">{t('stay', 'Stay')}</button>
                            <button onClick={handleConfirmLogout} disabled={isLoggingOut} className="flex items-center justify-center px-5 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 shadow-lg shadow-red-500/30 transition-all transform hover:scale-105">
                                {isLoggingOut ? (
                                    <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{t('loggingOut', 'Logging Out...')}</>
                                ) : t('logOut', 'Log Out')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="container font-noto-serif mx-auto p-4  md:p-8">
            <header className="flex w-full -ml-12 -mr-12 items-center justify-between gap-6 mb-12 px-4 sm:px-6 lg:px-8">
  
    <div>
        <PageToggle activePage="chef" />
    </div>

   
    <h1 className="flex-grow text-center text-4xl md:text-5xl font-noto-serif font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent pb-2">
        {t('chefsPageTitle', 'Manage Culinary Artists')}
    </h1>

   
    <button 
        onClick={() => setIsLogoutModalOpen(true)} 
        className="flex flex-shrink-0 items-center gap-2 px-4 py-2 rounded-lg text-red-500 bg-red-100 hover:bg-red-200 transition-colors" 
        title={t('logout', 'Logout')}
    >
        <LogOut size={20} />
        <span className="font-semibold hidden md:inline">
        {t('logout')}
        </span>
    </button>
</header>
                
                <div className={`max-w-3xl mx-auto font-noto-serif bg-white/60 backdrop-blur-lg p-8 rounded-2xl shadow-lg shadow-slate-200/50 mb-16 ${isRTL ? 'text-right' : ''}`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-700">{t('addNewArtist', 'Add a New Artist')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="relative"><User className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} text-slate-400`} size={20}/><input type="text" placeholder={t('chefsNameEn', "Chef's Name (EN)")} value={name} onChange={(e) => setName(e.target.value)} className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} /></div>
                            <div className="relative"><User className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-slate-400`} size={20}/><input type="text" placeholder={t('chefsNameAr', "اسم الشيف (AR)")} value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" className={`w-full ${isRTL ? 'pl-10 text-left' : 'pr-10 text-right'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} /></div>
                            <div className="relative"><Star className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} text-slate-400`} size={20}/><input type="text" placeholder={t('designationEn', 'Designation (EN)')} value={designation} onChange={(e) => setDesignation(e.target.value)} className={`w-full ${isRTL ? 'pr-10' : 'pl-10'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} /></div>
                            <div className="relative"><Star className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-slate-400`} size={20}/><input type="text" placeholder={t('designationAr', 'المنصب (AR)')} value={designationAr} onChange={(e) => setDesignationAr(e.target.value)} dir="rtl" className={`w-full ${isRTL ? 'pl-10 text-left' : 'pr-10 text-right'} p-3 bg-slate-100 border border-transparent rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white transition`} /></div>
                        </div>
                        
                        <div>
                            {imagePreview ? ( <div className="relative w-40 h-40 mx-auto"><img src={imagePreview} alt="Preview" className="w-40 h-40 rounded-full object-cover shadow-lg"/><button type="button" onClick={() => { setImage(null); setImagePreview(''); if(fileInputRef.current) fileInputRef.current.value = null; }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"><XCircle size={20} /></button></div> ) : ( <label htmlFor="file-upload" className="relative block w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400 hover:bg-slate-50 transition-colors"><UploadCloud className="mx-auto h-12 w-12 text-slate-400"/><span className="mt-2 block text-sm font-semibold text-cyan-600">{t('uploadPhoto', 'Upload a Photo')}</span><span className="mt-1 block text-xs text-slate-500">{t('fileRequirements', 'PNG, JPG up to 10MB')}</span><input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} ref={fileInputRef} accept="image/*"/></label> )}
                        </div>

                        <div className={`text-${isRTL ? 'left' : 'right'}`}>
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-8 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                <Plus size={20} className={isRTL ? 'ml-2' : 'mr-2'} />{t('addChef', 'Add Chef')}
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