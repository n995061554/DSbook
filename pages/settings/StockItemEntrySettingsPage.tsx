
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface StockItemEntrySettingsPageProps {
    onBack: () => void;
}

const SettingsToggleItem: React.FC<{ title: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ title, enabled, onChange }) => (
    <li className="flex justify-between items-center py-4">
        <h3 className="font-medium text-brand-dark">{title}</h3>
        <ToggleSwitch enabled={enabled} onChange={onChange} aria-label={title} />
    </li>
);

const StockItemEntrySettingsPage: React.FC<StockItemEntrySettingsPageProps> = ({ onBack }) => {
    const [settings, setSettings] = useState({
        mrp: false,
        standardCost: false,
        standardSellingPrice: false,
    });

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col h-full bg-white md:bg-brand-light">
             <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden">
                <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                <h1 className="text-xl font-semibold ml-4">Stock Item Entry Setting</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-0 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Data Entry Settings
                    </button>
                    <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Stock Item Entry Setting</h1>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                         <div className="pb-2">
                            <h2 className="text-lg font-semibold text-brand-dark">Rate Details</h2>
                            <p className="text-sm text-gray-500">Configure fields you would like to show in your stock item rate details</p>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            <SettingsToggleItem title="MRP" enabled={settings.mrp} onChange={v => handleToggle('mrp', v)} />
                            <SettingsToggleItem title="Standard Cost" enabled={settings.standardCost} onChange={v => handleToggle('standardCost', v)} />
                            <SettingsToggleItem title="Standard Selling Price" enabled={settings.standardSellingPrice} onChange={v => handleToggle('standardSellingPrice', v)} />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockItemEntrySettingsPage;
