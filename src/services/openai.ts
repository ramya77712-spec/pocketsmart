import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ConversationContext {
  userId: string;
  persona: string;
  financialData: any;
  previousInteractions: any[];
  currentGoals: any[];
  userTone: 'anxious' | 'confident' | 'curious' | 'overwhelmed' | 'motivated';
}

export interface AIResponse {
  message: string;
  tone: string;
  suggestions: string[];
  followUpQuestions: string[];
  personalizedTips: string[];
  confidenceScore: number;
}

export class AICoachService {
  private conversationHistory: Map<string, any[]> = new Map();
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generatePersonalizedResponse(
    userMessage: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const conversationHistory = this.getConversationHistory(context.userId);
      
      // Build conversation context for Gemini
      let fullPrompt = systemPrompt + '\n\n';
      
      // Add conversation history
      conversationHistory.forEach(msg => {
        if (msg.role === 'user') {
          fullPrompt += `User: ${msg.content}\n`;
        } else {
          fullPrompt += `Assistant: ${msg.content}\n`;
        }
      });
      
      // Add current user message
      fullPrompt += `User: ${userMessage}\nAssistant:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const aiMessage = response.text();
      
      // Update conversation history
      this.updateConversationHistory(context.userId, userMessage, aiMessage);
      
      // Parse AI response for structured data
      const parsedResponse = this.parseAIResponse(aiMessage);
      
      return {
        message: aiMessage,
        tone: context.userTone,
        suggestions: parsedResponse.suggestions,
        followUpQuestions: parsedResponse.followUpQuestions,
        personalizedTips: parsedResponse.personalizedTips,
        confidenceScore: 0.85
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return this.getFallbackResponse(context);
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    return `
You are an expert AI Financial Coach specializing in personalized financial guidance. 

User Context:
- Persona: ${context.persona}
- Current Tone: ${context.userTone}
- Financial Situation: ${JSON.stringify(context.financialData)}
- Goals: ${JSON.stringify(context.currentGoals)}

Instructions:
1. Provide empathetic, personalized financial advice
2. Reference the user's specific situation and previous conversations
3. Adapt your communication style to match their emotional tone
4. Offer 2-3 specific, actionable suggestions
5. Ask 1-2 follow-up questions to deepen engagement
6. Include motivational elements appropriate to their persona
7. Keep responses conversational and encouraging

Response Format:
- Main advice (2-3 paragraphs)
- Specific suggestions (bullet points)
- Follow-up questions
- Personalized tips based on their persona

Remember: Be supportive, non-judgmental, and focus on progress over perfection.
    `;
  }

  private getConversationHistory(userId: string): any[] {
    return this.conversationHistory.get(userId) || [];
  }

  private updateConversationHistory(userId: string, userMessage: string, aiResponse: string): void {
    const history = this.getConversationHistory(userId);
    history.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );
    
    // Keep only last 10 exchanges to manage token limits
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    
    this.conversationHistory.set(userId, history);
  }

  private parseAIResponse(response: string): {
    suggestions: string[];
    followUpQuestions: string[];
    personalizedTips: string[];
  } {
    // Simple parsing logic - in production, you might use more sophisticated NLP
    const suggestions = this.extractBulletPoints(response, ['suggest', 'recommend', 'try']);
    const followUpQuestions = this.extractQuestions(response);
    const personalizedTips = this.extractBulletPoints(response, ['tip', 'consider', 'remember']);
    
    return { suggestions, followUpQuestions, personalizedTips };
  }

  private extractBulletPoints(text: string, keywords: string[]): string[] {
    const lines = text.split('\n');
    return lines
      .filter(line => 
        line.trim().startsWith('•') || 
        line.trim().startsWith('-') ||
        keywords.some(keyword => line.toLowerCase().includes(keyword))
      )
      .map(line => line.replace(/^[•\-]\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 3);
  }

  private extractQuestions(text: string): string[] {
    const sentences = text.split(/[.!?]+/);
    return sentences
      .filter(sentence => sentence.trim().endsWith('?'))
      .map(sentence => sentence.trim())
      .slice(0, 2);
  }

  private getFallbackResponse(context: ConversationContext): AIResponse {
    const fallbackMessages = {
      anxious: "I understand financial planning can feel overwhelming. Let's take it one step at a time.",
      confident: "Great to see your confidence! Let's build on that momentum.",
      curious: "I love your curiosity about financial planning! Let's explore this together.",
      overwhelmed: "It's okay to feel overwhelmed. We'll break this down into manageable pieces.",
      motivated: "Your motivation is inspiring! Let's channel that energy into actionable steps."
    };

    return {
      message: fallbackMessages[context.userTone] || "I'm here to help with your financial journey.",
      tone: context.userTone,
      suggestions: ["Start with small, achievable goals", "Track your progress regularly"],
      followUpQuestions: ["What's your biggest financial concern right now?"],
      personalizedTips: ["Focus on building one habit at a time"],
      confidenceScore: 0.5
    };
  }

  async analyzeUserTone(message: string): Promise<'anxious' | 'confident' | 'curious' | 'overwhelmed' | 'motivated'> {
    try {
      const prompt = `Analyze the emotional tone of this message and respond with only one word from these options: anxious, confident, curious, overwhelmed, motivated

Message: "${message}"

Tone:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const tone = response.text().trim().toLowerCase();
      
      // Validate the response
      const validTones = ['anxious', 'confident', 'curious', 'overwhelmed', 'motivated'];
      if (validTones.includes(tone)) {
        return tone as any;
      }
    } catch (error) {
      console.error('Error analyzing tone with Gemini:', error);
    }

    // Fallback to keyword-based analysis
    const anxiousWords = ['worried', 'scared', 'nervous', 'afraid', 'stress'];
    const confidentWords = ['sure', 'confident', 'ready', 'excited', 'determined'];
    const curiousWords = ['how', 'why', 'what', 'learn', 'understand'];
    const overwhelmedWords = ['too much', 'confused', 'lost', 'complicated', 'difficult'];
    const motivatedWords = ['goal', 'achieve', 'improve', 'better', 'success'];

    const lowerMessage = message.toLowerCase();
    
    if (anxiousWords.some(word => lowerMessage.includes(word))) return 'anxious';
    if (confidentWords.some(word => lowerMessage.includes(word))) return 'confident';
    if (curiousWords.some(word => lowerMessage.includes(word))) return 'curious';
    if (overwhelmedWords.some(word => lowerMessage.includes(word))) return 'overwhelmed';
    if (motivatedWords.some(word => lowerMessage.includes(word))) return 'motivated';
    
    return 'curious'; // Default tone
  }
}

export const aiCoachService = new AICoachService();