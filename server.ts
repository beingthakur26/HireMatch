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
      
      console.log(`📄 Extracting PDF: ${req.file.originalname} (${req.file.size} bytes)`);
      
      // Load pdf-parse (classic version)
      let pdfParser;
      try {
        pdfParser = require("pdf-parse");
      } catch (e) {
        console.log("Standard require failed, trying dynamic import...");
        const mod = await import("pdf-parse");
        pdfParser = mod.default || mod;
      }
      
      if (typeof pdfParser !== "function") {
        // Handle cases where the import might be nested
        if (pdfParser.default && typeof pdfParser.default === "function") {
          pdfParser = pdfParser.default;
        } else if (pdfParser.pdf && typeof pdfParser.pdf === "function") {
          pdfParser = pdfParser.pdf;
        } else {
          throw new Error("PDF Parser could not be initialized as a function.");
        }
      }

      console.log("🚀 Starting PDF Extraction...");
      const data = await pdfParser(req.file.buffer);
      
      if (!data || !data.text) {
        throw new Error("PDF parsing returned empty content.");
      }
      if (!data || !data.text) {
        throw new Error("PDF parsing returned empty content.");
      }

      console.log(`✅ Extraction successful: ${data.text.length} characters`);
      res.json({ text: data.text });
    } catch (e: any) {
      console.error("Extraction failed:", e);
      res.status(500).json({ 
        error: "Failed to extract text from PDF", 
        details: e.message,
        stack: process.env.NODE_ENV !== 'production' ? e.stack : undefined
      });
    }
  });

  // Job Alerts Endpoints
  app.post("/api/alerts", (req, res) => {
    const { keywords, location, frequency } = req.body;
    console.log(`Setting up job alert: ${keywords} @ ${location} [${frequency}]`);
    // In a real app, we'd save this to a database and start a worker
    res.json({ success: true, id: `alert-${Date.now()}` });
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
