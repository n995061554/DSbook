
import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { 
    DocumentArrowUpIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon,
    PhoneIcon,
    ScaleIcon,
    UsersIcon,
    BuildingLibraryIcon,
    CreditCardIcon,
    ShoppingCartIcon,
    ReceiptPercentIcon,
    ReceiptRefundIcon,
    ArrowUpOnSquareIcon,
    BanknotesIcon,
} from '../components/icons';
import { Page } from '../types';
import KPIStrip from '../components/KPIStrip';
import { Customer } from '../types';

interface ServicesPageProps {
    category: 'Payment Recovery' | 'Trade Management';
    onNavigate: (page: Page) => void;
    customers: Customer[];
    loading: boolean;
}

// FIX: Added interface for trade management service to make onClickPage optional.
interface TradeManagementService {
    title: string;
    description: string;
    icon: React.ReactNode;
    tag?: 'HOT' | 'POPULAR' | 'NEW' | 'TRY';
    onClickPage?: Page;
}

const recoveryWorkflowData = {
    'Stage 1 – Preventive': [
         { 
            title: 'Digital Followup',
            description: 'Automated digital communication for payment reminders and notifications.',
            icon: <MagnifyingGlassIcon className="w-6 h-6" />,
            tag: 'POPULAR',
            onClickPage: Page.AutoReminderSettings,
        },
        { 
            title: 'Transaction Followup',
            description: 'System with configurable schedules for multi-channel communication.',
            icon: <DocumentTextIcon className="w-6 h-6" />,
            tag: 'NEW',
            onClickPage: Page.Customers,
        },
    ],
    'Stage 2 – Engagement': [
        { 
            title: 'Call All Time',
            description: '24/7 AI calling service for persistent debt collection and support.',
            icon: <PhoneIcon className="w-6 h-6" />,
            onClickPage: Page.BuyCredits,
        },
        { 
            title: 'Find Someone',
            description: 'Advanced services to locate debtors using comprehensive databases.',
            icon: <UsersIcon className="w-6 h-6" />,
            onClickPage: Page.FindSomeone,
        },
    ],
    'Stage 3 – Escalation': [
         { 
            title: 'Legal Notice',
            description: 'Generate and send legally compliant notices for debt recovery.',
            icon: <ScaleIcon className="w-6 h-6" />,
            tag: 'NEW',
            onClickPage: Page.AutoReminderSettings,
        },
        { 
            title: 'Pre-Legal Check',
            description: 'Comprehensive underwriting and risk assessment before legal proceedings.',
            icon: <MagnifyingGlassIcon className="w-6 h-6" />,
            onClickPage: Page.PreLegalCheck,
        },
        { 
            title: 'Arbitration',
            description: 'Alternative dispute resolution through arbitration for faster settlements.',
            icon: <ScaleIcon className="w-6 h-6" />,
            onClickPage: Page.Arbitration,
        },
        { 
            title: 'Legal Process Finance',
            description: 'Financing solutions for legal proceedings and debt recovery processes.',
            icon: <BanknotesIcon className="w-6 h-6" />,
            onClickPage: Page.LegalProcessFinance,
        },
         { 
            title: 'Expert Opinion',
            description: 'Professional legal advice and strategic guidance from experts.',
            icon: <UsersIcon className="w-6 h-6" />,
            onClickPage: Page.ExpertOpinion,
        },
    ],
    'Stage 4 – Enforcement': [
         { 
            title: 'National Debt Registry',
            description: 'Check and upload payment default records to global registries.',
            icon: <DocumentArrowUpIcon className="w-6 h-6" />,
            tag: 'HOT',
            onClickPage: Page.NationalDebtRegistry,
        },
    ]
} as const;


const tradeManagementData: readonly TradeManagementService[] = [
    { 
        title: 'Debtors (My Buyers)',
        description: 'Manage and track your buyers, monitor outstanding receivables, and analyze customer payment behavior.',
        icon: <UsersIcon className="w-6 h-6" />,
        onClickPage: Page.Customers,
    },
    { 
        title: 'My Sales',
        description: 'Track all your sales transactions, generate invoices, and monitor revenue streams with analytics.',
        icon: <DocumentTextIcon className="w-6 h-6" />,
    },
    { 
        title: 'Creditors (My Sellers)',
        description: 'Manage supplier relationships, track payables, and optimize vendor payment schedules.',
        icon: <BuildingLibraryIcon className="w-6 h-6" />,
    },
    { 
        title: 'My Purchases',
        description: 'Monitor purchase orders, track inventory procurement, and analyze spending patterns.',
        icon: <ShoppingCartIcon className="w-6 h-6" />,
    },
    { 
        title: 'My Lender Transaction',
        description: 'Initiate and manage lending transactions, track loan disbursements, and monitor repayment schedules.',
        icon: <CreditCardIcon className="w-6 h-6" />,
        tag: 'NEW',
    },
    { 
        title: 'Receive Payment',
        description: 'Process incoming payments, reconcile accounts, and manage multiple payment methods.',
        icon: <ReceiptPercentIcon className="w-6 h-6" />,
    },
    { 
        title: 'Goods Return',
        description: 'Handle return merchandise authorizations, track returned goods, and process refunds.',
        icon: <ReceiptRefundIcon className="w-6 h-6" />,
    },
    { 
        title: 'Credit Note',
        description: 'Generate and manage credit notes, handle billing adjustments, and maintain accurate financial records.',
        icon: <DocumentTextIcon className="w-6 h-6" />,
    },
    { 
        title: 'Received Statement',
        description: 'Review and reconcile supplier statements, verify transaction accuracy, and maintain complete audit trails.',
        icon: <ArrowUpOnSquareIcon className="w-6 h-6" />,
        tag: 'TRY',
    },
];


const ServicesPage: React.FC<ServicesPageProps> = ({ category, onNavigate, customers, loading }) => {

    if (category === 'Payment Recovery') {
        const itemCount = Object.values(recoveryWorkflowData).reduce((sum, stage) => sum + stage.length, 0);
        return (
            <div className="p-6 md:p-8">
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Dashboard</h1>
                <p className="text-gray-500 mb-6">Your AI-Powered Accounts.</p>
                
                <KPIStrip customers={customers} loading={loading} />

                {Object.entries(recoveryWorkflowData).map(([stage, services]) => (
                    <div key={stage} className="mb-10">
                        <h2 className="text-xl font-bold text-brand-dark mb-4 pb-2 border-b border-gray-200">{stage}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {services.map(service => (
                                <ServiceCard key={service.title} {...service} onClick={() => onNavigate(service.onClickPage)} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const itemCount = tradeManagementData.length;
    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark">{category}</h1>
                    <p className="text-gray-500">Excellent products for you ({itemCount} items)</p>
                </div>
                <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 text-sm">
                    Back
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tradeManagementData.map(service => (
                    <ServiceCard key={service.title} {...service} onClick={service.onClickPage ? () => onNavigate(service.onClickPage) : undefined} />
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;