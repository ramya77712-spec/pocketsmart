import { Expense, SavingsScenario, CompoundInterestProjection } from '../types';
import { formatINR } from './currency';

export const calculateLevel = (experience: number): number => {
  // Level progression: 100 XP for level 1, 200 for level 2, etc.
  let level = 1;
  let requiredXP = 100;
  let totalXP = 0;
  
  while (totalXP + requiredXP <= experience) {
    totalXP += requiredXP;
    level++;
    requiredXP = level * 100;
  }
  
  return level;
};

export const getXPForNextLevel = (experience: number): { current: number; required: number } => {
  const level = calculateLevel(experience);
  const requiredForCurrentLevel = (level - 1) * level * 50; // Sum of arithmetic sequence
  const requiredForNextLevel = level * (level + 1) * 50;
  
  return {
    current: experience - requiredForCurrentLevel,
    required: requiredForNextLevel - requiredForCurrentLevel
  };
};

export const calculateCompoundInterest = (
  monthlyContribution: number,
  annualRate: number = 0.10,
  years: number
): CompoundInterestProjection => {
  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;
  const totalContributions = monthlyContribution * totalMonths;
  
  // Future Value of Annuity Formula: FV = P * [((1 + r)^n - 1) / r]
  const futureValue = monthlyContribution * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate);
  const interestEarned = futureValue - totalContributions;
  
  return {
    years,
    futureValue: Math.round(futureValue),
    totalContributions: Math.round(totalContributions),
    interestEarned: Math.round(interestEarned),
    monthlyContribution
  };
};

export const calculateEmergencyFundTarget = (monthlyExpenses: number, months: number = 6): number => {
  return monthlyExpenses * months;
};

export const calculateDebtToIncomeRatio = (monthlyDebtPayments: number, monthlyIncome: number): number => {
  return (monthlyDebtPayments / monthlyIncome) * 100;
};

export const calculateNetWorth = (assets: number, liabilities: number): number => {
  return assets - liabilities;
};

export const categorizeExpenses = (expenses: Expense[]): { [key: string]: Expense[] } => {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.type]) {
      acc[expense.type] = [];
    }
    acc[expense.type].push(expense);
    return acc;
  }, {} as { [key: string]: Expense[] });
};

export const calculatePotentialSavings = (
  expenses: Expense[],
  scenario: SavingsScenario
): number => {
  let totalSavings = 0;
  
  expenses.forEach(expense => {
    switch (expense.category.toLowerCase()) {
      case 'dining':
        totalSavings += expense.amount * (scenario.diningReduction / 100);
        break;
      case 'entertainment':
        totalSavings += expense.amount * (scenario.entertainmentReduction / 100);
        break;
      case 'shopping':
        totalSavings += expense.amount * (scenario.shoppingReduction / 100);
        break;
      case 'subscriptions':
        totalSavings += expense.amount * (scenario.subscriptionReduction / 100);
        break;
      case 'transportation':
        totalSavings += expense.amount * (scenario.transportationReduction / 100);
        break;
      default:
        // Apply luxury reduction to any luxury category
        if (expense.type === 'luxuries') {
          totalSavings += expense.amount * (scenario.luxuryReduction / 100);
        }
        break;
    }
  });
  
  return Math.round(totalSavings);
};

export const calculateSavingsHealthScore = (
  monthlyIncome: number,
  totalExpenses: number,
  potentialSavings: number
): number => {
  const currentSavingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;
  const potentialSavingsRate = ((monthlyIncome - totalExpenses + potentialSavings) / monthlyIncome) * 100;
  
  // Score based on potential savings rate (0-100)
  // 20%+ savings rate = excellent (90-100)
  // 15-20% = good (70-89)
  // 10-15% = fair (50-69)
  // 5-10% = poor (30-49)
  // <5% = critical (0-29)
  
  if (potentialSavingsRate >= 20) return Math.min(90 + (potentialSavingsRate - 20) * 0.5, 100);
  if (potentialSavingsRate >= 15) return 70 + (potentialSavingsRate - 15) * 4;
  if (potentialSavingsRate >= 10) return 50 + (potentialSavingsRate - 10) * 4;
  if (potentialSavingsRate >= 5) return 30 + (potentialSavingsRate - 5) * 4;
  return Math.max(potentialSavingsRate * 6, 0);
};

export const calculateFinancialHealthScore = (
  monthlyIncome: number,
  totalExpenses: number,
  emergencyFund: number,
  totalDebt: number,
  currentSavings: number
): { score: number; breakdown: { [key: string]: number } } => {
  const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;
  const emergencyFundMonths = emergencyFund / (totalExpenses || 1);
  const debtToIncomeRatio = (totalDebt / (monthlyIncome * 12)) * 100;
  
  // Scoring components (out of 100)
  const savingsScore = Math.min(savingsRate * 5, 25); // Max 25 points
  const emergencyScore = Math.min(emergencyFundMonths * 8.33, 25); // Max 25 points (3 months = 25)
  const debtScore = Math.max(25 - (debtToIncomeRatio * 0.5), 0); // Max 25 points
  const netWorthScore = Math.min((currentSavings / monthlyIncome) * 2, 25); // Max 25 points
  
  const totalScore = savingsScore + emergencyScore + debtScore + netWorthScore;
  
  return {
    score: Math.round(totalScore),
    breakdown: {
      savings: Math.round(savingsScore),
      emergency: Math.round(emergencyScore),
      debt: Math.round(debtScore),
      netWorth: Math.round(netWorthScore)
    }
  };
};

// Format currency in INR
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const generateExperiencePoints = (action: string): number => {
  const xpMap: { [key: string]: number } = {
    'add_expense': 5,
    'complete_challenge': 50,
    'reach_savings_goal': 100,
    'complete_learning_module': 25,
    'maintain_streak': 10,
    'optimize_budget': 30,
    'emergency_fund_contribution': 20
  };
  
  return xpMap[action] || 0;
};