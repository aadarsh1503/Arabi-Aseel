import React, { useRef, useState } from 'react';
import { FiX, FiDownload, FiImage, FiLoader } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

const futuristicGridBg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDMyIDAgTCAwIDAgTCAwIDMyIiBmaWxsPSJub25lIiBzdHJva2U9IiM3MjRGMzgiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjIiIC8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==";


const MenuExporter = ({ show, onClose, items }) => {
    const printRef = useRef();
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [isExporting, setIsExporting] = useState(false);

    if (!show) return null;

    // Filter for available items first, then categorize them.
    const categorizedItems = items
        .filter(item => item.status === 'available')
        .reduce((acc, item) => {
            const categoryKey = item.category_name;
            if (!acc[categoryKey]) {
                acc[categoryKey] = {
                    name_en: item.category_name,
                    name_ar: item.category_name_ar,
                    items: []
                };
            }
            acc[categoryKey].items.push(item);
            return acc;
        }, {});

    const exportAction = async (exportFunc) => {
        setIsExporting(true);
        printRef.current.style.backgroundColor = '#FFFFFF';
        printRef.current.style.backgroundImage = 'none';
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
            await exportFunc();
        } catch (error) {
            console.error("Export failed:", error);
            alert("An error occurred during export. Please check the console.");
        } finally {
            printRef.current.style.backgroundColor = '';
            printRef.current.style.backgroundImage = `url('${futuristicGridBg}')`;
            setIsExporting(false);
        }
    };

    const handleExportPdf = () => exportAction(async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        let imgHeight = pdfWidth / ratio;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
        while (heightLeft > 0) {
            position = position - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }
        pdf.save('Arabi-Aseel-Menu-2100.pdf');
    });

    const handleExportImage = () => exportAction(async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = 'Arabi-Aseel-Menu-2100.png';
        link.click();
    });

    const renderPrice = (item) => {
        const priceBoxStyle = "flex flex-col items-end text-right";
        const qhfContainerStyle = "flex justify-end gap-5 mt-2";
        const qhfBlockStyle = "flex flex-col items-center";
        const qhfLabelStyle = "font-mono text-xs text-[#724F38] tracking-widest uppercase";
        const qhfValueStyle = "font-orbitron text-2xl font-bold text-black";

        if (item.price_type === 'q_h_f' || item.price_q || item.price_h || item.price_f) {
            return (
                <div dir='ltr' className={priceBoxStyle}>
                    <div className={qhfContainerStyle}>
                        {item.price_q && <div className={qhfBlockStyle}><span className={qhfLabelStyle}>Qtr</span><p className={qhfValueStyle}>{item.price_q}</p></div>}
                        {item.price_h && <div className={qhfBlockStyle}><span className={qhfLabelStyle}>Half</span><p className={qhfValueStyle}>{item.price_h}</p></div>}
                        {item.price_f && <div className={qhfBlockStyle}><span className={qhfLabelStyle}>Full</span><p className={qhfValueStyle}>{item.price_f}</p></div>}
                    </div>
                </div>
            );
        }

        if ((item.price_type === 'per_portion' || item.price_type === 'portion') && item.price_per_portion) {
            return (
                <div dir='ltr' className={priceBoxStyle}>
                     <div className='flex items-baseline'>
                        <span className="font-orbitron text-4xl font-bold text-black">{item.price_per_portion}</span>
                        <span className="font-mono text-sm text-gray-500 ml-2">AED / portion</span>
                    </div>
                </div>
            );
        }

        return (
            <div dir='ltr' className='flex items-center justify-end h-full'>
                <p className="font-mono text-sm text-red-500/70 border border-dashed border-red-500/50 px-2 py-1 rounded">
                    PRICE_UNAVAILABLE
                </p>
            </div>
        );
    };


    return (
        <div dir='ltr' className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-white text-black rounded-lg shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col border-2 border-[#724F38]/50">
                <div className="p-4 border-b border-[#724F38]/20 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold font-orbitron text-[#724F38]">MENU EXPORT_INTERFACE v3.2</h2>
                    <div className="flex items-center space-x-3">
                        <button onClick={handleExportPdf} disabled={isExporting} className="flex items-center space-x-2 bg-[#724F38] text-white px-4 py-2 rounded-md hover:bg-black transition-all disabled:bg-gray-400 disabled:cursor-wait">
                            {isExporting ? <FiLoader className="animate-spin" /> : <FiDownload />} <span>PDF</span>
                        </button>
                        <button onClick={handleExportImage} disabled={isExporting} className="flex items-center space-x-2 bg-[#724F38] text-white px-4 py-2 rounded-md hover:bg-black transition-all disabled:bg-gray-400 disabled:cursor-wait">
                           {isExporting ? <FiLoader className="animate-spin" /> : <FiImage />} <span>Image</span>
                        </button>
                        <button onClick={onClose} disabled={isExporting} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50">
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-6 overflow-y-auto bg-gray-200">
                    <div ref={printRef} className="A4-page bg-white p-10 shadow-lg" style={{ backgroundImage: `url('${futuristicGridBg}')`}}>
                        <header className="text-center mb-12 relative pb-6">
                            <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-[#724F38]/70"></div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-[#724F38]/70"></div>
                            <h1 className="text-6xl font-black font-orbitron text-black tracking-[0.2em]">ARABI ASEEL</h1>
                            <p className="text-lg font-mono text-[#724F38] tracking-[0.4em] mt-2">// AUTHENTIC CUISINE //</p>
                        </header>

                        <main className="space-y-12">
                            {Object.values(categorizedItems).map(category => (
                                <section key={category.name_en}>
                                    <div className="flex items-center gap-4 mb-6">
                                       <div className="w-3 h-10 bg-gradient-to-b from-[#724F38] to-[#d9a478] rounded-full"></div>
                                       <h2 className="text-4xl font-bold font-orbitron text-[#724F38] flex-grow flex justify-between items-baseline">
                                           <span>{isRTL ? category.name_ar : category.name_en}</span>
                                           <span className="font-cairo text-2xl text-black/70">{isRTL ? category.name_en : category.name_ar}</span>
                                       </h2>
                                    </div>

                                    <div className="space-y-8">
                                        {category.items.map(item => {
                                            const nameEn = item.translations?.find(t => t.language === 'en')?.name || 'N/A';
                                            const descEn = item.translations?.find(t => t.language === 'en')?.description || '';
                                            const nameAr = item.translations?.find(t => t.language === 'ar')?.name || '';
                                            const descAr = item.translations?.find(t => t.language === 'ar')?.description || '';

                                            return (
                                                <div key={item.menu_id} className="p-[1.5px] bg-gradient-to-br from-[#724F38]/60 via-transparent to-[#724F38]/60 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                                                    <div className="bg-gradient-to-br from-white/90 to-gray-100/80 backdrop-blur-sm rounded-lg p-4 flex gap-5">
                                                        <div className="w-44 flex-shrink-0">
                                                           <img src={item.image_url} alt={nameEn} className="w-full h-auto object-cover rounded-md border-4 border-[#724F38]/80 shadow-md" crossOrigin="anonymous" />
                                                        </div>
                                                        
                                                        <div className="flex-1 flex flex-col justify-between">
                                                            <div>
                                                                {/* ======================================================================== */}
                                                                {/* MODIFICATION: Corrected Bilingual Layout                                 */}
                                                                {/* Using flexbox to place English (left) and Arabic (right) on one line.    */}
                                                                {/* ======================================================================== */}
                                                                
                                                                {/* Name Block */}
                                                                <div className="flex justify-between items-baseline">
                                                                    <h3 className="text-2xl font-orbitron font-bold text-black tracking-wide text-left">{nameEn}</h3>
                                                                    {nameAr && <p className="font-cairo text-xl text-gray-700 text-right" dir="rtl">{nameAr}</p>}
                                                                </div>
                                                                
                                                                {/* Separator */}
                                                                <div className="w-full h-[1px] bg-gradient-to-r from-[#724F38]/50 to-transparent my-2"></div>

                                                                {/* Description Block */}
                                                                <div className="flex justify-between items-start gap-4">
                                                                    <p className="flex-1 text-md text-gray-800 leading-relaxed text-left">{descEn}</p>
                                                                    {descAr && <p className="flex-1 font-cairo text-md text-gray-700 text-right" dir="rtl">{descAr}</p>}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="mt-4">
                                                                {renderPrice(item)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}
                        </main>
                        
                        <footer className="mt-16 pt-6 text-center text-xs text-[#724F38]/80 border-t-2 border-dashed border-[#724F38]/30 font-mono">
                            <p>// SYS_ID: {btoa('MENU.2100.'+ new Date().toISOString()).substring(10, 30)} // STATUS: ONLINE // END_OF_DOCUMENT //</p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuExporter;