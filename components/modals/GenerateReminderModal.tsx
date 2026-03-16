
import React, { useState } from 'react';
import { Customer } from '../../types';
import { XMarkIcon, SparklesIcon, WalletIcon, EnvelopeIcon, ChatBubbleLeftEllipsisIcon, PhoneIcon } from '../icons';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/CurrencyContext';

interface GenerateReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer;
}

const ChannelOption: React.FC<{
    name: string, 
    icon: React.ReactNode, 
    description: string, 
    cost: number, 
    isPremium?: boolean, 
    selected: boolean, 
    onSelect: () => void,
    currencyCode: string,
}> = ({ name, icon, description, cost, isPremium, selected, onSelect, currencyCode }) => {
    return (
        <div 
            onClick={onSelect}
            className={`p-4 border-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${selected ? 'border-brand-secondary bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
        >
            <div className="flex items-center">
                <div className="text-brand-primary">{icon}</div>
                <div className="ml-4">
                    <h4 className="font-semibold text-brand-dark flex items-center">
                        {name}
                        {isPremium && <SparklesIcon className="w-4 h-4 ml-2 text-yellow-500" />}
                    </h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-brand-dark">{cost > 0 ? formatCurrency(cost, currencyCode) : 'Free'}</p>
                {isPremium && <p className="text-xs text-blue-600">from wallet</p>}
            </div>
        </div>
    )
}

const GenerateReminderModal: React.FC<GenerateReminderModalProps> = ({ isOpen, onClose, customer }) => {
    const [channels, setChannels] = useState<string[]>([]);
    const { currencyCode } = useCurrency();
    const walletBalance = 12530; // Mock balance

    const costs = {
        'Email': 0,
        'WhatsApp': 1, // Example cost in INR
        'AI Voice Call': 5, // Example cost
    };

    const handleChannelToggle = (channel: string) => {
        setChannels(prev => 
            prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
        );
    };

    const totalCost = channels.reduce((sum, channel) => sum + (costs[channel as keyof typeof costs] || 0), 0);
    const canAfford = walletBalance >= totalCost;

    const handleSend = () => {
        if (!canAfford) {
            alert("Insufficient wallet balance.");
            return;
        }
        alert(`Sending reminder via ${channels.join(', ')} for a total cost of ${formatCurrency(totalCost, currencyCode)}.`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-brand-dark flex items-center">
                        <SparklesIcon className="w-7 h-7 mr-3 text-brand-secondary" />
                        Generate Reminder
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <p className="text-gray-600 mb-4">Send a one-time payment reminder to <span className="font-bold text-brand-dark">{customer.name}</span>.</p>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Channel(s)</label>
                        <div className="space-y-3">
                            <ChannelOption 
                                name="Email"
                                icon={<EnvelopeIcon className="w-6 h-6"/>}
                                description="Standard email reminder."
                                cost={costs['Email']}
                                selected={channels.includes('Email')}
                                onSelect={() => handleChannelToggle('Email')}
                                currencyCode={currencyCode}
                            />
                            <ChannelOption 
                                name="WhatsApp"
                                icon={<ChatBubbleLeftEllipsisIcon className="w-6 h-6"/>}
                                description="Direct message via WhatsApp."
                                cost={costs['WhatsApp']}
                                isPremium
                                selected={channels.includes('WhatsApp')}
                                onSelect={() => handleChannelToggle('WhatsApp')}
                                currencyCode={currencyCode}
                            />
                            <ChannelOption 
                                name="AI Voice Call"
                                icon={<PhoneIcon className="w-6 h-6"/>}
                                description="Automated voice call with details."
                                cost={costs['AI Voice Call']}
                                isPremium
                                selected={channels.includes('AI Voice Call')}
                                onSelect={() => handleChannelToggle('AI Voice Call')}
                                currencyCode={currencyCode}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                         <div className="flex justify-between items-center">
                            <span className="font-semibold text-brand-dark">Total Cost:</span>
                            <span className="font-bold text-xl text-brand-primary">{formatCurrency(totalCost, currencyCode)}</span>
                        </div>
                         <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-gray-600 flex items-center"><WalletIcon className="w-4 h-4 mr-1"/> Wallet Balance:</span>
                            <span className={`font-semibold ${canAfford ? 'text-gray-800' : 'text-accent-red'}`}>{formatCurrency(walletBalance, currencyCode)}</span>
                        </div>
                         {!canAfford && <p className="text-xs text-accent-red mt-2 text-center">Insufficient balance. Please add funds to your wallet.</p>}
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end items-center space-x-3 p-6 border-t border-gray-200">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSend} disabled={channels.length === 0 || !canAfford} className="bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary disabled:bg-gray-400 transition-colors">
                        Send Reminder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateReminderModal;
