import axios from "axios";
import { Job } from "../types";

const api = axios.create({
  baseURL: "/api",
});

export const jobApi = {
  async extractResumeText(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("resume", file);
    const response = await api.post("/resume/extract", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.text;
  },

  async searchJobs(query: string, location?: string, jobType?: string): Promise<Job[]> {
    const response = await api.post("/jobs/search", { query, location, jobType });
    return response.data.jobs;
  },

  async createAlert(alertData: { keywords: string; location: string; frequency: string }): Promise<string> {
    const response = await api.post("/alerts", alertData);
    return response.data.id;
  }
};
