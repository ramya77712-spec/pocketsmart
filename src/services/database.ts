import { supabase, Database } from '../config/supabase';
import { UserProfile, FinancialData, Badge, Challenge } from '../types';
import toast from 'react-hot-toast';

export class DatabaseService {
  // User Profile Management
  async saveUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: profile.id!,
          name: profile.name!,
          persona_id: profile.persona?.id || 'student',
          level: profile.level || 1,
          experience: profile.experience || 0,
          streak_days: profile.streakDays || 0,
          total_saved: profile.totalSaved || 0,
          preferences: profile.preferences || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving user profile:', error);
        throw error;
      }

      return this.mapToUserProfile(data);
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      if (!data) {
        // No profile found, return null to create new one
        return null;
      }

      return this.mapToUserProfile(data);
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Financial Data Management
  async saveFinancialData(userId: string, financialData: FinancialData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('financial_data')
        .upsert({
          user_id: userId,
          monthly_income: financialData.monthlyIncome,
          expenses: financialData.expenses,
          emergency_fund: financialData.emergencyFund,
          current_savings: financialData.currentSavings,
          currency: 'INR'
        });

      if (error) {
        console.error('Error saving financial data:', error);
        toast.error('Failed to save financial data. Please try again.');
        throw error;
      }

      toast.success('Financial data saved successfully!');
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }

  async getFinancialData(userId: string): Promise<FinancialData | null> {
    try {
      const { data, error } = await supabase
        .from('financial_data')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching financial data:', error);
        throw error;
      }

      if (!data) {
        // No financial data found, return default
        return {
          monthlyIncome: 0,
          expenses: [],
          emergencyFund: 0,
          currentSavings: 0
        };
      }

      return {
        monthlyIncome: data.monthly_income,
        expenses: data.expenses,
        emergencyFund: data.emergency_fund,
        currentSavings: data.current_savings
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Badge Management
  async unlockBadge(userId: string, badge: Badge): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badge.id,
          unlocked_at: badge.unlockedAt.toISOString(),
          category: badge.category
        });

      if (error) {
        console.error('Error unlocking badge:', error);
        return false;
      }

      toast.success(`Badge unlocked: ${badge.name}!`);
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching user badges:', error);
        return [];
      }

      return data.map(this.mapToBadge);
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Learning Progress Management
  async saveLearningProgress(
    userId: string, 
    moduleId: string, 
    completed: boolean, 
    score: number,
    timeSpent: number = 0
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: userId,
          module_id: moduleId,
          completed,
          score,
          completed_at: new Date().toISOString(),
          time_spent: timeSpent
        });

      if (error) {
        console.error('Error saving learning progress:', error);
        return false;
      }

      if (completed) {
        toast.success(`Module completed with ${score}% score!`);
      }
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }

  async getLearningProgress(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching learning progress:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // Challenge Management
  async saveChallenge(userId: string, challenge: Challenge): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('challenges')
        .upsert({
          user_id: userId,
          challenge_id: challenge.id,
          is_active: challenge.isActive,
          progress: challenge.progress,
          started_at: new Date().toISOString(),
          completed_at: challenge.progress >= challenge.target ? new Date().toISOString() : null,
          target: challenge.target
        });

      if (error) {
        console.error('Error saving challenge:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }

  async getUserChallenges(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching user challenges:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  }

  // AI Conversation Management
  async saveConversation(userId: string, conversationData: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .upsert({
          user_id: userId,
          conversation_data: conversationData
        });

      if (error) {
        console.error('Error saving conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }

  // Data Export
  async exportUserData(userId: string): Promise<any> {
    try {
      const [profile, financialData, badges, learningProgress, challenges, conversations] = await Promise.all([
        this.getUserProfile(userId),
        this.getFinancialData(userId),
        this.getUserBadges(userId),
        this.getLearningProgress(userId),
        this.getUserChallenges(userId),
        supabase.from('ai_conversations').select('*').eq('user_id', userId)
      ]);

      return {
        profile,
        financialData,
        badges,
        learningProgress,
        challenges,
        conversations: conversations.data,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      toast.error('Failed to export data. Please try again.');
      return null;
    }
  }

  // Data Deletion
  async deleteUserData(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('delete_user_data', {
        target_user_id: userId
      });

      if (error) {
        console.error('Error deleting user data:', error);
        toast.error('Failed to delete data. Please try again.');
        return false;
      }

      toast.success('All data deleted successfully.');
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  }

  // Helper methods
  private mapToUserProfile(data: any): UserProfile {
    const { getDefaultPersona } = require('../data/personas');
    return {
      id: data.user_id,
      name: data.name,
      persona: getDefaultPersona(),
      level: data.level,
      experience: data.experience,
      badges: [],
      streakDays: data.streak_days,
      totalSaved: data.total_saved,
      goals: [],
      preferences: data.preferences || {
        currency: 'INR',
        notifications: true,
        theme: 'light',
        riskTolerance: 'moderate',
        coachingStyle: 'motivational',
        language: 'en',
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
      createdAt: new Date(data.created_at),
      lastActive: new Date(data.updated_at)
    };
  }

  private mapToBadge(data: any): Badge {
    return {
      id: data.badge_id,
      name: 'Achievement Badge',
      description: 'Badge earned through progress',
      icon: '🏆',
      unlockedAt: new Date(data.unlocked_at),
      category: data.category
    };
  }
}

export const databaseService = new DatabaseService();