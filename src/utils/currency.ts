// Currency utilities for INR formatting and conversion
export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
} as const;

export type SupportedCurrency = keyof typeof CURRENCY_SYMBOLS;

// Format currency in INR with proper Indian number formatting
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format currency with custom symbol
export const formatCurrency = (
  amount: number, 
  currency: SupportedCurrency = 'INR',
  locale: string = 'en-IN'
): string => {
  if (currency === 'INR') {
    return formatINR(amount);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Convert amount to INR (mock implementation - replace with real API)
export const convertToINR = async (
  amount: number, 
  fromCurrency: SupportedCurrency
): Promise<number> => {
  if (fromCurrency === 'INR') return amount;

  try {
    // Mock exchange rates - replace with real API like exchangerate-api.com
    const exchangeRates: Record<SupportedCurrency, number> = {
      INR: 1,
      USD: 83.25,
      EUR: 90.15,
      GBP: 105.50,
      JPY: 0.56,
      CNY: 11.45,
    };

    const rate = exchangeRates[fromCurrency];
    return Math.round(amount * rate);
  } catch (error) {
    console.error('Currency conversion error:', error);
    return amount; // Return original amount if conversion fails
  }
};

// Get real-time exchange rates (implement with actual API)
export const getExchangeRates = async (): Promise<Record<SupportedCurrency, number>> => {
  try {
    // Replace with actual API call
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
    // const data = await response.json();
    
    // Mock data for now
    return {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      JPY: 1.79,
      CNY: 0.087,
    };
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Return fallback rates
    return {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      JPY: 1.79,
      CNY: 0.087,
    };
  }
};

// Format large numbers in Indian style (Lakhs, Crores)
export const formatIndianNumber = (amount: number): string => {
  if (amount >= 10000000) { // 1 Crore
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) { // 1 Lakh
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) { // 1 Thousand
    return `₹${(amount / 1000).toFixed(1)} K`;
  } else {
    return formatINR(amount);
  }
};

// Validate currency amount
export const isValidAmount = (amount: string | number): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num >= 0 && num <= 999999999; // Max 99.99 Crores
};

// Parse Indian number format input
export const parseIndianAmount = (input: string): number => {
  // Remove currency symbols and spaces
  const cleaned = input.replace(/[₹$€£¥,\s]/g, '');
  
  // Handle Indian abbreviations
  if (cleaned.toLowerCase().includes('cr')) {
    return parseFloat(cleaned.replace(/cr/i, '')) * 10000000;
  } else if (cleaned.toLowerCase().includes('l')) {
    return parseFloat(cleaned.replace(/l/i, '')) * 100000;
  } else if (cleaned.toLowerCase().includes('k')) {
    return parseFloat(cleaned.replace(/k/i, '')) * 1000;
  }
  
  return parseFloat(cleaned) || 0;
};
// Format currency for Indian context with stress indicators
export const formatCurrencyWithStress = (amount: number, isStressful: boolean = false): string => {
  const formatted = formatINR(amount);
  return isStressful ? `⚠️ ${formatted}` : `✅ ${formatted}`;
};

// Calculate affordability score for Indian families
export const calculateAffordabilityScore = (
  monthlyIncome: number,
  totalExpenses: number,
  emergencyFund: number
): { score: number; status: 'excellent' | 'good' | 'warning' | 'critical'; message: string } => {
  const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;
  const emergencyMonths = emergencyFund / totalExpenses;
  
  let score = 0;
  score += Math.min(savingsRate * 2, 40); // Max 40 points for savings rate
  score += Math.min(emergencyMonths * 10, 60); // Max 60 points for emergency fund
  
  if (score >= 80) {
    return { score, status: 'excellent', message: 'आपकी वित्तीय स्थिति बहुत अच्छी है! (Your financial situation is excellent!)' };
  } else if (score >= 60) {
    return { score, status: 'good', message: 'अच्छी प्रगति! (Good progress!)' };
  } else if (score >= 40) {
    return { score, status: 'warning', message: 'सुधार की जरूरत है (Needs improvement)' };
  } else {
    return { score, status: 'critical', message: 'तुरंत ध्यान दें (Immediate attention needed)' };
  }
};