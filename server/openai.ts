import OpenAI from "openai";
import { type ChatMessage } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development" });

class AIAssistant {
  private systemPrompt = `You are a helpful AI assistant for JobNexus, a job application platform. 
Your name is JobNexus AI. Your purpose is to help users with their job search and application process.

You can help with:
1. Resume and cover letter advice
2. Job search strategies
3. Interview preparation
4. Specific career questions
5. Application follow-up suggestions
6. Career development advice

Be concise, helpful, and specific. When appropriate, use markdown formatting for lists and emphasis.
If you don't know something, admit it and suggest alternatives. Don't make up information about specific companies or jobs.

Current user is looking for help with their job applications.`;

  async getResponse(chatHistory: ChatMessage[], latestMessage: string): Promise<string> {
    try {
      // Format chat history for OpenAI
      const messages: any[] = [
        { role: "system", content: this.systemPrompt },
        ...chatHistory.map(msg => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.message
        }))
      ];

      // In a development environment with no API key, return mock responses
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key-for-development") {
        return this.getMockResponse(latestMessage);
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages,
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "text" }
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "I'm sorry, I encountered an issue while processing your request. Please try again later.";
    }
  }

  private getMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("resume") || lowerMessage.includes("cv")) {
      return "Here are some tips for improving your resume:\n\n1. **Tailor it to each job** - Customize your resume for each position\n2. **Use action verbs** - Start bullet points with strong action verbs\n3. **Quantify achievements** - Use numbers to show impact\n4. **Keep it concise** - Aim for 1-2 pages maximum\n5. **Include relevant keywords** - Match skills from the job description\n\nWould you like me to help with a specific section of your resume?";
    } 
    
    if (lowerMessage.includes("interview") || lowerMessage.includes("prepare")) {
      return "To prepare for your interview:\n\n1. **Research the company** - Know their products, culture, and recent news\n2. **Practice common questions** - Especially behavioral and technical ones\n3. **Prepare your own questions** - Show interest in the role and company\n4. **Use the STAR method** - For behavioral questions (Situation, Task, Action, Result)\n5. **Do a mock interview** - Practice with a friend or record yourself\n\nIs there a specific type of interview you're preparing for?";
    }
    
    if (lowerMessage.includes("cover letter") || lowerMessage.includes("coverletter")) {
      return "A strong cover letter should:\n\n1. **Address the hiring manager by name** if possible\n2. **Start with an attention-grabbing introduction**\n3. **Explain why you're interested in the company specifically**\n4. **Connect your experience to the job requirements**\n5. **End with a clear call to action**\n\nKeep it to one page and make sure it complements your resume rather than repeating it.";
    }
    
    if (lowerMessage.includes("rejected") || lowerMessage.includes("rejection")) {
      return "I'm sorry to hear about the rejection. It's normal to feel disappointed, but try to view it as a learning opportunity:\n\n1. **Ask for feedback** if possible\n2. **Review your application materials**\n3. **Consider if there were skills gaps** you could address\n4. **Don't take it personally** - many factors affect hiring decisions\n5. **Keep your momentum** by continuing to apply to other positions\n\nRemember that even experienced professionals face rejection. The right opportunity is still out there.";
    }
    
    // Default response
    return "I'm here to help with your job search journey. I can provide advice on resumes, cover letters, interviews, job search strategies, or handling application outcomes. What specific aspect of your job search would you like assistance with today?";
  }
  
  async generateJobSuggestions(skills: string[], location: string): Promise<string> {
    try {
      // In a development environment with no API key, return mock responses
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key-for-development") {
        return "Based on your skills and location preferences, I recommend looking into these roles:\n\n1. Frontend Developer positions at tech startups in San Francisco\n2. UI/UX roles at design agencies with remote options\n3. Product-focused engineering roles at established companies\n\nThese align well with your background in React and UI design experience.";
      }

      const skillsStr = skills.join(", ");
      const prompt = `Given a job seeker with the following skills: ${skillsStr} who is looking for work in ${location}, 
      suggest 3-5 specific job roles that would be a good match. For each suggestion, include the role title, 
      why it's a good match, and a brief note on the type of company to target. Format the response with numbered items and markdown.`;

      const messages: any[] = [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: prompt }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages,
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "text" }
      });

      return response.choices[0].message.content || "I couldn't generate job suggestions at the moment. Please try again later.";
    } catch (error) {
      console.error("Error generating job suggestions:", error);
      return "I'm sorry, I encountered an issue while generating job suggestions. Please try again later.";
    }
  }
}

export const aiAssistant = new AIAssistant();
