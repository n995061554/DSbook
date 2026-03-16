
import React, { useState } from 'react';
import { XMarkIcon, BuildingOfficeIcon } from '../icons';

interface AddCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCompany: (company: { name: string; status: 'Active' | 'Inactive' }) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onAddCompany }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddCompany({ name, status });
            setName('');
            setStatus('Active');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark flex items-center">
                        <BuildingOfficeIcon className="w-7 h-7 mr-3 text-brand-primary" />
                        Add New Company
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name
                            </label>
                            <input
                                type="text"
                                id="company-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"
                                required
                            />
                        </div>
                        <div>
                             <label htmlFor="company-status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select 
                                id="company-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary bg-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors">
                            Add Company
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompanyModal;
