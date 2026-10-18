# ⚡ AptiQuiz (Aptitude Arena 3D) — Next-Gen 3D Aptitude & Placement Platform

> A full-stack, real-time competitive aptitude and campus placement preparation platform featuring an interactive 3D Three.js universe, multiplayer battles, Google Gemini AI question synthesis, and authentic Previous Year Questions (PYQs).

![Aptitude Arena Banner](https://img.shields.io/badge/Status-Live%20%26%20Active-brightgreen)
![Node](https://img.shields.io/badge/Node-v20+-blue)
![React](https://img.shields.io/badge/React-19-cyan)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Three.js](https://img.shields.io/badge/Three.js-3D-black)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-1.5%2F2.0%20Flash-orange)

---

## 🌟 Key Features

- **🎯 Authentic Placement PYQs (Previous Year Questions)**
  - Real recruitment papers for **TCS NQT**, **Infosys**, **Wipro**, **Accenture**, **Cognizant**, **Amazon OA**, **Capgemini**, **GATE**, **CAT**, and **Banking/SSC**.
  - Target exam years (2024, 2023, 2022) and difficulty filters (Easy, Medium, Hard).
  - Step-by-step mathematical solutions and shortcut formulas for every problem.

- **🧠 Google Gemini 1.5/2.0 Flash AI Integration**
  - Live AI question synthesis with guaranteed structured JSON schema adherence.
  - Pre-connected backend engine — no client-side API key configuration required.
  - Zero-config verified offline PYQ repository fallback for instant practice.

- **⚔️ Real-Time Multiplayer Arena**
  - Socket.IO WebSockets powered live rooms.
  - Room creation, shareable invite codes, live player leaderboards, and instant countdown timers.

- **🌐 Interactive 3D Visual Experience**
  - Dynamic Three.js cosmic canvas with responsive camera interactions and particle fields.
  - Sleek glassmorphism cyberpunk UI with dark theme ergonomics.

- **📊 Student Analytics & Mistake Notebook**
  - Save completed practice sessions.
  - Mistake notebook filter (All, Mistakes Only, Correct Only) with detailed solution analysis.

- **🐳 Docker & Docker Compose Ready**
  - Multi-container orchestration: Express backend + Nginx reverse proxy + Vite React frontend.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/abh09ab/aptitude-arena.git
cd aptitude-arena
```

### 2. Start the Backend Server
```bash
cd server
npm install
npm start
```
*Backend runs on `http://localhost:3000`.*

### 3. Start the Frontend Application
In a separate terminal:
```bash
cd frontended
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🐳 Running with Docker

Run both backend and frontend with a single command:
```bash
# 1. (Optional) Copy environment template
cp .env.example .env

# 2. Build and launch containers
docker compose up --build -d
```
Access the application at **[http://localhost:5173](http://localhost:5173)**.  
For detailed Docker configuration, check [DOCKER.md](file:///c:/Users/abhay/Music/aptitude-arena/DOCKER.md).

---

## 🔑 Environment Configuration

Create a `.env` file in the root or inside `server/` (refer to `.env.example`):
```env
# Google Gemini API Key for live AI PYQ generation (Optional)
# Get a free key at https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Backend Port
PORT=3000
```
> If no API key is provided, the platform automatically serves questions from the built-in curated PYQ question bank!

---

## 📁 Repository Structure

```
aptitude-arena/
├── docker-compose.yml       # Multi-container Docker orchestration
├── DOCKER.md                # Docker guide & documentation
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── server/                  # Backend Node.js / Express / Socket.IO
│   ├── src/
│   │   ├── server.js        # Main server entry & REST endpoints
│   │   ├── socket.js        # Multiplayer WebSocket handlers
│   │   ├── aiGenerator.js   # Gemini API & PYQ engine
│   │   └── roomManager.js   # Game room state manager
│   ├── Data/                # Seed questions & persistence
│   ├── Dockerfile           # Backend containerfile
│   └── package.json
└── frontended/              # Frontend React + Vite + Three.js
    ├── src/
    │   ├── components/      # UI Views, 3D Canvas, Quiz & Arena
    │   ├── data/            # Local aptitude questions repository
    │   ├── App.jsx          # Root view routing & game state
    │   └── App.css          # Design system & styles
    ├── nginx.conf           # Production Nginx reverse proxy
    ├── Dockerfile           # Frontend multi-stage containerfile
    └── package.json
```

---

## 👨‍💻 Author

- GitHub: [@abh09ab](https://github.com/abh09ab)
- Project: **Aptitude Arena 3D**
>>>>>>> 1784f20 (feat: Aptitude Arena 3D with Docker setup and Google Gemini PYQ integration)
