export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  type: 'needs' | 'wants' | 'luxuries';
  date?: string;
  isRecurring?: boolean;
}

export interface FinancialData {
  monthlyIncome: number;
  expenses: Expense[];
  emergencyFund: number;
  currentSavings: number;
}

export interface SavingsScenario {
  diningReduction: number;
  entertainmentReduction: number;
  shoppingReduction: number;
  subscriptionReduction: number;
  transportationReduction: number;
  luxuryReduction: number;
}

export interface CompoundInterestProjection {
  years: number;
  futureValue: number;
  totalContributions: number;
  interestEarned: number;
  monthlyContribution: number;
}

export interface AIInsight {
  categorization: {
    needs: string[];
    wants: string[];
    luxuries: string[];
    suggestions: string[];
  };
  savingsRecommendations: {
    monthlyTarget: number;
    strategies: string[];
    priorityAreas: string[];
    emergencyFundTarget: number;
  };
  projections: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  healthScore: number;
  motivationalMessage: string;
  personalizedTips: string[];
  riskAssessment: string;
}

export interface UserProfile {
  id: string;
  name: string;
  persona: PersonaType;
  level: number;
  experience: number;
  badges: Badge[];
  streakDays: number;
  totalSaved: number;
  goals: FinancialGoal[];
  preferences: UserPreferences;
  conversationHistory: ConversationEntry[];
  learningProgress: LearningProgress;
  teamId?: string;
  role?: 'member' | 'leader';
  createdAt: Date;
  lastActive: Date;
}

export interface ConversationEntry {
  id: string;
  timestamp: Date;
  userMessage: string;
  aiResponse: string;
  context: {
    financialData: Partial<FinancialData>;
    userMood?: 'frustrated' | 'excited' | 'confused' | 'neutral';
    topicCategory: 'budgeting' | 'investing' | 'debt' | 'goals' | 'general';
  };
}

export interface LearningProgress {
  completedModules: string[];
  currentStreak: number;
  totalQuizzesTaken: number;
  averageScore: number;
  certificates: Certificate[];
  weakAreas: string[];
  strongAreas: string[];
}

export interface Certificate {
  id: string;
  name: string;
  category: string;
  earnedAt: Date;
  score: number;
  validUntil?: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  sharedGoals: FinancialGoal[];
  createdAt: Date;
  inviteCode: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  role: 'member' | 'leader';
  joinedAt: Date;
  contribution: number;
}

export interface ShareableReport {
  id: string;
  userId: string;
  type: 'progress' | 'achievement' | 'goal';
  title: string;
  description: string;
  imageUrl?: string;
  data: any;
  createdAt: Date;
  isPublic: boolean;
}

export interface PersonaType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultIncome: number;
  defaultExpenses: Expense[];
  savingsTarget: number;
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'savings' | 'streak' | 'goal' | 'learning' | 'milestone';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: 'emergency' | 'vacation' | 'house' | 'car' | 'retirement' | 'custom';
  priority: 'high' | 'medium' | 'low';
}

export interface UserPreferences {
  currency: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  coachingStyle: 'gentle' | 'motivational' | 'direct';
  language: string;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    shareProgress: boolean;
    allowTeamInvites: boolean;
    dataRetention: number; // days
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  category: string;
  duration: number; // days
  reward: Badge;
  isActive: boolean;
  progress: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'budgeting' | 'investing' | 'debt' | 'emergency' | 'goals';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  completed: boolean;
  scenarios: LearningScenario[];
}

export interface LearningScenario {
  id: string;
  title: string;
  situation: string;
  options: ScenarioOption[];
  correctAnswer: string;
  explanation: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  outcome: string;
  isCorrect: boolean;
}

export interface TeamGoal extends FinancialGoal {
  teamId: string;
  createdBy: string;
  contributors: { userId: string; amount: number }[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'leader' | 'member';
  contribution: number;
  joinedAt: Date;
  isOnline: boolean;
}

export interface AIConversationMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  tone?: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export interface ProgressReport {
  userId: string;
  generatedAt: Date;
  level: number;
  totalSaved: number;
  badgesEarned: number;
  streakDays: number;
  recentAchievements: Badge[];
  financialHealthScore: number;
}