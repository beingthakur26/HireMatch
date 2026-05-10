import { GoogleGenAI, Type } from "@google/genai";
import { Job, ParsedResume, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export const aiAssistantService = {
  async chat(history: ChatMessage[], profile?: UserProfile | null) {
    const systemInstruction = `You are HireMatch AI Assistant, a career coach and job search expert.
    
    User Profile Context:
    - Name: ${profile?.name || "Not provided"}
    - Email: ${profile?.email || "Not provided"}
    - Phone: ${profile?.phone || "Not provided"}
    - About/Bio: ${profile?.about || "Not provided"}
    - Skills: ${profile?.skills?.join(", ") || "Not provided"}
    - Detailed Resume Data: ${profile?.resume ? JSON.stringify(profile.resume) : "No resume uploaded yet"}.
    
    Capabilities:
    1. **Career Advice**: Answer questions about career paths, interview prep, and salary negotiations.
    2. **Resume Optimization**: If the user asks to "optimize" or "tailor" their resume for a specific role:
       - Analyze their current resume against the target role.
       - Suggest specific bullet points to add, skills to highlight, or formatting changes.
       - Help them "remove" irrelevant items or rephrase them to better fit the target role.
    3. **Job Search**: If the user asks for a job or internship (e.g., "Find me a React Developer job in London"):
       - Use the 'googleSearch' tool to find real-time job listings.
       - Provide a list of found jobs with titles, companies, and links.
       - If the user has a resume uploaded, compare the search results with their skills and highlight matches.
    
    Guidelines:
    - Be professional, encouraging, and concise.
    - If no profile details are provided, gently suggest they complete their profile for better results.
    - Always prioritize current, real job data when searching.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });

      return response.text;
    } catch (error) {
      console.error("Chat Error:", error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  }
};
