
import React, { useState } from 'react';
import { Page } from '../types';
import { 
    ArrowLeftIcon, 
    ShieldCheckIcon, 
    MagnifyingGlassIcon, 
    PencilIcon,
    ShareIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    BriefcaseIcon,
    ClipboardDocumentIcon,
    ArrowRightIcon,
} from '../components/icons';
import { useCompany } from '../contexts/CompanyContext';

interface TrustHubPageProps {
    onBack: () => void;
    onNavigate: (page: Page) => void;
}

const TrustScoreCircularProgress: React.FC<{ score: number, maxScore: number }> = ({ score, maxScore }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / maxScore) * circumference;

    let strokeColor = 'text-green-500';
    if (score / maxScore < 0.4) strokeColor = 'text-red-500';
    else if (score / maxScore < 0.7) strokeColor = 'text-yellow-500';

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 140 140">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="70"
                    cy="70"
                />
                <circle
                    className={`${strokeColor} transform -rotate-90 origin-center`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="70"
                    cy="70"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute text-center">
                <p className="text-3xl font-bold text-brand-dark">{score}</p>
                <p className="text-sm text-gray-500">/ {maxScore}</p>
            </div>
        </div>
    );
};

type GSTVerificationResult = null | 'loading' | {
    gstin: string;
    legalName: string;
    status: 'Active' | 'Inactive';
    businessType: string;
};

const TrustHubPage: React.FC<TrustHubPageProps> = ({ onBack, onNavigate }) => {
    const { selectedCompany } = useCompany();
    const [gstin, setGstin] = useState('');
    const [gstResult, setGstResult] = useState<GSTVerificationResult>(null);

    const handleGstVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gstin.trim()) return;
        setGstResult('loading');
        setTimeout(() => {
            const isValid = gstin.length === 15 && Math.random() > 0.2;
            if (isValid) {
                setGstResult({
                    gstin: gstin,
                    legalName: 'Mock Business Name Pvt. Ltd.',
                    status: Math.random() > 0.1 ? 'Active' : 'Inactive',
                    businessType: 'Private Limited Company',
                });
            } else {
                setGstResult({
                    gstin: gstin,
                    legalName: 'N/A',
                    status: 'Inactive',
                    businessType: 'N/A'
                });
            }
        }, 1500);
    };


    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-7xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>
            
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-dark">Trust Hub</h1>
                        <p className="text-gray-600">Build, verify, and showcase business credibility.</p>
                    </div>
                    <button className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary flex items-center">
                       <ShareIcon className="w-5 h-5 mr-2"/> Share My Trust Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">My Trust Score</h2>
                            <TrustScoreCircularProgress score={850} maxScore={1000} />
                            <p className="font-semibold text-lg text-green-600 mt-4">Excellent</p>
                            <div className="text-left mt-4 space-y-2 text-sm">
                                <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> Payment History: <span className="font-bold ml-auto">Strong</span></p>
                                <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> GST Compliance: <span className="font-bold ml-auto">Verified</span></p>
                                <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> Business Vintage: <span className="font-bold ml-auto">5+ Years</span></p>
                                <p className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/> Public Records: <span className="font-bold ml-auto">Clean</span></p>
                            </div>
                        </div>

                         <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">Recent Activity</h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start"><ShieldCheckIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"/> <div>You verified GSTIN for <span className="font-semibold">ABC Corp</span>. <p className="text-xs text-gray-400">2 hours ago</p></div></li>
                                <li className="flex items-start"><BriefcaseIcon className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"/> <div>'XYZ Inc.' viewed your Trust Profile link. <p className="text-xs text-gray-400">1 day ago</p></div></li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">My Public Trust Profile</h2>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <p className="font-bold text-lg text-brand-dark">{selectedCompany?.name}</p>
                                <div className="flex flex-wrap gap-3 mt-3">
                                    <span className="flex items-center bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"><ShieldCheckIcon className="w-4 h-4 mr-1"/>GST Verified</span>
                                    <span className="flex items-center bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"><ClockIcon className="w-4 h-4 mr-1"/>Timely Payments</span>
                                    <span className="flex items-center bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full"><BriefcaseIcon className="w-4 h-4 mr-1"/>5+ Years Vintage</span>
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <button className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark"><PencilIcon className="w-4 h-4 mr-1"/> View & Edit Profile</button>
                                     <button onClick={() => alert('Link copied to clipboard!')} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark"><ClipboardDocumentIcon className="w-4 h-4 mr-1"/> Get Shareable Link</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">Verification Tools</h2>
                             <form onSubmit={handleGstVerify} className="p-4 border rounded-lg mb-4">
                                <h3 className="font-semibold text-brand-dark mb-2 flex items-center"><MagnifyingGlassIcon className="w-5 h-5 mr-2"/>Quick GSTIN Verification</h3>
                                <div className="flex items-center gap-3">
                                    <input type="text" value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} placeholder="Enter GSTIN to verify" className="flex-grow p-2 border border-gray-300 rounded-md"/>
                                    <button type="submit" className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary" disabled={gstResult === 'loading'}>
                                        {gstResult === 'loading' ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>
                                {gstResult && gstResult !== 'loading' && (
                                     <div className={`mt-4 p-3 rounded-lg text-sm ${gstResult.status === 'Active' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                        <div className="flex items-center font-bold">
                                            {gstResult.status === 'Active' ? <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600"/> : <XCircleIcon className="w-5 h-5 mr-2 text-red-600"/>}
                                            Status: {gstResult.status}
                                        </div>
                                        <p className="ml-7"><strong>Legal Name:</strong> {gstResult.legalName}</p>
                                     </div>
                                )}
                             </form>
                             <button onClick={() => onNavigate(Page.BusinessBackgroundCheck)} className="w-full p-4 bg-blue-500 text-white rounded-lg font-bold flex items-center justify-between hover:bg-blue-600 transition-colors group">
                                <span>For a full report with CIBIL, PAN, and CIN data, use our comprehensive Business Background Check service.</span>
                                <ArrowRightIcon className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"/>
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustHubPage;