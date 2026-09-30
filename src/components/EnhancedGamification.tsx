import React, { useState, useEffect } from 'react';
import { Trophy, Target, BookOpen, Zap, Gift, Calendar, TrendingUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { UserProfile, Challenge, LearningModule } from '../types';
import { ChallengeCard } from './ChallengeCard';
import { LearningModule as LearningModuleComponent } from './LearningModule';
import { MONTHLY_CHALLENGES } from '../data/challenges';
import { LEARNING_MODULES } from '../data/learningModules';
import { generateExperiencePoints } from '../utils/calculations';
import { useTranslation } from 'react-i18next';

interface EnhancedGamificationProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

interface DailyProgress {
  challengeId: string;
  date: string;
  progress: number;
  completed: boolean;
}

export const EnhancedGamification: React.FC<EnhancedGamificationProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'challenges' | 'learning' | 'achievements'>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>(MONTHLY_CHALLENGES);
  const [learningModules, setLearningModules] = useState<LearningModule[]>(LEARNING_MODULES);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  useEffect(() => {
    // Load daily progress from localStorage
    const savedProgress = localStorage.getItem(`dailyProgress_${userProfile.id}`);
    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress));
    }
  }, [userProfile.id]);

  const celebrate = (message: string) => {
    setCelebrationMessage(message);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const updateDailyProgress = (challengeId: string, progress: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newProgress: DailyProgress = {
      challengeId,
      date: today,
      progress,
      completed: false
    };

    setDailyProgress(prev => {
      const filtered = prev.filter(p => !(p.challengeId === challengeId && p.date === today));
      const updated = [...filtered, newProgress];
      localStorage.setItem(`dailyProgress_${userProfile.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const getTodayProgress = (challengeId: string): number => {
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = dailyProgress.find(p => p.challengeId === challengeId && p.date === today);
    return todayProgress?.progress || 0;
  };

  const getWeeklyProgress = (challengeId: string): DailyProgress[] => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return dailyProgress.filter(p => 
      p.challengeId === challengeId && 
      new Date(p.date) >= weekAgo
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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

    // Initialize daily progress
    updateDailyProgress(challengeId, 0);
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

    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    setDailyProgress(prev => {
      const updated = prev.map(p => 
        p.challengeId === challengeId && p.date === today
          ? { ...p, completed: true }
          : p
      );
      localStorage.setItem(`dailyProgress_${userProfile.id}`, JSON.stringify(updated));
      return updated;
    });

    celebrate(`Challenge completed! You earned the "${challenge.reward.name}" badge and ${xpGained} XP!`);
  };

  const handleUpdateChallengeProgress = (challengeId: string, newProgress: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, progress: Math.min(newProgress, c.target) }
        : c
    ));

    updateDailyProgress(challengeId, newProgress);
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
    { id: 'challenges', label: t('challenges.title'), icon: Target, count: activeChallenges.length },
    { id: 'learning', label: 'Learning', icon: BookOpen, count: incompleteLearningModules.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, count: userProfile.badges.length },
  ];

  const renderProgressChart = (challengeId: string) => {
    const weeklyData = getWeeklyProgress(challengeId);
    const maxProgress = challenges.find(c => c.id === challengeId)?.target || 100;
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2 text-gray-700">
          Weekly Progress
        </h4>
        <div className="flex items-end gap-1 h-16">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split('T')[0];
            const dayData = weeklyData.find(d => d.date === dateStr);
            const height = dayData ? (dayData.progress / maxProgress) * 100 : 0;
            
            return (
              <motion.div
                key={dateStr}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.1 }}
                className={`flex-1 min-h-[4px] rounded-t ${
                  dayData?.completed 
                    ? 'bg-green-500' 
                    : height > 0 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                }`}
                title={`${date.toLocaleDateString()}: ${dayData?.progress || 0}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>
    );
  };

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
      <AnimatePresence>
        {celebrationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span>{celebrationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            Gamification Hub
          </h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                  >
                    {tab.count}
                  </motion.span>
                )}
              </motion.button>
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
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {t('challenges.active')}
                </h3>
                <div className="grid gap-4">
                  {activeChallenges.map((challenge) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl border-l-4 border-blue-500 bg-white shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2 text-gray-800">
                            {challenge.title}
                          </h4>
                          <p className="mb-3 text-gray-600">
                            {challenge.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{challenge.duration} {t('common.days')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span>Target: {challenge.target}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>Today: {getTodayProgress(challenge.id)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{challenge.reward.icon}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {t('challenges.progress')}
                          </span>
                          <span className="text-sm text-gray-600">
                            {challenge.progress} / {challenge.target}
                          </span>
                        </div>
                        <div className="w-full rounded-full h-3 bg-gray-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` }}
                            transition={{ duration: 0.5 }}
                            className="bg-blue-500 h-3 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Daily Progress Chart */}
                      {renderProgressChart(challenge.id)}

                      {/* Progress Update Controls */}
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => handleUpdateChallengeProgress(challenge.id, challenge.progress + 1)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleUpdateChallengeProgress(challenge.id, challenge.progress + 5)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleCompleteChallenge(challenge.id)}
                          className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {t('challenges.complete')}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Challenges */}
            {availableChallenges.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {t('challenges.available')}
                </h3>
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
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {t('challenges.completed')}
                </h3>
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
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Learning Modules
                </h3>
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
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Completed Modules
                </h3>
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
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Your Badges
            </h3>
            {userProfile.badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userProfile.badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                  >
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">{badge.icon}</span>
                      <h4 className="font-semibold mb-1 text-gray-800">
                        {badge.name}
                      </h4>
                      <p className="text-sm mb-2 text-gray-600">
                        {badge.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Earned on {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
                  No badges earned yet. Complete challenges and goals to unlock achievements!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};