
import React, { useState } from 'react';
import { ArrowLeftIcon, DocumentArrowDownIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/CurrencyContext';

interface CustomizeCommunicationPageProps {
    onBack: () => void;
}

const CustomizeCommunicationPage: React.FC<CustomizeCommunicationPageProps> = ({ onBack }) => {
    const [template, setTemplate] = useState('Your account balance is overdue as of {date}. View details: {link}');
    const [selectedTemplate, setSelectedTemplate] = useState('template1');
    const [sendDueBillsOnly, setSendDueBillsOnly] = useState(true);
    const [includeBankDetails, setIncludeBankDetails] = useState(false);
    const [baseAmount, setBaseAmount] = useState(500);
    const [lastPaymentDays, setLastPaymentDays] = useState(7);
    const [reportDateFilter, setReportDateFilter] = useState('This Month');
    const { currencyCode } = useCurrency();

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedTemplate(val);
        if (val === 'template1') setTemplate('Your account balance is overdue as of {date}. View details: {link}');
        else if (val === 'template2') setTemplate('This is a reminder of your payment of {amount} overdue as of {date}. View details: {link}');
        else setTemplate('');
    };

    const handleSaveChanges = () => {
        alert('Communication settings saved!');
    };
    
    const appName = "TallyFi AI";

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Auto Reminder Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-6">Customise Communication</h1>
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">SMS Template Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="template-select" className="text-sm font-medium text-gray-700">Choose Template</label>
                                    <select id="template-select" value={selectedTemplate} onChange={handleTemplateChange} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="template1">Template 1 - Overdue Balance</option>
                                        <option value="template2">Template 2 - Specific Amount</option>
                                        <option value="custom">Custom Template</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="template-editor" className="text-sm font-medium text-gray-700">Modify Your Template</label>
                                    <textarea 
                                        id="template-editor" 
                                        rows={4} 
                                        value={template} 
                                        onChange={e => setTemplate(e.target.value)}
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                                    <p className="font-semibold mb-1">Live Preview:</p>
                                    <p>{template.replace('{date}', new Date().toLocaleDateString()).replace('{amount}', formatCurrency(5000, currencyCode)).replace('{link}', 'https://tallyfi.ai/inv-123')} - Sent from {appName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">General Content Settings</h2>
                            <ul className="divide-y divide-gray-200">
                                <li className="py-3 flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Send Due Bills Only</span>
                                    <ToggleSwitch enabled={sendDueBillsOnly} onChange={setSendDueBillsOnly} />
                                </li>
                                <li className="py-3 flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Include Bank Account Details</span>
                                    <ToggleSwitch enabled={includeBankDetails} onChange={setIncludeBankDetails} />
                                </li>
                            </ul>
                            {includeBankDetails && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                    <p className="font-semibold text-sm">Default Bank Account:</p>
                                    <p className="text-sm text-gray-600">HDFC Bank - XXXXXXXX1234</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                     <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">Additional Settings</h2>
                             <div className="space-y-4">
                                <div>
                                    <label htmlFor="base-amount" className="text-sm font-medium text-gray-700">Set Base Amount ({currencyCode})</label>
                                    <p className="text-xs text-gray-500 mb-1">No reminder if outstanding is below this amount.</p>
                                    <input id="base-amount" type="number" value={baseAmount} onChange={e => setBaseAmount(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="last-payment" className="text-sm font-medium text-gray-700">Last Payment Grace Period</label>
                                    <p className="text-xs text-gray-500 mb-1">No reminder if last payment was within X days.</p>
                                    <input id="last-payment" type="number" value={lastPaymentDays} onChange={e => setLastPaymentDays(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">Reports</h2>
                            <p className="text-sm text-gray-600 mb-4">Download auto-reminder reports with filters.</p>
                            <select value={reportDateFilter} onChange={e => setReportDateFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm mb-4">
                                <option>Today</option><option>Yesterday</option><option>This Week</option><option>This Month</option>
                                <option>Last Month</option><option>This Quarter</option><option>This Year</option><option>Last Year</option>
                                <option>All</option><option>Custom Date</option>
                            </select>
                            <button className="w-full flex items-center justify-center bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
                                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                                Download Report
                            </button>
                        </div>
                     </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
                    <button onClick={handleSaveChanges} className="bg-brand-secondary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-brand-primary transition-colors shadow-md hover:shadow-lg">
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizeCommunicationPage;
