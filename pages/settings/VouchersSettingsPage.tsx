
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface VouchersSettingsPageProps {
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

const VouchersSettingsPage: React.FC<VouchersSettingsPageProps> = ({ onBack }) => {
    const [settings, setSettings] = useState({
        voucherClass: true,
        disableRate: false,
        disableDiscount: false,
        usernameInNarration: false,
        email: true,
        creditLimit: false,
        costCenter: false,
        includePartNumber: false,
        addRateWithTax: false,
        location: false,
        voucherType: false,
    });

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col h-full bg-white md:bg-brand-light">
             <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden">
                <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                <h1 className="text-xl font-semibold ml-4">Vouchers Setting</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-0 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Data Entry Settings
                    </button>
                    <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Vouchers Setting</h1>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            <SettingsToggleItem title="Voucher Class" description="Enable it to add entries with voucher class added in tally." enabled={settings.voucherClass} onChange={v => handleToggle('voucherClass', v)} />
                            <SettingsToggleItem title="Disable Rate for an item" description="Enable this to restrict user from editing the rate while adding an item in Order, Invoice or Quotation" enabled={settings.disableRate} onChange={v => handleToggle('disableRate', v)} />
                            <SettingsToggleItem title="Disable Discount for an item" description="Enable this to restrict user from editing the discount while adding an item in Order, Invoice or Quotation" enabled={settings.disableDiscount} onChange={v => handleToggle('disableDiscount', v)} />
                            <SettingsToggleItem title="User name in narration" description="Enable this to add user name in narration field so that you will know who create the entry in tally" enabled={settings.usernameInNarration} onChange={v => handleToggle('usernameInNarration', v)} />
                            <SettingsToggleItem title="Email" description="Enable this to send the mail to user also" enabled={settings.email} onChange={v => handleToggle('email', v)} />
                            <SettingsToggleItem title="Credit Limit" description="Enable this to restrict Order/Invoice entry if credit limit is reached for the selected ledger" enabled={settings.creditLimit} onChange={v => handleToggle('creditLimit', v)} />
                            <SettingsToggleItem title="Cost Center" description="Enable this to select cost centers in your data entries" enabled={settings.costCenter} onChange={v => handleToggle('costCenter', v)} />
                            <SettingsToggleItem title="Include Part Number" description="On selection, it shows the part number of item in the voucher" enabled={settings.includePartNumber} onChange={v => handleToggle('includePartNumber', v)} />
                            <SettingsToggleItem title="Add Rate with Tax" description="On selection, it allows to enter rate with tax field" enabled={settings.addRateWithTax} onChange={v => handleToggle('addRateWithTax', v)} />
                             <SettingsToggleItem title="Location" description="Enable location tracking on sales order and purchase order entry" enabled={settings.location} onChange={v => handleToggle('location', v)} />
                             <SettingsToggleItem title="Voucher type" description="Enable it to add entries with custom voucher types added in tally." enabled={settings.voucherType} onChange={v => handleToggle('voucherType', v)} />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VouchersSettingsPage;
