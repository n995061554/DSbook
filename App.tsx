
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import type { Customer } from './types';
import { Page } from './types';
import { getCustomers } from './services/mockApi';
import AutoReminderPage from './pages/settings/AutoReminderPage';
import SettingDetailPage from './pages/settings/SettingDetailPage';
import ShareSettingsPage from './pages/settings/ShareSettingsPage';
import VoucherShareSettingsPage from './pages/settings/VoucherShareSettingsPage';
import ConfigureInvoiceSharePage from './pages/settings/ConfigureInvoiceSharePage';
import InvoiceAutoSharingPage from './pages/settings/InvoiceAutoSharingPage';
import ManageContactsPage from './pages/settings/ManageContactsPage';
import CustomizeCommunicationPage from './pages/settings/CustomizeCommunicationPage';
import StockItemSettingsPage from './pages/settings/StockItemSettingsPage';
import DateSettingsPage from './pages/settings/DateSettingsPage';
import CurrencySettingsPage from './pages/settings/CurrencySettingsPage';
import DataEntrySettingsPage from './pages/settings/DataEntrySettingsPage';
import VouchersSettingsPage from './pages/settings/VouchersSettingsPage';
import OrdersSettingsPage from './pages/settings/OrdersSettingsPage';
import LedgerSettingsPage from './pages/settings/LedgerSettingsPage';
import StockItemEntrySettingsPage from './pages/settings/StockItemEntrySettingsPage';
import InvoiceSettingsPage from './pages/settings/InvoiceSettingsPage';
import InventoryVoucherSettingsPage from './pages/settings/InventoryVoucherSettingsPage';
import GeneralSettingsPage from './pages/GeneralSettingsPage';
import MetricDetailPage from './pages/MetricDetailPage';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CompanyProvider, useCompany } from './contexts/CompanyContext';
import { DSbookIcon } from './components/icons';
import ServicesPage from './pages/ServicesPage';
import BuyCreditsPage from './pages/BuyCreditsPage';
import NationalDebtRegistryPage from './pages/NationalDebtRegistryPage';
import TrustHubPage from './pages/TrustHubPage';
import BusinessBackgroundCheckPage from './pages/BusinessBackgroundCheckPage';

const MainApp: React.FC = () => {
  const { selectedCompany, loading: companyLoading } = useCompany();
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [settingDetailTitle, setSettingDetailTitle] = useState<string>('');
  const [selectedMetricTitle, setSelectedMetricTitle] = useState<string>('');
  const [pageState, setPageState] = useState<any>(null);

  const fetchCustomersData = useCallback(async () => {
    if (!selectedCompany) return;
    setLoading(true);
    try {
      const data = await getCustomers(selectedCompany.id);
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCompany]);

  useEffect(() => {
    fetchCustomersData();
  }, [fetchCustomersData]);

  const handleNavigate = useCallback((page: Page, state?: any) => {
    setCurrentPage(page);
    setSelectedCustomer(null);
    setPageState(state);

    if (page === Page.SettingDetail && typeof state === 'string') {
        setSettingDetailTitle(state);
    }
    if (page === Page.MetricDetail && typeof state === 'string') {
        setSelectedMetricTitle(state);
    }
  }, []);
  
  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentPage(Page.CustomerDetail);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case Page.Dashboard:
      case Page.PaymentRecovery:
        return <ServicesPage category="Payment Recovery" onNavigate={handleNavigate} customers={customers} loading={loading} />;
      case Page.TradeManagement:
        return <ServicesPage category="Trade Management" onNavigate={handleNavigate} customers={customers} loading={loading} />;
      
      case Page.NationalDebtRegistry:
        return <NationalDebtRegistryPage onBack={() => handleNavigate(Page.Dashboard)} customers={customers} onNavigate={handleNavigate} />;
      case Page.TrustHub:
        return <TrustHubPage onBack={() => handleNavigate(Page.Dashboard)} onNavigate={handleNavigate} />;
      case Page.BusinessBackgroundCheck:
        return <BusinessBackgroundCheckPage onBack={() => handleNavigate(Page.Dashboard)} initialState={pageState} />;
      case Page.LegalHistoryCheck:
      case Page.BusinessSecurity:
      case Page.FindSomeone:
      case Page.PreLegalCheck:
      case Page.Arbitration:
      case Page.LegalProcessFinance:
      case Page.ExpertOpinion:
        const title = currentPage.replace(/([A-Z])/g, ' $1').trim();
        return <div className="p-8 text-2xl font-bold text-brand-dark">{title} (Coming Soon)</div>;

      case Page.BuyCredits:
        return <BuyCreditsPage onBack={() => handleNavigate(Page.Dashboard)} />;
      case Page.Customers:
        return <CustomersPage customers={customers} onSelectCustomer={handleSelectCustomer} loading={loading} onNavigate={handleNavigate} />;
      case Page.CustomerDetail:
        return selectedCustomer ? <CustomerDetailPage customer={selectedCustomer} /> : <CustomersPage customers={customers} onSelectCustomer={handleSelectCustomer} loading={loading} onNavigate={handleNavigate} />;
      case Page.MetricDetail:
        return <MetricDetailPage metricTitle={selectedMetricTitle} onBack={() => handleNavigate(Page.Dashboard)} customers={customers} />;
      case Page.Profile:
        return <ProfilePage onNavigate={handleNavigate} />;
      case Page.Settings:
        return <GeneralSettingsPage onNavigate={handleNavigate} />;
      case Page.AutoReminderSettings:
        return <AutoReminderPage customers={customers} onNavigate={handleNavigate} onBack={() => handleNavigate(Page.Settings)} />;
      case Page.InvoiceAutoSharing:
        return <InvoiceAutoSharingPage customers={customers} onBack={() => handleNavigate(Page.Settings)} />;
      case Page.ShareSettings:
        return <ShareSettingsPage onBack={() => handleNavigate(Page.Settings)} onNavigate={handleNavigate} />;
      case Page.VoucherShareSettings:
        return <VoucherShareSettingsPage onBack={() => handleNavigate(Page.ShareSettings)} onNavigate={handleNavigate} />;
      case Page.ConfigureInvoiceShare:
        return <ConfigureInvoiceSharePage onBack={() => handleNavigate(Page.VoucherShareSettings)} onNavigate={handleNavigate} />;
       case Page.ManageContacts:
        return <ManageContactsPage customers={customers} onBack={() => handleNavigate(Page.AutoReminderSettings)} />;
      case Page.CustomizeCommunication:
        return <CustomizeCommunicationPage onBack={() => handleNavigate(Page.AutoReminderSettings)} />;
      case Page.StockItemSettings:
        return <StockItemSettingsPage onBack={() => handleNavigate(Page.Settings)} />;
      case Page.DateSettings:
        return <DateSettingsPage onBack={() => handleNavigate(Page.Settings)} />;
      case Page.CurrencySettings:
        return <CurrencySettingsPage onBack={() => handleNavigate(Page.Settings)} />;
      case Page.DataEntrySettings:
        return <DataEntrySettingsPage onBack={() => handleNavigate(Page.Settings)} onNavigate={handleNavigate} />;
      case Page.VouchersSettings:
        return <VouchersSettingsPage onBack={() => handleNavigate(Page.DataEntrySettings)} />;
      case Page.OrdersSettings:
        return <OrdersSettingsPage onBack={() => handleNavigate(Page.DataEntrySettings)} />;
      case Page.LedgerSettings:
        return <LedgerSettingsPage onBack={() => handleNavigate(Page.DataEntrySettings)} />;
      case Page.StockItemEntrySettings:
        return <StockItemEntrySettingsPage onBack={() => handleNavigate(Page.DataEntrySettings)} />;
      case Page.InvoiceSettings:
        return <InvoiceSettingsPage onBack={() => handleNavigate(Page.DataEntrySettings)} />;
      case Page.InventoryVoucherSettings:
        return <InventoryVoucherSettingsPage onBack={() => handleNavigate(Page.DataEntrySettings)} />;
      case Page.SettingDetail:
        return <SettingDetailPage title={settingDetailTitle} onBack={() => handleNavigate(Page.Settings)} />;
      default:
        return <ServicesPage category="Payment Recovery" onNavigate={handleNavigate} customers={customers} loading={loading} />;
    }
  };

  if (companyLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-brand-light text-brand-dark">
        <DSbookIcon className="h-12 w-12 animate-pulse" />
        <span className="ml-4 text-xl font-semibold">Loading your workspace...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNavigate={handleNavigate} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-light min-h-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const handleLogin = () => setIsLoggedIn(true);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <CompanyProvider>
      <CurrencyProvider>
        <MainApp />
      </CurrencyProvider>
    </CompanyProvider>
  );
};

export default App;