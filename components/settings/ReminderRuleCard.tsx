
import React from 'react';
import ToggleSwitch from '../ToggleSwitch';
import { EnvelopeIcon, ChatBubbleLeftEllipsisIcon, SparklesIcon, PhoneIcon } from '../icons';

type Channel = 'Email' | 'WhatsApp' | 'AI Voice Call';

interface ReminderRuleCardProps {
  title: string;
  description: string;
  timeframeLabel: string;
  enabled: boolean;
  days: number;
  channels: string[];
  onToggle: (enabled: boolean) => void;
  onDaysChange: (days: number) => void;
  onChannelChange: (channel: Channel, checked: boolean) => void;
  isAiManaged?: boolean;
}

const ChannelCheckbox: React.FC<{
    id: string;
    label: Channel;
    icon: React.ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}> = ({ id, label, icon, checked, onChange, disabled }) => (
    <div className="flex-1">
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
            disabled={disabled}
        />
        <label
            htmlFor={id}
            className={`flex items-center justify-center p-3 w-full rounded-lg border-2 transition-colors ${
                disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'
            } ${
                checked 
                ? 'border-brand-secondary bg-blue-50 text-brand-primary' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
        >
            {icon}
            <span className="ml-2 font-medium text-sm">{label}</span>
        </label>
    </div>
);


const ReminderRuleCard: React.FC<ReminderRuleCardProps> = ({
  title,
  description,
  timeframeLabel,
  enabled,
  days,
  channels,
  onToggle,
  onDaysChange,
  onChannelChange,
  isAiManaged,
}) => {
  const cardId = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`p-6 rounded-lg border-2 transition-opacity ${enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className={`text-lg font-bold text-brand-dark flex items-center`}>
                    {title}
                    {isAiManaged && <SparklesIcon className="w-5 h-5 ml-2 text-yellow-500" />}
                </h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <ToggleSwitch enabled={enabled} onChange={onToggle} aria-label={`Enable ${title}`} />
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${!enabled && 'opacity-50 pointer-events-none'}`}>
            <div>
                <label htmlFor={`${cardId}-days`} className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
                <div className="flex items-center">
                    <input 
                        type="number" 
                        id={`${cardId}-days`}
                        value={days}
                        onChange={(e) => onDaysChange(parseInt(e.target.value, 10) || 0)}
                        className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"
                        disabled={!enabled}
                        min="0"
                    />
                    <span className="ml-3 text-sm text-gray-600">{timeframeLabel}</span>
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
                 <div className="flex space-x-2">
                    <ChannelCheckbox 
                        id={`${cardId}-email`}
                        label="Email"
                        icon={<EnvelopeIcon className="w-5 h-5" />}
                        checked={channels.includes('Email')}
                        onChange={(checked) => onChannelChange('Email', checked)}
                        disabled={isAiManaged}
                    />
                    <ChannelCheckbox 
                        id={`${cardId}-whatsapp`}
                        label="WhatsApp"
                        icon={<ChatBubbleLeftEllipsisIcon className="w-5 h-5" />}
                        checked={channels.includes('WhatsApp')}
                        onChange={(checked) => onChannelChange('WhatsApp', checked)}
                         disabled={isAiManaged}
                    />
                     <ChannelCheckbox 
                        id={`${cardId}-ai-call`}
                        label="AI Voice Call"
                        icon={<PhoneIcon className="w-5 h-5" />}
                        checked={channels.includes('AI Voice Call')}
                        onChange={(checked) => onChannelChange('AI Voice Call', checked)}
                         disabled={isAiManaged}
                    />
                 </div>
                 {isAiManaged && <p className="text-xs text-gray-400 mt-2">AI will select the optimal channel(s) from the enabled options.</p>}
            </div>
        </div>
    </div>
  );
};

export default ReminderRuleCard;
