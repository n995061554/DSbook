
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, SearchIcon, ChevronDownIcon, BuildingOfficeIcon, CheckCircleIcon, PlusIcon, WalletIcon } from '../icons';
import { useCompany } from '../../contexts/CompanyContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatCurrency } from '../../utils/formatters';
import { Page } from '../../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const { availableCompanies, selectedCompany, switchCompany } = useCompany();
    const { currencyCode } = useCurrency();
    const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const user = { name: 'Sunil Patel', initials: 'SP' }; // Mock user
    const walletBalance = 1126; // Mock balance

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsCompanyMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCompanySwitch = (companyId: string) => {
        switchCompany(companyId);
        setIsCompanyMenuOpen(false);
    };

  return (
    <header className="bg-white p-4 flex justify-between items-center z-10 border-b border-gray-200">
      {/* Left side: Company Switcher */}
      <div className="relative" ref={menuRef}>
            <button onClick={() => setIsCompanyMenuOpen(prev => !prev)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center font-bold text-brand-dark">
                  {selectedCompany?.name.charAt(0).toUpperCase() ?? 'W'}
                </div>
                <span className="font-semibold text-brand-dark max-w-48 truncate">{selectedCompany?.name || 'Select Company'}</span>
                <ChevronDownIcon className="h-5 w-5 text-gray-500"/>
            </button>
            {isCompanyMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20 border animate-fade-in-down">
                    <div className="p-2 border-b">
                        <span className="text-xs font-semibold text-gray-500 uppercase px-2">Switch Company</span>
                    </div>
                    <ul>
                        {availableCompanies.map(company => (
                            <li key={company.id}>
                                <button onClick={() => handleCompanySwitch(company.id)} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
                                    <span className="truncate pr-2">{company.name}</span>
                                    {selectedCompany?.id === company.id && <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 border rounded-full p-1 px-3">
          <WalletIcon className="h-5 w-5 text-brand-primary" />
          <span className="font-bold text-brand-dark text-sm">{formatCurrency(walletBalance, currencyCode)}</span>
          <button onClick={() => onNavigate(Page.BuyCredits)} className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
            <PlusIcon className="w-4 h-4 text-brand-dark"/>
          </button>
        </div>
        
        <button className="relative text-gray-600 hover:text-brand-primary">
          <BellIcon className="h-6 w-6" />
        </button>
        
        <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer" title={user.name}>
          {user.initials}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
      `}</style>
    </header>
  );
};

export default Header;