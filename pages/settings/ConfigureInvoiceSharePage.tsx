
import React, { useState } from 'react';
import { Page } from '../../types';
import { ArrowLeftIcon, ChevronRightIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface ConfigureInvoiceSharePageProps {
    onBack: () => void;
    onNavigate: (page: Page, title?: string) => void;
}

const SettingsLinkItem: React.FC<{ title: string; description: string; onClick: () => void; }> = ({ title, description, onClick }) => (
    <li onClick={onClick} className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
        <div>
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
    </li>
);

const SettingsToggleItem: React.FC<{ title: string; description: string; enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ title, description, enabled, onChange }) => (
    <li className="flex justify-between items-center p-4">
        <div className="pr-4">
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex-shrink-0">
            <ToggleSwitch enabled={enabled} onChange={onChange} aria-label={title} />
        </div>
    </li>
);

const SettingsHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-gray-100 p-3 px-4 text-sm font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
        {title}
    </div>
);

const initialSettings = {
    // Header
    includeNarration: false,
    // Footer
    // Taxes & Details (from second image)
    sharePartNumber: false,
    shareGst: false,
    shareHsnSac: false,
    // Taxes & Details (from first image)
    includeConsignee: true,
    includeBatches: true,
    includeDescription: true,
    includeAlternateQuantity: true,
    includeDiscount: true,
    includeTaxTable: true,
};


const ConfigureInvoiceSharePage: React.FC<ConfigureInvoiceSharePageProps> = ({ onBack, onNavigate }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const savedSettings = localStorage.getItem('invoiceShareSettings');
            return savedSettings ? JSON.parse(savedSettings) : initialSettings;
        } catch (error) {
            return initialSettings;
        }
    });

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveChanges = () => {
        localStorage.setItem('invoiceShareSettings', JSON.stringify(settings));
        alert('Invoice share settings saved successfully!');
    };
    
    const handleReset = () => {
        setSettings(initialSettings);
        localStorage.removeItem('invoiceShareSettings');
        alert('Settings have been reset to default.');
    }

    return (
        <div className="p-0 md:p-8 bg-white md:bg-brand-light min-h-screen">
            <div className="max-w-4xl mx-auto">
                 {/* Mobile Header */}
                <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden sticky top-0 z-10">
                    <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                    <h1 className="text-xl font-semibold ml-4">Configure Invoice Share</h1>
                </div>

                {/* Desktop Header */}
                <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark my-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Voucher Share Settings
                </button>
            
                <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Configure Invoice Share</h1>
            
                <div className="space-y-8">
                    {/* INVOICE HEADER */}
                    <div className="bg-white rounded-xl md:shadow-lg overflow-hidden">
                        <SettingsHeader title="Invoice Header" />
                        <ul className="divide-y divide-gray-200">
                            <SettingsLinkItem 
                                title="Invoice Title" 
                                description="Change the header that appears on top when invoice is shared" 
                                onClick={() => onNavigate(Page.SettingDetail, 'Invoice Title')} 
                            />
                            <SettingsToggleItem
                                title="Include Narration"
                                description="On selection, it shows the voucher narration in the invoice"
                                enabled={settings.includeNarration}
                                onChange={(value) => handleToggle('includeNarration', value)}
                            />
                            <SettingsLinkItem 
                                title="Credit Note Header" 
                                description="Change the Credit Note Header that appears on top when the Credit Note is shared" 
                                onClick={() => onNavigate(Page.SettingDetail, 'Credit Note Header')} 
                            />
                        </ul>
                    </div>
                    
                    {/* INVOICE FOOTER */}
                    <div className="bg-white rounded-xl md:shadow-lg overflow-hidden">
                        <SettingsHeader title="Invoice Footer" />
                        <ul className="divide-y divide-gray-200">
                             <SettingsLinkItem 
                                title="Declaration" 
                                description="Configure the declaration shown in your invoice" 
                                onClick={() => onNavigate(Page.SettingDetail, 'Declaration')} 
                            />
                        </ul>
                    </div>

                    {/* INVOICE TAXES & DETAILS */}
                    <div className="bg-white rounded-xl md:shadow-lg overflow-hidden">
                        <SettingsHeader title="Invoice Taxes & Details" />
                        <ul className="divide-y divide-gray-200">
                            <SettingsToggleItem 
                                title="Invoice Share Part Number"
                                description="On selection, it adds the Part No. column while sharing your invoice"
                                enabled={settings.sharePartNumber}
                                onChange={(value) => handleToggle('sharePartNumber', value)}
                            />
                             <SettingsToggleItem 
                                title="Invoice Share GST %"
                                description="On selection, it adds the GST% column while sharing your invoice"
                                enabled={settings.shareGst}
                                onChange={(value) => handleToggle('shareGst', value)}
                            />
                             <SettingsToggleItem 
                                title="Invoice Share HSN/SAC"
                                description="On selection, it adds the HSN/SAC column if GST is not applicable while sharing your invoice"
                                enabled={settings.shareHsnSac}
                                onChange={(value) => handleToggle('shareHsnSac', value)}
                            />
                             <SettingsToggleItem 
                                title="Include Consignee Address"
                                description="On selection, it shows the consignee address of customer in the invoice"
                                enabled={settings.includeConsignee}
                                onChange={(value) => handleToggle('includeConsignee', value)}
                            />
                            <SettingsToggleItem 
                                title="Include batches"
                                description="On selection, it shows Batch no for each Item"
                                enabled={settings.includeBatches}
                                onChange={(value) => handleToggle('includeBatches', value)}
                            />
                            <SettingsToggleItem 
                                title="Include Description"
                                description="On selection, it shows description for each Item"
                                enabled={settings.includeDescription}
                                onChange={(value) => handleToggle('includeDescription', value)}
                            />
                            <SettingsToggleItem 
                                title="Include Alternate Quantity"
                                description="On selection, it shows alternate quantity for each Item"
                                enabled={settings.includeAlternateQuantity}
                                onChange={(value) => handleToggle('includeAlternateQuantity', value)}
                            />
                            <SettingsToggleItem 
                                title="Include Discount"
                                description="On selection, it shows discount for each Item"
                                enabled={settings.includeDiscount}
                                onChange={(value) => handleToggle('includeDiscount', value)}
                            />
                            <SettingsToggleItem 
                                title="Include Tax Table"
                                description="Enable to add tax table in invoice pdf share"
                                enabled={settings.includeTaxTable}
                                onChange={(value) => handleToggle('includeTaxTable', value)}
                            />
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center px-4 md:px-0">
                     <button
                        onClick={handleReset}
                        className="text-sm font-semibold text-gray-600 hover:text-accent-red transition-colors"
                    >
                        Reset to Defaults
                    </button>
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

export default ConfigureInvoiceSharePage;