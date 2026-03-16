
import React, { useMemo } from 'react';
import { Customer } from '../types';
import { formatCurrency, formatCurrencyShort } from '../utils/formatters';
import { useCurrency } from '../contexts/CurrencyContext';
import { BanknotesIcon, ClockIcon, ChartPieIcon, ShieldCheckIcon } from './icons';

interface KPIStripProps {
    customers: Customer[];
    loading: boolean;
}

const KPICard: React.FC<{ icon: React.ReactNode, title: string, value: string, isLoading: boolean }> = ({ icon, title, value, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
                <div className="flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-xl font-bold text-brand-dark">{value}</p>
            </div>
        </div>
    );
};


const KPIStrip: React.FC<KPIStripProps> = ({ customers, loading }) => {
    const { currencyCode } = useCurrency();

    const kpiData = useMemo(() => {
        if (!customers || customers.length === 0) {
            return {
                totalOutstanding: 0,
                overduePercentage: 0,
                avgDso: 0,
                recoveredThisMonth: 0,
            };
        }

        const totalOutstanding = customers.reduce((sum, c) => sum + c.totalOutstanding, 0);
        const totalInvoiceValue = customers.reduce((sum, c) => sum + c.invoices.reduce((invSum, inv) => invSum + inv.amount, 0), 0);
        
        const overdueValue = customers.reduce((sum, c) => 
            sum + c.invoices
                .filter(inv => inv.status === 'Overdue')
                .reduce((invSum, inv) => invSum + inv.amount, 0), 
        0);

        const overduePercentage = totalOutstanding > 0 ? (overdueValue / totalOutstanding) * 100 : 0;
        
        const totalAvgPaymentDays = customers.reduce((sum, c) => sum + c.avgPaymentDays, 0);
        const avgDso = customers.length > 0 ? totalAvgPaymentDays / customers.length : 0;

        // Mocking recovery for this month
        const recoveredThisMonth = totalOutstanding * 0.15 * (0.8 + Math.random() * 0.4);

        return {
            totalOutstanding,
            overduePercentage,
            avgDso,
            recoveredThisMonth,
        };
    }, [customers]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard 
                icon={<BanknotesIcon className="w-6 h-6 text-green-600"/>}
                title="Total Outstanding"
                value={formatCurrencyShort(kpiData.totalOutstanding)}
                isLoading={loading}
            />
            <KPICard 
                icon={<ChartPieIcon className="w-6 h-6 text-green-600"/>}
                title="Overdue %"
                value={`${kpiData.overduePercentage.toFixed(1)}%`}
                isLoading={loading}
            />
            <KPICard 
                icon={<ClockIcon className="w-6 h-6 text-green-600"/>}
                title="Avg. DSO"
                value={`${kpiData.avgDso.toFixed(0)} days`}
                isLoading={loading}
            />
            <KPICard 
                icon={<ShieldCheckIcon className="w-6 h-6 text-green-600"/>}
                title="Recovery This Month"
                value={formatCurrencyShort(kpiData.recoveredThisMonth)}
                isLoading={loading}
            />
        </div>
    );
};

export default KPIStrip;
