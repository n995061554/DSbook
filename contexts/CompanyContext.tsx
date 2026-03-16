
import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import type { Company } from '../types';
import { getCompaniesForUser } from '../services/mockApi';

interface CompanyContextType {
    availableCompanies: Company[];
    selectedCompany: Company | null;
    switchCompany: (companyId: string) => void;
    addCompany: (newCompanyData: Omit<Company, 'id'>) => void;
    loading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    const switchCompany = useCallback((companyId: string) => {
        const company = availableCompanies.find(c => c.id === companyId);
        if (company) {
            setSelectedCompany(company);
            localStorage.setItem('selectedCompanyId', companyId);
        }
    }, [availableCompanies]);

    useEffect(() => {
        getCompaniesForUser().then(companies => {
            setAvailableCompanies(companies);
            const savedCompanyId = localStorage.getItem('selectedCompanyId');
            const companyToSelect = companies.find(c => c.id === savedCompanyId) || companies[0];
            if (companyToSelect) {
                setSelectedCompany(companyToSelect);
            }
            setLoading(false);
        });
    }, []);

     const addCompany = useCallback((newCompanyData: Omit<Company, 'id'>) => {
        const newCompany: Company = {
            id: `comp_${Date.now()}`,
            ...newCompanyData
        };
        setAvailableCompanies(prev => [...prev, newCompany]);
        // Switch to the newly added company
        switchCompany(newCompany.id);
    }, [switchCompany, availableCompanies]);

    const value = useMemo(() => ({
        availableCompanies,
        selectedCompany,
        switchCompany,
        addCompany,
        loading,
    }), [availableCompanies, selectedCompany, switchCompany, addCompany, loading]);

    return (
        <CompanyContext.Provider value={value}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = (): CompanyContextType => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error('useCompany must be used within a CompanyProvider');
    }
    return context;
};
