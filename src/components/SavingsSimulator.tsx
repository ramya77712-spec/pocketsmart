import React, { useState } from 'react';
import { Slider } from './Slider';
import { Expense, SavingsScenario } from '../types';
import { calculatePotentialSavings, calculateCompoundInterest, formatCurrency } from '../utils/calculations';
import { formatINR } from '../utils/currency';

interface SavingsSimulatorProps {
  expenses: Expense[];
  onScenarioChange: (scenario: SavingsScenario) => void;
}

export const SavingsSimulator: React.FC<SavingsSimulatorProps> = ({
  expenses,
  onScenarioChange,
}) => {
  const [scenario, setScenario] = useState<SavingsScenario>({
    diningReduction: 0,
    entertainmentReduction: 0,
    shoppingReduction: 0,
    subscriptionReduction: 0,
    transportationReduction: 0,
    luxuryReduction: 0,
  });

  const handleScenarioChange = (key: keyof SavingsScenario, value: number) => {
    const newScenario = { ...scenario, [key]: value };
    setScenario(newScenario);
    onScenarioChange(newScenario);
  };

  const potentialSavings = calculatePotentialSavings(expenses, scenario);
  const projections = [5, 10, 15, 20, 30].map(years => calculateCompoundInterest(potentialSavings, 0.10, years));

  // Calculate current amounts for each category
  const categoryAmounts = expenses.reduce((acc, expense) => {
    const category = expense.category.toLowerCase();
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Calculate luxury expenses total
  const luxuryTotal = expenses
    .filter(expense => expense.type === 'luxuries')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const simulatorItems = [
    {
      key: 'diningReduction' as keyof SavingsScenario,
      label: 'बाहर खाना (Dining Out)',
      currentAmount: categoryAmounts.dining || 0,
      reduction: scenario.diningReduction,
      icon: '🍽️',
    },
    {
      key: 'entertainmentReduction' as keyof SavingsScenario,
      label: 'मनोरंजन (Entertainment)',
      currentAmount: categoryAmounts.entertainment || 0,
      reduction: scenario.entertainmentReduction,
      icon: '🎬',
    },
    {
      key: 'shoppingReduction' as keyof SavingsScenario,
      label: 'खरीदारी (Shopping)',
      currentAmount: categoryAmounts.shopping || 0,
      reduction: scenario.shoppingReduction,
      icon: '🛍️',
    },
    {
      key: 'subscriptionReduction' as keyof SavingsScenario,
      label: 'सब्स्क्रिप्शन (Subscriptions)',
      currentAmount: categoryAmounts.subscriptions || 0,
      reduction: scenario.subscriptionReduction,
      icon: '📱',
    },
    {
      key: 'transportationReduction' as keyof SavingsScenario,
      label: 'परिवहन (Transportation)',
      currentAmount: categoryAmounts.transportation || 0,
      reduction: scenario.transportationReduction,
      icon: '🚗',
    },
    {
      key: 'luxuryReduction' as keyof SavingsScenario,
      label: 'विलासिता (Luxury Items)',
      currentAmount: luxuryTotal,
      reduction: scenario.luxuryReduction,
      icon: '💎',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        बचत सिमुलेटर (Emergency Fund Builder)
      </h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">💡 How This Helps Your Family</h3>
        <p className="text-blue-700 text-sm">
          Adjust your spending in different categories to see how much you can save monthly. 
          Even small changes can build a strong emergency fund to protect your family from unexpected expenses.
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        {simulatorItems.map(item => (
          <div key={item.key} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.label}</h3>
                  <p className="text-sm text-gray-600">
                    Current: {formatINR(item.currentAmount)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  -{formatINR(item.currentAmount * (item.reduction / 100))}
                </p>
                <p className="text-sm text-gray-600">{item.reduction}% reduction</p>
              </div>
            </div>
            <Slider
              value={item.reduction}
              onChange={(value) => handleScenarioChange(item.key, value)}
              min={0}
              max={50}
              step={5}
              disabled={item.currentAmount === 0}
            />
          </div>
        ))}
      </div>

      {potentialSavings > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            मासिक बचत क्षमता (Monthly Savings Potential): {formatINR(potentialSavings)}
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Emergency Fund Timeline</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">3 months fund:</p>
                <p className="font-bold text-blue-600">
                  {Math.ceil((75000) / potentialSavings)} months
                </p>
              </div>
              <div>
                <p className="text-gray-600">6 months fund:</p>
                <p className="font-bold text-green-600">
                  {Math.ceil((150000) / potentialSavings)} months
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {projections.map((projection) => (
              <div key={projection.years} className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-800 mb-2">{projection.years} Years</h4>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {formatINR(projection.futureValue)}
                </p>
                <p className="text-sm text-gray-600">
                  Interest: {formatINR(projection.interestEarned)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Contributions: {formatINR(projection.totalContributions)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>मान्यताएं (Assumptions):</strong> 10% annual return (typical for Indian mutual funds), monthly contributions, compound interest calculated monthly
            </p>
          </div>
        </div>
      )}
    </div>
  );
};