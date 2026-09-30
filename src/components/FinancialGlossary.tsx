import React, { useState } from 'react';
import { Search, BookOpen, Lightbulb, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'budgeting' | 'investing' | 'debt' | 'savings' | 'insurance' | 'taxes';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  examples: string[];
  relatedTerms: string[];
  tips: string[];
}

interface FinancialGlossaryProps {
  onTermSelect?: (term: GlossaryTerm) => void;
}

export const FinancialGlossary: React.FC<FinancialGlossaryProps> = ({ onTermSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const glossaryTerms: GlossaryTerm[] = [
    {
      id: '1',
      term: 'Emergency Fund',
      definition: 'A savings account set aside for unexpected expenses or financial emergencies, typically covering 3-6 months of living expenses.',
      category: 'savings',
      difficulty: 'beginner',
      examples: [
        'Medical bills not covered by insurance',
        'Unexpected car repairs',
        'Job loss or reduced income',
        'Major home repairs'
      ],
      relatedTerms: ['Liquid Assets', 'Safety Net', 'Cash Reserves'],
      tips: [
        'Start with a goal of $1,000 for small emergencies',
        'Keep emergency funds in a high-yield savings account',
        'Automate transfers to build your fund gradually'
      ]
    },
    {
      id: '2',
      term: 'Compound Interest',
      definition: 'Interest calculated on the initial principal and accumulated interest from previous periods, creating exponential growth over time.',
      category: 'investing',
      difficulty: 'intermediate',
      examples: [
        'Earning interest on your savings account balance plus previous interest',
        'Investment returns that are reinvested to generate additional returns',
        'Credit card debt that grows when minimum payments don\'t cover interest'
      ],
      relatedTerms: ['Simple Interest', 'Annual Percentage Yield', 'Time Value of Money'],
      tips: [
        'Start investing early to maximize compound growth',
        'Reinvest dividends and interest for maximum benefit',
        'Be aware of compound interest working against you in debt'
      ]
    },
    {
      id: '3',
      term: 'Asset Allocation',
      definition: 'The strategy of dividing investments among different asset categories (stocks, bonds, cash) to balance risk and reward based on goals and risk tolerance.',
      category: 'investing',
      difficulty: 'advanced',
      examples: [
        '60% stocks, 30% bonds, 10% cash for moderate risk tolerance',
        '80% stocks, 20% bonds for aggressive growth strategy',
        'Target-date funds that automatically adjust allocation over time'
      ],
      relatedTerms: ['Diversification', 'Risk Tolerance', 'Portfolio Rebalancing'],
      tips: [
        'Review and rebalance your allocation annually',
        'Consider your age and time horizon when allocating',
        'Don\'t put all eggs in one basket - diversify across asset classes'
      ]
    },
    {
      id: '4',
      term: 'Debt-to-Income Ratio',
      definition: 'A percentage that compares your total monthly debt payments to your gross monthly income, used by lenders to assess creditworthiness.',
      category: 'debt',
      difficulty: 'beginner',
      examples: [
        'If you earn $5,000/month and pay $1,500 in debt, your DTI is 30%',
        'Mortgage, car loans, credit cards, and student loans all count as debt',
        'Most lenders prefer DTI below 36% for new loans'
      ],
      relatedTerms: ['Credit Score', 'Debt Consolidation', 'Credit Utilization'],
      tips: [
        'Aim for a DTI below 36% for financial health',
        'Pay down high-interest debt first to improve your ratio',
        'Consider increasing income or reducing expenses to lower DTI'
      ]
    },
    {
      id: '5',
      term: 'Dollar-Cost Averaging',
      definition: 'An investment strategy where you invest a fixed amount regularly regardless of market conditions, reducing the impact of market volatility.',
      category: 'investing',
      difficulty: 'intermediate',
      examples: [
        'Investing $500 monthly in an index fund regardless of price',
        'Automatic 401(k) contributions from each paycheck',
        'Setting up automatic investments in a brokerage account'
      ],
      relatedTerms: ['Market Timing', 'Volatility', 'Index Funds'],
      tips: [
        'Automate investments to maintain consistency',
        'Works best with diversified investments like index funds',
        'Don\'t try to time the market - stay consistent'
      ]
    },
    {
      id: '6',
      term: 'Net Worth',
      definition: 'The total value of your assets minus your liabilities, representing your overall financial position.',
      category: 'budgeting',
      difficulty: 'beginner',
      examples: [
        'Assets: $50,000 (savings + investments + home equity)',
        'Liabilities: $30,000 (mortgage + car loan + credit cards)',
        'Net Worth: $20,000 ($50,000 - $30,000)'
      ],
      relatedTerms: ['Assets', 'Liabilities', 'Financial Statement'],
      tips: [
        'Calculate your net worth annually to track progress',
        'Focus on increasing assets and decreasing liabilities',
        'Don\'t get discouraged by negative net worth early in life'
      ]
    }
  ];

  const categories = [
    { key: 'all', label: 'All Categories', icon: BookOpen },
    { key: 'budgeting', label: 'Budgeting', icon: PieChart },
    { key: 'investing', label: 'Investing', icon: TrendingUp },
    { key: 'savings', label: 'Savings', icon: DollarSign },
    { key: 'debt', label: 'Debt', icon: Lightbulb },
  ];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      budgeting: 'bg-blue-100 text-blue-800',
      investing: 'bg-green-100 text-green-800',
      debt: 'bg-red-100 text-red-800',
      savings: 'bg-purple-100 text-purple-800',
      insurance: 'bg-orange-100 text-orange-800',
      taxes: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Financial Glossary</h2>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search financial terms..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terms List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredTerms.map((term) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedTerm?.id === term.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => {
                  setSelectedTerm(term);
                  onTermSelect?.(term);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{term.term}</h3>
                  <div className="flex gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(term.category)}`}>
                      {term.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(term.difficulty)}`}>
                      {term.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{term.definition}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Term Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          {selectedTerm ? (
            <motion.div
              key={selectedTerm.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{selectedTerm.term}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(selectedTerm.difficulty)}`}>
                    {selectedTerm.difficulty}
                  </span>
                </div>
                <p className="text-gray-700">{selectedTerm.definition}</p>
              </div>

              {selectedTerm.examples.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Examples:</h4>
                  <ul className="space-y-1">
                    {selectedTerm.examples.map((example, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTerm.tips.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Tips:
                  </h4>
                  <ul className="space-y-1">
                    {selectedTerm.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">💡</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTerm.relatedTerms.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Related Terms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.relatedTerms.map((relatedTerm, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                        onClick={() => setSearchQuery(relatedTerm)}
                      >
                        {relatedTerm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Select a term to see detailed information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};