
import React from 'react';
import { Page } from '../../types';
import { 
    DSbookIcon, 
    DashboardIcon, 
    ShieldCheckIcon, 
    BriefcaseIcon,
    ScaleIcon,
    BuildingLibraryIcon,
    ShieldExclamationIcon,
    CreditCardIcon,
    ArrowsRightLeftIcon,
    SettingsIcon,
    StarIcon,
} from '../icons';

interface SidebarProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; page: Page; currentPage: Page; onNavigate: (page: Page) => void; }> = ({ icon, label, page, currentPage, onNavigate }) => {
  const isActive = currentPage === page;
  return (
    <li className="mb-1">
      <button
        onClick={() => onNavigate(page)}
        className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-brand-primary text-white'
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span className="ml-3 font-semibold text-sm">{label}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage }) => {
  const mainNavItems = [
    { icon: <DashboardIcon className="h-5 w-5" />, label: 'Dashboard', page: Page.Dashboard },
    { icon: <BuildingLibraryIcon className="h-5 w-5" />, label: 'National Debt Registry', page: Page.NationalDebtRegistry },
    { icon: <ShieldCheckIcon className="h-5 w-5" />, label: 'Trust Hub', page: Page.TrustHub },
    { icon: <BriefcaseIcon className="h-5 w-5" />, label: 'Business Background check', page: Page.BusinessBackgroundCheck },
    { icon: <ScaleIcon className="h-5 w-5" />, label: 'Legal History Check', page: Page.LegalHistoryCheck },
    { icon: <ShieldExclamationIcon className="h-5 w-5" />, label: 'Business Security', page: Page.BusinessSecurity },
    { icon: <CreditCardIcon className="h-5 w-5" />, label: 'Payment Recovery', page: Page.PaymentRecovery },
    { icon: <ArrowsRightLeftIcon className="h-5 w-5" />, label: 'Trade Management', page: Page.TradeManagement },
    { icon: <SettingsIcon className="h-5 w-5" />, label: 'Setting', page: Page.Settings },
  ];
  
  return (
    <aside className="w-64 bg-white text-brand-dark flex flex-col p-4 border-r border-gray-200">
      <div className="flex items-center mb-8 p-2">
        <DSbookIcon className="h-8 w-auto" />
      </div>
      <nav className="flex-grow">
        <ul>
          {mainNavItems.map(item => (
             <NavItem key={item.page} {...item} currentPage={currentPage} onNavigate={onNavigate} />
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 bg-green-50 rounded-lg text-center border border-green-200">
        <div className="flex justify-center mb-2">
            <StarIcon className="w-6 h-6 text-yellow-500" />
        </div>
        <h3 className="font-bold text-brand-dark text-sm">Submit Your Experience</h3>
        <p className="text-xs text-gray-500 mt-1">Share your success story and help others</p>
      </div>
    </aside>
  );
};

export default Sidebar;