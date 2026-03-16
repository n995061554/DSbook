
import React, { useState } from 'react';
import { ArrowLeftIcon, PhoneIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../components/icons';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/formatters';

interface BuyCreditsPageProps {
  onBack: () => void;
}

const creditPacks = [
    { calls: 3000, price: 5000 },
    { calls: 7000, price: 10000 },
    { calls: 12000, price: 15000 },
];

const BuyCreditsPage: React.FC<BuyCreditsPageProps> = ({ onBack }) => {
    const [selectedPack, setSelectedPack] = useState(creditPacks[0]);
    const { currencyCode } = useCurrency();
    const availableBalance = 926; // Mock available balance

    const insufficientAmount = Math.max(0, selectedPack.price - availableBalance);

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Buy Call Credits</h1>
                <p className="text-gray-600 mb-8">Top-up your balance for pay-per-answer calling.</p>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500">Available Balance</p>
                        <p className="text-4xl font-bold text-brand-dark">{formatCurrency(availableBalance, currencyCode)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {creditPacks.map(pack => (
                            <button 
                                key={pack.calls}
                                onClick={() => setSelectedPack(pack)}
                                className={`relative p-6 border-2 rounded-lg text-left transition-all ${selectedPack.calls === pack.calls ? 'border-brand-primary bg-green-50 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                            >
                                {selectedPack.calls === pack.calls && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center">
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="flex items-center mb-1">
                                    <PhoneIcon className="w-5 h-5 text-brand-primary" />
                                    <p className="ml-2 text-xl font-bold text-brand-dark">{pack.calls.toLocaleString()} Calls</p>
                                </div>
                                <p className="text-2xl font-bold text-brand-dark">{formatCurrency(pack.price, currencyCode)}</p>
                                <p className="text-xs text-gray-500 mt-1">Deducted from main balance</p>
                            </button>
                        ))}
                    </div>

                    {insufficientAmount > 0 && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
                                <div>
                                    <p className="font-bold text-red-700">Insufficient Balance</p>
                                    <p className="text-sm text-red-600">You need {formatCurrency(insufficientAmount, currencyCode)} more to purchase {selectedPack.calls.toLocaleString()} calls</p>
                                </div>
                            </div>
                            <button className="bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary text-sm">
                                Add Funds
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyCreditsPage;
