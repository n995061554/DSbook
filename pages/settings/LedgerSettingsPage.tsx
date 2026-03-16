
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface LedgerSettingsPageProps {
    onBack: () => void;
}

const SettingsToggleItem: React.FC<{ title: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ title, enabled, onChange }) => (
    <li className="flex justify-between items-center py-3">
        <h3 className="font-medium text-brand-dark">{title}</h3>
        <ToggleSwitch enabled={enabled} onChange={onChange} aria-label={title} />
    </li>
);

const SettingsHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="pt-6 pb-2">
        <h2 className="text-lg font-semibold text-brand-dark">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);


const LedgerSettingsPage: React.FC<LedgerSettingsPageProps> = ({ onBack }) => {
    const [settings, setSettings] = useState({
        verifyGst: true,
        cst: false,
        vatNumber: false,
        panNumber: false,
        telephoneNumber: false,
        mobileNumber: false,
        emailAddress: false,
        emailCcAddress: false,
        maintainBillByBill: false,
        priceLevel: false,
    });

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col h-full bg-white md:bg-brand-light">
             <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden">
                <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                <h1 className="text-xl font-semibold ml-4">Ledger Setting</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-0 md:p-8">
                <div className="max-w-4xl mx-auto">
                     <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Data Entry Settings
                    </button>
                    <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Ledger Setting</h1>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <ul className="divide-y divide-gray-200">
                            <SettingsHeader title="Company Details" description="Configure fields you would like to show in your ledger company details" />
                            <SettingsToggleItem title="Verify GST" enabled={settings.verifyGst} onChange={v => handleToggle('verifyGst', v)} />
                            <SettingsToggleItem title="CST" enabled={settings.cst} onChange={v => handleToggle('cst', v)} />
                            <SettingsToggleItem title="VAT Number" enabled={settings.vatNumber} onChange={v => handleToggle('vatNumber', v)} />
                            <SettingsToggleItem title="PAN Number" enabled={settings.panNumber} onChange={v => handleToggle('panNumber', v)} />

                            <SettingsHeader title="Contact Details" description="Configure fields you would like to show in your ledger contact details" />
                            <SettingsToggleItem title="Telephone Number" enabled={settings.telephoneNumber} onChange={v => handleToggle('telephoneNumber', v)} />
                            <SettingsToggleItem title="Mobile Number" enabled={settings.mobileNumber} onChange={v => handleToggle('mobileNumber', v)} />
                            <SettingsToggleItem title="Email Address" enabled={settings.emailAddress} onChange={v => handleToggle('emailAddress', v)} />
                            <SettingsToggleItem title="Email CC Address" enabled={settings.emailCcAddress} onChange={v => handleToggle('emailCcAddress', v)} />

                             <SettingsHeader title="Credit Details" description="Configure fields you would like to show in your ledger credit details" />
                            <SettingsToggleItem title="Maintain bill by bill" enabled={settings.maintainBillByBill} onChange={v => handleToggle('maintainBillByBill', v)} />
                            <SettingsToggleItem title="Price level" enabled={settings.priceLevel} onChange={v => handleToggle('priceLevel', v)} />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LedgerSettingsPage;
