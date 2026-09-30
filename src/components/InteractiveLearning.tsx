import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Star, Clock, CheckCircle, X, Lightbulb, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LearningModule as LearningModuleType, LearningScenario, UserProfile } from '../types';
import { databaseService } from '../services/database';
import { generateExperiencePoints } from '../utils/calculations';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

interface InteractiveLearningProps {
  modules: LearningModuleType[];
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onModuleComplete: (moduleId: string, score: number) => void;
}

interface QuizState {
  currentScenario: number;
  selectedAnswers: { [scenarioId: string]: string };
  showExplanation: boolean;
  score: number;
  timeSpent: number;
  startTime: Date;
}

export const InteractiveLearning: React.FC<InteractiveLearningProps> = ({
  modules,
  userProfile,
  onUpdateProfile,
  onModuleComplete,
}) => {
  const [activeModule, setActiveModule] = useState<LearningModuleType | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [learningProgress, setLearningProgress] = useState<{ [moduleId: string]: any }>({});

  useEffect(() => {
    loadLearningProgress();
  }, [userProfile.id]);

  const loadLearningProgress = async () => {
    const progress = await databaseService.getLearningProgress(userProfile.id);
    const progressMap = progress.reduce((acc, item) => {
      acc[item.module_id] = item;
      return acc;
    }, {});
    setLearningProgress(progressMap);
  };

  const startModule = (module: LearningModuleType) => {
    setActiveModule(module);
    setQuizState({
      currentScenario: 0,
      selectedAnswers: {},
      showExplanation: false,
      score: 0,
      timeSpent: 0,
      startTime: new Date()
    });
  };

  const selectAnswer = (scenarioId: string, optionId: string) => {
    if (!quizState || !activeModule) return;

    const scenario = activeModule.scenarios[quizState.currentScenario];
    const selectedOption = scenario.options.find(opt => opt.id === optionId);
    
    if (!selectedOption) return;

    const newAnswers = { ...quizState.selectedAnswers, [scenarioId]: optionId };
    const newScore = selectedOption.isCorrect ? quizState.score + 1 : quizState.score;

    setQuizState({
      ...quizState,
      selectedAnswers: newAnswers,
      showExplanation: true,
      score: newScore
    });
  };

  const nextScenario = () => {
    if (!quizState || !activeModule) return;

    if (quizState.currentScenario < activeModule.scenarios.length - 1) {
      setQuizState({
        ...quizState,
        currentScenario: quizState.currentScenario + 1,
        showExplanation: false
      });
    } else {
      completeModule();
    }
  };

  const completeModule = async () => {
    if (!quizState || !activeModule) return;

    const timeSpent = Math.floor((Date.now() - quizState.startTime.getTime()) / 1000 / 60);
    const scorePercentage = (quizState.score / activeModule.scenarios.length) * 100;
    
    // Calculate XP based on difficulty and performance
    const baseXP = generateExperiencePoints('complete_learning_module');
    const difficultyMultiplier = {
      beginner: 1,
      intermediate: 1.5,
      advanced: 2
    }[activeModule.difficulty];
    const performanceBonus = scorePercentage >= 80 ? 1.2 : scorePercentage >= 60 ? 1.1 : 1;
    
    const totalXP = Math.floor(baseXP * difficultyMultiplier * performanceBonus);

    // Save progress to database
    await databaseService.saveLearningProgress(
      userProfile.id,
      activeModule.id,
      true,
      scorePercentage
    );

    // Update user profile
    onUpdateProfile({
      experience: userProfile.experience + totalXP
    });

    // Show celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);

    // Notify parent component
    onModuleComplete(activeModule.id, scorePercentage);

    // Show completion message
    toast.success(
      `Module completed! Score: ${scorePercentage.toFixed(0)}% | XP gained: ${totalXP}`,
      { duration: 5000 }
    );

    // Reset state
    setActiveModule(null);
    setQuizState(null);
    
    // Reload progress
    loadLearningProgress();
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 border-green-200',
      intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      advanced: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      budgeting: '💰',
      investing: '📈',
      debt: '💳',
      emergency: '🛡️',
      goals: '🎯'
    };
    return icons[category as keyof typeof icons] || '📚';
  };

  const getProgressPercentage = (moduleId: string) => {
    const progress = learningProgress[moduleId];
    return progress ? progress.score : 0;
  };

  const isModuleCompleted = (moduleId: string) => {
    const progress = learningProgress[moduleId];
    return progress && progress.completed;
  };

  if (activeModule && quizState) {
    const scenario = activeModule.scenarios[quizState.currentScenario];
    const selectedAnswer = quizState.selectedAnswers[scenario.id];
    const selectedOption = scenario.options.find(opt => opt.id === selectedAnswer);

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        {showCelebration && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}

        {/* Module Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getCategoryIcon(activeModule.category)}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{activeModule.title}</h2>
              <p className="text-gray-600">{activeModule.description}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModule(null)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {quizState.currentScenario + 1} of {activeModule.scenarios.length}
            </span>
            <span className="text-sm text-gray-600">
              Score: {quizState.score}/{activeModule.scenarios.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((quizState.currentScenario + 1) / activeModule.scenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Scenario Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Scenario Question */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">{scenario.title}</h3>
              <p className="text-blue-800">{scenario.situation}</p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {scenario.options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => selectAnswer(scenario.id, option.id)}
                  disabled={quizState.showExplanation}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === option.id
                      ? option.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  } ${quizState.showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{option.text}</span>
                    {quizState.showExplanation && selectedAnswer === option.id && (
                      option.isCorrect ? 
                        <CheckCircle className="w-5 h-5 text-green-500" /> :
                        <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {quizState.showExplanation && selectedAnswer === option.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 text-sm text-gray-600"
                    >
                      {option.outcome}
                    </motion.p>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            {quizState.showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-gray-800">Explanation</h4>
                </div>
                <p className="text-gray-700">{scenario.explanation}</p>
              </motion.div>
            )}

            {/* Navigation */}
            {quizState.showExplanation && (
              <div className="flex justify-end">
                {quizState.currentScenario < activeModule.scenarios.length - 1 ? (
                  <button
                    onClick={nextScenario}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={completeModule}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Complete Module
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Interactive Learning</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const isCompleted = isModuleCompleted(module.id);
          const progress = getProgressPercentage(module.id);

          return (
            <motion.div
              key={module.id}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{getCategoryIcon(module.category)}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{module.title}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
                {isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{module.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Target className="w-4 h-4" />
                  <span>{module.scenarios.length} questions</span>
                </div>
              </div>

              {isCompleted && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Best Score</span>
                    <span className="text-sm font-medium text-green-600">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => startModule(module)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isCompleted ? 'Retake Module' : 'Start Learning'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};