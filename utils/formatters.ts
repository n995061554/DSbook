
export const formatCurrency = (amount: number, currencyCode: string = 'INR'): string => {
  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US'; // Simple locale switch
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyShort = (num: number): string => {
  if (typeof num !== 'number') return '0';
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};
