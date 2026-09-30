import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        profile: 'Profile',
        input: 'Financial Data',
        analysis: 'Analysis',
        simulator: 'Simulator',
        coach: 'AI Coach',
        challenges: 'Challenges',
        accessibility: 'Accessibility',
        insights: 'Insights'
      },
      // Authentication
      auth: {
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        forgotPassword: 'Forgot Password?',
        createAccount: 'Create Account',
        welcomeBack: 'Welcome Back',
        getStarted: 'Get Started',
        resetPassword: 'Reset Password',
        checkEmail: 'Check Your Email',
        resetFailed: 'Reset Failed'
      },
      // Profile
      profile: {
        welcome: 'Welcome back,',
        level: 'Level',
        experience: 'Experience',
        badges: 'Badges',
        streak: 'Streak',
        totalSaved: 'Total Saved',
        activeGoals: 'Active Goals'
      },
      // Input
      input: {
        monthlyIncome: 'Monthly Income',
        addExpense: 'Add Expense',
        category: 'Category',
        amount: 'Amount',
        description: 'Description',
        save: 'Save',
        saved: 'Saved!',
        uploadCSV: 'Upload CSV',
        sampleCSV: 'Sample CSV',
        fileName: 'File Name',
        preview: 'Preview',
        emergencyFund: 'Emergency Fund',
        currentSavings: 'Current Savings'
      },
      // Analysis
      analysis: {
        title: 'Expense Analysis',
        needs: 'Needs',
        wants: 'Wants',
        optional: 'Optional',
        spendingByType: 'Spending by Type',
        spendingByCategory: 'Spending by Category'
      },
      // Insights
      insights: {
        title: 'Financial Insights',
        incomeExpenseRatio: 'Income vs Expense Ratio',
        emergencyFundScore: 'Emergency Fund Score',
        savingsForecast: 'Savings Forecast',
        expenseEfficiency: 'Expense Efficiency',
        monthlyPotential: 'Monthly Savings Potential',
        financialHealth: 'Financial Health Score'
      },
      // Challenges
      challenges: {
        title: 'Challenges',
        active: 'Active Challenges',
        available: 'Available Challenges',
        completed: 'Completed Challenges',
        start: 'Start Challenge',
        complete: 'Mark Complete',
        progress: 'Progress'
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        next: 'Next',
        previous: 'Previous',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        days: 'days',
        currency: '₹',
        months: 'months',
        years: 'years'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        profile: 'प्रोफ़ाइल',
        input: 'वित्तीय डेटा',
        analysis: 'विश्लेषण',
        simulator: 'सिमुलेटर',
        coach: 'AI कोच',
        challenges: 'चुनौतियां',
        accessibility: 'पहुंच',
        insights: 'अंतर्दृष्टि'
      },
      auth: {
        login: 'लॉगिन',
        logout: 'लॉगआउट',
        email: 'ईमेल',
        password: 'पासवर्ड',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
        forgotPassword: 'पासवर्ड भूल गए?',
        createAccount: 'खाता बनाएं',
        welcomeBack: 'वापसी पर स्वागत',
        getStarted: 'शुरू करें',
        resetPassword: 'पासवर्ड रीसेट करें',
        checkEmail: 'अपना ईमेल जांचें',
        resetFailed: 'रीसेट असफल'
      },
      profile: {
        welcome: 'वापसी पर स्वागत,',
        level: 'स्तर',
        experience: 'अनुभव',
        badges: 'बैज',
        streak: 'लगातार',
        totalSaved: 'कुल बचत',
        activeGoals: 'सक्रिय लक्ष्य'
      },
      input: {
        monthlyIncome: 'मासिक आय',
        addExpense: 'खर्च जोड़ें',
        category: 'श्रेणी',
        amount: 'राशि',
        description: 'विवरण',
        save: 'सेव करें',
        saved: 'सेव हो गया!',
        uploadCSV: 'CSV अपलोड करें',
        sampleCSV: 'नमूना CSV',
        fileName: 'फ़ाइल का नाम',
        preview: 'पूर्वावलोकन',
        emergencyFund: 'आपातकालीन फंड',
        currentSavings: 'वर्तमान बचत'
      },
      analysis: {
        title: 'खर्च विश्लेषण',
        needs: 'जरूरतें',
        wants: 'इच्छाएं',
        optional: 'वैकल्पिक',
        spendingByType: 'प्रकार के अनुसार खर्च',
        spendingByCategory: 'श्रेणी के अनुसार खर्च'
      },
      insights: {
        title: 'वित्तीय अंतर्दृष्टि',
        incomeExpenseRatio: 'आय बनाम व्यय अनुपात',
        emergencyFundScore: 'आपातकालीन फंड स्कोर',
        savingsForecast: 'बचत पूर्वानुमान',
        expenseEfficiency: 'व्यय दक्षता',
        monthlyPotential: 'मासिक बचत क्षमता',
        financialHealth: 'वित्तीय स्वास्थ्य स्कोर'
      },
      challenges: {
        title: 'चुनौतियां',
        active: 'सक्रिय चुनौतियां',
        available: 'उपलब्ध चुनौतियां',
        completed: 'पूर्ण चुनौतियां',
        start: 'चुनौती शुरू करें',
        complete: 'पूर्ण चिह्नित करें',
        progress: 'प्रगति'
      },
      common: {
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        close: 'बंद करें',
        next: 'अगला',
        previous: 'पिछला',
        small: 'छोटा',
        medium: 'मध्यम',
        large: 'बड़ा',
        days: 'दिन',
        currency: '₹',
        months: 'महीने',
        years: 'साल'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;