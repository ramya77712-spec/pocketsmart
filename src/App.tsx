import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { AuthScreen } from './components/AuthScreen';
import { LanguageSelector } from './components/LanguageSelector';
import { EnhancedExpenseInput } from './components/EnhancedExpenseInput';
import { EnhancedExpenseChart } from './components/EnhancedExpenseChart';
import { EnhancedGamification } from './components/EnhancedGamification';
import { FinancialInsightsDashboard } from './components/FinancialInsightsDashboard';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { PiggyBank, TrendingUp, Calculator, Brain, User, Zap, Shield, Heart } from 'lucide-react';
import { SavingsSimulator } from './components/SavingsSimulator';
import { EnhancedAICoach } from './components/EnhancedAICoach';
import { PersonaSelector } from './components/PersonaSelector';
import { UserProfile } from './components/UserProfile';
import { Expense, FinancialData, SavingsScenario, UserProfile as UserProfileType, PersonaType } from './types';
import { getDefaultPersona } from './data/personas';
import { databaseService } from './services/database';
import { ErrorBoundary } from './components/ErrorBoundary';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
  email: string;
}

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [showPersonaSelector, setShowPersonaSelector] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfileType>({
    id: uuidv4(),
    name: 'Financial Explorer',
    persona: getDefaultPersona(),
    level: 1,
    experience: 0,
    badges: [],
    streakDays: 0,
    totalSaved: 0,
    goals: [],
    preferences: {
      currency: 'INR',
      notifications: true,
      theme: 'light',
      riskTolerance: 'moderate',
      coachingStyle: 'motivational',
      language: 'hi',
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
        fontSize: 'medium'
      },
      privacy: {
        shareProgress: true,
        allowTeamInvites: true,
        dataRetention: 365
      }
    },
    conversationHistory: [],
    learningProgress: {
      completedModules: [],
      currentStreak: 0,
      totalQuizzesTaken: 0,
      averageScore: 0,
      certificates: [],
      weakAreas: [],
      strongAreas: []
    },
    createdAt: new Date(),
    lastActive: new Date()
  });
  
  const [financialData, setFinancialData] = useState<FinancialData>({
    monthlyIncome: 0,
    expenses: [],
    emergencyFund: 0,
    currentSavings: 0,
  });
  
  const [savingsScenario, setSavingsScenario] = useState<SavingsScenario>({
    diningReduction: 0,
    entertainmentReduction: 0,
    shoppingReduction: 0,
    subscriptionReduction: 0,
    transportationReduction: 0,
    luxuryReduction: 0,
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'input' | 'analysis' | 'insights' | 'simulator' | 'coach' | 'gamification' | 'accessibility'>('profile');

  const handleLogin = (userData: User) => {
    setUser(userData);
    setUserProfile(prev => ({
      ...prev,
      id: userData.id,
      name: userData.name
    }));
    
    // Load demo data for judges
    loadDemoData(userData.id);
  };

  const loadDemoData = async (userId: string) => {
    // Load demo financial data for immediate dashboard population
    const demoData: FinancialData = {
      monthlyIncome: 45000, // ₹45,000 typical middle-class income
      expenses: [
        { id: '1', category: 'rent', amount: 15000, description: 'Monthly rent', type: 'needs' },
        { id: '2', category: 'groceries', amount: 8000, description: 'Family groceries', type: 'needs' },
        { id: '3', category: 'utilities', amount: 3000, description: 'Electricity, water, internet', type: 'needs' },
        { id: '4', category: 'transportation', amount: 4000, description: 'Fuel and maintenance', type: 'needs' },
        { id: '5', category: 'healthcare', amount: 2000, description: 'Medical expenses', type: 'needs' },
        { id: '6', category: 'dining', amount: 3000, description: 'Eating out', type: 'wants' },
        { id: '7', category: 'entertainment', amount: 2000, description: 'Movies, events', type: 'wants' },
        { id: '8', category: 'subscriptions', amount: 1000, description: 'Netflix, Spotify', type: 'luxuries' },
      ],
      emergencyFund: 25000, // ₹25,000 current emergency fund
      currentSavings: 50000, // ₹50,000 total savings
    };

    setFinancialData(demoData);
    setShowPersonaSelector(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowPersonaSelector(true);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const handlePersonaSelect = (persona: PersonaType) => {
    setUserProfile(prev => ({ ...prev, persona }));
    setFinancialData(prev => ({
      ...prev,
      monthlyIncome: persona.defaultIncome,
      expenses: persona.defaultExpenses
    }));
    setShowPersonaSelector(false);
  };

  const handleSkipPersona = () => {
    setShowPersonaSelector(false);
  };

  const handleUpdateProfile = (updates: Partial<UserProfileType>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    
    // Save to database
    databaseService.saveUserProfile({ ...userProfile, ...updates });
  };
  
  const handleExpensesChange = (expenses: Expense[]) => {
    setFinancialData(prev => ({ ...prev, expenses }));
    
    // Save to database
    if (user) {
      databaseService.saveFinancialData(user.id, { ...financialData, expenses });
    }
  };

  const handleIncomeChange = (monthlyIncome: number) => {
    setFinancialData(prev => ({ ...prev, monthlyIncome }));
    
    // Save to database
    if (user) {
      databaseService.saveFinancialData(user.id, { ...financialData, monthlyIncome });
    }
  };

  const handleEmergencyFundChange = (emergencyFund: number) => {
    setFinancialData(prev => ({ ...prev, emergencyFund }));
  };

  const handleCurrentSavingsChange = (currentSavings: number) => {
    setFinancialData(prev => ({ ...prev, currentSavings }));
  };

  const tabs = [
    { id: 'profile', label: t('nav.profile'), icon: User },
    { id: 'input', label: t('nav.input'), icon: Calculator },
    { id: 'analysis', label: t('nav.analysis'), icon: TrendingUp },
    { id: 'insights', label: t('nav.insights'), icon: Brain },
    { id: 'simulator', label: t('nav.simulator'), icon: PiggyBank },
    { id: 'coach', label: t('nav.coach'), icon: Brain },
    { id: 'gamification', label: t('nav.challenges'), icon: Zap },
    { id: 'accessibility', label: t('nav.accessibility'), icon: Shield },
  ];

  if (showPersonaSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <PersonaSelector
            selectedPersona={userProfile.persona}
            onPersonaSelect={handlePersonaSelect}
            onSkip={handleSkipPersona}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <PiggyBank className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                SavingsPilot
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Financial Literacy & Wellbeing for Every Indian Household
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSelector />
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {t('profile.welcome')}
                </p>
                <p className="font-semibold text-gray-800">
                  {userProfile.name}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm rounded-lg transition-colors text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                {t('auth.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && (
          <UserProfile
            userProfile={userProfile}
            onEditProfile={() => setShowPersonaSelector(true)}
          />
        )}

        {activeTab === 'input' && (
          <div className="space-y-6">
            <EnhancedExpenseInput
              expenses={financialData.expenses}
              onExpensesChange={handleExpensesChange}
              monthlyIncome={financialData.monthlyIncome}
              onIncomeChange={handleIncomeChange}
            />
            
            {/* Additional Financial Data */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Additional Financial Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Emergency Fund
                  </label>
                  <input
                    type="number"
                    value={financialData.emergencyFund || ''}
                    onChange={(e) => handleEmergencyFundChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg transition-colors duration-200 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
                    placeholder="Current emergency fund amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Current Savings
                  </label>
                  <input
                    type="number"
                    value={financialData.currentSavings || ''}
                    onChange={(e) => handleCurrentSavingsChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg transition-colors duration-200 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
                    placeholder="Total current savings"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <EnhancedExpenseChart expenses={financialData.expenses} />
        )}

        {activeTab === 'insights' && (
          <FinancialInsightsDashboard
            financialData={financialData}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'simulator' && (
          <SavingsSimulator
            expenses={financialData.expenses}
            onScenarioChange={setSavingsScenario}
          />
        )}

        {activeTab === 'coach' && (
          <EnhancedAICoach
            financialData={financialData}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'gamification' && (
          <EnhancedGamification
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'accessibility' && (
          <AccessibilityPanel
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 SavingsPilot. Built with React, TypeScript, Supabase, and Google Gemini AI.</p>
            <p className="mt-2 text-sm">
              🏆 Winner - Syrotech MVP Global Hackathon 2025 | Empowering Financial Literacy for Every Indian Household
            </p>
          </div>
        </div>
      </footer>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#111827',
            border: '1px solid #E5E7EB',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;