
import React, { useState } from 'react';
import { ArrowLeftIcon, SparklesIcon } from '../../components/icons';

interface DateSettingsPageProps {
    onBack: () => void;
}

const DateSettingsPage: React.FC<DateSettingsPageProps> = ({ onBack }) => {
    const [defaultDateFilter, setDefaultDateFilter] = useState('This Month');
    const [financialYearMode, setFinancialYearMode] = useState<'indian' | 'custom'>('indian');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

    const dateFilters = [
        'Today', 'Yesterday', 'This Week', 'This Month', 
        'Last Month', 'This Quarter', 'This Year', 'Last Year', 'All'
    ];
    
    const mockSuggestions = [
        "Automated period-locking after a set date to prevent accidental back-dated entries.",
        "Set up custom reporting periods like 'Diwali Season' or 'Q1 Campaign' for focused analysis.",
        "AI-powered alerts for upcoming fiscal year-end tasks and compliance deadlines.",
        "A dashboard widget to visualize progress within the current financial year or selected period."
    ];

    const handleGenerateIdeas = () => {
        setIsGeneratingIdeas(true);
        setAiSuggestions([]);
        setTimeout(() => {
            setAiSuggestions(mockSuggestions);
            setIsGeneratingIdeas(false);
        }, 1500);
    };

    const handleSaveChanges = () => {
        console.log('Saving Date Settings:', {
            defaultDateFilter,
            financialYearMode,
            customStartDate,
            customEndDate,
        });
        alert('Date settings saved successfully!');
    };

    return (
        <div className="p-6 md:p-8 bg-brand-light">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Settings
                </button>
            
                <h1 className="text-3xl font-bold text-brand-dark mb-8">Date Settings</h1>
            
                <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8 space-y-10">
                    {/* Default Date Filter Section */}
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark mb-2">Default Date Filter</h2>
                        <p className="text-sm text-gray-600 mb-4">Set the default date range that appears across your reports and dashboards.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {dateFilters.map(filter => (
                                <button 
                                    key={filter} 
                                    onClick={() => setDefaultDateFilter(filter)} 
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-center border-2 ${
                                        defaultDateFilter === filter 
                                        ? 'bg-brand-primary text-white border-brand-primary shadow' 
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Financial Year Section */}
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark mb-2">Financial Year Configuration</h2>
                        <p className="text-sm text-gray-600 mb-4">Define your financial year for accurate period-based reporting.</p>
                        <div className="space-y-4">
                            <div className="flex items-center p-3 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
                                <input type="radio" id="fy-indian" name="fy-mode" value="indian" checked={financialYearMode === 'indian'} onChange={() => setFinancialYearMode('indian')} className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary"/>
                                <label htmlFor="fy-indian" className="ml-3 text-sm font-medium text-gray-700">
                                    Indian Financial Year (Apr 1st - Mar 31st)
                                </label>
                            </div>
                            <div className="p-3 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
                                <div className="flex items-center">
                                     <input type="radio" id="fy-custom" name="fy-mode" value="custom" checked={financialYearMode === 'custom'} onChange={() => setFinancialYearMode('custom')} className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary"/>
                                    <label htmlFor="fy-custom" className="ml-3 text-sm font-medium text-gray-700">
                                        Customize Financial Year
                                    </label>
                                </div>
                                {financialYearMode === 'custom' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pl-7 animate-fade-in">
                                        <div>
                                            <label htmlFor="start-date" className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                                            <input type="date" id="start-date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                        </div>
                                         <div>
                                            <label htmlFor="end-date" className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                                            <input type="date" id="end-date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Suggestions Section */}
                    <div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-bold text-brand-primary flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-yellow-500"/>AI-Powered Suggestions</h4>
                            <p className="text-sm text-gray-600 mt-1 mb-3">Let TallyFi AI suggest ways to enhance your date and period management.</p>
                            <button onClick={handleGenerateIdeas} disabled={isGeneratingIdeas} className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary disabled:bg-gray-400 flex items-center justify-center min-w-[140px]">
                                {isGeneratingIdeas ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Thinking...
                                    </>
                                ) : 'Generate Ideas'}
                            </button>
                             {aiSuggestions.length > 0 && (
                                <div className="mt-4 space-y-2 animate-fade-in">
                                    {aiSuggestions.map((idea, index) => (
                                        <p key={index} className="text-sm text-blue-800 bg-blue-100 p-2 rounded-md">💡 {idea}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
             <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(-5px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DateSettingsPage;
