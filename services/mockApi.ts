
import type { Customer, Invoice, CommunicationEvent, HealthScore, AISuggestion, Company } from '../types';
import { HealthStatus, CommunicationType, Channel, InvoiceStatus } from '../types';

const createHealthScore = (score: number): HealthScore => {
  let status: HealthStatus;
  if (score > 85) status = HealthStatus.Excellent;
  else if (score > 65) status = HealthStatus.Good;
  else if (score > 40) status = HealthStatus.Warning;
  else status = HealthStatus.Poor;
  return {
    score,
    status,
    lastUpdated: new Date(),
    factors: {
      paymentHistory: Math.round(score * 0.4),
      cibilScore: Math.round(score * 0.3) + 500,
      businessAge: Math.floor(Math.random() * 10) + 1,
      gstVerified: Math.random() > 0.2,
    },
  };
};

const createInvoices = (count: number, baseAmount: number): Invoice[] => {
  return Array.from({ length: count }, (_, i) => {
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - (i * 15 + 10));
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const today = new Date();
    let status: InvoiceStatus;
    if (today > dueDate) status = InvoiceStatus.Overdue;
    else if (dueDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) status = InvoiceStatus.DueSoon;
    else status = InvoiceStatus.Paid;

    if (Math.random() > 0.8 && status !== InvoiceStatus.Overdue) status = InvoiceStatus.Paid;
    
    const finalStatus = status === InvoiceStatus.Paid ? InvoiceStatus.Paid : (new Date() > dueDate ? InvoiceStatus.Overdue : InvoiceStatus.DueSoon);
    
    let predictedPaymentDate: Date | undefined = undefined;
    if (finalStatus === InvoiceStatus.Overdue) {
        predictedPaymentDate = new Date();
        predictedPaymentDate.setDate(predictedPaymentDate.getDate() + Math.floor(Math.random() * 10) + 3);
    }

    return {
      id: `inv_${i}_${Date.now()}`,
      invoiceNumber: `INV-2024-${1001 + i}`,
      amount: baseAmount * (1 + (Math.random() - 0.5) * 0.5),
      issueDate,
      dueDate,
      status: finalStatus,
      predictedPaymentDate,
    };
  });
};

const createCommunicationHistory = (invoiceCount: number): CommunicationEvent[] => {
  const history: CommunicationEvent[] = [];
  const types = Object.values(CommunicationType);
  const channels = Object.values(Channel).filter(c => c !== Channel.System);
  
  for (let i = 0; i < invoiceCount * 1.5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const type = types[Math.floor(Math.random() * types.length)];
    let summary = '';
    let channel: Channel = channels[Math.floor(Math.random() * channels.length)];
    let compliance = undefined;

    switch(type) {
        case CommunicationType.SoftReminder: summary = 'Sent a friendly payment reminder.'; compliance = { dndSafe: true, timeWindowCompliant: true, consentRecorded: true }; break;
        case CommunicationType.FirmReminder: summary = 'Sent a firm reminder for overdue payment.'; compliance = { dndSafe: true, timeWindowCompliant: true, consentRecorded: true }; break;
        case CommunicationType.AICall: summary = 'AI called customer, promised payment by next week.'; channel = Channel.AIVoiceCall; compliance = { dndSafe: true, timeWindowCompliant: true, consentRecorded: true }; break;
        case CommunicationType.BillingBlocked: summary = 'Customer billing has been temporarily blocked.'; channel = Channel.System; break;
        case CommunicationType.LegalNotice: summary = 'Legal notice sent for non-payment.'; compliance = { dndSafe: true, timeWindowCompliant: true, consentRecorded: true }; break;
        case CommunicationType.PaymentReceived: summary = `Payment of ${ (Math.random()*10000).toFixed(2)} received.`; channel = Channel.System; break;
        case CommunicationType.InvoiceCreated: summary = `Invoice INV-2024-${1001+i} created.`; channel = Channel.System; break;
        case CommunicationType.DueDateApproaching: summary = `Invoice INV-2024-${1001+i} is due in 3 days.`; channel = Channel.System; break;
        case CommunicationType.PaymentPromised: summary = 'Customer promised payment via AI call.'; channel = Channel.System; break;
        case CommunicationType.PaymentFailed: summary = 'Automated payment collection failed.'; channel = Channel.System; break;
        case CommunicationType.DisputeRaised: summary = 'Customer raised a dispute on an invoice.'; channel = Channel.System; break;
    }

    history.push({
      id: `comm_${i}_${Date.now()}`,
      type,
      channel,
      date,
      summary,
      compliance,
    });
  }
  return history.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const createAiSuggestions = (customer: {healthScore: HealthScore, avgPaymentDays: number}): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];
    if(customer.healthScore.status === HealthStatus.Poor) {
        suggestions.push({
            id: 'sug1',
            title: 'Initiate AI Voice Call',
            reason: 'High overdue amount and poor health score. Previous email reminders have been ineffective.',
            actionLabel: 'Start AI Call'
        });
    }
     if(customer.avgPaymentDays > 30) {
        suggestions.push({
            id: 'sug2',
            title: 'Send Firm Reminder via WhatsApp',
            reason: 'Customer has a history of responding to WhatsApp messages. Payment is 15 days overdue.',
            actionLabel: 'Send WhatsApp'
        });
    }
    if (customer.healthScore.status === HealthStatus.Warning) {
         suggestions.push({
            id: 'sug3',
            title: 'Offer Early Payment Discount',
            reason: 'A small discount on the next invoice could improve payment timeliness and customer relationship.',
            actionLabel: 'Create Offer'
        });
    }
    if (!suggestions.length && (customer.healthScore.status === HealthStatus.Good || customer.healthScore.status === HealthStatus.Excellent)) {
         suggestions.push({
            id: 'sug4',
            title: 'Schedule a Relationship Call',
            reason: 'Proactively connect with this good-standing customer to solidify the relationship.',
            actionLabel: 'Schedule Call',
            isPremium: true
        });
    }
    return suggestions;
}

const generateCustomers = (companyId: string, companyName: string, numCustomers: number): Customer[] => {
    const customers = Array.from({ length: numCustomers }, (_, i) => {
        const healthScore = createHealthScore(Math.random() * 100);
        const invoices = createInvoices(Math.floor(Math.random() * 10) + 5, Math.random() * 50000);
        
        const riskScore = Math.round(Math.random() * 100);
        let recommendedAction = { label: 'Start AI Call', page: 'PaymentRecovery' };
        if (riskScore < 30) recommendedAction = { label: 'Send Reminder', page: 'CustomerDetail' };
        else if (riskScore > 75) recommendedAction = { label: 'Escalate to Legal', page: 'PaymentRecovery' };

        const baseCustomer = {
            id: `cust_${companyId}_${i}`,
            companyId: companyId,
            name: `User ${i} (${companyName.split(' ')[0]})`,
            company: `${companyName} Customer ${i}`,
            creditLimit: (Math.floor(Math.random() * 10) + 1) * 100000,
            avgPaymentDays: Math.floor(Math.random() * 50) + 5,
            healthScore: healthScore,
            invoices: invoices,
            communicationHistory: createCommunicationHistory(invoices.length),
            tallyLedgerId: `L-${companyId.slice(-1)}-${1001 + i}`,
            riskScore: {
                score: riskScore,
                trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
            },
            recommendedAction: recommendedAction
        };
        return {
            ...baseCustomer,
            totalOutstanding: baseCustomer.invoices.filter(inv => inv.status !== InvoiceStatus.Paid).reduce((sum, inv) => sum + inv.amount, 0),
            aiSuggestions: createAiSuggestions(baseCustomer)
        };
    });
    return customers;
};

const mockCompanies: Company[] = [
    { id: 'comp_1', name: 'Innovate Solutions Pvt. Ltd.', status: 'Active' },
    { id: 'comp_2', name: 'Global Exports Inc.', status: 'Active' },
    { id: 'comp_3', name: 'Future Builders Co.', status: 'Inactive' },
];

const mockTenantData: Record<string, { company: Company, customers: Customer[] }> = {
    'comp_1': {
        company: mockCompanies[0],
        customers: generateCustomers('comp_1', 'Innovate Solutions', 5)
    },
    'comp_2': {
        company: mockCompanies[1],
        customers: generateCustomers('comp_2', 'Global Exports', 8)
    },
    'comp_3': {
        company: mockCompanies[2],
        customers: generateCustomers('comp_3', 'Future Builders', 3)
    }
};

export const getCompaniesForUser = (): Promise<Company[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockCompanies)));
        }, 500);
    });
};

export const getCustomers = (companyId: string): Promise<Customer[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const companyData = mockTenantData[companyId];
      if (companyData) {
        resolve(JSON.parse(JSON.stringify(companyData.customers)));
      } else {
        reject(new Error('Company not found'));
      }
    }, 1000);
  });
};

export const getCustomerById = (companyId: string, customerId: string): Promise<Customer | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
       const companyData = mockTenantData[companyId];
       if (companyData) {
           const customer = companyData.customers.find(c => c.id === customerId);
           resolve(customer ? JSON.parse(JSON.stringify(customer)) : undefined);
       } else {
           resolve(undefined);
       }
    }, 500);
  });
};
