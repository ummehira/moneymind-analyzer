import { useMemo } from 'react';

const CURRENCY_CONFIG = {
  PKR: { symbol: 'Rs.', locale: 'en-PK', decimals: 0 },
  USD: { symbol: '$',   locale: 'en-US', decimals: 2 },
  EUR: { symbol: '€',   locale: 'en-EU', decimals: 2 },
  GBP: { symbol: '£',   locale: 'en-GB', decimals: 2 },
  AED: { symbol: 'AED', locale: 'en-AE', decimals: 2 },
  SAR: { symbol: 'SAR', locale: 'en-SA', decimals: 2 },
  INR: { symbol: '₹',   locale: 'en-IN', decimals: 0 },
};

export const useCurrency = (currencyCode = 'PKR') => {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.PKR;

  const format = useMemo(() => (amount) => {
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString(config.locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    });
    return `${config.symbol} ${formatted}`;
  }, [config]);

  return { format, symbol: config.symbol, code: currencyCode };
};

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_CONFIG);
