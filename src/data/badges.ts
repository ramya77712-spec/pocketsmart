import { Badge } from '../types';

export const AVAILABLE_BADGES: Omit<Badge, 'unlockedAt'>[] = [
  // Savings Badges
  {
    id: 'first-save',
    name: 'First Steps',
    description: 'Saved your first $100',
    icon: '🌱',
    category: 'savings'
  },
  {
    id: 'savings-streak-7',
    name: 'Week Warrior',
    description: 'Maintained savings for 7 days',
    icon: '🔥',
    category: 'streak'
  },
  {
    id: 'savings-streak-30',
    name: 'Monthly Master',
    description: 'Maintained savings for 30 days',
    icon: '🏆',
    category: 'streak'
  },
  {
    id: 'emergency-fund',
    name: 'Safety Net',
    description: 'Built a 3-month emergency fund',
    icon: '🛡️',
    category: 'milestone'
  },
  {
    id: 'goal-crusher',
    name: 'Goal Crusher',
    description: 'Achieved your first financial goal',
    icon: '🎯',
    category: 'goal'
  },
  {
    id: 'budget-master',
    name: 'Budget Master',
    description: 'Stayed under budget for 3 months',
    icon: '📊',
    category: 'milestone'
  },
  {
    id: 'learning-enthusiast',
    name: 'Learning Enthusiast',
    description: 'Completed 5 learning modules',
    icon: '📚',
    category: 'learning'
  },
  {
    id: 'thousand-saver',
    name: 'Thousand Club',
    description: 'Saved $1,000 total',
    icon: '💰',
    category: 'savings'
  },
  {
    id: 'investment-starter',
    name: 'Investment Pioneer',
    description: 'Started your investment journey',
    icon: '📈',
    category: 'milestone'
  },
  {
    id: 'debt-free',
    name: 'Debt Destroyer',
    description: 'Eliminated all consumer debt',
    icon: '⚡',
    category: 'milestone'
  }
];

export const checkBadgeEligibility = (
  userProfile: any,
  financialData: any
): Badge[] => {
  const newBadges: Badge[] = [];
  const currentBadgeIds = userProfile.badges.map((b: Badge) => b.id);

  // Check each badge condition
  AVAILABLE_BADGES.forEach(badge => {
    if (currentBadgeIds.includes(badge.id)) return;

    let shouldUnlock = false;

    switch (badge.id) {
      case 'first-save':
        shouldUnlock = userProfile.totalSaved >= 100;
        break;
      case 'savings-streak-7':
        shouldUnlock = userProfile.streakDays >= 7;
        break;
      case 'savings-streak-30':
        shouldUnlock = userProfile.streakDays >= 30;
        break;
      case 'emergency-fund':
        shouldUnlock = financialData.emergencyFund >= (financialData.monthlyIncome * 3);
        break;
      case 'thousand-saver':
        shouldUnlock = userProfile.totalSaved >= 1000;
        break;
      case 'goal-crusher':
        shouldUnlock = userProfile.goals.some((g: any) => g.currentAmount >= g.targetAmount);
        break;
      case 'budget-master':
        // This would require tracking budget adherence over time
        shouldUnlock = userProfile.level >= 5;
        break;
      case 'learning-enthusiast':
        // This would require tracking completed modules
        shouldUnlock = userProfile.experience >= 500;
        break;
    }

    if (shouldUnlock) {
      newBadges.push({
        ...badge,
        unlockedAt: new Date()
      });
    }
  });

  return newBadges;
};