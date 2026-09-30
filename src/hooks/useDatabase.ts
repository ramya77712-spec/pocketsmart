import { useState, useEffect } from 'react';
import { databaseService } from '../services/database';
import { UserProfile, FinancialData } from '../types';
import toast from 'react-hot-toast';

export const useUserProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userProfile = await databaseService.getUserProfile(userId);
        setProfile(userProfile);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      const updatedProfile = { ...profile, ...updates };
      const saved = await databaseService.saveUserProfile(updatedProfile);
      if (saved) {
        setProfile(saved);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error(errorMessage);
    }
  };

  return { profile, loading, error, updateProfile };
};

export const useFinancialData = (userId: string | null) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const loadFinancialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await databaseService.getFinancialData(userId);
        setFinancialData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load financial data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [userId]);

  const updateFinancialData = async (updates: Partial<FinancialData>) => {
    if (!financialData || !userId) return;

    try {
      const updatedData = { ...financialData, ...updates };
      const success = await databaseService.saveFinancialData(userId, updatedData);
      if (success) {
        setFinancialData(updatedData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update financial data';
      toast.error(errorMessage);
    }
  };

  return { financialData, loading, error, updateFinancialData };
};

export const useLearningProgress = (userId: string | null) => {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const loadProgress = async () => {
      setLoading(true);
      try {
        const data = await databaseService.getLearningProgress(userId);
        setProgress(data);
      } catch (error) {
        console.error('Failed to load learning progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  const saveProgress = async (moduleId: string, completed: boolean, score: number) => {
    if (!userId) return;

    try {
      await databaseService.saveLearningProgress(userId, moduleId, completed, score);
      // Reload progress
      const data = await databaseService.getLearningProgress(userId);
      setProgress(data);
    } catch (error) {
      console.error('Failed to save learning progress:', error);
    }
  };

  return { progress, loading, saveProgress };
};