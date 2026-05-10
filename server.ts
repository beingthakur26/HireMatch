import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { createRequire } from "module";

// Setup
dotenv.config();
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("🚀 Initializing HireMatch AI Server...");
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes Start
  app.get("/api/health", (req, res) => res.json({ ok: true }));

  // Tavily Search
  app.post("/api/jobs/search", async (req, res) => {
    try {
      const { query, location, jobType } = req.body;
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "Missing Tavily API Key" });

      const { tavily } = await import("@tavily/core");
      const client = tavily({ apiKey });

      const searchQuery = `${query} ${jobType || ""} job ${location || ""} 2025`;
      const result = await client.search(searchQuery, {
        searchDepth: "advanced",
        maxResults: 10,
      });

      const jobs = result.results.map((r: any, i: number) => ({
        id: `t-${i}-${Date.now()}`,
        source: "Tavily",
        sourceUrl: r.url,
        title: r.title,
        company: "Remote/Verified",
        description: r.content,
        postedAt: new Date().toISOString(),
        location: location || "Remote",
      }));

      res.json({ jobs });
    } catch (e) {
      console.error("Search failed:", e);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // PDF Extraction
  const upload = multer({ storage: multer.memoryStorage() });
  app.post("/api/resume/extract", upload.single("resume"), async (req: any, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file" });
      
      // Robust loading for pdf-parse which can be tricky in ESM/TSX
      let pdfParser = require("pdf-parse");
      
      // Fallback strategies for different packaging
      let pdf = typeof pdfParser === "function" ? pdfParser : pdfParser.default;
      
      if (typeof pdf !== "function") {
        console.log("pdfParser is not a function, trying internal path...");
        try {
          const internal = require("pdf-parse/lib/pdf-parse.js");
          pdf = typeof internal === "function" ? internal : internal.default;
        } catch (e) {
          console.error("Failed to load internal pdf-parse:", e);
        }
      }

      if (typeof pdf !== "function") {
        console.error("Final check: pdf is still not a function. pdfParser is:", typeof pdfParser);
        throw new Error("pdf-parse could not be loaded as a function.");
      }

      const data = await pdf(req.file.buffer);
      res.json({ text: data.text });
    } catch (e) {
      console.error("Extraction failed:", e);
      res.status(500).json({ error: "Failed to extract text" });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    console.log(" Starting Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Serving production build...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server ready at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("❌ Fatal server startup error:", err);
});
