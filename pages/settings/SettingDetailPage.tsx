
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface SettingDetailPageProps {
    title: string;
    onBack: () => void;
}

const OutstandingSettings: React.FC = () => {
    const [gracePeriod, setGracePeriod] = useState(5);
    const [riskThreshold, setRiskThreshold] = useState(60);
    const [viewBy, setViewBy] = useState<'dueDays' | 'billDate'>('dueDays');
    const [agingBuckets, setAgingBuckets] = useState([
        { from: 0, to: 30 },
        { from: 30, to: 60 },
        { from: 60, to: 90 },
        { from: 90, to: 120 },
        { from: 120, to: 180 },
    ]);

    const handleAgingChange = (index: number, newToValue: number) => {
        const newBuckets = [...agingBuckets];
        newBuckets[index].to = newToValue;

        if (index < newBuckets.length - 1) {
            newBuckets[index + 1].from = newToValue;
        }
        setAgingBuckets(newBuckets);
    };

    return (
        <div className="space-y-8 text-left">
             {/* General Outstanding Settings */}
            <div>
                 <h3 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">General</h3>
                <div className="space-y-6">
                     <div>
                        <label htmlFor="grace-period" className="block text-sm font-medium text-gray-700">Payment Grace Period (days)</label>
                        <p className="text-sm text-gray-500 mb-2">Allow extra days after the due date before an invoice is marked 'Overdue'.</p>
                        <input
                            type="number"
                            id="grace-period"
                            value={gracePeriod}
                            onChange={(e) => setGracePeriod(Number(e.target.value))}
                            className="w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"
                        />
                    </div>
                    <div>
                        <label htmlFor="risk-threshold" className="block text-sm font-medium text-gray-700">High-Risk Health Score Threshold</label>
                        <p className="text-sm text-gray-500 mb-2">Customers with a health score below this value will be flagged as 'High-Risk'.</p>
                        <input
                            type="range"
                            id="risk-threshold"
                            min="0"
                            max="100"
                            value={riskThreshold}
                            onChange={(e) => setRiskThreshold(Number(e.target.value))}
                            className="w-full max-w-xs"
                        />
                        <div className="text-center font-bold text-brand-primary w-full max-w-xs">{riskThreshold} / 100</div>
                    </div>
                </div>
            </div>
           
            {/* Calculation Settings */}
            <div>
                <h3 className="text-lg font-semibold text-brand-dark border-b pb-2 mb-4">Calculation Settings</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">View Outstanding By</label>
                         <p className="text-sm text-gray-500 mb-2">Calculate ageing reports based on invoice due date or the original bill date.</p>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input type="radio" name="viewBy" value="dueDays" checked={viewBy === 'dueDays'} onChange={() => setViewBy('dueDays')} className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-600">Due Days</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="viewBy" value="billDate" checked={viewBy === 'billDate'} onChange={() => setViewBy('billDate')} className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary border-gray-300"/>
                                <span className="ml-2 text-sm text-gray-600">Bill Date</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ageing Configuration</label>
                         <p className="text-sm text-gray-500 mb-2">Define the buckets for your ageing analysis reports.</p>
                        <div className="space-y-2 max-w-sm">
                            <div className="flex font-semibold text-gray-600">
                                <div className="w-1/2 px-2">From Days</div>
                                <div className="w-1/2 px-2">To Days</div>
                            </div>
                            {agingBuckets.map((bucket, index) => {
                                const isInvalid = bucket.to <= bucket.from;
                                return (
                                    <div key={index} className="flex items-center">
                                        <div className="w-1/2 px-2 py-2 bg-gray-100 rounded-l-md border border-r-0 border-gray-200">{bucket.from}</div>
                                        <div className="w-1/2">
                                            <input 
                                                type="number"
                                                value={bucket.to}
                                                onChange={(e) => handleAgingChange(index, Number(e.target.value))}
                                                className={`w-full p-2 border rounded-r-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary ${isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FileUploadSetting: React.FC<{ title: string }> = ({ title }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    
    return (
         <div className="space-y-4 text-left">
            <p className="text-sm text-gray-500">Upload an image for your {title.toLowerCase()}. This will be displayed on all shared voucher PDFs.</p>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {preview ? (
                        <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                    ) : (
                         <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-secondary">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </div>
            </div>
            {file && <p className="text-sm text-gray-600">File selected: <strong>{file.name}</strong></p>}
        </div>
    );
};

const TextContentSetting: React.FC<{ title: string; initialValue: string; description: string }> = ({ title, initialValue, description }) => {
    const [text, setText] = useState(initialValue);
    
    return (
        <div className="space-y-4 text-left">
            <p className="text-sm text-gray-500">{description}</p>
            <textarea 
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"
            />
        </div>
    );
}

const VoucherConfigSetting: React.FC<{ items: { id: string; label: string; enabled: boolean }[] }> = ({ items }) => {
    const [toggles, setToggles] = useState(items.reduce((acc, item) => ({ ...acc, [item.id]: item.enabled }), {} as Record<string, boolean>));

    const handleToggle = (id: string, value: boolean) => {
        setToggles(prev => ({ ...prev, [id]: value }));
    }

    return (
        <div className="space-y-4 text-left">
            <ul className="divide-y divide-gray-200">
                {items.map(item => (
                    <li key={item.id} className="py-3 flex justify-between items-center">
                        <span className="font-medium text-gray-700">{item.label}</span>
                        <ToggleSwitch enabled={toggles[item.id]} onChange={(val) => handleToggle(item.id, val)} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

const SettingDetailPage: React.FC<SettingDetailPageProps> = ({ title, onBack }) => {
    
    const renderContent = () => {
        switch(title) {
            case "Outstanding":
                return <OutstandingSettings />;
            case "Company Logo":
            case "Signature":
                return <FileUploadSetting title={title} />;
            case "Declaration":
                return <TextContentSetting title={title} description="Enter the default declaration text to be shown on your invoices." initialValue="We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct." />;
            case "Invoice Title":
                 return <TextContentSetting title={title} description="Change the default title for shared invoices (e.g., 'Tax Invoice')." initialValue="Invoice" />;
            case "Credit Note Header":
                return <TextContentSetting title={title} description="Change the default title for shared credit notes." initialValue="Credit Note" />;
            case "Order":
                 return <VoucherConfigSetting items={[
                     { id: 'rate', label: 'Include Item Rate', enabled: true },
                     { id: 'status', label: 'Show Order Status', enabled: false },
                     { id: 'eta', label: 'Display Estimated Delivery Date', enabled: true },
                 ]} />;
            case "Inventory Voucher":
                 return <VoucherConfigSetting items={[
                     { id: 'batchNo', label: 'Include Batch Number', enabled: true },
                     { id: 'location', label: 'Show Warehouse Location', enabled: true },
                 ]} />;
            default:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-brand-dark">Coming Soon!</h2>
                        <p className="mt-2 text-gray-600">The settings for "{title}" are under construction. Please check back later.</p>
                    </div>
                );
        }
    };
    
    const handleSaveChanges = () => {
        alert(`Settings for "${title}" saved successfully!`);
        onBack();
    }

    return (
        <div className="p-6 md:p-8 bg-brand-light min-h-full">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-6">{title} Settings</h1>
            
                <div className="bg-white rounded-xl shadow-lg p-8">
                   {renderContent()}
                </div>

                 <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={handleSaveChanges}
                        className="bg-brand-secondary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors shadow-md hover:shadow-lg"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingDetailPage;
