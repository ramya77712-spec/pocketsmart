import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'savingspilot-web'
    }
  }
});

// Database schema types for TypeScript
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          persona_id: string;
          level: number;
          experience: number;
          streak_days: number;
          total_saved: number;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      financial_data: {
        Row: {
          id: string;
          user_id: string;
          monthly_income: number;
          expenses: any[];
          emergency_fund: number;
          current_savings: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['financial_data']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['financial_data']['Insert']>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          unlocked_at: string;
          category: string;
        };
        Insert: Omit<Database['public']['Tables']['user_badges']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['user_badges']['Insert']>;
      };
      learning_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          completed: boolean;
          score: number;
          completed_at: string;
          time_spent: number;
        };
        Insert: Omit<Database['public']['Tables']['learning_progress']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['learning_progress']['Insert']>;
      };
      challenges: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          is_active: boolean;
          progress: number;
          started_at: string;
          completed_at: string | null;
          target: number;
        };
        Insert: Omit<Database['public']['Tables']['challenges']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['challenges']['Insert']>;
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          conversation_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>;
      };
    };
  };
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Real-time subscription helper
export const subscribeToUserChanges = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('user-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};