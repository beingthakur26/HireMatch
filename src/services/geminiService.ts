import { GoogleGenAI, Type } from "@google/genai";
import { Job, ParsedResume } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async parseResume(rawText: string): Promise<ParsedResume> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following resume text into a structured JSON format.
      
      Resume Text:
      """
      ${rawText}
      """`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  year: { type: Type.STRING },
                  cgpa: { type: Type.STRING },
                },
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  link: { type: Type.STRING },
                },
              },
            },
            totalExperienceYears: { type: Type.NUMBER },
            inferredSeniority: { type: Type.STRING },
            inferredDomain: { type: Type.STRING },
          },
          required: ["name", "email", "skills", "experience", "education", "totalExperienceYears"],
        },
      },
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      throw new Error("Failed to parse resume data");
    }
  },

  async scoreJobMatch(resume: ParsedResume, job: Job) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Score the match between this resume and job description.
      
      RESUME:
      ${JSON.stringify(resume)}
      
      JOB:
      ${JSON.stringify(job)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            matchReasons: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["score", "matchReasons", "missingSkills"],
        },
      },
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("Failed to parse scoring response:", e);
      return { score: 0, matchReasons: [], missingSkills: [] };
    }
  },

  async getResumeImprovements(resume: ParsedResume, job: Job) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a senior career coach. Provide specific, actionable resume improvement advice for this job.
      
      RESUME: ${JSON.stringify(resume)}
      JOB: ${JSON.stringify(job)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  section: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                  impact: { type: Type.STRING },
                },
              },
            },
            atsKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["overallScore", "suggestions", "atsKeywords"],
        },
      },
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("Failed to parse improvements response:", e);
      return { overallScore: 0, suggestions: [], atsKeywords: [] };
    }
  },

  async generateCoverLetter(resume: ParsedResume, job: Job) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a 3-paragraph professional cover letter for ${resume.name} applying to ${job.title} at ${job.company}. 
      Use these resume details: ${JSON.stringify(resume)}. 
      Return ONLY the letter text.`,
    });
    return response.text.trim();
  },
};
