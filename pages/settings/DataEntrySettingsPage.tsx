
import React from 'react';
import { Page } from '../../types';
import { ArrowLeftIcon, ChevronRightIcon } from '../../components/icons';

interface DataEntrySettingsPageProps {
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

const DataEntrySettingsPage: React.FC<DataEntrySettingsPageProps> = ({ onBack, onNavigate }) => {

    const settingsItems = [
        {
            title: "Vouchers",
            description: "Configure fields you would like to show in your vouchers entry",
            page: Page.VouchersSettings,
        },
        {
            title: "Orders",
            description: "Configure fields you would like to show in your orders entry",
            page: Page.OrdersSettings,
        },
        {
            title: "Ledger",
            description: "Configure fields you would like to show in your ledger entry",
            page: Page.LedgerSettings,
        },
        {
            title: "Stock Item",
            description: "Configure fields you would like to show in your stock item entry",
            page: Page.StockItemEntrySettings,
        },
        {
            title: "Invoice",
            description: "Configure fields you would like to show in your invoice entry",
            page: Page.InvoiceSettings,
        },
        {
            title: "Inventory Voucher",
            description: "Configure fields you would like to show in your Inventory Voucher entry",
            page: Page.InventoryVoucherSettings,
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white md:bg-brand-light">
             <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden">
                <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                <h1 className="text-xl font-semibold ml-4">Data Entry Setting</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-0 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Settings
                    </button>
                
                    <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Data Entry Settings</h1>
                
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {settingsItems.map(item => (
                                <SettingsLinkItem
                                    key={item.title}
                                    title={item.title}
                                    description={item.description}
                                    onClick={() => onNavigate(item.page)}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataEntrySettingsPage;