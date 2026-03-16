
import React, { useState } from 'react';
import { Page } from '../../types';
import { ArrowLeftIcon, ChevronRightIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';

interface ShareSettingsPageProps {
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
        <div>
            <h3 className="font-semibold text-brand-dark">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ToggleSwitch enabled={enabled} onChange={onChange} aria-label={title} />
    </li>
);

const SettingsHeader: React.FC<{ title: string }> = ({ title }) => (
    <li className="bg-gray-100 p-2 px-4 text-sm font-bold text-gray-600 uppercase tracking-wider">
        {title}
    </li>
);

const ShareSettingsPage: React.FC<ShareSettingsPageProps> = ({ onBack, onNavigate }) => {
    const [pdfPreview, setPdfPreview] = useState(true);
    const [pdfFooter, setPdfFooter] = useState(true);
    const [selectedBank, setSelectedBank] = useState('Hdfc Bank');
    const bankAccounts = ['Axis Bank Ltd', 'Hdfc Bank'];

    const handleSaveChanges = () => {
        console.log('Saving Share Settings:', {
            pdfPreview,
            pdfFooter,
            selectedBank,
        });
        alert('Share settings saved successfully!');
    };

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-6">Share</h1>
            
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        <SettingsLinkItem title="Vouchers" description="Customise the Voucher details" onClick={() => onNavigate(Page.VoucherShareSettings)} />
                        <SettingsLinkItem title="Outstanding" description="Enables you to configure Outstanding" onClick={() => onNavigate(Page.SettingDetail, 'Outstanding')} />
                        <SettingsLinkItem title="Ledger Report" description="Enables you to configure while sharing Ledger report" onClick={() => onNavigate(Page.SettingDetail, 'Ledger Report')} />
                        
                        <SettingsHeader title="Additional Settings" />
                        
                        <SettingsLinkItem title="Signature" description="Customize the signature while sending out emails, msgs etc." onClick={() => onNavigate(Page.SettingDetail, 'Signature')} />
                        <SettingsToggleItem title="PDF Preview" description="On selection, it allows you to preview PDF before sending it" enabled={pdfPreview} onChange={setPdfPreview} />
                        <SettingsToggleItem title="PDF Footer" description="On selection, it removes the Biz Analyst Footer while sharing reports" enabled={pdfFooter} onChange={setPdfFooter} />
                        
                        <li className="p-4">
                            <h3 className="font-semibold text-brand-dark">Select Bank Account</h3>
                            <p className="text-sm text-gray-500 mb-3">On Selection, it shows the bank account details in the invoice</p>
                            <div className="space-y-3">
                                {bankAccounts.map(bank => (
                                    <label key={bank} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="bank-account"
                                            value={bank}
                                            checked={selectedBank === bank}
                                            onChange={() => setSelectedBank(bank)}
                                            className="h-4 w-4 border-gray-300 text-brand-secondary focus:ring-brand-secondary"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{bank}</span>
                                    </label>
                                ))}
                            </div>
                        </li>
                    </ul>
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
    );
};

export default ShareSettingsPage;