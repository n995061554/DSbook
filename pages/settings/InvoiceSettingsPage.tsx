
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface InvoiceSettingsPageProps {
    onBack: () => void;
}

const SettingsToggleItem: React.FC<{ title: string; description: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ title, description, enabled, onChange }) => (
    <li className="flex justify-between items-start p-4">
        <div className="pr-4">
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex-shrink-0">
            <ToggleSwitch enabled={enabled} onChange={onChange} aria-label={title} />
        </div>
    </li>
);

const InvoiceSettingsPage: React.FC<InvoiceSettingsPageProps> = ({ onBack }) => {
    const [settings, setSettings] = useState({
        includeSupplierInvoiceNumber: false,
        addBatch: false,
        createEntryWithoutTax: false,
        multiModePosPayment: false,
        allowZeroValueEntries: false,
    });

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col h-full bg-white md:bg-brand-light">
             <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden">
                <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                <h1 className="text-xl font-semibold ml-4">Invoice Setting</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-0 md:p-8">
                <div className="max-w-4xl mx-auto">
                     <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Data Entry Settings
                    </button>
                    <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Invoice Setting</h1>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            <SettingsToggleItem title="Include Supplier Invoice Number" description="Enable to add Supplier Invoice Number while creating Invoice" enabled={settings.includeSupplierInvoiceNumber} onChange={v => handleToggle('includeSupplierInvoiceNumber', v)} />
                            <SettingsToggleItem title="Add Batch" description="Enable this to include batch while adding item in invoice" enabled={settings.addBatch} onChange={v => handleToggle('addBatch', v)} />
                            <SettingsToggleItem title="Create Entry Without Tax" description="Enable this to allow users to remove auto filled tax ledgers while adding items" enabled={settings.createEntryWithoutTax} onChange={v => handleToggle('createEntryWithoutTax', v)} />
                            <SettingsToggleItem title="Multi Mode POS Payment" description="Enable this to enable multi mode pos payment methods" enabled={settings.multiModePosPayment} onChange={v => handleToggle('multiModePosPayment', v)} />
                            <SettingsToggleItem title="Allow Zero-Value Entries" description="Enable this to create the invoices with zero value" enabled={settings.allowZeroValueEntries} onChange={v => handleToggle('allowZeroValueEntries', v)} />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSettingsPage;
