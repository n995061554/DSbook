
import React from 'react';
import { EnvelopeIcon, ChatBubbleLeftEllipsisIcon, PhoneIcon, SparklesIcon } from '../icons';

type FrequencyMode = 'off' | 'daily' | 'weekly' | 'monthly';
type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface Frequency {
    mode: FrequencyMode;
    days: string[];
    time: string;
}

interface FrequencyEditorProps {
    title: string;
    icon: 'sms' | 'whatsapp' | 'email' | 'ai' | 'aicall' | 'ivr';
    isPremium: boolean;
    frequency: Frequency;
    onFrequencyChange: (frequency: Frequency) => void;
}

const iconMap = {
    sms: <EnvelopeIcon className="w-6 h-6" />,
    whatsapp: <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />,
    email: <EnvelopeIcon className="w-6 h-6" />,
    ai: <SparklesIcon className="w-6 h-6" />,
    aicall: <PhoneIcon className="w-6 h-6" />,
    ivr: <PhoneIcon className="w-6 h-6" />,
};

const weekDays: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthDays = Array.from({ length: 31 }, (_, i) => String(i + 1));

const FrequencyEditor: React.FC<FrequencyEditorProps> = ({ title, icon, isPremium, frequency, onFrequencyChange }) => {
    
    const handleModeChange = (mode: FrequencyMode) => {
        onFrequencyChange({ ...frequency, mode, days: [] });
    };

    const handleDayToggle = (day: string) => {
        const days = frequency.days.includes(day)
            ? frequency.days.filter(d => d !== day)
            : [...frequency.days, day];
        onFrequencyChange({ ...frequency, days });
    };
    
    const handleTimeChange = (time: string) => {
         onFrequencyChange({ ...frequency, time });
    };

    const renderDaySelector = () => {
        if (frequency.mode === 'weekly') {
            return (
                <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                        <button key={day} onClick={() => handleDayToggle(day)} className={`w-10 h-10 rounded-full text-sm font-semibold border-2 ${frequency.days.includes(day) ? 'bg-brand-secondary text-white border-brand-secondary' : 'bg-white text-gray-700 border-gray-300'}`}>
                            {day}
                        </button>
                    ))}
                </div>
            );
        }
        if (frequency.mode === 'monthly') {
            return (
                <div className="flex flex-wrap gap-2">
                    {monthDays.map(day => (
                         <button key={day} onClick={() => handleDayToggle(day)} className={`w-10 h-10 rounded-full text-sm font-semibold border-2 ${frequency.days.includes(day) ? 'bg-brand-secondary text-white border-brand-secondary' : 'bg-white text-gray-700 border-gray-300'}`}>
                            {day}
                        </button>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-brand-dark flex items-center">
                    <span className="mr-3 text-brand-primary">{iconMap[icon]}</span>
                    {title}
                    {isPremium && <SparklesIcon className="w-5 h-5 ml-2 text-yellow-500" />}
                </h3>
                {isPremium && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">PREMIUM</span>}
            </div>
            
            <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Frequency:</label>
                <div className="flex border border-gray-300 rounded-lg p-0.5">
                    {(['off', 'daily', 'weekly', 'monthly'] as FrequencyMode[]).map(mode => (
                        <button key={mode} onClick={() => handleModeChange(mode)} className={`px-3 py-1 text-sm rounded-md capitalize ${frequency.mode === mode ? 'bg-brand-primary text-white' : 'text-gray-600'}`}>
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {frequency.mode !== 'off' && (
                <div className="space-y-4">
                    {renderDaySelector()}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mr-4">Send at:</label>
                         <input type="time" value={frequency.time} onChange={e => handleTimeChange(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FrequencyEditor;
