
import React, { useState, useEffect } from 'react';
import { Page, BusinessReport } from '../types';
import { 
    ArrowLeftIcon, 
    MagnifyingGlassIcon, 
    ChevronDownIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    BriefcaseIcon,
    WalletIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon
} from '../components/icons';
import { format } from 'date-fns';

type SearchType = 'gstin' | 'pan' | 'cin';

interface BusinessBackgroundCheckPageProps {
    onBack: () => void;
    initialState?: { searchType: SearchType; searchValue: string };
}

const mockReportDb: { [id: string]: BusinessReport } = {
    'GSTIN_27AAFCA1234B1Z5': {
        id: '27AAFCA1234B1Z5',
        trustScore: 820,
        gstDetails: {
            legalName: 'Chronic Late Payers Inc.',
            tradeName: 'CLP Industries',
            address: '123 Business Hub, Andheri East, Mumbai, Maharashtra - 400069',
            contact: { email: 'contact@clp.inc', mobile: '********99' },
            status: 'Active',
            registrationDate: new Date('2015-08-20'),
            businessType: 'Private Limited Company',
            complianceScore: 95,
        },
        corporateDetails: {
            cin: 'U72200MH2015PTC204569',
            companyName: 'Chronic Late Payers Inc.',
            dateOfIncorporation: new Date('2015-08-15'),
            registeredAddress: '123 Business Hub, Andheri East, Mumbai, Maharashtra - 400069',
            companyStatus: 'Active',
            directors: [
                { name: 'Ramesh Patel', din: '01234567', appointed: new Date('2015-08-15') },
                { name: 'Sita Sharma', din: '07654321', appointed: new Date('2018-01-10') },
            ]
        },
        creditInfo: {
            cibilScore: 650,
            defaulterStatus: 'Yes',
            reportDate: new Date(),
            totalAccounts: 8,
            activeAccounts: 5,
            overdueAccounts: 2,
            recentInquiries: 3,
        },
        internalRecord: {
            isReported: true,
            reportedOn: new Date('2024-03-15'),
            amount: 150000,
            reportedBy: 'A logistics company',
        }
    }
};


const CibilGauge: React.FC<{ score: number }> = ({ score }) => {
    const percentage = ((score - 300) / (900 - 300)) * 100;
    const rotation = (percentage / 100) * 180;
    
    let colorClass = 'text-green-500';
    if (score < 550) colorClass = 'text-red-500';
    else if (score < 700) colorClass = 'text-yellow-500';

    return (
        <div className="relative w-48 h-24 overflow-hidden mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-[20px] border-gray-200 rounded-t-full border-b-0"></div>
            <div className={`absolute top-0 left-0 w-full h-full border-[20px] border-transparent rounded-t-full border-b-0 ${colorClass}`}
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', transform: `rotate(${rotation}deg)`, transformOrigin: 'bottom center', transition: 'transform 0.5s' }}>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <span className="text-3xl font-bold text-brand-dark">{score}</span>
                <span className="text-xs text-gray-500 block">/ 900</span>
            </div>
        </div>
    );
};

const ReportSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-16 bg-gray-200 rounded-lg w-1/2"></div>
        <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="p-4 border rounded-lg grid grid-cols-2 gap-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="p-4 border rounded-lg grid grid-cols-2 gap-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);


const BusinessBackgroundCheckPage: React.FC<BusinessBackgroundCheckPageProps> = ({ onBack, initialState }) => {
    const [searchType, setSearchType] = useState<SearchType>(initialState?.searchType || 'gstin');
    const [searchValue, setSearchValue] = useState(initialState?.searchValue || '');
    const [report, setReport] = useState<BusinessReport | null | 'not_found'>(null);
    const [isLoading, setIsLoading] = useState(false);

    const searchPlaceholders: Record<SearchType, string> = {
        gstin: 'Enter Business GSTIN',
        pan: 'Enter Business PAN',
        cin: 'Enter Corporate Identity Number',
    };
    
     const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchValue.trim()) return;
        setIsLoading(true);
        setReport(null);
        
        setTimeout(() => {
            const key = `${searchType.toUpperCase()}_${searchValue.trim().toUpperCase()}`;
            if (mockReportDb[key]) {
                setReport(mockReportDb[key]);
            } else {
                setReport('not_found');
            }
            setIsLoading(false);
        }, 2000);
    };
    
    useEffect(() => {
        if (initialState?.searchValue) {
            handleSearch();
        }
    }, [initialState]);
    

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Business Background Check</h1>
                <p className="text-gray-600 mb-8">Get a comprehensive report on any business using their official identifiers.</p>
                
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSearch} className="flex items-stretch gap-2 mb-8">
                        <div className="relative">
                            <select value={searchType} onChange={e => setSearchType(e.target.value as SearchType)} className="h-full appearance-none bg-gray-100 border-r border-gray-300 text-gray-700 font-semibold py-3 pl-4 pr-10 rounded-l-lg focus:outline-none">
                                <option value="gstin">GSTIN</option>
                                <option value="pan">PAN</option>
                                <option value="cin">CIN</option>
                            </select>
                            <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                        </div>
                        <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder={searchPlaceholders[searchType]} className="flex-grow p-3 border border-gray-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-brand-secondary focus:border-transparent"/>
                        <button type="submit" disabled={isLoading} className="bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-primary flex items-center shrink-0 disabled:bg-gray-400">
                            <MagnifyingGlassIcon className="w-5 h-5 mr-2" /> 
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    {isLoading && <ReportSkeleton />}
                    
                    {!report && !isLoading && (
                        <div className="text-center p-8 text-gray-500">
                             <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                             <h3 className="font-semibold text-lg">Verify a Business</h3>
                             <p>Enter an identifier to generate a comprehensive business report.</p>
                        </div>
                    )}
                    
                    {report === 'not_found' && (
                        <div className="text-center p-8 text-gray-500">
                             <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                             <h3 className="font-semibold text-lg text-brand-dark">No Record Found</h3>
                             <p>We could not find any details for the provided identifier. Please check the number and try again.</p>
                        </div>
                    )}

                    {report && report !== 'not_found' && (
                        <div className="space-y-8">
                            {/* Report Header */}
                            <div>
                                <h2 className="text-2xl font-bold text-brand-dark">{report.gstDetails?.legalName || report.corporateDetails?.companyName}</h2>
                                <p className="text-gray-500">Trust Score: <span className="font-bold text-brand-primary">{report.trustScore}/1000</span></p>
                            </div>

                            {/* GST Details */}
                            {report.gstDetails && (
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-3 border-b pb-2 flex items-center"><BuildingOfficeIcon className="w-6 h-6 mr-3 text-brand-primary"/>GST Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                        <p><strong>Legal Name:</strong> {report.gstDetails.legalName}</p>
                                        <p><strong>Trade Name:</strong> {report.gstDetails.tradeName}</p>
                                        <p className="md:col-span-2"><strong>Address:</strong> {report.gstDetails.address}</p>
                                        <p><strong>Status:</strong> <span className={`font-semibold ${report.gstDetails.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{report.gstDetails.status}</span></p>
                                        <p><strong>Registration:</strong> {format(report.gstDetails.registrationDate, 'dd MMM yyyy')}</p>
                                        <p><strong>Contact:</strong> {report.gstDetails.contact.email} / {report.gstDetails.contact.mobile}</p>
                                        <p><strong>Compliance:</strong> <span className="font-bold">{report.gstDetails.complianceScore}%</span></p>
                                    </div>
                                </div>
                            )}

                             {/* Corporate Details */}
                             {report.corporateDetails && (
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-3 border-b pb-2 flex items-center"><BriefcaseIcon className="w-6 h-6 mr-3 text-brand-primary"/>Corporate & PAN Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                        <p><strong>Company Name:</strong> {report.corporateDetails.companyName}</p>
                                        <p><strong>CIN:</strong> {report.corporateDetails.cin}</p>
                                        <p><strong>Incorporated:</strong> {format(report.corporateDetails.dateOfIncorporation, 'dd MMM yyyy')}</p>
                                        <p><strong>Status:</strong> <span className={`font-semibold ${report.corporateDetails.companyStatus === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{report.corporateDetails.companyStatus}</span></p>
                                        <div className="md:col-span-2">
                                            <strong>Directors:</strong>
                                            <ul className="list-disc list-inside mt-1">
                                                {report.corporateDetails.directors.map(d => <li key={d.din}>{d.name} (DIN: {d.din})</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {/* Credit Info */}
                            {report.creditInfo && (
                                <div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-3 border-b pb-2 flex items-center"><WalletIcon className="w-6 h-6 mr-3 text-brand-primary"/>CIBIL & Credit Score (Premium)</h3>
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4 flex items-start">
                                        <InformationCircleIcon className="w-5 h-5 mr-2 mt-0.5 shrink-0"/>
                                        <p>This is a premium feature. Accessing credit reports requires explicit consent from the other party and costs <strong>50 credits</strong> from your wallet.</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="flex-shrink-0">
                                            <CibilGauge score={report.creditInfo.cibilScore} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm flex-grow">
                                            <p><strong>Defaulter Status:</strong> <span className={`font-bold ${report.creditInfo.defaulterStatus === 'Yes' ? 'text-red-600' : 'text-green-600'}`}>{report.creditInfo.defaulterStatus}</span></p>
                                            <p><strong>Total Loan Accounts:</strong> {report.creditInfo.totalAccounts}</p>
                                            <p><strong>Active Accounts:</strong> {report.creditInfo.activeAccounts}</p>
                                            <p><strong>Overdue Accounts:</strong> {report.creditInfo.overdueAccounts}</p>
                                            <p><strong>Recent Inquiries:</strong> {report.creditInfo.recentInquiries} in last 3 months</p>
                                            <p><strong>Report Date:</strong> {format(report.creditInfo.reportDate, 'dd MMM yyyy')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Internal Record */}
                            <div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3 border-b pb-2 flex items-center"><UsersIcon className="w-6 h-6 mr-3 text-brand-primary"/>Internal Defaulter Record</h3>
                                {report.internalRecord.isReported ? (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                                        <p><strong className="text-red-700">This business was reported as a defaulter in our registry.</strong></p>
                                        <p><strong>Reported On:</strong> {report.internalRecord.reportedOn ? format(report.internalRecord.reportedOn, 'dd MMM yyyy') : 'N/A'}</p>
                                        <p><strong>Amount:</strong> {report.internalRecord.amount?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                                        <p className="text-green-700 font-semibold">No default records found for this business in our internal registry.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessBackgroundCheckPage;