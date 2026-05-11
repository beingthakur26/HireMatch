import { GoogleGenAI, Type } from "@google/genai";
import { Job, ParsedResume } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async parseResume(rawText: string): Promise<ParsedResume> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `You are an expert ATS (Applicant Tracking System) parser. Parse the following resume text into a highly structured JSON format.
      
      CRITICAL INSTRUCTIONS:
      1. Dates: For experience, extract 'startDate' and 'endDate' in 'MM/YYYY' format if possible. 'duration' should be the raw string from the resume (e.g., "Jan 2020 - Present").
      2. Institutions: Be precise with educational institutions. 
      3. Feedback: populate 'parsingMetadata' by identifying sections that are ambiguous, missing, or poorly formatted in the raw text.
      4. Skills: normalize common skills (e.g., "React.js" -> "React").

      Resume Text:
      """
      ${rawText}
      """` }] }],
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
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
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
            parsingMetadata: {
              type: Type.OBJECT,
              properties: {
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                sectionsQuality: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      section: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      missingInfo: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                  },
                },
              },
            },
          },
          required: ["name", "email", "skills", "experience", "education", "totalExperienceYears", "parsingMetadata"],
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
      contents: [{ role: 'user', parts: [{ text: `Score the match between this resume and job description.
      
      RESUME:
      ${JSON.stringify(resume)}
      
      JOB:
      ${JSON.stringify(job)}` }] }],
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
      contents: [{ role: 'user', parts: [{ text: `You are a world-class ATS (Applicant Tracking System) Specialist and Career Coach. 
      Analyze the provided Resume against the Job Description to provide high-impact, actionable optimization advice.
      
      FOCUS AREAS:
      1. Keyword Alignment: Identify critical missing hard skills and industry terms.
      2. Quantifiable Achievements: Suggest how to add metrics to the experience section.
      3. Formatting for ATS: Point out any potentially problematic layouts or fonts.
      4. Summary/Objective: Refine it to align with the employer's value proposition.

      RESUME: ${JSON.stringify(resume)}
      JOB: ${JSON.stringify(job)}` }] }],
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
                  impact: { type: Type.STRING, description: "High, Medium, or Low" },
                  reasoning: { type: Type.STRING, description: "Why this optimization matters for ATS" },
                },
              },
            },
            atsKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            tailoredSummary: { type: Type.STRING, description: "A highly optimized professional summary for this specific job" },
          },
          required: ["overallScore", "suggestions", "atsKeywords", "tailoredSummary"],
        },
      },
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("Failed to parse improvements response:", e);
      return { overallScore: 0, suggestions: [], atsKeywords: [], tailoredSummary: "" };
    }
  },

  async generateCoverLetter(resume: ParsedResume, job: Job) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Write a 3-paragraph professional cover letter for ${resume.name} applying to ${job.title} at ${job.company}. 
      Use these resume details: ${JSON.stringify(resume)}. 
      Return ONLY the letter text.` }] }],
    });
    return response.text.trim();
  },

  async startInterview(resume: ParsedResume, job: Job) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `You are a senior interviewer at ${job.company}. You are interviewing ${resume.name} for the position of ${job.title}.
      
      CANDIDATE INFO:
      ${JSON.stringify(resume)}
      
      JOB DESCRIPTION:
      ${JSON.stringify(job)}
      
      RULES:
      1. Be professional and encouraging.
      2. Start with a brief greeting and one introductory question.
      3. Do NOT reveal your internal logic.
      4. Ask one question at a time.
      
      Begin the interview.` }] }],
    });
    return response.text.trim();
  },

  async continueInterview(resume: ParsedResume, job: Job, history: { role: "user" | "model", parts: { text: string }[] }[]) {
     const chat = ai.chats.create({
       model: "gemini-3-flash-preview",
       config: {
         systemInstruction: `You are a senior interviewer at ${job.company}. You are interviewing ${resume.name} for the position of ${job.title}.
       Ask one question at a time. If the interview should end, provide a brief closing statement and say "INTERVIEW_OVER".`
       },
       history: history.slice(0, -1).map(h => ({
         role: h.role,
         parts: h.parts
       }))
     });

     const lastMessage = history[history.length - 1].parts[0].text;
     const result = await chat.sendMessage({ message: lastMessage });
     return result.text;
  },

  async evaluateInterview(history: any[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: `Evaluate this interview transcript between an AI interviewer and a candidate.
      
      TRANSCRIPT:
      ${JSON.stringify(history)}
      
      Provide a detailed evaluation in JSON format.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING }
          },
          required: ["overallScore", "strengths", "weaknesses", "tips", "verdict"]
        }
      }
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      return { overallScore: 0, strengths: [], weaknesses: [], tips: [], verdict: "Evaluation failed" };
    }
  }
};
