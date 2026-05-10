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
}
