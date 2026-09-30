import { PersonaType, Expense } from '../types';

export const PERSONAS: PersonaType[] = [
  {
    id: 'student',
    name: 'छात्र (College Student)',
    description: 'Managing finances on a tight budget while studying in India',
    icon: '🎓',
    defaultIncome: 15000,
    savingsTarget: 2000,
    riskTolerance: 'low',
    defaultExpenses: [
      { id: '1', category: 'rent', amount: 6000, description: 'Shared PG/hostel', type: 'needs' },
      { id: '2', category: 'groceries', amount: 2000, description: 'Basic groceries', type: 'needs' },
      { id: '3', category: 'transportation', amount: 800, description: 'Bus/metro pass', type: 'needs' },
      { id: '4', category: 'education', amount: 1000, description: 'Books, stationery', type: 'needs' },
      { id: '5', category: 'dining', amount: 1500, description: 'Canteen, eating out', type: 'wants' },
      { id: '6', category: 'entertainment', amount: 1000, description: 'Movies, games', type: 'wants' },
      { id: '7', category: 'subscriptions', amount: 500, description: 'Internet, streaming', type: 'luxuries' },
    ]
  },
  {
    id: 'freelancer',
    name: 'फ्रीलांसर (Freelancer)',
    description: 'Variable income with irregular cash flow',
    icon: '💻',
    defaultIncome: 35000,
    savingsTarget: 7000,
    riskTolerance: 'medium',
    defaultExpenses: [
      { id: '1', category: 'rent', amount: 12000, description: 'Home office rent', type: 'needs' },
      { id: '2', category: 'utilities', amount: 3000, description: 'Internet, electricity', type: 'needs' },
      { id: '3', category: 'groceries', amount: 4000, description: 'Monthly groceries', type: 'needs' },
      { id: '4', category: 'insurance', amount: 2000, description: 'Health insurance', type: 'needs' },
      { id: '5', category: 'business', amount: 2500, description: 'Software, tools', type: 'needs' },
      { id: '6', category: 'dining', amount: 2000, description: 'Client meetings', type: 'wants' },
      { id: '7', category: 'coworking', amount: 1500, description: 'Coworking space', type: 'wants' },
      { id: '8', category: 'courses', amount: 1000, description: 'Skill development', type: 'luxuries' },
    ]
  },
  {
    id: 'working-parent',
    name: 'कामकाजी माता-पिता (Working Parent)',
    description: 'Balancing family expenses with career growth in Indian context',
    icon: '👨‍👩‍👧‍👦',
    defaultIncome: 55000,
    savingsTarget: 8000,
    riskTolerance: 'medium',
    defaultExpenses: [
      { id: '1', category: 'rent', amount: 18000, description: 'Family home/EMI', type: 'needs' },
      { id: '2', category: 'utilities', amount: 3000, description: 'Electricity, water, gas', type: 'needs' },
      { id: '3', category: 'groceries', amount: 8000, description: 'Family groceries', type: 'needs' },
      { id: '4', category: 'childcare', amount: 5000, description: 'School fees, tuition', type: 'needs' },
      { id: '5', category: 'insurance', amount: 4000, description: 'Family health insurance', type: 'needs' },
      { id: '6', category: 'transportation', amount: 4000, description: 'Fuel, maintenance', type: 'needs' },
      { id: '7', category: 'education', amount: 3000, description: 'Kids activities, books', type: 'wants' },
      { id: '8', category: 'dining', amount: 2500, description: 'Family dining out', type: 'wants' },
      { id: '9', category: 'entertainment', amount: 1500, description: 'Movies, outings', type: 'wants' },
      { id: '10', category: 'subscriptions', amount: 1000, description: 'Streaming, apps', type: 'luxuries' },
    ]
  },
  {
    id: 'young-professional',
    name: 'युवा पेशेवर (Young Professional)',
    description: 'Early career with growth potential',
    icon: '💼',
    defaultIncome: 42000,
    savingsTarget: 8400,
    riskTolerance: 'high',
    defaultExpenses: [
      { id: '1', category: 'rent', amount: 14000, description: 'City apartment/PG', type: 'needs' },
      { id: '2', category: 'utilities', amount: 2000, description: 'Electricity, internet', type: 'needs' },
      { id: '3', category: 'groceries', amount: 3500, description: 'Monthly groceries', type: 'needs' },
      { id: '4', category: 'transportation', amount: 2000, description: 'Metro, cab, fuel', type: 'needs' },
      { id: '5', category: 'insurance', amount: 1800, description: 'Health insurance', type: 'needs' },
      { id: '6', category: 'dining', amount: 4000, description: 'Restaurants, office lunch', type: 'wants' },
      { id: '7', category: 'entertainment', amount: 2000, description: 'Movies, events', type: 'wants' },
      { id: '8', category: 'shopping', amount: 3000, description: 'Clothes, gadgets', type: 'wants' },
      { id: '9', category: 'fitness', amount: 1500, description: 'Gym membership', type: 'wants' },
      { id: '10', category: 'subscriptions', amount: 1000, description: 'Netflix, Spotify, apps', type: 'luxuries' },
      { id: '11', category: 'travel', amount: 2000, description: 'Weekend trips', type: 'luxuries' },
    ]
  },
  {
    id: 'retiree',
    name: 'सेवानिवृत्त (Retiree)',
    description: 'Fixed income with focus on preservation',
    icon: '🏖️',
    defaultIncome: 32000,
    savingsTarget: 3200,
    riskTolerance: 'low',
    defaultExpenses: [
      { id: '1', category: 'housing', amount: 8000, description: 'House maintenance', type: 'needs' },
      { id: '2', category: 'utilities', amount: 2500, description: 'All utilities', type: 'needs' },
      { id: '3', category: 'groceries', amount: 5000, description: 'Monthly groceries', type: 'needs' },
      { id: '4', category: 'healthcare', amount: 6000, description: 'Medical expenses', type: 'needs' },
      { id: '5', category: 'insurance', amount: 2000, description: 'Health insurance', type: 'needs' },
      { id: '6', category: 'transportation', amount: 1500, description: 'Local travel', type: 'needs' },
      { id: '7', category: 'dining', amount: 2000, description: 'Occasional dining', type: 'wants' },
      { id: '8', category: 'hobbies', amount: 1500, description: 'Leisure activities', type: 'wants' },
      { id: '9', category: 'travel', amount: 2500, description: 'Pilgrimage, family visits', type: 'luxuries' },
    ]
  },
  {
    id: 'homemaker',
    name: 'गृहिणी (Homemaker)',
    description: 'Managing household budget and family savings',
    icon: '🏠',
    defaultIncome: 25000,
    savingsTarget: 3000,
    riskTolerance: 'low',
    defaultExpenses: [
      { id: '1', category: 'groceries', amount: 8000, description: 'Family groceries', type: 'needs' },
      { id: '2', category: 'utilities', amount: 2500, description: 'Electricity, water, gas', type: 'needs' },
      { id: '3', category: 'healthcare', amount: 2000, description: 'Family medical', type: 'needs' },
      { id: '4', category: 'education', amount: 3000, description: 'Children\'s education', type: 'needs' },
      { id: '5', category: 'transportation', amount: 1500, description: 'Local transport', type: 'needs' },
      { id: '6', category: 'household', amount: 1000, description: 'Cleaning supplies', type: 'needs' },
      { id: '7', category: 'clothing', amount: 1500, description: 'Family clothing', type: 'wants' },
      { id: '8', category: 'entertainment', amount: 1000, description: 'Family outings', type: 'wants' },
      { id: '9', category: 'savings', amount: 1500, description: 'Children\'s future', type: 'luxuries' },
    ]
  }
];

export const getPersonaById = (id: string): PersonaType | undefined => {
  return PERSONAS.find(persona => persona.id === id);
};

export const getDefaultPersona = (): PersonaType => {
  return PERSONAS[0]; // Student as default
};