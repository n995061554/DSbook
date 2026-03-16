
import React, { useState, useMemo } from 'react';
import { Customer } from '../../types';
import { ArrowLeftIcon, SearchIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface ManageContactsPageProps {
    onBack: () => void;
    customers: Customer[];
}

const ManageContactsPage: React.FC<ManageContactsPageProps> = ({ onBack, customers }) => {
    const [customerSettings, setCustomerSettings] = useState(() => 
        customers.map(c => ({ 
            id: c.id, 
            name: c.name, 
            company: c.company, 
            autoReminderEnabled: Math.random() > 0.2, 
            mobile: Math.random() > 0.1 ? `98765${String(Math.random()).slice(2, 7)}` : ''
        }))
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [contactFilter, setContactFilter] = useState('All'); // 'All' or 'Missing'
    const [isTallySyncEnabled, setIsTallySyncEnabled] = useState(true);

    const filteredCustomers = useMemo(() => {
        return customerSettings
            .filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                c.company.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(c => contactFilter === 'Missing' ? !c.mobile : true);
    }, [customerSettings, searchTerm, contactFilter]);

    const handleToggle = (id: string, field: 'autoReminderEnabled', value: boolean) => {
        setCustomerSettings(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };
    
    const handleMobileChange = (id: string, mobile: string) => {
        setCustomerSettings(prev => prev.map(c => c.id === id ? { ...c, mobile } : c));
    }
    
    const handleSaveChanges = () => {
        alert("Contact settings saved successfully!");
    }

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Auto Reminder Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Manage Contacts & Reminders</h1>
                <p className="text-gray-600 mb-8">Enable or disable auto-reminders for specific customers and manage their contact details.</p>
            
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div>
                             <label className="font-semibold text-brand-dark text-sm">Sync Contact Changes with Tally</label>
                             <p className="text-xs text-gray-600">Numbers added here will be updated in Tally if this is enabled.</p>
                        </div>
                        <ToggleSwitch enabled={isTallySyncEnabled} onChange={setIsTallySyncEnabled} />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center mb-4">
                        <div className="relative flex-grow">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex border border-gray-300 rounded-lg p-0.5">
                            {['All Contacts', 'No Contact Details'].map(status => (
                                <button key={status} onClick={() => setContactFilter(status === 'All Contacts' ? 'All' : 'Missing')} className={`px-3 py-1 text-sm rounded-md ${contactFilter === (status === 'All Contacts' ? 'All' : 'Missing') ? 'bg-brand-primary text-white' : 'text-gray-600'}`}>
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase sticky top-0">
                                <tr>
                                    <th className="py-2 px-3 text-left">Customer</th>
                                    <th className="py-2 px-3 text-left">Mobile Number</th>
                                    <th className="py-2 px-3 text-center">Auto-Reminder</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-gray-200">
                                {filteredCustomers.map(c => (
                                    <tr key={c.id}>
                                        <td className="py-2 px-3">
                                            <p className="font-semibold">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.company}</p>
                                        </td>
                                        <td className="py-2 px-3">
                                            <input 
                                                type="tel"
                                                value={c.mobile}
                                                onChange={(e) => handleMobileChange(c.id, e.target.value)}
                                                placeholder="Add mobile number"
                                                className="w-full p-1 border border-gray-300 rounded-md"
                                            />
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <ToggleSwitch enabled={c.autoReminderEnabled} onChange={val => handleToggle(c.id, 'autoReminderEnabled', val)} />
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
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

export default ManageContactsPage;
