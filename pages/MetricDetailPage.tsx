
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Customer } from '../types';
import { ArrowLeftIcon, SearchIcon, CalendarDaysIcon, Cog8ToothIcon, ShareIcon, PrinterIcon, DocumentTextIcon } from '../components/icons';
import { formatCurrency, formatCurrencyShort } from '../utils/formatters';
import { useCurrency } from '../contexts/CurrencyContext';
// FIX: Consolidated and changed date-fns imports to be named imports from the main package.
import { 
    format, 
    formatDistanceToNowStrict, 
    isToday, 
    isYesterday, 
    isWithinInterval, 
    startOfWeek, 
    endOfWeek, 
    startOfMonth, 
    endOfMonth, 
    startOfQuarter, 
    endOfQuarter, 
    startOfYear, 
    endOfYear, 
    subYears, 
    subMonths 
} from 'date-fns';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import SalesSettingsModal, { type ViewSettings } from '../components/modals/SalesSettingsModal';

interface MetricDetailPageProps {
    metricTitle: string;
    onBack: () => void;
    customers: Customer[];
}

interface SalesChartProps {
    data: any[];
    chartType: 'bar' | 'line';
}

const SalesChart: React.FC<SalesChartProps> = ({ data, chartType }) => {
    const { currencyCode } = useCurrency();
    const monthlyData = useMemo(() => {
        const salesByMonth: { [key: string]: number } = {};
        data.forEach(sale => {
            const monthKey = format(new Date(sale.date), 'MMM yyyy');
            if (!salesByMonth[monthKey]) {
                salesByMonth[monthKey] = 0;
            }
            salesByMonth[monthKey] += sale.amount;
        });

        const chartData = [];
        for (let i = 11; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const monthKey = format(date, 'MMM yyyy');
            const shortMonthKey = format(date, 'MMM');
            chartData.push({
                name: shortMonthKey,
                Sales: salesByMonth[monthKey] || 0,
            });
        }
        return chartData;
    }, [data]);

    const ChartComponent = chartType === 'bar' ? BarChart : LineChart;

    return (
        <div className="h-80 bg-white p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Month-wise Sales</h2>
            <ResponsiveContainer width="100%" height="90%">
                <ChartComponent data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatCurrencyShort(Number(value))} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip
                        cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }}
                        formatter={(value: number) => [formatCurrency(value, currencyCode), 'Sales']}
                    />
                    <Legend />
                    {chartType === 'bar' ? (
                        <Bar dataKey="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    ) : (
                        <Line type="monotone" dataKey="Sales" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
};

const generateMockData = (metricTitle: string, customers: Customer[]) => {
    switch (metricTitle) {
        case 'Payment':
        case 'Receipt':
        case 'Total Sales':
        case 'Total Purchase':
            return customers.flatMap(c => 
                Array.from({ length: Math.floor(Math.random() * 15) + 5 }).map((_, i) => ({
                    id: `${c.id}-${metricTitle.toLowerCase()}-${i}`,
                    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                    partyName: c.name,
                    vchNo: `VCH-${Math.floor(Math.random() * 10000)}`,
                    amount: Math.random() * 50000 + 1000,
                }))
            );
        case 'Outstanding Payable':
            return customers.flatMap(c => 
                Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => {
                    const dueDate = new Date(Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000);
                    return {
                        id: `${c.id}-payable-${i}`,
                        partyName: c.company,
                        dueOn: dueDate,
                        overdueBy: dueDate < new Date() ? formatDistanceToNowStrict(dueDate, { unit: 'day' }) : 'N/A',
                        amount: Math.random() * 20000 + 500,
                    };
                })
            );
        case 'Outstanding Receivable':
             return customers
                .filter(c => c.totalOutstanding > 0)
                .map(c => ({
                    id: c.id,
                    partyName: c.name,
                    dueOn: 'Multiple',
                    overdueBy: `${c.avgPaymentDays} days avg`,
                    amount: c.totalOutstanding,
            }));
        default:
            return [];
    }
};

const getItemDate = (item: any): Date | null => {
    if (item?.date instanceof Date) return item.date;
    if (item?.dueOn instanceof Date) return item.dueOn;
    return null;
};

const MetricDetailPage: React.FC<MetricDetailPageProps> = ({ metricTitle, onBack, customers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('This Month');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [viewSettings, setViewSettings] = useState<ViewSettings>({
        chartType: 'bar',
        visibleColumns: ['date', 'partyName', 'vchNo', 'amount'],
    });
    const { currencyCode } = useCurrency();

    const shareMenuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (['Outstanding Payable', 'Outstanding Receivable'].includes(metricTitle)) {
            setSortConfig({ key: 'amount', direction: 'desc' });
        } else {
            setSortConfig({ key: 'date', direction: 'desc' });
        }
    }, [metricTitle]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
                setIsShareMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const metricData = useMemo(() => generateMockData(metricTitle, customers), [metricTitle, customers]);
    
    const dateFilteredData = useMemo(() => {
        if (dateFilter === 'All') return metricData;
    
        const now = new Date();
        let interval: { start: Date; end: Date };
    
        const filterableData = metricData.filter(item => getItemDate(item));
        if (metricData.length > 0 && filterableData.length === 0) {
            return metricData;
        }
    
        const filterFn = (item: any) => {
            const d = getItemDate(item);
            if (!d) return false;
    
            switch (dateFilter) {
                case 'Today': return isToday(d);
                case 'Yesterday': return isYesterday(d);
                case 'This Week': interval = { start: startOfWeek(now), end: endOfWeek(now) }; break;
                case 'This Month': interval = { start: startOfMonth(now), end: endOfMonth(now) }; break;
                case 'This Quarter': interval = { start: startOfQuarter(now), end: endOfQuarter(now) }; break;
                case 'This Year': interval = { start: startOfYear(now), end: endOfYear(now) }; break;
                case 'Last Year': const lastYear = subYears(now, 1); interval = { start: startOfYear(lastYear), end: endOfYear(lastYear) }; break;
                default: return false;
            }
            return isWithinInterval(d, interval);
        };
    
        return filterableData.filter(filterFn);
    }, [metricData, dateFilter]);

    const sortedAndFilteredData = useMemo(() => {
        let sortableItems = [...dateFilteredData].filter(item => 
            item.partyName && item.partyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortConfig !== null) {
            sortableItems.sort((a: any, b: any) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [dateFilteredData, searchTerm, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const renderTableRow = (item: any) => {
        switch (metricTitle) {
            case 'Payment':
            case 'Receipt':
            case 'Total Purchase':
            case 'Total Sales':
                return (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        {viewSettings.visibleColumns.includes('date') && <td className="py-3 px-4">{format(new Date(item.date), 'dd MMM yyyy')}</td>}
                        {viewSettings.visibleColumns.includes('partyName') && <td className="py-3 px-4">{item.partyName}</td>}
                        {viewSettings.visibleColumns.includes('vchNo') && <td className="py-3 px-4">{item.vchNo}</td>}
                        {viewSettings.visibleColumns.includes('amount') && <td className="py-3 px-4 text-right font-semibold">{formatCurrency(item.amount, currencyCode)}</td>}
                    </tr>
                );
            case 'Outstanding Payable':
                 return (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{item.partyName}</td>
                        <td className="py-3 px-4">{format(new Date(item.dueOn), 'dd MMM yyyy')}</td>
                        <td className="py-3 px-4 text-center">{item.overdueBy}</td>
                        <td className="py-3 px-4 text-right font-semibold">{formatCurrency(item.amount, currencyCode)}</td>
                    </tr>
                );
            case 'Outstanding Receivable':
                 return (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{item.partyName}</td>
                        <td className="py-3 px-4">{item.dueOn}</td>
                        <td className="py-3 px-4 text-center">{item.overdueBy}</td>
                        <td className="py-3 px-4 text-right font-semibold">{formatCurrency(item.amount, currencyCode)}</td>
                    </tr>
                );
            default: return null;
        }
    };
    
    const renderSalesDetail = () => {
        const dateFilters = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Last Year', 'All'];
        
        return (
            <>
                <SalesChart data={dateFilteredData} chartType={viewSettings.chartType} />
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 items-center mb-4">
                            {dateFilters.map(filter => (
                                <button key={filter} onClick={() => setDateFilter(filter)} className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${dateFilter === filter ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                    {filter}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="relative flex-grow">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" placeholder="Search by party name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative" ref={shareMenuRef}>
                                    <button onClick={() => setIsShareMenuOpen(prev => !prev)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50">
                                        <ShareIcon className="w-5 h-5"/> Share
                                    </button>
                                    {isShareMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border animate-fade-in-down">
                                            <button onClick={() => alert('Exporting to Excel...')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"><DocumentTextIcon className="w-5 h-5 text-green-600"/> Excel</button>
                                            <button onClick={() => alert('Exporting to PDF...')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"><DocumentTextIcon className="w-5 h-5 text-red-600"/> PDF</button>
                                            <button onClick={() => alert('Printing...')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"><PrinterIcon className="w-5 h-5 text-gray-600"/> Print</button>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setIsSettingsModalOpen(true)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50">
                                    <Cog8ToothIcon className="w-5 h-5"/> Settings
                                </button>
                            </div>
                        </div>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    {viewSettings.visibleColumns.includes('date') && <th className="py-3 px-4 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('date')}><span>Date {getSortIndicator('date')}</span></th>}
                                    {viewSettings.visibleColumns.includes('partyName') && <th className="py-3 px-4 cursor-pointer hover:bg-gray-200" onClick={() => requestSort('partyName')}><span>Party Name {getSortIndicator('partyName')}</span></th>}
                                    {viewSettings.visibleColumns.includes('vchNo') && <th className="py-3 px-4">Voucher No.</th>}
                                    {viewSettings.visibleColumns.includes('amount') && <th className="py-3 px-4 text-right cursor-pointer hover:bg-gray-200" onClick={() => requestSort('amount')}><span>Amount {getSortIndicator('amount')}</span></th>}
                                </tr>
                            </thead>
                            <tbody className="text-brand-dark">
                                {sortedAndFilteredData.length > 0 ? (
                                    sortedAndFilteredData.map(renderTableRow)
                                ) : (
                                    <tr>
                                        <td colSpan={viewSettings.visibleColumns.length} className="text-center py-8 text-gray-500">
                                            No matching records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };

    const renderGenericDetail = () => {
        const tableHeaders: { key: string, label: string, align?: string }[] = [];

        switch (metricTitle) {
            case 'Outstanding Payable':
            case 'Outstanding Receivable':
                tableHeaders.push(
                    { key: 'partyName', label: 'Party Name' },
                    { key: 'dueOn', label: 'Due On' },
                    { key: 'overdueBy', label: 'Overdue By', align: 'center' },
                    { key: 'amount', label: 'Amount', align: 'right' }
                );
                break;
            default:
                return (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <p className="text-center text-gray-500">No detailed view available for this metric.</p>
                    </div>
                );
        }

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="relative flex-grow">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by party name..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                {tableHeaders.map(header => (
                                    <th key={header.key} className={`py-3 px-4 ${header.align ? `text-${header.align}` : ''} cursor-pointer hover:bg-gray-200`} onClick={() => requestSort(header.key)}>
                                        <span>{header.label} {getSortIndicator(header.key)}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-brand-dark">
                            {sortedAndFilteredData.length > 0 ? (
                                sortedAndFilteredData.map(renderTableRow)
                            ) : (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="text-center py-8 text-gray-500">
                                        No matching records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 md:p-8 bg-brand-light min-h-full">
            <div className="max-w-7xl mx-auto">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-primary hover:text-brand-dark mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-brand-dark mb-6">Details for {metricTitle}</h1>
                {['Total Sales', 'Total Purchase', 'Receipt', 'Payment'].includes(metricTitle) ? renderSalesDetail() : renderGenericDetail()}
            </div>
             <SalesSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                settings={viewSettings}
                onSettingsChange={setViewSettings}
            />
            {/* FIX: To prevent JSX parsing errors, the style content is provided as a single-line string. */}
            <style>{`@keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }`}</style>
        </div>
    );
};

export default MetricDetailPage;
