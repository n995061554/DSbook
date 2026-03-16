import React from 'react';
// FIX: Corrected import path for Page enum.
import { Page } from '../types';
import {
    ChevronRightIcon,
    ShareIcon,
    BanknotesIcon,
    BellAlertIcon,
    ShoppingCartIcon,
    CalendarDaysIcon,
    DevicePhoneMobileIcon,
    CurrencyRupeeIcon,
    QueueListIcon,
    KeyIcon,
    LockClosedIcon,
    GlobeAltIcon,
} from '../components/icons';

interface GeneralSettingsPageProps {
    onNavigate: (page: Page, title?: string) => void;
}

interface SettingsItemProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, title, description, onClick }) => (
    <li
        onClick={onClick}
        className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
        <div className="mr-4 text-gray-500">
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
    </li>
);

const GeneralSettingsPage: React.FC<GeneralSettingsPageProps> = ({ onNavigate }) => {

    const settingsItems: SettingsItemProps[] = [
        {
            icon: ShareIcon,
            title: "Share",
            description: "Additional settings while sharing, emailing your customers",
            onClick: () => onNavigate(Page.ShareSettings),
        },
        {
            icon: BanknotesIcon,
            title: "Outstanding",
            description: "Enables you to configure Outstanding",
            onClick: () => onNavigate(Page.SettingDetail, "Outstanding"),
        },
        {
            icon: ShareIcon, 
            title: "Invoice Auto Sharing",
            description: "Share invoices automatically on entry",
            onClick: () => onNavigate(Page.InvoiceAutoSharing),
        },
        {
            icon: BellAlertIcon,
            title: "Auto Reminder Scheduler",
            description: "Enables auto reminder setting for outstanding",
            onClick: () => onNavigate(Page.AutoReminderSettings),
        },
        {
            icon: ShoppingCartIcon,
            title: "Stock Item",
            description: "Configure your stock items",
            onClick: () => onNavigate(Page.StockItemSettings),
        },
        {
            icon: CalendarDaysIcon,
            title: "Date",
            description: "Date Settings",
            onClick: () => onNavigate(Page.DateSettings),
        },
        {
            icon: DevicePhoneMobileIcon,
            title: "Default Screen",
            description: "Choose the default screen to open while opening this app",
            onClick: () => onNavigate(Page.SettingDetail, "Default Screen"),
        },
        {
            icon: CurrencyRupeeIcon,
            title: "Currency",
            description: "Set the default currency for the app",
            onClick: () => onNavigate(Page.CurrencySettings),
        },
        {
            icon: QueueListIcon,
            title: "Data Entry",
            description: "Data Entry Settings",
            onClick: () => onNavigate(Page.DataEntrySettings),
        },
    ];
    
     const securityItems: SettingsItemProps[] = [
        {
            icon: GlobeAltIcon,
            title: "Language & Region",
            description: "Set app language and currency format",
            onClick: () => {}, // Future implementation
        },
         {
            icon: KeyIcon,
            title: "Change Password",
            description: "Update your account password",
            onClick: () => {}, // Future implementation
        },
         {
            icon: LockClosedIcon,
            title: "Two-Factor Authentication",
            description: "Add an extra layer of security to your account",
            onClick: () => {}, // Future implementation
        },
    ];

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-brand-dark mb-8">Settings</h1>
            
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <ul className="divide-y divide-gray-200">
                        {settingsItems.map((item, index) => (
                            <SettingsItem
                                key={index}
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                                onClick={item.onClick}
                            />
                        ))}
                    </ul>
                </div>
                
                 <h2 className="text-2xl font-bold text-brand-dark mb-4">Security & Region</h2>
                 <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {securityItems.map((item, index) => (
                            <SettingsItem
                                key={index}
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                                onClick={item.onClick}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettingsPage;