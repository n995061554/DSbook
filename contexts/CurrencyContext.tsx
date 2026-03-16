
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

type CurrencyFormat = 'indian' | 'international';

interface CurrencyContextType {
    currencyCode: string;
    currencySymbol: string;
    currencyFormat: CurrencyFormat;
    setCurrency: (code: string) => void;
    setFormat: (format: CurrencyFormat) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// A simple map for currency symbols. In a real app, this might be more comprehensive
// or use Intl.NumberFormat's built-in symbol detection.
const currencySymbolMap: { [key: string]: string } = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currencyCode, setCurrencyCode] = useState(() => localStorage.getItem('currencyCode') || 'INR');
    const [currencyFormat, setCurrencyFormat] = useState<CurrencyFormat>(() => (localStorage.getItem('currencyFormat') as CurrencyFormat) || 'indian');

    const setCurrency = useCallback((code: string) => {
        setCurrencyCode(code);
        localStorage.setItem('currencyCode', code);
    }, []);

    const setFormat = useCallback((format: CurrencyFormat) => {
        setCurrencyFormat(format);
        localStorage.setItem('currencyFormat', format);
    }, []);

    const currencySymbol = useMemo(() => currencySymbolMap[currencyCode] || currencyCode, [currencyCode]);

    const value = useMemo(() => ({
        currencyCode,
        currencySymbol,
        currencyFormat,
        setCurrency,
        setFormat,
    }), [currencyCode, currencySymbol, currencyFormat, setCurrency, setFormat]);

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
