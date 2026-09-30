import React, { useState, useRef } from 'react';
import { Plus, Upload, Download, AlertCircle, Check, Eye, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expense } from '../types';
import { parseCSV, generateSampleCSV } from '../utils/csvParser';
import { useTranslation } from 'react-i18next';

interface EnhancedExpenseInputProps {
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

export const EnhancedExpenseInput: React.FC<EnhancedExpenseInputProps> = ({
  expenses,
  onExpensesChange,
  monthlyIncome,
  onIncomeChange,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
  });
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<Expense[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    setHasUnsavedChanges(true);
  };

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter(expense => expense.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setCsvError(null);
    setUploadedFileName(file.name);

    try {
      const parsedExpenses = await parseCSV(file);
      setCsvPreview(parsedExpenses);
      setShowPreview(true);
    } catch (error) {
      setCsvError(error instanceof Error ? error.message : 'Failed to parse CSV file');
      setUploadedFileName(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const confirmCSVImport = () => {
    if (csvPreview) {
      onExpensesChange([...expenses, ...csvPreview]);
      setCsvPreview(null);
      setShowPreview(false);
      setUploadedFileName(null);
      setHasUnsavedChanges(true);
    }
  };

  const cancelCSVImport = () => {
    setCsvPreview(null);
    setShowPreview(false);
    setUploadedFileName(null);
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

  const handleSave = async () => {
    setSaveStatus('saving');
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setIsSaving(false);
      setHasUnsavedChanges(false);
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 1000);
  };

  const handleIncomeChange = (value: number) => {
    onIncomeChange(value);
    setHasUnsavedChanges(true);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingIncome = monthlyIncome - totalExpenses;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {t('input.monthlyIncome')}
        </h2>
        
        {hasUnsavedChanges && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              saveStatus === 'saved'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('common.loading')}
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Check className="w-4 h-4" />
                {t('input.saved')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('input.save')}
              </>
            )}
          </motion.button>
        )}
      </div>
      
      {/* Monthly Income */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {t('input.monthlyIncome')}
        </label>
        <input
          type="number"
          value={monthlyIncome || ''}
          onChange={(e) => handleIncomeChange(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2 border rounded-lg transition-colors duration-200 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
          placeholder="Enter your monthly income"
        />
      </div>

      {/* CSV Upload Section */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Bulk Upload
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <label className="flex-1 cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              disabled={isUploading}
            />
            <div className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? t('common.loading') : t('input.uploadCSV')}
            </div>
          </label>
          
          <button
            onClick={downloadSampleCSV}
            className="flex items-center justify-center px-4 py-2 rounded-lg transition-colors bg-gray-600 text-white hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('input.sampleCSV')}
          </button>
        </div>

        {uploadedFileName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2 rounded bg-blue-50"
          >
            <span className="text-sm text-blue-700">
              {t('input.fileName')}: {uploadedFileName}
            </span>
          </motion.div>
        )}

        {csvError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"
          >
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{csvError}</p>
          </motion.div>
        )}
      </div>

      {/* CSV Preview Modal */}
      <AnimatePresence>
        {showPreview && csvPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full max-h-[80vh] rounded-xl shadow-2xl overflow-hidden bg-white"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    {t('input.preview')} ({csvPreview.length} items)
                  </h3>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {csvPreview.map((expense, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize text-gray-800">
                            {expense.category}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            expense.type === 'needs' ? 'bg-red-100 text-red-800' :
                            expense.type === 'wants' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {expense.type}
                          </span>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-gray-600">
                            {expense.description}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-gray-800">
                        ${expense.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={cancelCSVImport}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={confirmCSVImport}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Import {csvPreview.length} Expenses
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Entry */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {t('input.addExpense')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            className="px-3 py-2 border rounded-lg transition-colors duration-200 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
          >
            <option value="">{t('input.category')}</option>
            {EXPENSE_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            placeholder={t('input.amount')}
            className="px-3 py-2 border rounded-lg transition-colors duration-200 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
          />
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            placeholder={t('input.description')}
            className="px-3 py-2 border rounded-lg transition-colors duration-200 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addExpense}
            disabled={!newExpense.category || !newExpense.amount}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </motion.button>
        </div>
      </div>

      {/* Expense List */}
      {expenses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Current Expenses
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {expenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize text-gray-800">
                        {expense.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        expense.type === 'needs' ? 'bg-red-100 text-red-800' :
                        expense.type === 'wants' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {expense.type}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-gray-600">
                        {expense.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">
                      ${expense.amount}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 transition-colors text-xl font-bold"
                    >
                      ×
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Summary */}
      {monthlyIncome > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">
                Monthly Income
              </p>
              <p className="text-xl font-bold text-green-600">
                ${monthlyIncome}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Total Expenses
              </p>
              <p className="text-xl font-bold text-red-600">
                ${totalExpenses}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-gray-600">
                Remaining
              </p>
              <p className={`text-xl font-bold ${
                remainingIncome >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${remainingIncome}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};