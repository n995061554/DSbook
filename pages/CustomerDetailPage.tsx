
import React, { useState } from 'react';
import type { Customer, Invoice, CommunicationEvent, HealthScore, AISuggestion } from '../types';
import { HealthStatus, CommunicationType, Channel, InvoiceStatus } from '../types';
// FIX: Changed date-fns imports to be named imports from the main package.
import { format, formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../contexts/CurrencyContext';
// FIX: Changed CogIcon to Cog8ToothIcon and aliased it to CogIcon to fix import error.
import { CheckCircleIcon, XCircleIcon, SparklesIcon, Cog8ToothIcon as CogIcon, ShieldCheckIcon } from '../components/icons';
import GenerateReminderModal from '../components/modals/GenerateReminderModal';

interface CustomerDetailPageProps {
  customer: Customer;
}

interface HealthStatusIndicatorProps {
  healthScore: HealthScore;
}

const HealthStatusIndicator: React.FC<HealthStatusIndicatorProps> = ({ healthScore }) => {
    const status = healthScore.status;
    const styles = {
        [HealthStatus.Excellent]: { bg: 'bg-green-500', text: 'text-green-500', bar: 'bg-green-500' },
        [HealthStatus.Good]: { bg: 'bg-blue-500', text: 'text-blue-500', bar: 'bg-blue-500' },
        [HealthStatus.Warning]: { bg: 'bg-yellow-500', text: 'text-yellow-500', bar: 'bg-yellow-500' },
        [HealthStatus.Poor]: { bg: 'bg-red-500', text: 'text-red-500', bar: 'bg-red-500' },
    };
    return (
        <div className={`p-4 border-2 ${styles[status].bg.replace('bg-', 'border-')} rounded-lg`}>
            <div className="flex justify-between items-center mb-2">
                <span className={`font-bold text-lg ${styles[status].text}`}>{status}</span>
                <span className={`font-black text-2xl ${styles[status].text}`}>{healthScore.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${styles[status].bar} h-2.5 rounded-full`} style={{width: `${healthScore.score}%`}}></div>
            </div>
        </div>
    );
};

const InvoiceRow: React.FC<{ invoice: Invoice, currencyCode: string }> = ({ invoice, currencyCode }) => {
  const statusStyles = {
    [InvoiceStatus.Paid]: 'text-green-600',
    [InvoiceStatus.Overdue]: 'text-red-600',
    [InvoiceStatus.DueSoon]: 'text-yellow-600',
  };
  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-4">{invoice.invoiceNumber}</td>
      <td className="py-3 px-4">{format(new Date(invoice.issueDate), 'dd MMM yyyy')}</td>
      <td className="py-3 px-4">{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</td>
      <td className="py-3 px-4 text-right">{formatCurrency(invoice.amount, currencyCode)}</td>
      <td className={`py-3 px-4 font-semibold ${statusStyles[invoice.status]}`}>{invoice.status}</td>
      <td className="py-3 px-4 text-gray-500 italic">
        {invoice.predictedPaymentDate ? format(new Date(invoice.predictedPaymentDate), 'dd MMM yyyy') : 'N/A'}
      </td>
    </tr>
  );
};

const TimelineEvent: React.FC<{ event: CommunicationEvent }> = ({ event }) => {
    const iconMap: { [key in CommunicationType | Channel]?: string } = {
        [CommunicationType.SoftReminder]: 'bg-blue-500',
        [CommunicationType.FirmReminder]: 'bg-yellow-500',
        [CommunicationType.AICall]: 'bg-purple-500',
        [CommunicationType.LegalNotice]: 'bg-black',
        [CommunicationType.PaymentReceived]: 'bg-green-500',
        [Channel.System]: 'bg-gray-400',
    };
    const channelMap = {
        [Channel.Email]: '📧',
        [Channel.WhatsApp]: '💬',
        [Channel.IVR]: '📞',
        [Channel.AIVoiceCall]: '🤖',
        [Channel.System]: <CogIcon className="w-5 h-5"/>,
    };
    const bgColor = iconMap[event.type] || iconMap[event.channel] || 'bg-gray-500';

  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-4">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-xl`}>
          {channelMap[event.channel]}
        </div>
        <div className="w-px h-full bg-gray-300"></div>
      </div>
      <div className="pb-8 w-full">
        <p className="font-semibold text-brand-dark">{event.type}</p>
        <p className="text-sm text-gray-600">{event.summary}</p>
        <div className="flex items-center text-xs text-gray-400 mt-1">
            <span>{formatDistanceToNow(new Date(event.date), { addSuffix: true })}</span>
            {event.compliance && (
                <div className="flex items-center ml-4 pl-4 border-l border-gray-300" title="Compliance Checks Passed">
                    <ShieldCheckIcon className="w-4 h-4 text-green-500 mr-1"/>
                    <span className="text-gray-500">
                        {event.compliance.dndSafe && 'DND Safe ✔ '}
                        {event.compliance.consentRecorded && 'Consent ✔'}
                    </span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const AISuggestionCard: React.FC<{ suggestion: AISuggestion }> = ({ suggestion }) => (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
        <h4 className="font-bold text-blue-800 flex items-center">
            {suggestion.title}
            {suggestion.isPremium && <span title="Premium Feature"><SparklesIcon className="w-5 h-5 ml-2 text-yellow-500" /></span>}
        </h4>
        <p className="text-sm text-blue-700 mt-1">{suggestion.reason}</p>
        <button className="mt-3 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-blue-600 transition-colors">
            {suggestion.actionLabel}
        </button>
    </div>
);


const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ customer }) => {
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const { currencyCode } = useCurrency();
  
  return (
    <>
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-6">
          <img src={`https://picsum.photos/seed/${customer.id}/80/80`} alt={customer.name} className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white shadow-lg" />
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">{customer.name}</h1>
            <p className="text-lg text-gray-600">{customer.company}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-500">Total Outstanding</h3>
              <p className="text-3xl font-bold text-brand-primary">{formatCurrency(customer.totalOutstanding, currencyCode)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-500">Credit Limit</h3>
              <p className="text-3xl font-bold text-brand-dark">{formatCurrency(customer.creditLimit, currencyCode)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-500">Avg. Payment Days</h3>
              <p className="text-3xl font-bold text-brand-dark">{customer.avgPaymentDays}</p>
            </div>
             <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-gray-500">Tally Ledger ID</h3>
              <p className="text-3xl font-bold text-brand-dark">{customer.tallyLedgerId}</p>
            </div>
          </div>
           <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-brand-dark mb-3">Customer Health</h3>
              <HealthStatusIndicator healthScore={customer.healthScore} />
              <div className="text-sm text-gray-600 mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                      <span>GST Verified:</span>
                      {customer.healthScore.factors.gstVerified ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <XCircleIcon className="w-5 h-5 text-red-500" />}
                  </div>
                   <div className="flex items-center justify-between">
                      <span>CIBIL Score:</span>
                      <span className="font-semibold">{customer.healthScore.factors.cibilScore}</span>
                  </div>
              </div>
           </div>
        </div>

         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
                  <SparklesIcon className="w-6 h-6 text-brand-secondary mr-2" />
                  AI Smart Suggestions
              </h2>
              {customer.aiSuggestions.map(suggestion => <AISuggestionCard key={suggestion.id} suggestion={suggestion} />)}
         </div>


        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-dark">Invoices</h2>
              <button onClick={() => setIsReminderModalOpen(true)} className="bg-brand-secondary text-white font-bold py-1 px-3 text-sm rounded-md hover:bg-brand-primary flex items-center">
                <SparklesIcon className="w-4 h-4 mr-1"/>
                Generate Reminder
              </button>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Issued</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">AI Predicted Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.invoices.map(invoice => <InvoiceRow key={invoice.id} invoice={invoice} currencyCode={currencyCode} />)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Communication Timeline</h2>
            <div className="relative max-h-96 overflow-y-auto pr-2">
               <div className="absolute left-5 top-0 h-full w-px bg-gray-300"></div>
              {customer.communicationHistory.map(event => <TimelineEvent key={event.id} event={event} />)}
            </div>
          </div>
        </div>
      </div>
      <GenerateReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          customer={customer}
      />
    </>
  );
};

export default CustomerDetailPage;
