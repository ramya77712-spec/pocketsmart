import React from 'react';
import { Trophy, Star, Target, Calendar, TrendingUp } from 'lucide-react';
import { UserProfile as UserProfileType, Badge } from '../types';
import { calculateLevel, getXPForNextLevel, formatCurrency } from '../utils/calculations';

interface UserProfileProps {
  userProfile: UserProfileType;
  onEditProfile: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userProfile, onEditProfile }) => {
  const level = calculateLevel(userProfile.experience);
  const xpProgress = getXPForNextLevel(userProfile.experience);
  const progressPercentage = (xpProgress.current / xpProgress.required) * 100;

  const recentBadges = userProfile.badges
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3);

  const activeGoals = userProfile.goals.filter(goal => goal.currentAmount < goal.targetAmount);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{userProfile.name}</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="text-2xl">{userProfile.persona.icon}</span>
              {userProfile.persona.name}
            </p>
          </div>
        </div>
        <button
          onClick={onEditProfile}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Level and XP Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-800">Level {level}</span>
          </div>
          <span className="text-sm text-gray-600">
            {xpProgress.current} / {xpProgress.required} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Total Saved</p>
          <p className="font-bold text-green-600">{formatCurrency(userProfile.totalSaved)}</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Streak</p>
          <p className="font-bold text-orange-600">{userProfile.streakDays} days</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Badges</p>
          <p className="font-bold text-purple-600">{userProfile.badges.length}</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Active Goals</p>
          <p className="font-bold text-blue-600">{activeGoals.length}</p>
        </div>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Achievements</h3>
          <div className="flex gap-3">
            {recentBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                title={badge.description}
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="font-medium text-yellow-800 text-sm">{badge.name}</p>
                  <p className="text-xs text-yellow-600">
                    {new Date(badge.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Goals</h3>
          <div className="space-y-3">
            {activeGoals.slice(0, 2).map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">{goal.name}</h4>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};