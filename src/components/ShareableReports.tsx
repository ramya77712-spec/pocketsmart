import React, { useState } from 'react';
import { Share2, Download, Image, FileText, Trophy, Target } from 'lucide-react';
import { UserProfile, FinancialData } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ShareableReportsProps {
  userProfile: UserProfile;
  financialData: FinancialData;
}

export const ShareableReports: React.FC<ShareableReportsProps> = ({
  userProfile,
  financialData,
}) => {
  const [selectedReport, setSelectedReport] = useState<'progress' | 'achievement' | 'goal'>('progress');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProgressReport = async () => {
    setIsGenerating(true);
    
    // Mock report generation
    setTimeout(() => {
      const reportData = {
        userName: userProfile.name,
        level: userProfile.level,
        totalSaved: userProfile.totalSaved,
        badges: userProfile.badges.length,
        streak: userProfile.streakDays,
        savingsRate: ((financialData.monthlyIncome - financialData.expenses.reduce((sum, exp) => sum + exp.amount, 0)) / financialData.monthlyIncome) * 100
      };
      
      // In a real app, this would generate a PDF or image
      console.log('Generated progress report:', reportData);
      setIsGenerating(false);
    }, 2000);
  };

  const generateAchievementReport = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const reportData = {
        userName: userProfile.name,
        recentBadges: userProfile.badges.slice(-3),
        level: userProfile.level,
        experience: userProfile.experience
      };
      
      console.log('Generated achievement report:', reportData);
      setIsGenerating(false);
    }, 2000);
  };

  const generateGoalReport = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const reportData = {
        userName: userProfile.name,
        activeGoals: userProfile.goals.filter(g => g.currentAmount < g.targetAmount),
        completedGoals: userProfile.goals.filter(g => g.currentAmount >= g.targetAmount)
      };
      
      console.log('Generated goal report:', reportData);
      setIsGenerating(false);
    }, 2000);
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const messages = {
      progress: `🎯 Just hit Level ${userProfile.level} on my financial journey! Saved ${formatCurrency(userProfile.totalSaved)} so far with a ${userProfile.streakDays}-day streak! 💪 #FinancialFreedom #SavingsGoals`,
      achievement: `🏆 Earned ${userProfile.badges.length} financial achievement badges! Every small step counts towards financial freedom! #PersonalFinance #Achievement`,
      goal: `🎯 Making progress on my financial goals! ${userProfile.goals.filter(g => g.currentAmount >= g.targetAmount).length} goals completed so far! #FinancialGoals #Success`
    };

    const message = encodeURIComponent(messages[selectedReport]);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${message}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${message}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const reportTypes = [
    {
      id: 'progress' as const,
      name: 'Progress Report',
      description: 'Show your savings journey and milestones',
      icon: Trophy,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'achievement' as const,
      name: 'Achievement Report',
      description: 'Highlight your earned badges and level',
      icon: Trophy,
      color: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    },
    {
      id: 'goal' as const,
      name: 'Goal Report',
      description: 'Track progress on your financial goals',
      icon: Target,
      color: 'bg-green-50 text-green-600 border-green-200'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Share Your Success</h2>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedReport === type.id
                  ? type.color
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <h3 className="font-semibold mb-1">{type.name}</h3>
              <p className="text-sm opacity-80">{type.description}</p>
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
        
        {selectedReport === 'progress' && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                🎯 {userProfile.name}'s Financial Journey
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Level</p>
                  <p className="font-bold text-blue-600">{userProfile.level}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Saved</p>
                  <p className="font-bold text-green-600">{formatCurrency(userProfile.totalSaved)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Badges Earned</p>
                  <p className="font-bold text-yellow-600">{userProfile.badges.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Streak Days</p>
                  <p className="font-bold text-orange-600">{userProfile.streakDays}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'achievement' && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                🏆 {userProfile.name}'s Achievements
              </h4>
              <p className="text-gray-600 mb-4">Level {userProfile.level} Financial Champion</p>
              <div className="flex justify-center gap-2 mb-4">
                {userProfile.badges.slice(-3).map((badge, index) => (
                  <div key={index} className="text-2xl">{badge.icon}</div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {userProfile.badges.length} badges earned • {userProfile.experience} XP
              </p>
            </div>
          </div>
        )}

        {selectedReport === 'goal' && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                🎯 {userProfile.name}'s Goals
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Active Goals</p>
                  <p className="font-bold text-blue-600">
                    {userProfile.goals.filter(g => g.currentAmount < g.targetAmount).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Completed</p>
                  <p className="font-bold text-green-600">
                    {userProfile.goals.filter(g => g.currentAmount >= g.targetAmount).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generation and Sharing Options */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (selectedReport === 'progress') generateProgressReport();
              else if (selectedReport === 'achievement') generateAchievementReport();
              else generateGoalReport();
            }}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Image className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
          <button
            onClick={() => {
              // Mock PDF generation
              console.log('Generating PDF report...');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate PDF
          </button>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-2">Share on Social Media</h4>
          <div className="flex gap-2">
            <button
              onClick={() => shareToSocial('twitter')}
              className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
            >
              Twitter
            </button>
            <button
              onClick={() => shareToSocial('linkedin')}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
            >
              LinkedIn
            </button>
            <button
              onClick={() => shareToSocial('facebook')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};