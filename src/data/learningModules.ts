import { LearningModule } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'emergency-fund-basics',
    title: 'आपातकालीन फंड की मूल बातें (Emergency Fund Basics)',
    description: 'Learn why emergency funds are crucial for Indian families and how to build one',
    category: 'emergency',
    difficulty: 'beginner',
    estimatedTime: 10,
    completed: false,
    scenarios: [
      {
        id: 'scenario-1',
        title: 'Emergency Fund Size for Indian Families',
        situation: 'Your monthly family expenses are ₹25,000. What should be your emergency fund target considering Indian job market volatility?',
        options: [
          {
            id: 'a',
            text: '₹25,000 (1 month)',
            outcome: 'This is too low for Indian families. Job searches can take 3-6 months.',
            isCorrect: false
          },
          {
            id: 'b',
            text: '₹1,50,000 (6 months)',
            outcome: 'Perfect! 6 months is ideal for Indian families considering job market uncertainty.',
            isCorrect: true
          },
          {
            id: 'c',
            text: '₹75,000 (3 months)',
            outcome: 'Good start, but 6 months is safer for Indian economic conditions.',
            isCorrect: false
          }
        ],
        correctAnswer: 'b',
        explanation: 'Indian families should aim for 6 months of expenses due to longer job search periods and economic volatility.'
      }
    ]
  },
  {
    id: 'budgeting-indian-families',
    title: 'भारतीय परिवारों के लिए बजटिंग (Budgeting for Indian Families)',
    description: 'Learn the 50/30/20 rule adapted for Indian household expenses',
    category: 'budgeting',
    difficulty: 'beginner',
    estimatedTime: 15,
    completed: false,
    scenarios: [
      {
        id: 'scenario-1',
        title: 'Indian Family Budget Allocation',
        situation: 'Your family earns ₹60,000 per month. How should you allocate according to Indian financial advisors?',
        options: [
          {
            id: 'a',
            text: '₹30,000 needs, ₹18,000 wants, ₹12,000 savings',
            outcome: 'Excellent! This follows the 50/30/20 rule adapted for Indian families.',
            isCorrect: true
          },
          {
            id: 'b',
            text: '₹40,000 needs, ₹15,000 wants, ₹5,000 savings',
            outcome: 'Too much on needs, too little on savings. Aim for 20% savings.',
            isCorrect: false
          },
          {
            id: 'c',
            text: '₹25,000 needs, ₹25,000 wants, ₹10,000 savings',
            outcome: 'Needs are too low for Indian families. Include healthcare, education costs.',
            isCorrect: false
          }
        ],
        correctAnswer: 'a',
        explanation: 'Indian families should allocate 50% to needs (including healthcare, education), 30% to wants, and 20% to savings.'
      }
    ]
  },
  {
    id: 'investment-basics-india',
    title: 'भारत में निवेश की मूल बातें (Investment Basics in India)',
    description: 'Understand SIP, mutual funds, and safe investment options for Indian investors',
    category: 'investing',
    difficulty: 'intermediate',
    estimatedTime: 20,
    completed: false,
    scenarios: [
      {
        id: 'scenario-1',
        title: 'First Investment for Indian Families',
        situation: 'You have ₹5,000 monthly surplus. What\'s the best first investment for Indian families?',
        options: [
          {
            id: 'a',
            text: 'Fixed Deposit in bank',
            outcome: 'Safe but low returns (5-6%). Good for emergency fund, not wealth building.',
            isCorrect: false
          },
          {
            id: 'b',
            text: 'SIP in diversified mutual fund',
            outcome: 'Excellent choice! SIPs provide rupee cost averaging and potential 10-12% returns.',
            isCorrect: true
          },
          {
            id: 'c',
            text: 'Direct stock investment',
            outcome: 'Too risky for beginners. Start with mutual funds first.',
            isCorrect: false
          }
        ],
        correctAnswer: 'b',
        explanation: 'SIP (Systematic Investment Plan) in mutual funds is ideal for Indian families - provides diversification, professional management, and rupee cost averaging.'
      }
    ]
  },
  {
    id: 'debt-management-india',
    title: 'कर्ज प्रबंधन (Debt Management)',
    description: 'Learn to manage credit cards, personal loans, and EMIs effectively',
    category: 'debt',
    difficulty: 'intermediate',
    estimatedTime: 18,
    completed: false,
    scenarios: [
      {
        id: 'scenario-1',
        title: 'Credit Card vs Personal Loan',
        situation: 'You need ₹2,00,000 for home renovation. Credit card offers 36% APR, personal loan offers 12% APR. What should you choose?',
        options: [
          {
            id: 'a',
            text: 'Credit card for convenience',
            outcome: 'Very expensive! 36% APR will cost you ₹72,000 extra per year.',
            isCorrect: false
          },
          {
            id: 'b',
            text: 'Personal loan at 12% APR',
            outcome: 'Much better choice! You\'ll save ₹48,000 annually compared to credit card.',
            isCorrect: true
          },
          {
            id: 'c',
            text: 'Mix of both',
            outcome: 'Unnecessarily complex. Stick with the lower interest option.',
            isCorrect: false
          }
        ],
        correctAnswer: 'b',
        explanation: 'Always choose the lowest interest rate option. Credit cards have very high interest rates and should be avoided for large purchases.'
      }
    ]
  },
  {
    id: 'insurance-planning-india',
    title: 'बीमा योजना (Insurance Planning)',
    description: 'Understand health insurance, term life insurance, and protection for Indian families',
    category: 'insurance',
    difficulty: 'beginner',
    estimatedTime: 12,
    completed: false,
    scenarios: [
      {
        id: 'scenario-1',
        title: 'Health Insurance Priority',
        situation: 'You\'re 28, married with one child. Monthly income ₹50,000. What insurance should you prioritize?',
        options: [
          {
            id: 'a',
            text: 'Family health insurance ₹10 lakh cover',
            outcome: 'Excellent priority! Medical costs are the #1 cause of financial stress in India.',
            isCorrect: true
          },
          {
            id: 'b',
            text: 'Term life insurance ₹1 crore',
            outcome: 'Important but health insurance should come first for immediate protection.',
            isCorrect: false
          },
          {
            id: 'c',
            text: 'Investment-linked insurance',
            outcome: 'Avoid! These products have poor returns. Separate insurance and investment.',
            isCorrect: false
          }
        ],
        correctAnswer: 'a',
        explanation: 'Health insurance should be the first priority for Indian families due to rising medical costs and limited public healthcare.'
      }
    ]
  }
];

export const getModulesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): LearningModule[] => {
  return LEARNING_MODULES.filter(module => module.difficulty === difficulty);
};

export const getModulesByCategory = (category: string): LearningModule[] => {
  return LEARNING_MODULES.filter(module => module.category === category);
};