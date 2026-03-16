
import React from 'react';
import { XMarkIcon, ChartBarIcon, PresentationChartLineIcon } from '../icons';

export interface ViewSettings {
    chartType: 'bar' | 'line';
    visibleColumns: string[];
}

interface SalesSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: ViewSettings;
    onSettingsChange: (settings: ViewSettings) => void;
}

const allColumns = [
    { key: 'date', label: 'Date', required: true },
    { key: 'partyName', label: 'Party Name', required: true },
    { key: 'vchNo', label: 'Voucher No.', required: false },
    { key: 'amount', label: 'Amount', required: true },
];


const SalesSettingsModal: React.FC<SalesSettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
    if (!isOpen) return null;

    const handleChartTypeChange = (type: 'bar' | 'line') => {
        onSettingsChange({ ...settings, chartType: type });
    };

    const handleColumnToggle = (columnKey: string) => {
        const newVisibleColumns = settings.visibleColumns.includes(columnKey)
            ? settings.visibleColumns.filter(key => key !== columnKey)
            : [...settings.visibleColumns, columnKey];
        onSettingsChange({ ...settings, visibleColumns: newVisibleColumns });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-brand-dark">View Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Chart Type Setting */}
                    <div>
                        <h3 className="text-lg font-semibold text-brand-dark mb-3">Chart Type</h3>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleChartTypeChange('bar')}
                                className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${settings.chartType === 'bar' ? 'border-brand-secondary bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                            >
                                <ChartBarIcon className="w-8 h-8 text-brand-primary mb-2" />
                                <span className="font-medium text-sm">Bar Chart</span>
                            </button>
                            <button
                                onClick={() => handleChartTypeChange('line')}
                                className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${settings.chartType === 'line' ? 'border-brand-secondary bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                            >
                                <PresentationChartLineIcon className="w-8 h-8 text-brand-primary mb-2" />
                                <span className="font-medium text-sm">Line Chart</span>
                            </button>
                        </div>
                    </div>

                    {/* Visible Columns Setting */}
                    <div>
                        <h3 className="text-lg font-semibold text-brand-dark mb-3">Visible Columns</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {allColumns.map(col => (
                                <label key={col.key} className={`flex items-center p-3 border rounded-lg transition-colors ${col.required ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300'}`}>
                                    <input
                                        type="checkbox"
                                        checked={settings.visibleColumns.includes(col.key)}
                                        onChange={() => handleColumnToggle(col.key)}
                                        disabled={col.required}
                                        className="h-5 w-5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary disabled:text-gray-400"
                                    />
                                    <span className="ml-3 font-medium text-sm">{col.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button onClick={onClose} className="bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalesSettingsModal;
