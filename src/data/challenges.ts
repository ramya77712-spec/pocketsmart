import { Challenge } from '../types';

export const MONTHLY_CHALLENGES: Challenge[] = [
  {
    id: 'cook-at-home',
    title: 'घर का खाना चुनौती (Cook at Home Challenge)',
    description: 'Cook all meals at home for 7 days to save ₹500+ on dining expenses',
    target: 7,
    category: 'dining',
    duration: 7,
    reward: {
      id: 'home-chef',
      name: 'घर का शेफ (Home Chef)',
      description: 'Cooked at home for a full week and saved money',
      icon: '👨‍🍳',
      unlockedAt: new Date(),
      category: 'milestone'
    },
    isActive: false,
    progress: 0
  },
  {
    id: 'emergency-fund-boost',
    title: 'आपातकालीन फंड बूस्ट (Emergency Fund Sprint)',
    description: 'Add ₹2,000 to your emergency fund this month for financial security',
    target: 2000,
    category: 'savings',
    duration: 30,
    reward: {
      id: 'emergency-booster',
      name: 'सुरक्षा योद्धा (Safety Warrior)',
      description: 'Boosted emergency fund for family security',
      icon: '🛡️',
      unlockedAt: new Date(),
      category: 'milestone'
    },
    isActive: false,
    progress: 0
  },
  {
    id: 'mindful-spending',
    title: 'सोच-समझकर खर्च (Mindful Spending)',
    description: 'Wait 24 hours before any non-essential purchase over ₹1,000',
    target: 10,
    category: 'shopping',
    duration: 30,
    reward: {
      id: 'mindful-spender',
      name: 'बुद्धिमान खरीदार (Smart Shopper)',
      description: 'Practiced thoughtful purchasing decisions',
      icon: '🧘',
      unlockedAt: new Date(),
      category: 'milestone'
    },
    isActive: false,
    progress: 0
  },
  {
    id: 'subscription-cleanup',
    title: 'सब्स्क्रिप्शन सफाई (Subscription Cleanup)',
    description: 'Cancel at least 2 unused subscriptions to save ₹300+ monthly',
    target: 3,
    category: 'subscriptions',
    duration: 30,
    reward: {
      id: 'subscription-slayer',
      name: 'सब्स्क्रिप्शन मास्टर (Subscription Master)',
      description: 'Eliminated unnecessary subscriptions',
      icon: '✂️',
      unlockedAt: new Date(),
      category: 'savings'
    },
    isActive: false,
    progress: 0
  },
  {
    id: 'daily-savings',
    title: 'दैनिक बचत (Daily Savings)',
    description: 'Save ₹50 every day for 2 weeks by making small changes',
    target: 700,
    category: 'dining',
    duration: 14,
    reward: {
      id: 'daily-saver',
      name: 'दैनिक बचतकर्ता (Daily Saver)',
      description: 'Saved money through daily discipline',
      icon: '💰',
      unlockedAt: new Date(),
      category: 'savings'
    },
    isActive: false,
    progress: 0
  },
];

export const getActiveChallenges = (challenges: Challenge[]): Challenge[] => {
  return challenges.filter(challenge => challenge.isActive);
};

export const getCompletedChallenges = (challenges: Challenge[]): Challenge[] => {
  return challenges.filter(challenge => challenge.progress >= challenge.target);
};