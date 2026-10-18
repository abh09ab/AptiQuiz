# 🐳 Docker Deployment & Google Gemini API Guide — Aptitude Arena 3D

This guide details how to build and run **Aptitude Arena 3D** (Backend API + Real-time WebSockets + 3D React Frontend) in **Docker**, and how to configure the **Google Gemini API** for live AI-powered Previous Year Questions (PYQs) generation.

---

## 🏗️ Architecture Overview

The multi-container Docker setup consists of:

1. **`server` (Backend Node/Express & Socket.IO)**
   - Port: `3000`
   - Handles real-time multiplayer room orchestration, Google Gemini 1.5/2.0 Flash AI API calls, PYQ synthesis, and health checks.
   - Built via `server/Dockerfile` using lightweight `node:20-alpine`.

2. **`frontend` (3D Vite React Application)**
   - Port: `5173`
   - Multi-stage build (`frontended/Dockerfile`): builds React assets and serves them via high-performance `nginx:alpine`.
   - Reverse proxies `/api/` and `/socket.io/` to the `server` container.

3. **Bridge Network (`aptitude-network`)**
   - Inter-container DNS communication between the Nginx frontend reverse proxy and Express backend server.

---

## ⚡ Quick Start with Docker

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and optionally set your **Google Gemini API Key**:
```env
# Get a free key at https://aistudio.google.com/
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
PORT=3000
```
> **Note:** If `GEMINI_API_KEY` is not provided, the platform automatically switches to its **Curated PYQ Verified Bank**, allowing instant offline practice of real TCS, Infosys, Wipro, Accenture, Amazon, and GATE questions with zero configuration!

### 2. Build and Launch Containers
Run using Docker Compose:
```bash
docker compose up --build -d
```

### 3. Verify Container Status
Check running containers:
```bash
docker compose ps
```

View real-time logs:
```bash
# All services
docker compose logs -f

# Backend server only
docker compose logs -f server

# Frontend proxy only
docker compose logs -f frontend
```

### 4. Access the Application
- 🌐 **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- ⚡ **Backend Health Check**: [http://localhost:3000/health](http://localhost:3000/health)
- 🧠 **AI Engine Status**: [http://localhost:3000/api/ai-status](http://localhost:3000/api/ai-status)

### 5. Stop Containers
```bash
docker compose down
```

---

## 🔑 Google Gemini API Setup & PYQ Features

### Getting a Free Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **"Create API Key"** and copy the resulting string (starts with `AIzaSy...`).
3. You can either:
   - Add it to `.env` as `GEMINI_API_KEY=...` (available globally to backend & containers).
   - Or paste it directly in the **"AI & PYQ Generator"** view in the web UI.

### In-App Key Validation
The web interface includes an interactive **"Test API Key"** button that sends a test ping to Google Gemini:
- 🟢 `Connected: Google Gemini 1.5 Flash Active`
- 🔴 Displays the exact reason if a key has expired or is invalid.

### Supported PYQ Companies & Competitive Exams
- **TCS NQT / Digital** (Tata Consultancy Services)
- **Infosys** (InfyTQ & Springboard)
- **Wipro** (NLTH & Elite)
- **Accenture** (Cognitive Assessment)
- **Cognizant** (GenC & GenC Elevate)
- **Amazon** (OA & High Package Math)
- **Capgemini** (Excellence Assessment)
- **GATE CS / General Aptitude**
- **CAT / MBA Quantitative & LRDI**
- **SSC CGL & Banking (IBPS PO / SBI)**

### Question Output Schema
Questions generated via Gemini API include:
- `company`: Target placement firm / exam tag
- `year`: Exam year (e.g. 2024, 2023)
- `category`: Section (Quant, Logical, Verbal, DI)
- `difficulty`: Easy / Medium / Hard
- `options`: 4 plausible multiple-choice options
- `correctOptionId`: Exact correct option identifier
- `explanation`: Detailed step-by-step mathematical/logical breakdown with shortcuts and formulas.
