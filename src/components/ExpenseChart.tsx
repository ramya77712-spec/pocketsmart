import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Expense } from '../types';
import { categorizeExpenses } from '../utils/calculations';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseChartProps {
  expenses: Expense[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  const categorizedExpenses = categorizeExpenses(expenses);
  
  // Calculate totals by type
  const typeData = {
    needs: categorizedExpenses.needs?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
    wants: categorizedExpenses.wants?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
    optional: categorizedExpenses.optional?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
  };

  // Calculate totals by category
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const pieData = {
    labels: ['Needs', 'Wants', 'Optional'],
    datasets: [
      {
        data: [typeData.needs, typeData.wants, typeData.optional],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red for needs
          'rgba(245, 158, 11, 0.8)',  // Yellow for wants  
          'rgba(59, 130, 246, 0.8)',  // Blue for optional
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: Object.keys(categoryData).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        label: 'Amount ($)',
        data: Object.values(categoryData),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed || context.parsed.y;
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Expense Analysis</h2>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Add expenses to see your spending analysis</p>
        </div>
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Expense Analysis</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <h3 className="font-semibold text-red-800">Needs</h3>
          <p className="text-2xl font-bold text-red-600">${typeData.needs.toLocaleString()}</p>
          <p className="text-sm text-red-600">
            {totalAmount > 0 ? ((typeData.needs / totalAmount) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
          <h3 className="font-semibold text-yellow-800">Wants</h3>
          <p className="text-2xl font-bold text-yellow-600">${typeData.wants.toLocaleString()}</p>
          <p className="text-sm text-yellow-600">
            {totalAmount > 0 ? ((typeData.wants / totalAmount) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-800">Optional</h3>
          <p className="text-2xl font-bold text-blue-600">${typeData.optional.toLocaleString()}</p>
          <p className="text-sm text-blue-600">
            {totalAmount > 0 ? ((typeData.optional / totalAmount) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending by Type</h3>
          <div className="h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending by Category</h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};