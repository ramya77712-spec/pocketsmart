// Firebase service for data persistence
// Note: This is a mock implementation for demo purposes
// In production, you would configure Firebase/Supabase properly

import { UserProfile, Team, ShareableReport } from '../types';

class FirebaseService {
  private isConfigured = false;

  constructor() {
    // Mock Firebase configuration
    this.isConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (!this.isConfigured) {
      // Save to localStorage as fallback
      localStorage.setItem(`profile_${profile.id}`, JSON.stringify(profile));
      return;
    }
    
    // In production: await firestore.collection('users').doc(profile.id).set(profile);
    console.log('Saving user profile:', profile.id);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.isConfigured) {
      const stored = localStorage.getItem(`profile_${userId}`);
      return stored ? JSON.parse(stored) : null;
    }
    
    // In production: return await firestore.collection('users').doc(userId).get();
    return null;
  }

  async createTeam(team: Team): Promise<string> {
    if (!this.isConfigured) {
      localStorage.setItem(`team_${team.id}`, JSON.stringify(team));
      return team.id;
    }
    
    // In production: return await firestore.collection('teams').add(team);
    return team.id;
  }

  async joinTeam(userId: string, inviteCode: string): Promise<Team | null> {
    if (!this.isConfigured) {
      // Mock team joining
      return null;
    }
    
    // In production: find team by invite code and add user
    return null;
  }

  async saveReport(report: ShareableReport): Promise<string> {
    if (!this.isConfigured) {
      localStorage.setItem(`report_${report.id}`, JSON.stringify(report));
      return report.id;
    }
    
    // In production: return await firestore.collection('reports').add(report);
    return report.id;
  }

  async exportUserData(userId: string): Promise<any> {
    if (!this.isConfigured) {
      const profile = await this.getUserProfile(userId);
      return { profile, exportedAt: new Date() };
    }
    
    // In production: gather all user data for export
    return {};
  }

  async deleteUserData(userId: string): Promise<void> {
    if (!this.isConfigured) {
      localStorage.removeItem(`profile_${userId}`);
      return;
    }
    
    // In production: delete all user data from Firestore
    console.log('Deleting user data:', userId);
  }
}

export const firebaseService = new FirebaseService();