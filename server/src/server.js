require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { generateGeminiMCQs, testGeminiApiKey, CURATED_PYQ_BANK } = require("./aiGenerator");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #060812; color: #f3f4ff; min-height: 100vh;">
      <h1 style="color: #a78bfa;">⚡ Aptitude Arena Backend API Server</h1>
      <p style="color: #10b981; font-weight: bold;">Status: Socket.IO Server is Running Live on Port 3000</p>
      <p style="color: #94a3b8;">Google Gemini API integration: ${process.env.GEMINI_API_KEY ? "🟢 Server Key Configured" : "⚪ Client Key / Fallback Mode"}</p>
      <p style="color: #94a3b8;">To play the game, visit the Frontend App below:</p>
      <p><a href="http://localhost:5173" style="color: #67e8f9; font-size: 18px; font-weight: bold;">👉 Open Frontend Application (http://localhost:5173)</a></p>
      <p><a href="/health" style="color: #cbd5e1;">Check JSON Health Endpoint (/health)</a></p>
    </div>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Aptitude Arena backend is running!",
    hasBackendGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Endpoint to check AI server status
app.get("/api/ai-status", (req, res) => {
  res.json({
    hasBackendKey: Boolean(process.env.GEMINI_API_KEY),
    supportedModels: ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"],
    curatedPyqCount: CURATED_PYQ_BANK.length
  });
});

// Endpoint to validate a Google Gemini API Key
app.post("/api/test-gemini-key", async (req, res) => {
  try {
    const { apiKey } = req.body || {};
    const result = await testGeminiApiKey(apiKey);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Failed to validate key" });
  }
});

// Endpoint to generate MCQs & PYQs via Gemini or curated bank
app.post("/api/generate-questions", async (req, res) => {
  try {
    const {
      category,
      count,
      apiKey,
      company,
      year,
      difficulty,
      isPyq
    } = req.body || {};

    const result = await generateGeminiMCQs({
      category,
      count,
      apiKey,
      company,
      year,
      difficulty,
      isPyq
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to generate MCQs" });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

require("./socket")(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (process.env.GEMINI_API_KEY) {
    console.log("⚡ Google Gemini API Key configured in backend environment.");
  }
});

