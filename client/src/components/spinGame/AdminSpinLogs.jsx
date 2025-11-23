import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Search, 
    Trophy, 
    Frown, 
    RefreshCcw, 
    Calendar, 
    MapPin, 
    Smartphone, 
    FileSpreadsheet, // Icon for Excel/Sheets
    Download
} from 'lucide-react';
import PageToggle from '../AdminPanel/PageToggle'; 

const API_BASE = '/api/marketing';

const AdminSpinLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'prize', 'lose'

    // Fetch Logs
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const { data } = await axios.get(`${API_BASE}/admin/logs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(data);
            } catch (error) {
                console.error("Error fetching logs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // --- EXPORT TO CSV (Google Sheets Compatible) ---
    const exportToCSV = () => {
        if (!logs.length) return alert("No data to export");

        // 1. Define Headers
        const headers = ["Player Name", "Mobile Number", "Place/City", "Result Type", "Prize Won", "Date & Time"];

        // 2. Format Rows (Handle commas and special chars)
        const csvRows = [
            headers.join(','), // Header Row
            ...logs.map(log => {
                const date = new Date(log.created_at).toLocaleString();
                
                // Helper to escape quotes and wrap text in quotes (prevents broken columns)
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

        // 3. Create File and Download
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spin_wheel_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // Calculate Stats
    const totalSpins = logs.length;
    const totalWins = logs.filter(l => l.result_type === 'prize').length;
    const totalLosses = logs.filter(l => l.result_type === 'lose').length;

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            log.mobile.includes(searchTerm) ||
            log.prize_label?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'all' || log.result_type === filter;

        return matchesSearch && matchesFilter;
    });

    // Helper: Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-slate-800">
            {/* IMPORTANT: ensure activePage matches 'user_logs' exactly as per PageToggle */}
            <PageToggle activePage="user_logs" />

            {/* Header & Stats */}
            <header className="mb-10 mt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Player Analytics</h1>
                        <p className="text-gray-500 mt-1">View participation history and results.</p>
                    </div>
                    
                    {/* EXPORT BUTTON */}
                    <button 
                        onClick={exportToCSV}
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-medium"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        Export Data
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <RefreshCcw className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Spins</p>
                            <h3 className="text-2xl font-bold text-slate-800">{totalSpins}</h3>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Prizes Won</p>
                            <h3 className="text-2xl font-bold text-slate-800">{totalWins}</h3>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-red-50 rounded-xl text-red-600">
                            <Frown className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Lost/Retry</p>
                            <h3 className="text-2xl font-bold text-slate-800">{totalLosses}</h3>
                        </div>
                    </div>
                </div>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name, mobile, or prize..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['all', 'prize', 'lose'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                                filter === type 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {type === 'all' ? 'All Logs' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Player</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Result</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Prize Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                                        {/* Player Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm">
                                                    {log.user_name ? log.user_name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{log.user_name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Smartphone className="w-3 h-3" /> +{log.mobile}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                                                <MapPin className="w-3 h-3" /> {log.place}
                                            </span>
                                        </td>

                                        {/* Result Type Badge */}
                                        <td className="px-6 py-4">
                                            {log.result_type === 'prize' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide border border-green-200">
                                                    <Trophy className="w-3 h-3" /> Winner
                                                </span>
                                            ) : log.result_type === 'retry' ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide border border-orange-200">
                                                    <RefreshCcw className="w-3 h-3" /> Retry
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide border border-gray-200">
                                                    <Frown className="w-3 h-3" /> Lost
                                                </span>
                                            )}
                                        </td>

                                        {/* Prize Details */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {log.image_url ? (
                                                    <img src={log.image_url} alt="Prize" className="w-8 h-8 object-contain" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                                                )}
                                                <span className={`text-sm font-medium ${log.result_type === 'prize' ? 'text-slate-800' : 'text-gray-400'}`}>
                                                    {log.prize_label || "No Prize"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(log.created_at)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="w-8 h-8 mb-2 opacity-20" />
                                            <p>No logs found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Showing {filteredLogs.length} records</span>
                </div>
            </div>
        </div>
    );
};

export default AdminSpinLogs;