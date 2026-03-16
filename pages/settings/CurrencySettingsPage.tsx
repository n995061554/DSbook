
import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon, ChevronRightIcon, SearchIcon, XMarkIcon } from '../../components/icons';
import { useCurrency } from '../../contexts/CurrencyContext';

// --- CURRENCY DATA ---
const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];


// --- MODAL FOR CURRENCY SELECTION ---
const CurrencyListModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    currentCurrency: string;
    onSave: (currencyCode: string) => void;
}> = ({ isOpen, onClose, currentCurrency, onSave }) => {
    const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCurrencies = useMemo(() => {
        if (!searchTerm) return currencies;
        const lowercasedFilter = searchTerm.toLowerCase();
        return currencies.filter(currency =>
            currency.name.toLowerCase().includes(lowercasedFilter) ||
            currency.code.toLowerCase().includes(lowercasedFilter) ||
            currency.symbol.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm]);

    const handleSave = () => {
        onSave(selectedCurrency);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col" aria-modal="true" role="dialog">
            <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md">
                <button onClick={onClose} aria-label="Close currency selection"><ArrowLeftIcon className="w-6 h-6" /></button>
                <h1 className="text-xl font-semibold ml-4">Select Currency</h1>
            </div>
            
            <div className="p-4 border-b">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search by name, code, or symbol..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-100 pl-10 pr-4 py-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                <ul>
                    {filteredCurrencies.map(currency => (
                        <li key={currency.code}>
                            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 border-b">
                                <span className="text-gray-800">{currency.name} ({currency.code}) ({currency.symbol})</span>
                                <input type="radio" name="currency" value={currency.code} checked={selectedCurrency === currency.code} onChange={() => setSelectedCurrency(currency.code)} className="h-5 w-5 border-gray-300 text-brand-secondary focus:ring-brand-secondary"/>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-shrink-0 p-4 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)]">
                <button onClick={handleSave} className="w-full bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-primary">SAVE</button>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
interface CurrencySettingsPageProps {
    onBack: () => void;
}

const SettingsItem: React.FC<{ title: string; value: string; onClick?: () => void }> = ({ title, value, onClick }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`} role={onClick ? 'button' : undefined}>
        <div>
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-brand-primary font-medium">{value}</p>
        </div>
        {onClick && <ChevronRightIcon className="w-5 h-5 text-gray-400" />}
    </div>
);

const CurrencySettingsPage: React.FC<CurrencySettingsPageProps> = ({ onBack }) => {
    const { currencyCode, currencyFormat, setCurrency, setFormat } = useCurrency();
    const [isCurrencyListModalOpen, setCurrencyListModalOpen] = useState(false);
    
    const selectedCurrencyDetails = currencies.find(c => c.code === currencyCode) || currencies[0];

    return (
        <>
            <div className="flex flex-col h-screen bg-white md:bg-brand-light">
                <div className="flex-shrink-0 bg-brand-primary text-white p-4 flex items-center shadow-md md:hidden">
                    <button onClick={onBack} aria-label="Back to previous screen"><ArrowLeftIcon className="w-6 h-6" /></button>
                    <h1 className="text-xl font-semibold ml-4">Currency Settings</h1>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <div className="max-w-4xl mx-auto w-full p-0 md:p-8">
                         <button onClick={onBack} className="hidden md:flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Settings
                        </button>
                         <h1 className="hidden md:block text-3xl font-bold text-brand-dark mb-6">Currency Settings</h1>

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                <li>
                                    <SettingsItem 
                                        title="Default Currency" 
                                        value={`${selectedCurrencyDetails.name} (${selectedCurrencyDetails.symbol})`} 
                                        onClick={() => setCurrencyListModalOpen(true)} 
                                    />
                                </li>
                                <li>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-brand-dark">Currency Format</h3>
                                        <p className="text-sm text-gray-500">Customise the number format in the app</p>
                                        <div className="pt-3 space-y-3">
                                            <label className="flex items-center space-x-3 cursor-pointer"><input type="radio" name="currency-format" value="indian" checked={currencyFormat === 'indian'} onChange={() => setFormat('indian')} className="h-5 w-5 text-brand-secondary focus:ring-brand-secondary"/><span className="text-gray-800">Indian (Crore, Lakh)</span></label>
                                            <label className="flex items-center space-x-3 cursor-pointer"><input type="radio" name="currency-format" value="international" checked={currencyFormat === 'international'} onChange={() => setFormat('international')} className="h-5 w-5 text-brand-secondary focus:ring-brand-secondary"/><span className="text-gray-800">International (Billion, Million)</span></label>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <CurrencyListModal isOpen={isCurrencyListModalOpen} onClose={() => setCurrencyListModalOpen(false)} currentCurrency={currencyCode} onSave={setCurrency} />
        </>
    );
};

export default CurrencySettingsPage;
