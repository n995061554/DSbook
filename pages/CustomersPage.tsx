
import React, { useState, useMemo } from 'react';
import type { Customer } from '../types';
import { HealthStatus, Page } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../contexts/CurrencyContext';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '../components/icons';

interface CustomersPageProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  loading: boolean;
  onNavigate: (page: Page) => void;
}

const HealthStatusBadge: React.FC<{ status: HealthStatus }> = ({ status }) => {
    const statusStyles = {
        [HealthStatus.Excellent]: 'bg-green-100 text-green-800',
        [HealthStatus.Good]: 'bg-blue-100 text-blue-800',
        [HealthStatus.Warning]: 'bg-yellow-100 text-yellow-800',
        [HealthStatus.Poor]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
}

const getRiskColor = (score: number) => {
    if (score > 70) return 'text-red-600';
    if (score > 40) return 'text-yellow-600';
    return 'text-green-600';
};

const CustomersPage: React.FC<CustomersPageProps> = ({ customers, onSelectCustomer, loading, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Customer | 'healthScore' | 'riskScore', direction: 'asc' | 'desc' } | null>({ key: 'riskScore', direction: 'desc' });
    const { currencyCode } = useCurrency();

    const sortedCustomers = useMemo(() => {
        let sortableItems = [...customers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === 'healthScore') aValue = a.healthScore.score;
                else if (sortConfig.key === 'riskScore') aValue = a.riskScore.score;
                else {
                    aValue = a[sortConfig.key as keyof Customer];
                    bValue = b[sortConfig.key as keyof Customer];
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [customers, sortConfig]);

    const filteredCustomers = sortedCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const requestSort = (key: keyof Customer | 'healthScore' | 'riskScore') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Customer | 'healthScore' | 'riskScore') => {
        if (!sortConfig || sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    if (loading) {
        return (
             <div className="p-8">
                 <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-6 animate-pulse"></div>
                 <div className="bg-white shadow-lg rounded-xl overflow-hidden animate-pulse">
                     <div className="h-16 bg-gray-200 rounded-t-xl"></div>
                     {[...Array(10)].map((_, i) => <div key={i} className="h-14 bg-gray-100 border-b border-gray-200"></div>)}
                 </div>
             </div>
        );
    }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-brand-dark mb-6">Debtors (My Buyers)</h1>
       <div className="mb-4">
            <input
                type="text"
                placeholder="Search by name or company..."
                className="w-full max-w-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort('name')}>Customer {getSortIndicator('name')}</th>
              <th className="py-3 px-6 text-right cursor-pointer" onClick={() => requestSort('totalOutstanding')}>Outstanding {getSortIndicator('totalOutstanding')}</th>
              <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort('avgPaymentDays')}>Avg. Pay Days {getSortIndicator('avgPaymentDays')}</th>
              <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort('riskScore')}>Risk Score {getSortIndicator('riskScore')}</th>
              <th className="py-3 px-6 text-left">Recommended Action</th>
              <th className="py-3 px-6 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="text-brand-dark text-sm font-light">
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="border-b border-gray-200 hover:bg-brand-light transition-colors duration-200">
                <td className="py-4 px-6 text-left">
                  <div className="flex items-center">
                    <div className="font-semibold">{customer.name}</div>
                  </div>
                </td>
                <td className="py-3 px-6 text-right font-semibold">{formatCurrency(customer.totalOutstanding, currencyCode)}</td>
                <td className="py-3 px-6 text-center">{customer.avgPaymentDays} days</td>
                <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center">
                        <span className={`font-bold ${getRiskColor(customer.riskScore.score)}`}>{customer.riskScore.score}</span>
                        {customer.riskScore.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4 ml-1 text-red-500" />}
                        {customer.riskScore.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4 ml-1 text-green-500" />}
                    </div>
                </td>
                 <td className="py-3 px-6 text-left">
                    <button onClick={() => onNavigate(customer.recommendedAction.page as Page)} className="bg-green-100 text-green-800 text-xs font-semibold py-1 px-3 rounded-full hover:bg-green-200 transition-colors">
                        {customer.recommendedAction.label}
                    </button>
                </td>
                <td className="py-3 px-6 text-center">
                  <button onClick={() => onSelectCustomer(customer)} className="bg-brand-secondary text-white py-1 px-4 rounded-full text-xs font-semibold hover:bg-brand-primary transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;