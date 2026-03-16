
import React, { useState } from 'react';
import { ArrowLeftIcon, ChevronRightIcon, XMarkIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface OrdersSettingsPageProps {
    onBack: () => void;
}

// Type for item rate options
type ItemRateOption = 'Last Sale Rate' | 'Standard Price' | 'Price List';

// Modal Component for Item Rate Selection
const ItemRateModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentOption: ItemRateOption;
    onSelect: (option: ItemRateOption) => void;
}> = ({ isOpen, onClose, currentOption, onSelect }) => {
    if (!isOpen) return null;

    const options: ItemRateOption[] = ['Last Sale Rate', 'Standard Price', 'Price List'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end md:items-center p-0" aria-modal="true" role="dialog">
            <div className="bg-white rounded-t-2xl md:rounded-xl shadow-2xl w-full max-w-sm m-0 md:m-4 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-brand-dark">Select item rate option</h2>
                    <button onClick={onClose} aria-label="Close item rate selection"><XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" /></button>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {options.map(option => (
                            <label key={option} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="item-rate-option"
                                    value={option}
                                    checked={currentOption === option}
                                    onChange={() => {
                                        onSelect(option);
                                        onClose();
                                    }}
                                    className="h-5 w-5 text-brand-secondary focus:ring-brand-secondary border-gray-300"
                                />
                                <span className="text-gray-800">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


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

const OrdersSettingsPage: React.FC<OrdersSettingsPageProps> = ({ onBack }) => {
    const [settings, setSettings] = useState({
        orderNo: false,
        addGodownAndBatch: false,
        includeAccountLedgerName: false,
        createEntryWithoutTax: false,
        allowZeroValueEntries: false,
    });
    const [itemRateOption, setItemRateOption] = useState<ItemRateOption>('Last Sale Rate');
    const [isItemRateModalOpen, setIsItemRateModalOpen] = useState(false);

    const handleToggle = (key: keyof typeof settings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <div className="flex flex-col h-full bg-white md:bg-brand-light">
                 <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden">
                    <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                    <h1 className="text-xl font-semibold ml-4">Orders Setting</h1>
                </div>
                <div className="flex-grow overflow-y-auto p-0 md:p-8">
                    <div className="max-w-4xl mx-auto">
                         <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Data Entry Settings
                        </button>
                        <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Orders Setting</h1>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                <li onClick={() => setIsItemRateModalOpen(true)} className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="pr-4">
                                        <h3 className="font-semibold text-brand-dark">Select Option for item rate</h3>
                                        <p className="text-sm text-gray-500">Select an option for pre selecting item rate while entering item in orders</p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center space-x-2">
                                        <span className="text-sm font-medium text-brand-primary">{itemRateOption}</span>
                                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                </li>
                                <SettingsToggleItem title="Order No" description="Enable it to add order number while creating an order entry." enabled={settings.orderNo} onChange={v => handleToggle('orderNo', v)} />
                                <SettingsToggleItem title="Add Godown and Batch" description="On selection, it allows to select godown and batch while creating order." enabled={settings.addGodownAndBatch} onChange={v => handleToggle('addGodownAndBatch', v)} />
                                <SettingsToggleItem title="Include Account Ledger Name" description="Enable to add account ledger name while creating a Sales/Purchase Order." enabled={settings.includeAccountLedgerName} onChange={v => handleToggle('includeAccountLedgerName', v)} />
                                <SettingsToggleItem title="Create Entry Without Tax" description="Enable this to allow users to remove auto filled tax ledgers while adding items" enabled={settings.createEntryWithoutTax} onChange={v => handleToggle('createEntryWithoutTax', v)} />
                                <SettingsToggleItem title="Allow Zero-Value Entries" description="Enable this to create the orders with zero value" enabled={settings.allowZeroValueEntries} onChange={v => handleToggle('allowZeroValueEntries', v)} />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <ItemRateModal
                isOpen={isItemRateModalOpen}
                onClose={() => setIsItemRateModalOpen(false)}
                currentOption={itemRateOption}
                onSelect={setItemRateOption}
            />
        </>
    );
};

export default OrdersSettingsPage;
