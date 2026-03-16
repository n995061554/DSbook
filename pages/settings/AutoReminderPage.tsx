
import React, { useState } from 'react';
import { ArrowLeftIcon, SparklesIcon, DocumentArrowDownIcon, UserGroupIcon, PencilIcon, WalletIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import FrequencyEditor, { type Frequency } from '../../components/settings/FrequencyEditor';
import GenerateNoticeModal from '../../components/modals/GenerateNoticeModal';
import { formatCurrency } from '../../utils/formatters';
import { Customer, Page } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';

interface AutoReminderPageProps {
    onBack: () => void;
    onNavigate: (page: Page) => void;
    customers: Customer[];
}

const PremiumFeatureToggle: React.FC<{ title: string, description: string, enabled: boolean, onChange: (val: boolean) => void }> = ({ title, description, enabled, onChange }) => (
    <div className="flex justify-between items-start p-4 border border-blue-200 bg-blue-50 rounded-lg">
        <div>
             <h4 className="font-bold text-brand-primary flex items-center">
                {title}
                <SparklesIcon className="w-5 h-5 ml-2 text-yellow-500" />
            </h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <ToggleSwitch enabled={enabled} onChange={onChange} />
    </div>
);


const AutoReminderPage: React.FC<AutoReminderPageProps> = ({ onBack, onNavigate, customers }) => {
    const [smartDelay, setSmartDelay] = useState(true);
    const [isNoticeModalOpen, setNoticeModalOpen] = useState(false);
    const { currencyCode } = useCurrency();
    
    const [frequencies, setFrequencies] = useState<{
        sms: Frequency;
        whatsapp: Frequency;
        email: Frequency;
        aiReminder: Frequency;
        aiCall: Frequency;
        ivr: Frequency;
    }>({
        sms: { mode: 'daily', days: [], time: '10:00' },
        whatsapp: { mode: 'weekly', days: ['Mon', 'Fri'], time: '14:00' },
        email: { mode: 'monthly', days: ['15'], time: '09:00' },
        aiReminder: { mode: 'off', days: [], time: '11:00' },
        aiCall: { mode: 'off', days: [], time: '15:00' },
        ivr: { mode: 'off', days: [], time: '16:00' },
    });

    const [aiManaged, setAiManaged] = useState(true);

    const handleSaveChanges = () => {
        console.log('Saving settings:', { smartDelay, frequencies });
        alert('Auto-reminder settings saved successfully!');
    };

    return (
        <>
            <div className="p-6 md:p-8 bg-brand-light">
                <div className="max-w-4xl mx-auto">
                    <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Settings
                    </button>
                
                    <div className="flex items-center mb-2">
                        <h1 className="text-3xl font-bold text-brand-dark">AI Auto-Reminder</h1>
                        <SparklesIcon className="w-7 h-7 ml-3 text-brand-secondary" />
                    </div>
                    <p className="text-gray-600 mb-8">Set up intelligent, automated communication workflows for your outstanding invoices.</p>
                
                    {/* Main Links */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <button onClick={() => setNoticeModalOpen(true)} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
                            <DocumentArrowDownIcon className="w-7 h-7 text-accent-red mb-2"/>
                            <h3 className="font-bold text-brand-dark">Generate Legal Notice</h3>
                            <p className="text-sm text-gray-500">For customers not paying since long.</p>
                        </button>
                         <button onClick={() => onNavigate(Page.ManageContacts)} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
                            <UserGroupIcon className="w-7 h-7 text-brand-primary mb-2"/>
                            <h3 className="font-bold text-brand-dark">Manage Contacts</h3>
                            <p className="text-sm text-gray-500">Edit auto-reminder status per customer.</p>
                        </button>
                         <button onClick={() => onNavigate(Page.CustomizeCommunication)} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
                            <PencilIcon className="w-7 h-7 text-brand-secondary mb-2"/>
                            <h3 className="font-bold text-brand-dark">Customise Communication</h3>
                            <p className="text-sm text-gray-500">Modify templates and message settings.</p>
                        </button>
                    </div>

                    {/* AI & Premium Features */}
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">AI & Premium Features</h2>
                        <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                            <WalletIcon className="w-8 h-8 mr-4 text-brand-primary"/>
                            <div>
                                <p className="text-sm text-blue-800">Premium features are charged from your wallet.</p>
                                <span className="font-bold text-brand-dark">Current Balance: {formatCurrency(12530, currencyCode)}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <PremiumFeatureToggle title="AI Managed Escalation" description="Let AI dynamically choose the best channel and time based on customer behavior." enabled={aiManaged} onChange={setAiManaged} />
                            <PremiumFeatureToggle title="Enable Smart Delay" description="Allow AI to postpone reminders if payment is predicted to be imminent." enabled={smartDelay} onChange={setSmartDelay} />
                        </div>
                    </div>

                    {/* Channel Frequency Settings */}
                    <div className="space-y-6">
                        <FrequencyEditor title="SMS" icon="sms" isPremium={false} frequency={frequencies.sms} onFrequencyChange={(f) => setFrequencies(p => ({...p, sms: f}))} />
                        <FrequencyEditor title="WhatsApp" icon="whatsapp" isPremium={true} frequency={frequencies.whatsapp} onFrequencyChange={(f) => setFrequencies(p => ({...p, whatsapp: f}))} />
                        <FrequencyEditor title="Email" icon="email" isPremium={false} frequency={frequencies.email} onFrequencyChange={(f) => setFrequencies(p => ({...p, email: f}))} />
                        <FrequencyEditor title="AI Reminder" icon="ai" isPremium={true} frequency={frequencies.aiReminder} onFrequencyChange={(f) => setFrequencies(p => ({...p, aiReminder: f}))} />
                        <FrequencyEditor title="AI Call Assist" icon="aicall" isPremium={true} frequency={frequencies.aiCall} onFrequencyChange={(f) => setFrequencies(p => ({...p, aiCall: f}))} />
                        <FrequencyEditor title="IVR Call Assist" icon="ivr" isPremium={true} frequency={frequencies.ivr} onFrequencyChange={(f) => setFrequencies(p => ({...p, ivr: f}))} />
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={handleSaveChanges}
                            className="bg-brand-secondary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors shadow-md hover:shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
             <GenerateNoticeModal 
                isOpen={isNoticeModalOpen}
                onClose={() => setNoticeModalOpen(false)}
                customers={customers}
            />
        </>
    );
};

export default AutoReminderPage;