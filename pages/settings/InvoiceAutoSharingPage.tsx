
import React, { useState, useMemo } from 'react';
import { Customer } from '../../types';
import { ArrowLeftIcon, ChatBubbleLeftEllipsisIcon, EnvelopeIcon, WalletIcon, SearchIcon, PencilIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/CurrencyContext';

interface InvoiceAutoSharingPageProps {
    onBack: () => void;
    customers: Customer[];
}

// Mock data for the history report
const mockHistory = [
    { id: 1, customerName: 'Innovate Solutions Pvt. Ltd.', invoice: 'INV-2024-1001', amount: 50000, date: new Date(), channel: 'SMS', status: 'Shared' },
    { id: 2, customerName: 'Dynamic Tech Corp.', invoice: 'INV-2024-1003', amount: 22000, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), channel: 'WhatsApp', status: 'Shared' },
    { id: 3, customerName: 'Future Builders Co.', invoice: 'INV-2024-1005', amount: 45000, date: new Date(), channel: 'SMS', status: 'Pending' },
    { id: 4, customerName: 'Creative Designs Studio', invoice: 'INV-2024-1008', amount: 15000, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), channel: 'SMS', status: 'Shared' },
];

const InvoiceAutoSharingPage: React.FC<InvoiceAutoSharingPageProps> = ({ onBack, customers }) => {
    const [isGloballyEnabled, setIsGloballyEnabled] = useState(true);
    const [customerSettings, setCustomerSettings] = useState(() => 
        customers.map(c => ({ id: c.id, name: c.name, company: c.company, enabled: Math.random() > 0.3, mobile: `98765${String(Math.random()).slice(2, 7)}` }))
    );
    const [searchTerm, setSearchTerm] = useState('');
    const { currencyCode } = useCurrency();
    
    // Channel settings
    const [isSmsEnabled, setIsSmsEnabled] = useState(true);
    const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(false);
    const [smsTemplate, setSmsTemplate] = useState('Dear Customer, your invoice {invoice_no} for {amount} from TallyFi AI is ready. Thank you!');

    // Report settings
    const [reportStatusFilter, setReportStatusFilter] = useState('All');
    const [reportDateFilter, setReportDateFilter] = useState('This Month');

    // Contact management settings
    const [contactFilter, setContactFilter] = useState('All');
    const [isTallySyncEnabled, setIsTallySyncEnabled] = useState(true);

    const filteredCustomers = useMemo(() =>
        customerSettings.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company.toLowerCase().includes(searchTerm.toLowerCase())
        ), [customerSettings, searchTerm]
    );

    const handleCustomerToggle = (id: string, enabled: boolean) => {
        setCustomerSettings(prev => prev.map(c => c.id === id ? { ...c, enabled } : c));
    };
    
    const handleSaveContact = (id: string, mobile: string) => {
         setCustomerSettings(prev => prev.map(c => c.id === id ? { ...c, mobile } : c));
         // In a real app, this would also trigger a save to the backend
         alert(`Contact for ${customerSettings.find(c=>c.id === id)?.name} saved!`);
    }

    const handleSaveChanges = () => {
        alert('All auto-sharing settings saved successfully!');
    }

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-7xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Invoice Auto Sharing</h1>
                <p className="text-gray-600 mb-8">Automate invoice delivery to your customers as soon as they are created.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Settings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Master Toggle and Customer List */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <h2 className="text-xl font-bold text-brand-dark">Auto Share Settings</h2>
                                <ToggleSwitch enabled={isGloballyEnabled} onChange={setIsGloballyEnabled} aria-label="Enable Invoice Auto Sharing Globally" />
                            </div>
                            <div className="relative mt-4 mb-2">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                />
                            </div>
                            <div className="max-h-80 overflow-y-auto pr-2">
                                <ul className="divide-y divide-gray-200">
                                    {filteredCustomers.map(customer => (
                                        <li key={customer.id} className="flex justify-between items-center py-3">
                                            <div>
                                                <p className="font-semibold text-brand-dark">{customer.name}</p>
                                                <p className="text-sm text-gray-500">{customer.company}</p>
                                            </div>
                                            <ToggleSwitch enabled={customer.enabled} onChange={(val) => handleCustomerToggle(customer.id, val)} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Report View */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                             <h2 className="text-xl font-bold text-brand-dark mb-4">Auto-Shared Invoice History</h2>
                             <div className="flex flex-wrap gap-4 items-center mb-4">
                                <div className="flex border border-gray-300 rounded-lg p-0.5">
                                    {['All', 'Shared', 'Pending'].map(status => (
                                        <button key={status} onClick={() => setReportStatusFilter(status)} className={`px-3 py-1 text-sm rounded-md ${reportStatusFilter === status ? 'bg-brand-primary text-white' : 'text-gray-600'}`}>
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <select value={reportDateFilter} onChange={e => setReportDateFilter(e.target.value)} className="p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-brand-secondary focus:border-brand-secondary">
                                    <option>Today</option>
                                    <option>Yesterday</option>
                                    <option>This Week</option>
                                    <option>This Month</option>
                                    <option>This Quarter</option>
                                    <option>This Year</option>
                                    <option>Custom Date</option>
                                </select>
                             </div>
                             <div className="overflow-x-auto max-h-72">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-600 uppercase sticky top-0">
                                        <tr>
                                            <th className="py-2 px-3 text-left">Customer</th>
                                            <th className="py-2 px-3 text-left">Invoice #</th>
                                            <th className="py-2 px-3 text-right">Amount</th>
                                            <th className="py-2 px-3 text-center">Channel</th>
                                            <th className="py-2 px-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {mockHistory.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="py-2 px-3">{item.customerName}</td>
                                                <td className="py-2 px-3">{item.invoice}</td>
                                                <td className="py-2 px-3 text-right">{formatCurrency(item.amount, currencyCode)}</td>
                                                <td className="py-2 px-3 text-center">{item.channel}</td>
                                                <td className="py-2 px-3 text-center">
                                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === 'Shared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    </div>

                    {/* Right Column - Channel and Contact Settings */}
                    <div className="space-y-8">
                         {/* Channel Settings */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                             <h2 className="text-xl font-bold text-brand-dark mb-4">Channel Settings</h2>
                             <div className="space-y-6">
                                {/* SMS */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="font-semibold text-brand-dark flex items-center"><EnvelopeIcon className="w-5 h-5 mr-2"/>SMS</label>
                                        <ToggleSwitch enabled={isSmsEnabled} onChange={setIsSmsEnabled} />
                                    </div>
                                    <textarea 
                                        value={smsTemplate}
                                        onChange={e => setSmsTemplate(e.target.value)}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
                                        disabled={!isSmsEnabled}
                                    />
                                    <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                                        <p className="font-semibold mb-1">SMS Preview:</p>
                                        <p>{smsTemplate.replace('{invoice_no}', 'INV-007').replace('{amount}', formatCurrency(12345, currencyCode))}</p>
                                    </div>
                                </div>
                                {/* WhatsApp */}
                                 <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="font-semibold text-brand-dark flex items-center"><ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2"/>WhatsApp</label>
                                        <ToggleSwitch enabled={isWhatsAppEnabled} onChange={setIsWhatsAppEnabled} />
                                    </div>
                                     <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                                        <WalletIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"/>
                                        <div>
                                            WhatsApp messages are a premium feature and will be charged from your wallet.
                                            <span className="font-bold block mt-1">Balance: {formatCurrency(12530, currencyCode)}</span>
                                        </div>
                                     </div>
                                </div>
                             </div>
                        </div>

                         {/* Contact Details */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-brand-dark mb-4">Contact Details for Auto-Sharing</h2>
                            <p className="text-sm text-gray-600 mb-4">To send invoices via auto-share, you need to add mobile numbers for your parties. Contacts updated here can be synced with Tally.</p>
                            <div className="flex justify-between items-center mb-4 p-3 bg-gray-100 rounded-lg">
                                <label className="font-semibold text-brand-dark text-sm">Sync with Tally</label>
                                <ToggleSwitch enabled={isTallySyncEnabled} onChange={setIsTallySyncEnabled} />
                            </div>
                            {/* Contact list will go here */}
                             <div className="max-h-60 overflow-y-auto pr-2">
                                <ul className="divide-y divide-gray-200">
                                    {customerSettings.map(c => (
                                        <li key={c.id} className="py-2">
                                            <p className="font-semibold text-sm text-brand-dark">{c.name}</p>
                                            {c.mobile ? (
                                                <p className="text-sm text-gray-500">{c.mobile}</p>
                                            ) : (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input type="tel" placeholder="Add mobile number" className="w-full p-1 text-sm border border-gray-300 rounded-md"/>
                                                    <button onClick={() => alert('Save')} className="text-xs bg-gray-200 text-gray-800 font-semibold px-2 py-1 rounded-md">Save</button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                             </div>
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

export default InvoiceAutoSharingPage;
