import React from 'react';
import { Calendar, Target, Trophy, Play, CheckCircle } from 'lucide-react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (challengeId: string) => void;
  onComplete: (challengeId: string) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onStart,
  onComplete,
}) => {
  const progressPercentage = (challenge.progress / challenge.target) * 100;
  const isCompleted = challenge.progress >= challenge.target;
  const daysRemaining = challenge.duration - Math.floor(challenge.progress);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{challenge.title}</h3>
          <p className="text-gray-600 mb-3">{challenge.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{challenge.duration} days</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Target: {challenge.target}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">{challenge.reward.icon}</span>
          {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {challenge.progress} / {challenge.target}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Reward Preview */}
      <div className="bg-yellow-50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-yellow-800">Reward</span>
        </div>
        <p className="text-sm text-yellow-700">{challenge.reward.description}</p>
      </div>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        {challenge.isActive && !isCompleted && (
          <span className="text-sm text-blue-600 font-medium">
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Last day!'}
          </span>
        )}
        
        {!challenge.isActive && !isCompleted && (
          <button
            onClick={() => onStart(challenge.id)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Challenge
          </button>
        )}
        
        {challenge.isActive && !isCompleted && (
          <button
            onClick={() => onComplete(challenge.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Mark Complete
          </button>
        )}
        
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Completed!</span>
          </div>
        )}
      </div>
    </div>
  );
};