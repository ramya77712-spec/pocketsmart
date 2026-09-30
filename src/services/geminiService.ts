import { GoogleGenerativeAI } from '@google/generative-ai';
import { FinancialData, ConversationEntry, UserProfile } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. Using mock responses.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateFinancialAdvice(
    financialData: FinancialData,
    userProfile: UserProfile,
    conversationHistory: ConversationEntry[] = []
  ): Promise<any> {
    if (!this.model) {
      return this.getMockAdvice(financialData, userProfile);
    }

    try {
      const context = this.buildContext(financialData, userProfile, conversationHistory);
      const prompt = this.buildFinancialCoachPrompt(context);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getMockAdvice(financialData, userProfile);
    }
  }

  async generateQuiz(
    moduleId: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    userProgress: any
  ): Promise<any> {
    if (!this.model) {
      return this.getMockQuiz(moduleId, difficulty);
    }

    try {
      const prompt = this.buildQuizPrompt(moduleId, difficulty, userProgress);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini quiz generation error:', error);
      return this.getMockQuiz(moduleId, difficulty);
    }
  }

  async detectUserMood(message: string): Promise<'frustrated' | 'excited' | 'confused' | 'neutral'> {
    if (!this.model) {
      return 'neutral';
    }

    try {
      const prompt = `Analyze the emotional tone of this message and classify it as one of: frustrated, excited, confused, or neutral. 
      
      Message: "${message}"
      
      Respond with only one word: frustrated, excited, confused, or neutral.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const mood = response.text().trim().toLowerCase();
      
      if (['frustrated', 'excited', 'confused', 'neutral'].includes(mood)) {
        return mood as any;
      }
      return 'neutral';
    } catch (error) {
      console.error('Mood detection error:', error);
      return 'neutral';
    }
  }

  private buildContext(
    financialData: FinancialData,
    userProfile: UserProfile,
    conversationHistory: ConversationEntry[]
  ): string {
    const totalExpenses = financialData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = ((financialData.monthlyIncome - totalExpenses) / financialData.monthlyIncome) * 100;
    
    const recentConversations = conversationHistory.slice(-5).map(conv => 
      `User: ${conv.userMessage}\nAI: ${conv.aiResponse}`
    ).join('\n\n');

    return `
User Profile:
- Name: ${userProfile.name}
- Persona: ${userProfile.persona.name}
- Level: ${userProfile.level}
- Experience: ${userProfile.experience} XP
- Badges: ${userProfile.badges.length}
- Streak: ${userProfile.streakDays} days
- Total Saved: $${userProfile.totalSaved}

Financial Data:
- Monthly Income: $${financialData.monthlyIncome}
- Total Expenses: $${totalExpenses}
- Savings Rate: ${savingsRate.toFixed(1)}%
- Emergency Fund: $${financialData.emergencyFund}
- Current Savings: $${financialData.currentSavings}

Recent Conversation History:
${recentConversations}

Expense Breakdown:
${financialData.expenses.map(exp => `- ${exp.category}: $${exp.amount} (${exp.type})`).join('\n')}
    `;
  }

  private buildFinancialCoachPrompt(context: string): string {
    return `You are an expert AI Financial Coach with deep knowledge of personal finance, behavioral economics, and wealth building strategies. You provide personalized, actionable, and motivational financial guidance.

Context:
${context}

Analyze the user's financial situation and provide comprehensive advice. Consider their conversation history, current financial state, persona, and progress level.

Respond with a JSON object containing:
{
  "categorization": {
    "needs": ["Essential expenses with amounts"],
    "wants": ["Discretionary but regular expenses"],
    "luxuries": ["Optional/luxury expenses"],
    "suggestions": ["Specific categorization improvements"]
  },
  "savingsRecommendations": {
    "monthlyTarget": "Realistic monthly savings goal",
    "emergencyFundTarget": "3-6 months of expenses",
    "strategies": ["Specific actionable strategies"],
    "priorityAreas": ["Categories to focus on first"]
  },
  "projections": {
    "conservative": "70% of potential savings",
    "moderate": "100% of potential savings",
    "aggressive": "130% with additional optimizations"
  },
  "healthScore": "0-100 based on savings rate and financial health",
  "motivationalMessage": "Encouraging, specific message referencing their progress",
  "personalizedTips": ["3-5 tips specific to user's situation and persona"],
  "riskAssessment": "Assessment of financial vulnerability",
  "nextSteps": ["Immediate actionable steps"],
  "celebrateWins": ["Acknowledge recent achievements or progress"]
}

Make the advice personal by referencing their persona, level, badges, and conversation history. Be encouraging and specific.`;
  }

  private buildQuizPrompt(moduleId: string, difficulty: string, userProgress: any): string {
    return `Generate a financial literacy quiz for module "${moduleId}" at ${difficulty} difficulty level.

User Progress Context:
- Completed modules: ${userProgress.completedModules?.length || 0}
- Average score: ${userProgress.averageScore || 0}%
- Weak areas: ${userProgress.weakAreas?.join(', ') || 'None identified'}

Create 5 multiple-choice questions that test understanding of the module content. Vary question types (calculation, concept, scenario-based).

Respond with JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": [
        {"id": "a", "text": "Option A", "isCorrect": false},
        {"id": "b", "text": "Option B", "isCorrect": true},
        {"id": "c", "text": "Option C", "isCorrect": false},
        {"id": "d", "text": "Option D", "isCorrect": false}
      ],
      "explanation": "Why this answer is correct",
      "difficulty": "beginner|intermediate|advanced",
      "points": 10
    }
  ],
  "totalPoints": 50,
  "passingScore": 70,
  "timeLimit": 300
}`;
  }

  private getMockAdvice(financialData: FinancialData, userProfile: UserProfile): any {
    const totalExpenses = financialData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = ((financialData.monthlyIncome - totalExpenses) / financialData.monthlyIncome) * 100;
    
    return {
      categorization: {
        needs: financialData.expenses.filter(e => e.type === 'needs').map(e => `${e.category}: $${e.amount}`),
        wants: financialData.expenses.filter(e => e.type === 'wants').map(e => `${e.category}: $${e.amount}`),
        luxuries: financialData.expenses.filter(e => e.type === 'luxuries').map(e => `${e.category}: $${e.amount}`),
        suggestions: [
          "Great job tracking your expenses! This is the first step to financial success.",
          "Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
          "Look for opportunities to optimize your largest expense categories."
        ]
      },
      savingsRecommendations: {
        monthlyTarget: Math.max(financialData.monthlyIncome * 0.2, 100),
        emergencyFundTarget: totalExpenses * 6,
        strategies: [
          "Automate your savings to pay yourself first",
          "Use the envelope method for discretionary spending",
          "Review and optimize subscriptions monthly",
          "Consider increasing income through side hustles"
        ],
        priorityAreas: ["dining", "entertainment", "subscriptions"]
      },
      projections: {
        conservative: (financialData.monthlyIncome - totalExpenses) * 0.7,
        moderate: financialData.monthlyIncome - totalExpenses,
        aggressive: (financialData.monthlyIncome - totalExpenses) * 1.3
      },
      healthScore: Math.min(Math.max(savingsRate * 5, 0), 100),
      motivationalMessage: `Hi ${userProfile.name}! As a ${userProfile.persona.name}, you're making great progress with ${userProfile.badges.length} badges earned. Keep up the momentum!`,
      personalizedTips: [
        `Based on your ${userProfile.persona.name} profile, focus on building emergency savings first`,
        "Your current streak of " + userProfile.streakDays + " days shows great consistency!",
        "Consider setting up automatic transfers to make saving effortless"
      ],
      riskAssessment: savingsRate < 10 ? "Medium-High Risk: Focus on building emergency fund" : "Low Risk: Good financial foundation",
      nextSteps: [
        "Set up automatic savings transfer",
        "Review largest expense categories",
        "Complete next learning module for bonus XP"
      ],
      celebrateWins: [
        userProfile.badges.length > 0 ? `Congratulations on earning ${userProfile.badges.length} badges!` : "You're just getting started - first badge coming soon!",
        userProfile.streakDays > 0 ? `Amazing ${userProfile.streakDays}-day streak!` : "Ready to start your savings streak?"
      ]
    };
  }

  private getMockQuiz(moduleId: string, difficulty: string): any {
    return {
      questions: [
        {
          id: "q1",
          question: "What percentage of income should typically go to needs according to the 50/30/20 rule?",
          options: [
            { id: "a", text: "30%", isCorrect: false },
            { id: "b", text: "50%", isCorrect: true },
            { id: "c", text: "20%", isCorrect: false },
            { id: "d", text: "70%", isCorrect: false }
          ],
          explanation: "The 50/30/20 rule suggests 50% for needs, 30% for wants, and 20% for savings.",
          difficulty: difficulty,
          points: 10
        }
      ],
      totalPoints: 50,
      passingScore: 70,
      timeLimit: 300
    };
  }
}

export const geminiService = new GeminiService();