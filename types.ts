
export enum Page {
  Dashboard = 'DASHBOARD',
  NationalDebtRegistry = 'NATIONAL_DEBT_REGISTRY',
  TrustHub = 'TRUST_HUB',
  BusinessBackgroundCheck = 'BUSINESS_BACKGROUND_CHECK',
  LegalHistoryCheck = 'LEGAL_HISTORY_CHECK',
  BusinessSecurity = 'BUSINESS_SECURITY',
  PaymentRecovery = 'PAYMENT_RECOVERY',
  TradeManagement = 'TRADE_MANAGEMENT',
  Settings = 'SETTINGS',
  
  Customers = 'CUSTOMERS',
  CustomerDetail = 'CUSTOMER_DETAIL',
  MetricDetail = 'METRIC_DETAIL',
  Profile = 'PROFILE',
  AutoReminderSettings = 'AUTO_REMINDER_SETTINGS',
  SettingDetail = 'SETTING_DETAIL',
  ShareSettings = 'SHARE_SETTINGS',
  VoucherShareSettings = 'VOUCHER_SHARE_SETTINGS',
  ConfigureInvoiceShare = 'CONFIGURE_INVOICE_SHARE',
  InvoiceAutoSharing = 'INVOICE_AUTO_SHARING',
  ManageContacts = 'MANAGE_CONTACTS',
  CustomizeCommunication = 'CUSTOMIZE_COMMUNICATION',
  StockItemSettings = 'STOCK_ITEM_SETTINGS',
  DateSettings = 'DATE_SETTINGS',
  CurrencySettings = 'CURRENCY_SETTINGS',
  DataEntrySettings = 'DATA_ENTRY_SETTINGS',
  VouchersSettings = 'VOUCHERS_SETTINGS',
  OrdersSettings = 'ORDERS_SETTINGS',
  LedgerSettings = 'LEDGER_SETTINGS',
  StockItemEntrySettings = 'STOCK_ITEM_ENTRY_SETTINGS',
  InvoiceSettings = 'INVOICE_SETTINGS',
  InventoryVoucherSettings = 'INVENTORY_VOUCHER_SETTINGS',
  
  BuyCredits = 'BUY_CREDITS',
  FindSomeone = 'FIND_SOMEONE',
  PreLegalCheck = 'PRE_LEGAL_CHECK',
  Arbitration = 'ARBITRATION',
  LegalProcessFinance = 'LEGAL_PROCESS_FINANCE',
  ExpertOpinion = 'EXPERT_OPINION',
}

export enum HealthStatus {
  Excellent = 'Excellent',
  Good = 'Good',
  Warning = 'Warning',
  Poor = 'Poor',
}

export enum CommunicationType {
  // User/AI Actions
  SoftReminder = 'Soft Reminder',
  FirmReminder = 'Firm Reminder',
  AICall = 'AI Call',
  LegalNotice = 'Legal Notice',
  PaymentReceived = 'Payment Received',
  // System Events
  InvoiceCreated = 'Invoice Created',
  DueDateApproaching = 'Due Date Approaching',
  PaymentPromised = 'Payment Promise Made',
  PaymentFailed = 'Payment Failed',
  DisputeRaised = 'Dispute Raised',
  BillingBlocked = 'Billing Blocked',
}

export enum Channel {
  Email = 'Email',
  WhatsApp = 'WhatsApp',
  IVR = 'IVR',
  AIVoiceCall = 'AI Voice Call',
  System = 'System',
}

export enum InvoiceStatus {
    Paid = 'Paid',
    Overdue = 'Overdue',
    DueSoon = 'Due Soon'
}

export interface Company {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  issueDate: Date;
  status: InvoiceStatus;
  predictedPaymentDate?: Date;
}

export interface CommunicationEvent {
  id: string;
  type: CommunicationType;
  channel: Channel;
  date: Date;
  summary: string;
  compliance?: {
    dndSafe: boolean;
    timeWindowCompliant: boolean;
    consentRecorded: boolean;
  };
}

export interface HealthScore {
  score: number;
  status: HealthStatus;
  lastUpdated: Date;
  factors: {
    paymentHistory: number;
    cibilScore: number;
    businessAge: number;
    gstVerified: boolean;
  };
}

export interface AISuggestion {
    id: string;
    title: string;
    reason: string;
    actionLabel: string;
    isPremium?: boolean;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  company: string;
  totalOutstanding: number;
  creditLimit: number;
  avgPaymentDays: number;
  healthScore: HealthScore;
  invoices: Invoice[];
  communicationHistory: CommunicationEvent[];
  tallyLedgerId: string;
  aiSuggestions: AISuggestion[];
  riskScore: { 
    score: number; 
    trend: 'up' | 'down' | 'stable';
  };
  recommendedAction: { 
    label: string; 
    page: string; 
  };
}

// Types for Business Background Check Report
export interface GstDetails {
  legalName: string;
  tradeName: string;
  address: string;
  contact: { email: string; mobile: string };
  status: 'Active' | 'Inactive' | 'Cancelled';
  registrationDate: Date;
  businessType: string;
  complianceScore: number; // Out of 100
}

export interface CorporateDetails {
  cin: string;
  companyName: string;
  dateOfIncorporation: Date;
  registeredAddress: string;
  companyStatus: string;
  directors: { name: string; din: string; appointed: Date }[];
}

export interface CreditInfo {
  cibilScore: number;
  defaulterStatus: 'Yes' | 'No' | 'N/A';
  reportDate: Date;
  totalAccounts: number;
  activeAccounts: number;
  overdueAccounts: number;
  recentInquiries: number;
}

export interface InternalRecord {
  isReported: boolean;
  reportedOn?: Date;
  amount?: number;
  reportedBy?: string;
}

export interface BusinessReport {
  id: string; // Could be GSTIN, PAN, etc.
  trustScore: number; // Overall score out of 1000
  gstDetails: GstDetails | null;
  corporateDetails: CorporateDetails | null;
  creditInfo: CreditInfo | null;
  internalRecord: InternalRecord;
}