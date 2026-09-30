import React, { useState } from 'react';
import { BookOpen, Clock, Award, ChevronRight, CheckCircle, X } from 'lucide-react';
import { LearningModule as LearningModuleType, LearningScenario } from '../types';

interface LearningModuleProps {
  module: LearningModuleType;
  onComplete: (moduleId: string) => void;
}

export const LearningModule: React.FC<LearningModuleProps> = ({ module, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<number>>(new Set());

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'budgeting': return '💰';
      case 'investing': return '📈';
      case 'debt': return '💳';
      case 'emergency': return '🛡️';
      case 'goals': return '🎯';
      default: return '📚';
    }
  };

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    setShowExplanation(true);
    
    // Mark scenario as completed after a delay
    setTimeout(() => {
      setCompletedScenarios(prev => new Set([...prev, currentScenario]));
      
      // Check if all scenarios are completed
      if (completedScenarios.size + 1 >= module.scenarios.length) {
        setTimeout(() => {
          onComplete(module.id);
        }, 2000);
      }
    }, 3000);
  };

  const nextScenario = () => {
    if (currentScenario < module.scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    }
  };

  const scenario = module.scenarios[currentScenario];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Module Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{getCategoryIcon(module.category)}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{module.title}</h3>
              <p className="text-gray-600 mt-1">{module.description}</p>
              
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{module.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <BookOpen className="w-4 h-4" />
                  <span>{module.scenarios.length} scenarios</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {module.completed && <CheckCircle className="w-6 h-6 text-green-500" />}
            <ChevronRight className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {/* Module Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {!module.completed ? (
            <div className="p-6">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Scenario {currentScenario + 1} of {module.scenarios.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    {completedScenarios.size} / {module.scenarios.length} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentScenario + 1) / module.scenarios.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Scenario */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">{scenario.title}</h4>
                <p className="text-blue-800">{scenario.situation}</p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {scenario.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === option.id
                        ? option.isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">{option.text}</span>
                      {showExplanation && selectedAnswer === option.id && (
                        option.isCorrect ? 
                          <CheckCircle className="w-5 h-5 text-green-500" /> :
                          <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {showExplanation && selectedAnswer === option.id && (
                      <p className="mt-2 text-sm text-gray-600">{option.outcome}</p>
                    )}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-gray-800 mb-2">Explanation</h5>
                  <p className="text-gray-700">{scenario.explanation}</p>
                </div>
              )}

              {/* Navigation */}
              {showExplanation && (
                <div className="flex justify-end">
                  {currentScenario < module.scenarios.length - 1 ? (
                    <button
                      onClick={nextScenario}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Scenario
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-green-600 font-semibold mb-2">Module Complete!</p>
                      <div className="flex items-center justify-center gap-2 text-yellow-600">
                        <Award className="w-5 h-5" />
                        <span>+25 XP earned</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Module Completed!</h4>
              <p className="text-gray-600">You've mastered this topic. Great job!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};