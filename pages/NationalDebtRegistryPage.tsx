
import React, { useState, useMemo } from 'react';
import { Customer, Invoice, InvoiceStatus, Page } from '../types';
import { 
    ArrowLeftIcon, 
    MagnifyingGlassIcon, 
    ShieldCheckIcon, 
    ExclamationTriangleIcon, 
    DocumentArrowUpIcon,
    ChevronDownIcon,
} from '../components/icons';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/formatters';
import { format } from 'date-fns';

interface NationalDebtRegistryPageProps {
    onBack: () => void;
    customers: Customer[];
    onNavigate: (page: Page, state?: any) => void;
}

interface DefaulterInfo {
    id: string;
    name: string;
    reportedOn: Date;
    amount: number;
    reportedBy: string;
    address?: string;
}

type SearchResult = 'loading' | 'not_found' | DefaulterInfo;
type SearchType = 'gstin' | 'pan' | 'cin' | 'name';

const mockDb: { [id: string]: DefaulterInfo } = {
    'gst_27AAFCA1234B1Z5': { id: 'gst_27AAFCA1234B1Z5', name: 'Chronic Late Payers Inc.', reportedOn: new Date('2024-03-15'), amount: 150000, reportedBy: 'A logistics company', address: 'Mumbai, Maharashtra' },
    'pan_ABCDE1234F': { id: 'pan_ABCDE1234F', name: 'Swift Supplies', reportedOn: new Date('2024-02-10'), amount: 82000, reportedBy: 'Another supplier', address: 'Delhi, Delhi' },
    'cin_U72200MH2010PTC204569': { id: 'cin_U72200MH2010PTC204569', name: 'Innovate Tech Solutions Pvt Ltd', reportedOn: new Date('2023-12-05'), amount: 210000, reportedBy: 'A marketing agency', address: 'Pune, Maharashtra' },
    'name_Ghosting Goods Co.': { id: 'name_Ghosting Goods Co.', name: 'Ghosting Goods Co.', reportedOn: new Date('2024-01-20'), amount: 75000, reportedBy: 'A wholesale supplier', address: 'Bengaluru, Karnataka' }
};

const mockNameSearchDb: DefaulterInfo[] = [
    { id: 'gst_27AAFCA1234B1Z5', name: 'Chronic Late Payers Inc.', reportedOn: new Date('2024-03-15'), amount: 150000, reportedBy: 'A logistics company', address: 'Mumbai, Maharashtra' },
    { id: 'some_other_id_1', name: 'Late Payments Co', reportedOn: new Date(), amount: 0, reportedBy: '', address: 'Chennai, Tamil Nadu' },
];


const ConfirmationModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    customerName?: string,
    amount: number
}> = ({ isOpen, onClose, onConfirm, customerName, amount }) => {
    const { currencyCode } = useCurrency();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4">
                <div className="p-6">
                    <div className="flex items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                Confirm Report Submission
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    You are about to report <span className="font-bold">{customerName || 'this customer'}</span> for an overdue amount of <span className="font-bold">{formatCurrency(amount, currencyCode)}</span>. This is a serious action and may have credit and legal implications for the reported business. Are you sure you want to proceed?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-xl">
                    <button type="button" onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        Confirm & Submit
                    </button>
                    <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}


const NationalDebtRegistryPage: React.FC<NationalDebtRegistryPageProps> = ({ onBack, customers, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'check' | 'report'>('check');
    
    // Search states
    const [searchType, setSearchType] = useState<SearchType>('gstin');
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
    const [searchResultsList, setSearchResultsList] = useState<DefaulterInfo[] | null>(null);
    const [searchedValue, setSearchedValue] = useState('');
    
    // Report states
    const [reportCustomerId, setReportCustomerId] = useState('');
    const [reportInvoiceIds, setReportInvoiceIds] = useState<string[]>([]);
    const [reportFiles, setReportFiles] = useState<File[]>([]);
    const [reportDeclaration, setReportDeclaration] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const { currencyCode } = useCurrency();

    const searchPlaceholders: Record<SearchType, string> = {
        gstin: 'Enter Business GSTIN',
        pan: 'Enter Business PAN',
        cin: 'Enter Corporate Identity Number',
        name: 'Enter Business Name'
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        setSearchResult('loading');
        setSearchResultsList(null);
        setSearchedValue(searchValue);
        
        setTimeout(() => {
            if (searchType === 'name') {
                 // Simulate finding multiple matches for a name
                if (searchValue.toLowerCase().includes('late')) {
                    setSearchResultsList(mockNameSearchDb);
                    setSearchResult(null);
                } else {
                    setSearchResult('not_found');
                }
            } else {
                const key = `${searchType}_${searchValue.trim().toUpperCase()}`;
                if (mockDb[key]) {
                    setSearchResult(mockDb[key]);
                } else {
                    setSearchResult('not_found');
                }
            }
        }, 1500);
    };

    const handleSelectBusiness = (business: DefaulterInfo) => {
        setSearchResult('loading');
        setSearchResultsList(null);
        // Simulate a "deep" search now that we have a unique ID
        setTimeout(() => {
            const result = mockDb[business.id];
            if (result && result.amount > 0) {
                 setSearchResult(result);
            } else {
                 setSearchResult('not_found');
            }
        }, 500);
    }
    
    const handleRunBackgroundCheck = () => {
        onNavigate(Page.BusinessBackgroundCheck, { searchType, searchValue: searchedValue });
    };

    const selectedCustomer = useMemo(() => customers.find(c => c.id === reportCustomerId), [customers, reportCustomerId]);
    const overdueInvoices = useMemo(() => selectedCustomer?.invoices.filter(inv => inv.status === InvoiceStatus.Overdue) || [], [selectedCustomer]);
    const totalReportAmount = useMemo(() => {
        return overdueInvoices
            .filter(inv => reportInvoiceIds.includes(inv.id))
            .reduce((sum, inv) => sum + inv.amount, 0);
    }, [overdueInvoices, reportInvoiceIds]);

    const handleInvoiceToggle = (invoiceId: string) => {
        setReportInvoiceIds(prev => prev.includes(invoiceId) ? prev.filter(id => id !== invoiceId) : [...prev, invoiceId]);
    };

    const handleSubmitReport = () => {
        // Mock API call
        setTimeout(() => {
            alert("Report submitted successfully!");
            setIsConfirmModalOpen(false);
            // Reset form
            setReportCustomerId('');
            setReportInvoiceIds([]);
            setReportFiles([]);
            setReportDeclaration(false);
        }, 2000);
    };

    return (
        <>
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-2">National Debt Registry</h1>
                <p className="text-gray-600 mb-8">Check and report payment defaulters to mitigate risk and enforce collections.</p>

                <div className="flex border-b border-gray-200 mb-8">
                    <button onClick={() => setActiveTab('check')} className={`py-3 px-6 font-semibold text-sm ${activeTab === 'check' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                        Check Defaulter Status
                    </button>
                    <button onClick={() => setActiveTab('report')} className={`py-3 px-6 font-semibold text-sm ${activeTab === 'report' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                        Report a Defaulter
                    </button>
                </div>

                {activeTab === 'check' && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                        <form onSubmit={handleSearch} className="flex items-stretch gap-2 mb-6">
                            <div className="relative">
                                <select value={searchType} onChange={e => setSearchType(e.target.value as SearchType)} className="h-full appearance-none bg-gray-100 border-r border-gray-300 text-gray-700 font-semibold py-3 pl-4 pr-10 rounded-l-lg focus:outline-none">
                                    <option value="gstin">GSTIN</option>
                                    <option value="pan">PAN</option>
                                    <option value="cin">CIN</option>
                                    <option value="name">Name</option>
                                </select>
                                <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                            </div>
                            <input
                                type="text"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                placeholder={searchPlaceholders[searchType]}
                                className="flex-grow p-3 border border-gray-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                            />
                            <button type="submit" className="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-primary flex items-center shrink-0">
                                <MagnifyingGlassIcon className="w-5 h-5 mr-2" /> Search
                            </button>
                        </form>

                        {searchResult === 'loading' && <div className="text-center p-8"><p className="animate-pulse">Checking registry...</p></div>}
                        
                        {searchResult === null && searchResultsList === null && (
                             <div className="text-center p-8 text-gray-500">
                                <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="font-semibold text-lg">Check a Business's Status</h3>
                                <p>Select a search type and enter an identifier to check for default records.</p>
                            </div>
                        )}
                        
                        {searchResultsList && (
                            <div className="p-4 border rounded-lg">
                                 <h3 className="font-bold text-brand-dark mb-2">Multiple businesses found. Please select one to check.</h3 >
                                 <ul className="space-y-2">
                                     {searchResultsList.map(biz => (
                                         <li key={biz.id}>
                                             <button onClick={() => handleSelectBusiness(biz)} className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md">
                                                 <p className="font-semibold">{biz.name}</p>
                                                 <p className="text-sm text-gray-500">{biz.address}</p>
                                             </button>
                                         </li>
                                     ))}
                                 </ul>
                            </div>
                        )}

                        {searchResult === 'not_found' && (
                            <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                <div className="flex items-center mb-4">
                                    <ShieldCheckIcon className="w-10 h-10 text-green-500 mr-4"/>
                                    <div>
                                        <h3 className="font-bold text-green-800">Clean Record</h3>
                                        <p className="text-sm text-green-700">No default records found for: <strong>{searchedValue}</strong>.</p>
                                    </div>
                                </div>
                                <button onClick={handleRunBackgroundCheck} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 text-sm">
                                    Run Comprehensive Background Check
                                </button>
                            </div>
                        )}

                        {searchResult && typeof searchResult === 'object' && (
                             <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <div className="flex items-center">
                                    <ExclamationTriangleIcon className="w-10 h-10 text-red-500 mr-4"/>
                                    <div>
                                        <h3 className="font-bold text-red-800">Defaulter Record Found!</h3>
                                        <p className="text-sm text-red-700">This business has been reported for non-payment.</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white p-4 rounded-md border">
                                    <div><strong className="block text-gray-500">Business Name:</strong> <span className="font-semibold">{searchResult.name}</span></div>
                                    <div><strong className="block text-gray-500">Identifier:</strong> <span className="font-semibold">{searchedValue}</span></div>
                                    <div><strong className="block text-gray-500">Reported On:</strong> <span className="font-semibold">{format(searchResult.reportedOn, 'dd MMM yyyy')}</span></div>
                                    <div><strong className="block text-gray-500">Default Amount:</strong> <span className="font-semibold">{formatCurrency(searchResult.amount, currencyCode)}</span></div>
                                </div>
                                <div className="mt-4">
                                     <button onClick={handleRunBackgroundCheck} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 text-sm">
                                        Run Comprehensive Background Check
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'report' && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-6">
                        <div>
                            <label htmlFor="report-customer" className="block text-sm font-medium text-gray-700 mb-1">Select Customer to Report</label>
                            <select id="report-customer" value={reportCustomerId} onChange={e => {setReportCustomerId(e.target.value); setReportInvoiceIds([]);}} className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                                <option value="">-- Select a Customer --</option>
                                {customers.filter(c => c.totalOutstanding > 0).map(c => <option key={c.id} value={c.id}>{c.name} ({formatCurrency(c.totalOutstanding, currencyCode)})</option>)}
                            </select>
                        </div>

                        {selectedCustomer && (
                             <>
                                {overdueInvoices.length > 0 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Overdue Invoices to Include</label>
                                        <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-1">
                                            {overdueInvoices.map(inv => (
                                                <label key={inv.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                                    <input type="checkbox" checked={reportInvoiceIds.includes(inv.id)} onChange={() => handleInvoiceToggle(inv.id)} className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary"/>
                                                    <span className="ml-3 flex-grow">{inv.invoiceNumber} - Due {format(inv.dueDate, 'dd MMM yyyy')}</span>
                                                    <span className="font-semibold">{formatCurrency(inv.amount, currencyCode)}</span>
                                                </label>
                                            ))}
                                        </div>
                                         <p className="text-right font-bold mt-2">Total Amount to Report: {formatCurrency(totalReportAmount, currencyCode)}</p>
                                    </div>
                                ) : <p className="text-sm text-gray-500">This customer has no overdue invoices.</p>}
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Supporting Documents</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-dark focus-within:outline-none">
                                                    <span>Upload files</span>
                                                    <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={e => setReportFiles(Array.from(e.target.files || []))}/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">Invoices, POs, Communications, etc.</p>
                                        </div>
                                    </div>
                                     {reportFiles.length > 0 && <div className="text-sm mt-2">{reportFiles.length} file(s) selected.</div>}
                                </div>

                                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                                    <input id="declaration" type="checkbox" checked={reportDeclaration} onChange={e => setReportDeclaration(e.target.checked)} className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary border-gray-300 rounded mt-1"/>
                                    <label htmlFor="declaration" className="ml-3 text-sm text-gray-700">I hereby declare that the debt is legally valid, undisputed, and all information provided is accurate to the best of my knowledge.</label>
                                </div>
                             </>
                        )}
                        <div className="flex justify-end">
                            <button onClick={() => setIsConfirmModalOpen(true)} disabled={!reportCustomerId || totalReportAmount === 0 || !reportDeclaration} className="bg-accent-red text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-400">
                                Submit Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <ConfirmationModal 
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={handleSubmitReport}
            customerName={selectedCustomer?.name}
            amount={totalReportAmount}
        />
        </>
    );
};

export default NationalDebtRegistryPage;