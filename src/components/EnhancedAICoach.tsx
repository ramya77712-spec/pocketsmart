import React, { useState, useEffect } from 'react';
import { Brain, Send, Loader, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { FinancialData, UserProfile, ConversationEntry } from '../types';
import { geminiService } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface EnhancedAICoachProps {
  financialData: FinancialData;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const EnhancedAICoach: React.FC<EnhancedAICoachProps> = ({
  financialData,
  userProfile,
  onUpdateProfile,
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>(
    userProfile.conversationHistory || []
  );
  const [aiInsights, setAiInsights] = useState<any>(null);

  useEffect(() => {
    // Auto-generate initial insights when component mounts
    if (conversation.length === 0 && financialData.expenses.length > 0) {
      generateInitialInsights();
    }
  }, [financialData]);

  const generateInitialInsights = async () => {
    setIsLoading(true);
    try {
      const insights = await geminiService.generateFinancialAdvice(
        financialData,
        userProfile,
        conversation
      );
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      // Detect user mood
      const mood = await geminiService.detectUserMood(userMessage);
      
      // Generate AI response
      const response = await geminiService.generateFinancialAdvice(
        financialData,
        userProfile,
        conversation
      );

      // Create conversation entry
      const newEntry: ConversationEntry = {
        id: uuidv4(),
        timestamp: new Date(),
        userMessage,
        aiResponse: response.motivationalMessage || 'Thank you for your message. I\'m here to help with your financial journey!',
        context: {
          financialData,
          userMood: mood,
          topicCategory: 'general'
        }
      };

      const updatedConversation = [...conversation, newEntry];
      setConversation(updatedConversation);
      setAiInsights(response);

      // Update user profile with conversation history
      onUpdateProfile({
        conversationHistory: updatedConversation
      });

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excited': return '🎉';
      case 'frustrated': return '😤';
      case 'confused': return '🤔';
      default: return '😊';
    }
  };

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    
    return `${timeGreeting}, ${userProfile.name}! I'm your AI financial coach. I've analyzed your spending patterns and I'm here to help you achieve your financial goals. What would you like to discuss today?`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">AI Financial Coach</h2>
            <p className="opacity-90">Powered by Google Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm opacity-90">
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>Level {userProfile.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{conversation.length} conversations</span>
          </div>
        </div>
      </div>

      {/* AI Insights Dashboard */}
      {aiInsights && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Insights</h3>
          
          {/* Health Score */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">Financial Health Score</span>
              <span className="text-2xl font-bold text-blue-600">{aiInsights.healthScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${aiInsights.healthScore}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {aiInsights.nextSteps?.slice(0, 3).map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Celebrate Your Wins</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {aiInsights.celebrateWins?.slice(0, 3).map((win: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">🎉</span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Conversation History */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {conversation.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{getPersonalizedGreeting()}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                "How can I save more money?",
                "What's my biggest expense?",
                "Help me set a savings goal",
                "Review my spending patterns"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="p-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {conversation.map((entry) => (
          <div key={entry.id} className="space-y-3">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                <p className="text-sm">{entry.userMessage}</p>
                <div className="flex items-center justify-between mt-1 text-xs opacity-75">
                  <span>{entry.timestamp.toLocaleTimeString()}</span>
                  {entry.context.userMood && (
                    <span>{getMoodEmoji(entry.context.userMood)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
                <p className="text-sm text-gray-800">{entry.aiResponse}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {entry.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your finances..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Context Indicators */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Conversations are analyzed to provide better advice</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>Powered by Google Gemini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};