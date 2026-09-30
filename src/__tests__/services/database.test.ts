import { databaseService } from '../../services/database';
import { supabase } from '../../config/supabase';

// Mock Supabase
jest.mock('../../config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          order: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      })),
      insert: jest.fn(),
      rpc: jest.fn()
    }))
  }
}));

describe('DatabaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUserProfile', () => {
    it('should save user profile successfully', async () => {
      const mockProfile = {
        id: 'user-123',
        name: 'Test User',
        level: 1,
        experience: 0
      };

      const mockSupabaseResponse = {
        data: {
          user_id: 'user-123',
          name: 'Test User',
          level: 1,
          experience: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        error: null
      };

      (supabase.from as jest.Mock).mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue(mockSupabaseResponse)
          })
        })
      });

      const result = await databaseService.saveUserProfile(mockProfile);
      
      expect(result).toBeTruthy();
      expect(result?.id).toBe('user-123');
      expect(result?.name).toBe('Test User');
    });

    it('should handle database errors gracefully', async () => {
      const mockProfile = {
        id: 'user-123',
        name: 'Test User'
      };

      (supabase.from as jest.Mock).mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' }
            })
          })
        })
      });

      const result = await databaseService.saveUserProfile(mockProfile);
      
      expect(result).toBeNull();
    });
  });

  describe('getFinancialData', () => {
    it('should return default data when no records found', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' }
            })
          })
        })
      });

      const result = await databaseService.getFinancialData('user-123');
      
      expect(result).toEqual({
        monthlyIncome: 0,
        expenses: [],
        emergencyFund: 0,
        currentSavings: 0
      });
    });
  });
});