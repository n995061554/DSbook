
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface StockItemSettingsPageProps {
    onBack: () => void;
}

const SettingsToggleItem: React.FC<{ title: string; description: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ title, description, enabled, onChange }) => (
    <li className="flex justify-between items-center p-4 md:p-6">
        <div className="pr-4">
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex-shrink-0">
            <ToggleSwitch enabled={enabled} onChange={onChange} aria-label={title} />
        </div>
    </li>
);

const StockItemSettingsPage: React.FC<StockItemSettingsPageProps> = ({ onBack }) => {
    const [activeFilter, setActiveFilter] = useState('Show all');
    const [showGroupClosing, setShowGroupClosing] = useState(true);
    const [showClosingAmount, setShowClosingAmount] = useState(false);

    const filters = ['Show all', 'In stock', 'Not in stock', 'Negative stock', 'Below reorder level'];

    const handleSaveChanges = () => {
        console.log('Saving Stock Item Settings:', {
            activeFilter,
            showGroupClosing,
            showClosingAmount,
        });
        alert('Stock Item settings saved successfully!');
    };

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-6">Stock Item Settings</h1>
            
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-brand-dark mb-2">Stock Item Filters</h2>
                        <p className="text-sm text-gray-600 mb-4">Select the default view for your stock item list.</p>
                        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
                            {filters.map(filter => (
                                <button 
                                    key={filter} 
                                    onClick={() => setActiveFilter(filter)} 
                                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors text-center ${
                                        activeFilter === filter 
                                        ? 'bg-brand-primary text-white shadow' 
                                        : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ul className="divide-y divide-gray-200">
                         <li className="bg-gray-100 p-2 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">
                            Display & Sharing Options
                        </li>
                        <SettingsToggleItem
                            title="Show group/category of closing"
                            description="On selection, it shows closing balance and value in stock group and stock category"
                            enabled={showGroupClosing}
                            onChange={setShowGroupClosing}
                        />
                        <SettingsToggleItem
                            title="Show closing amount"
                            description="On selection, it shows closing amount while sharing stock group or stock category or stock item"
                            enabled={showClosingAmount}
                            onChange={setShowClosingAmount}
                        />
                    </ul>
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

export default StockItemSettingsPage;
