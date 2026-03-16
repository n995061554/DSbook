
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { XMarkIcon, SparklesIcon, DocumentArrowDownIcon, ChevronDownIcon, EnvelopeIcon, ChatBubbleLeftEllipsisIcon } from '../icons';
import { Customer } from '../../types';

interface GenerateNoticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    customers: Customer[];
}

const GenerateNoticeModal: React.FC<GenerateNoticeModalProps> = ({ isOpen, onClose, customers }) => {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [invoiceDetails, setInvoiceDetails] = useState('');
    const [interestRate, setInterestRate] = useState(18);
    const [noticeContent, setNoticeContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSendMenuOpen, setIsSendMenuOpen] = useState(false);
    const sendMenuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sendMenuRef.current && !sendMenuRef.current.contains(event.target as Node)) {
                setIsSendMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const poorHealthCustomers = useMemo(() => {
        return customers.filter(c => c.healthScore.status === 'Poor');
    }, [customers]);

    const aiNoticeIdeas = [
        'A strongly worded but professional legal warning.',
        'A final offer for settlement before legal action.',
        'A formal notice highlighting breach of payment terms.',
        'A direct tone mentioning consequences like credit score impact.',
    ];

    const handleGenerateNotice = () => {
        setIsGenerating(true);
        // Mock AI generation
        setTimeout(() => {
            const customer = customers.find(c => c.id === selectedCustomerId);
            const generatedText = `
LEGAL NOTICE FOR NON-PAYMENT

To,
${customer?.company || '[Customer Company Name]'}
${'[Customer Address]'}

Subject: Final notice for non-payment of outstanding invoice(s) amounting to [Total Amount].

Dear Sir/Madam,

This is to inform you that despite our repeated reminders, you have failed to clear the following outstanding amount(s):

Invoice Details:
${invoiceDetails}

As per our terms, a late payment interest of ${interestRate}% per annum from the due date is applicable.

You are hereby called upon to make the payment of the total outstanding amount within 15 days of receipt of this notice, failing which we will be constrained to initiate legal proceedings against you for recovery of the said amount, at your cost and consequence.

Sincerely,
[Your Company Name]
(Powered by TallyFi AI)
            `.trim();
            setNoticeContent(generatedText);
            setIsGenerating(false);
        }, 1500);
    };

    const handleDownloadPdf = () => alert("Downloading notice as PDF...");
    const handleSendEmail = () => alert("Sending notice via Email...");
    const handleSendWhatsApp = () => alert("Sending notice via WhatsApp...");
    const handlePrint = () => {
        const printContent = `
            <div style="font-family: serif; padding: 40px; color: black;">
                <h2 style="text-align: center; text-decoration: underline;">REGISTERED A.D.</h2>
                <h3 style="text-align: center; text-decoration: underline; margin-top: 40px;">LEGAL NOTICE</h3>
                <pre style="white-space: pre-wrap; font-family: serif; font-size: 12pt; line-height: 1.5; margin-top: 20px;">${noticeContent}</pre>
            </div>
        `;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Legal Notice</title></head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh] transform transition-all">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-brand-dark flex items-center">
                        <DocumentArrowDownIcon className="w-7 h-7 mr-3 text-accent-red" />
                        Generate Legal Notice
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label htmlFor="customer-select" className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
                            <select id="customer-select" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white" disabled={isGenerating}>
                                <option value="">-- Choose a customer --</option>
                                {poorHealthCustomers.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-1">Late Payment Interest (% p.a.)</label>
                            <input type="number" id="interest-rate" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" disabled={isGenerating}/>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="invoice-details" className="block text-sm font-medium text-gray-700 mb-1">Invoice Details (Number, Date, Amount)</label>
                        <textarea id="invoice-details" rows={3} value={invoiceDetails} onChange={e => setInvoiceDetails(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" disabled={isGenerating}/>
                    </div>

                    <div className="mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-bold text-brand-primary flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-yellow-500"/>AI Assist (Premium)</h4>
                            <p className="text-sm text-gray-600 mt-1 mb-3">Let AI generate the notice content for you. You can also get ideas for different approaches.</p>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {aiNoticeIdeas.map((idea, i) => (
                                        <button key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200" disabled={isGenerating}>{idea}</button>
                                    ))}
                                </div>
                                <button onClick={handleGenerateNotice} disabled={!selectedCustomerId || isGenerating} className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary disabled:bg-gray-400 flex items-center justify-center w-32">
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating...
                                        </>
                                    ) : 'Generate'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notice-content" className="block text-sm font-medium text-gray-700 mb-1">Notice Content</label>
                        <textarea id="notice-content" rows={10} value={noticeContent} onChange={e => setNoticeContent(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50" disabled={isGenerating}/>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex justify-between items-center space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300" disabled={isGenerating}>Cancel</button>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleDownloadPdf} disabled={!noticeContent || isGenerating} className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500 transition-colors">Download PDF</button>
                        
                        <div className="relative" ref={sendMenuRef}>
                             <button onClick={() => setIsSendMenuOpen(prev => !prev)} disabled={!noticeContent || isGenerating} className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500 transition-colors flex items-center">
                                Send <ChevronDownIcon className="w-5 h-5 ml-1"/>
                             </button>
                            {isSendMenuOpen && (
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                    <button onClick={handleSendEmail} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2"/> Email</button>
                                    <button onClick={handleSendWhatsApp} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><ChatBubbleLeftEllipsisIcon className="w-4 h-4 mr-2"/> WhatsApp</button>
                                </div>
                            )}
                        </div>

                        <button onClick={handlePrint} disabled={!noticeContent || isGenerating} className="bg-accent-red text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:hover:bg-gray-400">Print for Regd. Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateNoticeModal;
