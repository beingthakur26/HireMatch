export interface Job {
  id?: string;
  externalId?: string;
  source: "linkedin" | "internshala" | "unstop" | "naukri" | "indeed" | "wellfound" | "tavily" | "other";
  sourceUrl: string;
  title: string;
  company: string;
  companyLogo?: string;
  location?: string;
  locationType?: "remote" | "hybrid" | "onsite";
  jobType?: "fulltime" | "parttime" | "internship" | "contract";
  description?: string;
  requiredSkills?: string[];
  salary?: {
    min: number;
    max?: number;
    currency: string;
    period?: string;
  };
  postedAt: string;
  matchScore?: number;
  matchReasons?: string[];
  missingSkills?: string[];
}

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    startDate?: string;
    endDate?: string;
    description: string;
    technologies: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
    cgpa?: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  totalExperienceYears: number;
  inferredSeniority?: string;
  inferredDomain?: string;
  parsingMetadata?: {
    warnings: string[];
    sectionsQuality: {
      section: string;
      score: number; // 0-100
      missingInfo: string[];
    }[];
  };
}

export interface JobAlert {
  id: string;
  keywords: string;
  location: string;
  frequency: "daily" | "weekly" | "instant";
  createdAt: string;
  isActive: boolean;
}

export interface UserExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface UserEducation {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface CreditTransaction {
  id: string;
  type: "earned" | "spent" | "bonus";
  amount: number;
  reason: string;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  jobId: string;
  company: string;
  role: string;
  debrief: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    tips: string[];
    verdict: string;
  };
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  about: string;
  skills: string[];
  experience: UserExperience[];
  education: UserEducation[];
  profilePicture?: string;
  resume?: ParsedResume;
  credits: {
    balance: number;
    totalEarned: number;
    lastRefillDate: string;
    transactions: CreditTransaction[];
    referralCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}
