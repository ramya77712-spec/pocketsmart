import React, { useState } from 'react';
import { Plus, Upload, Download, AlertCircle } from 'lucide-react';
import { Expense } from '../types';
import { parseCSV, generateSampleCSV } from '../utils/csvParser';

interface ExpenseInputProps {
  expenses: Expense[];
  onExpensesChange: (expenses: Expense[]) => void;
  monthlyIncome: number;
  onIncomeChange: (income: number) => void;
}

const EXPENSE_CATEGORIES = [
  { value: 'rent', label: 'Rent/Mortgage', type: 'needs' as const },
  { value: 'utilities', label: 'Utilities', type: 'needs' as const },
  { value: 'groceries', label: 'Groceries', type: 'needs' as const },
  { value: 'transportation', label: 'Transportation', type: 'needs' as const },
  { value: 'insurance', label: 'Insurance', type: 'needs' as const },
  { value: 'healthcare', label: 'Healthcare', type: 'needs' as const },
  { value: 'dining', label: 'Dining Out', type: 'wants' as const },
  { value: 'entertainment', label: 'Entertainment', type: 'wants' as const },
  { value: 'shopping', label: 'Shopping', type: 'wants' as const },
  { value: 'subscriptions', label: 'Subscriptions', type: 'optional' as const },
  { value: 'hobbies', label: 'Hobbies', type: 'optional' as const },
  { value: 'travel', label: 'Travel', type: 'optional' as const },
];

export const ExpenseInput: React.FC<ExpenseInputProps> = ({
  expenses,
  onExpensesChange,
  monthlyIncome,
  onIncomeChange,
}) => {
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
  });
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;

    const categoryInfo = EXPENSE_CATEGORIES.find(cat => cat.value === newExpense.category);
    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      type: categoryInfo?.type || 'optional',
    };

    onExpensesChange([...expenses, expense]);
    setNewExpense({ category: '', amount: '', description: '' });
  };

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter(expense => expense.id !== id));
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setCsvError(null);

    try {
      const parsedExpenses = await parseCSV(file);
      onExpensesChange([...expenses, ...parsedExpenses]);
    } catch (error) {
      setCsvError(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-expenses.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingIncome = monthlyIncome - totalExpenses;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Information</h2>
      
      {/* Monthly Income */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Income
        </label>
        <input
          type="number"
          value={monthlyIncome || ''}
          onChange={(e) => onIncomeChange(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your monthly income"
        />
      </div>

      {/* CSV Upload Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Bulk Upload</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              disabled={isUploading}
            />
            <div className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload CSV'}
            </div>
          </label>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Sample CSV
          </button>
        </div>
        {csvError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{csvError}</p>
          </div>
        )}
      </div>

      {/* Manual Entry */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder="Amount"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            placeholder="Description (optional)"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addExpense}
            disabled={!newExpense.category || !newExpense.amount}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </button>
        </div>
      </div>

      {/* Expense List */}
      {expenses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Expenses</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{expense.category}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      expense.type === 'needs' ? 'bg-red-100 text-red-800' :
                      expense.type === 'wants' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {expense.type}
                    </span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-gray-600">{expense.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">${expense.amount}</span>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {monthlyIncome > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="text-xl font-bold text-green-600">${monthlyIncome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">${totalExpenses}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className={`text-xl font-bold ${remainingIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remainingIncome}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};