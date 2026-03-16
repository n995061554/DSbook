
import React from 'react';
import { Page } from '../../types';
import { ArrowLeftIcon, ChevronRightIcon } from '../../components/icons';

interface VoucherShareSettingsPageProps {
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

const VoucherShareSettingsPage: React.FC<VoucherShareSettingsPageProps> = ({ onBack, onNavigate }) => {

    const voucherSettings = [
        {
            title: "Invoice",
            description: "Configure fields you would like to show in your invoice",
            onClick: () => onNavigate(Page.ConfigureInvoiceShare)
        },
        {
            title: "Order",
            description: "Configure fields you would like to show in your order",
            onClick: () => onNavigate(Page.SettingDetail, "Order")
        },
        {
            title: "Inventory Voucher",
            description: "Enables you to configure while sharing Inventory Voucher",
            onClick: () => onNavigate(Page.SettingDetail, "Inventory Voucher")
        },
        {
            title: "Company Logo",
            description: "Add, Edit or Delete the Company Logo image that is attached to every shared voucher PDF next to your company details",
            onClick: () => onNavigate(Page.SettingDetail, "Company Logo")
        },
        {
            title: "Signature",
            description: "Add, Edit or Delete the Signature image that is attached to every shared voucher PDF in the signature section",
            onClick: () => onNavigate(Page.SettingDetail, "Signature")
        },
    ];

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Share Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-6">Voucher Share Settings</h1>
            
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {voucherSettings.map(setting => (
                            <SettingsLinkItem 
                                key={setting.title}
                                title={setting.title} 
                                description={setting.description} 
                                onClick={setting.onClick}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VoucherShareSettingsPage;