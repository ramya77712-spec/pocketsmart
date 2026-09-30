import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Mic, MicOff, Volume2, VolumeX, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiCoachService, ConversationContext, AIResponse } from '../services/openai';
import { databaseService } from '../services/database';
import { UserProfile, FinancialData, SavingsScenario } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import toast from 'react-hot-toast';

interface AICoachAdvancedProps {
  userProfile: UserProfile;
  financialData: FinancialData;
  savingsScenario: SavingsScenario;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  tone?: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

export const AICoachAdvanced: React.FC<AICoachAdvancedProps> = ({
  userProfile,
  financialData,
  savingsScenario,
  onUpdateProfile,
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTone, setUserTone] = useState<'anxious' | 'confident' | 'curious' | 'overwhelmed' | 'motivated'>('curious');
  const [conversationContext, setConversationContext] = useState<ConversationContext | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize conversation context
    setConversationContext({
      userId: userProfile.id,
      persona: userProfile.persona.name,
      financialData,
      previousInteractions: [],
      currentGoals: userProfile.goals,
      userTone
    });

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition error. Please try again.');
      };
    }

    // Load conversation history
    loadConversationHistory();
  }, [userProfile.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationHistory = async () => {
    // Load previous conversations from database
    // Implementation would fetch and set messages
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationContext) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Analyze user tone
      const detectedTone = await aiCoachService.analyzeUserTone(inputMessage);
      setUserTone(detectedTone);

      // Generate AI response
      const aiResponse = await aiCoachService.generatePersonalizedResponse(
        inputMessage,
        { ...conversationContext, userTone: detectedTone }
      );

      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        timestamp: new Date(),
        tone: aiResponse.tone,
        suggestions: aiResponse.suggestions,
        followUpQuestions: aiResponse.followUpQuestions
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save conversation to database
      await databaseService.saveConversation(userProfile.id, {
        messages: [...messages, userMessage, aiMessage],
        context: conversationContext
      });

      // Award XP for AI interaction
      const xpGained = 10;
      onUpdateProfile({
        experience: userProfile.experience + xpGained
      });

    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (!synthRef.current) {
      toast.error('Text-to-speech not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.type.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-coach-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareConversation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Financial Coach Conversation',
          text: 'Check out my personalized financial coaching session!',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      const shareText = `Check out my AI Financial Coach conversation: ${window.location.href}`;
      await navigator.clipboard.writeText(shareText);
      toast.success('Link copied to clipboard!');
    }
  };

  const getToneColor = (tone: string) => {
    const colors = {
      anxious: 'text-red-600 bg-red-50',
      confident: 'text-green-600 bg-green-50',
      curious: 'text-blue-600 bg-blue-50',
      overwhelmed: 'text-orange-600 bg-orange-50',
      motivated: 'text-purple-600 bg-purple-50'
    };
    return colors[tone as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI Financial Coach</h2>
            <p className="text-sm text-gray-600">
              Personalized guidance for {userProfile.persona.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getToneColor(userTone)}`}>
            {userTone}
          </span>
          <button
            onClick={exportConversation}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Export conversation"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={shareConversation}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Share conversation"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {message.type === 'ai' && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleTextToSpeech(message.content)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Read aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {/* AI Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium text-gray-600">Suggestions:</p>
                    {message.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                )}

                {/* Follow-up Questions */}
                {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium text-gray-600">Questions for you:</p>
                    {message.followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(question)}
                        className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your finances..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};