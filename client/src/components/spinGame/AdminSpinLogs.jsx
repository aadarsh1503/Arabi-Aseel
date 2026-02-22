import React, { useState, useEffect } from 'react';
import { 
    Search, 
    Trophy, 
    Frown, 
    RefreshCcw, 
    Calendar, 
    MapPin, 
    Smartphone, 
    FileSpreadsheet, 
    Trash2,          
    AlertTriangle    
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageToggle from '../AdminPanel/PageToggle';
import { useTranslation } from 'react-i18next';

const BASEURL = import.meta.env.VITE_API_BASE_URL || '';


const AdminSpinLogs = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'prize', 'lose'

    // Fetch Logs
    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASEURL}/api/marketing/admin/logs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs", error);
            toast.error(t('logs_toast_load_fail'));
        } finally {
            setLoading(false);
        }
    };

    // --- FUNCTION 1: DELETE SINGLE PLAYER ---
    const handleDeleteOne = async (participantId) => {
        // Confirmation
        if (!window.confirm(t('logs_confirm_delete_one'))) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await fetch(`${BASEURL}/api/marketing/participants/${participantId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update UI instantly without reloading
            setLogs(prevLogs => prevLogs.filter(log => log.participant_id !== participantId));
            toast.success(t('logs_toast_delete_success'));
        } catch (error) {
            console.error(error);
            toast.error(t('logs_toast_delete_fail'));
        }
    };

    // --- FUNCTION 2: CLEAR ALL PLAYERS ---
    const handleClearAll = async () => {
        // Double Confirmation for safety
        const confirm1 = window.confirm(t('logs_confirm_clear_1'));
        if (!confirm1) return;
        
        const confirm2 = window.confirm(t('logs_confirm_clear_2'));
        if (!confirm2) return;

        try {
            const token = localStorage.getItem('authToken');
            await fetch(`${BASEURL}/api/marketing/participants`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Clear UI
            setLogs([]);
            toast.success(t('logs_toast_clear_success'));
        } catch (error) {
            console.error(error);
            toast.error(t('logs_toast_clear_fail'));
        }
    };

    // Export to CSV Logic
    const exportToCSV = () => {
        if (!logs.length) return toast.info(t('logs_toast_no_export'));
        
        // Translate Headers for CSV
        const headers = [
            t('logs_th_player'), 
            t('logs_th_mobile'), 
            t('logs_th_location'), 
            t('logs_th_result'), 
            t('logs_th_prize'), 
            t('logs_th_time')
        ];

        const csvRows = [
            headers.join(','), 
            ...logs.map(log => {
                const date = new Date(log.created_at).toLocaleString();
                const escape = (text) => `"${String(text || '').replace(/"/g, '""')}"`;
                return [
                    escape(log.user_name),
                    escape(log.mobile),
                    escape(log.place),
                    escape(log.result_type),
                    escape(log.prize_label || 'N/A'),
                    escape(date)
                ].join(',');
            })
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spin_wheel_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            (log.user_name && log.user_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (log.mobile && log.mobile.includes(searchTerm)) ||
            (log.prize_label && log.prize_label.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = filter === 'all' || log.result_type === filter;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-BH' : 'en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateString));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
    );

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
                <PageToggle activePage="user_logs" />
            </div>

            {/* Header */}
            <header className="mb-8 mt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('logs_title')}</h1>
                    <p className="text-gray-500 mt-1">{t('logs_total_records', { count: logs.length })}</p>
                </div>
                
                <div className="flex gap-3">
                    {/* Export Button */}
                    <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all font-medium text-sm"
                    >
                        <FileSpreadsheet className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-0'}`} />
                        {t('logs_btn_export')}
                    </button>

                    {/* Clear All Button */}
                    {logs.length > 0 && (
                        <button 
                            onClick={handleClearAll}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all font-medium text-sm"
                        >
                            <AlertTriangle className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-0'}`} />
                            {t('logs_btn_clear_all')}
                        </button>
                    )}
                </div>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-96">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 w-5 h-5 text-gray-400`} />
                    <input 
                        type="text" 
                        placeholder={t('logs_search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none`}
                    />
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['all', 'prize', 'lose'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                                filter === type ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            {type === 'all' ? t('logs_filter_all') : 
                             type === 'prize' ? t('logs_filter_prize') : 
                             t('logs_filter_lose')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t('logs_th_player')}</th>
                                <th className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t('logs_th_location')}</th>
                                <th className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t('logs_th_result')}</th>
                                <th className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t('logs_th_prize')}</th>
                                <th className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>{t('logs_th_time')}</th>
                                <th className={`px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>{t('logs_th_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.log_id} className="hover:bg-blue-50/30 transition-colors">
                                        
                                        {/* Player */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-bold text-slate-800">{log.user_name || t('logs_unknown_user')}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1" dir="ltr">
                                                    <Smartphone className="w-3 h-3" /> 
                                                    <span className={isRTL ? 'mr-1' : ''}>+{log.mobile}</span>
                                                </p>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                                                <MapPin className="w-3 h-3" /> {log.place}
                                            </span>
                                        </td>

                                        {/* Result */}
                                        <td className="px-6 py-4">
                                            {log.result_type === 'prize' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                                                    <Trophy className="w-3 h-3" /> {t('logs_badge_winner')}
                                                </span>
                                            ) : log.result_type === 'retry' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide">
                                                    <RefreshCcw className="w-3 h-3" /> {t('logs_badge_retry')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide">
                                                    <Frown className="w-3 h-3" /> {t('logs_badge_lost')}
                                                </span>
                                            )}
                                        </td>

                                        {/* Prize */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {log.image_url && <img src={log.image_url} alt="Prize" className="w-8 h-8 object-contain" />}
                                                <span className={`text-sm font-medium ${log.result_type === 'prize' ? 'text-slate-800' : 'text-gray-400'}`}>
                                                    {log.prize_label || "-"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className={`px-6 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                                            <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-end'} gap-2 text-xs text-gray-500`}>
                                                <Calendar className="w-3 h-3" />
                                                <span dir="ltr">{formatDate(log.created_at)}</span>
                                            </div>
                                        </td>

                                        {/* DELETE ACTION BUTTON */}
                                        <td className={`px-6 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                                            <button 
                                                onClick={() => handleDeleteOne(log.participant_id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                                                title={t('logs_btn_delete')}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        {t('logs_no_data')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{t('logs_showing_records', { count: filteredLogs.length })}</span>
                </div>
            </div>
        </div>
    );
};

export default AdminSpinLogs;