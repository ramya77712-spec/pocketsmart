import React, { useState, useEffect } from 'react';
import { Trophy, Target, BookOpen, Zap, Gift } from 'lucide-react';
import Confetti from 'react-confetti';
import { UserProfile, Challenge, LearningModule } from '../types';
import { ChallengeCard } from './ChallengeCard';
import { LearningModule as LearningModuleComponent } from './LearningModule';
import { MONTHLY_CHALLENGES } from '../data/challenges';
import { LEARNING_MODULES } from '../data/learningModules';
import { generateExperiencePoints } from '../utils/calculations';

interface GamificationProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const Gamification: React.FC<GamificationProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'learning' | 'achievements'>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>(MONTHLY_CHALLENGES);
  const [learningModules, setLearningModules] = useState<LearningModule[]>(LEARNING_MODULES);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  const celebrate = (message: string) => {
    setCelebrationMessage(message);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleStartChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isActive: true, progress: 0 }
        : challenge
    ));
    
    // Award XP for starting a challenge
    const xpGained = generateExperiencePoints('start_challenge');
    onUpdateProfile({
      experience: userProfile.experience + xpGained
    });
  };

  const handleCompleteChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, progress: c.target, isActive: false }
        : c
    ));

    // Award badge and XP
    const xpGained = generateExperiencePoints('complete_challenge');
    const newBadges = [...userProfile.badges, challenge.reward];
    
    onUpdateProfile({
      experience: userProfile.experience + xpGained,
      badges: newBadges
    });

    celebrate(`Challenge completed! You earned the "${challenge.reward.name}" badge and ${xpGained} XP!`);
  };

  const handleCompleteModule = (moduleId: string) => {
    setLearningModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, completed: true }
        : module
    ));

    const xpGained = generateExperiencePoints('complete_learning_module');
    onUpdateProfile({
      experience: userProfile.experience + xpGained
    });

    celebrate(`Learning module completed! You earned ${xpGained} XP!`);
  };

  const activeChallenges = challenges.filter(c => c.isActive);
  const availableChallenges = challenges.filter(c => !c.isActive && c.progress < c.target);
  const completedChallenges = challenges.filter(c => c.progress >= c.target);

  const incompleteLearningModules = learningModules.filter(m => !m.completed);
  const completedLearningModules = learningModules.filter(m => m.completed);

  const tabs = [
    { id: 'challenges', label: 'Challenges', icon: Target, count: activeChallenges.length },
    { id: 'learning', label: 'Learning', icon: BookOpen, count: incompleteLearningModules.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, count: userProfile.badges.length },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Celebration Message */}
      {celebrationMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            <span>{celebrationMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Gamification Hub</h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Active Challenges */}
            {activeChallenges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Challenges</h3>
                <div className="grid gap-4">
                  {activeChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onStart={handleStartChallenge}
                      onComplete={handleCompleteChallenge}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Available Challenges */}
            {availableChallenges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Challenges</h3>
                <div className="grid gap-4">
                  {availableChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onStart={handleStartChallenge}
                      onComplete={handleCompleteChallenge}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Challenges */}
            {completedChallenges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Challenges</h3>
                <div className="grid gap-4">
                  {completedChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onStart={handleStartChallenge}
                      onComplete={handleCompleteChallenge}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-6">
            {/* Available Modules */}
            {incompleteLearningModules.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Modules</h3>
                <div className="space-y-4">
                  {incompleteLearningModules.map((module) => (
                    <LearningModuleComponent
                      key={module.id}
                      module={module}
                      onComplete={handleCompleteModule}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Modules */}
            {completedLearningModules.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed Modules</h3>
                <div className="space-y-4">
                  {completedLearningModules.map((module) => (
                    <LearningModuleComponent
                      key={module.id}
                      module={module}
                      onComplete={handleCompleteModule}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Badges</h3>
            {userProfile.badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProfile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                  >
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">{badge.icon}</span>
                      <h4 className="font-semibold text-gray-800 mb-1">{badge.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <p className="text-xs text-gray-500">
                        Earned on {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No badges earned yet. Complete challenges and goals to unlock achievements!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};