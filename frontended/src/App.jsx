import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import {
  Users,
  Trophy,
  Brain,
  ArrowRight,
  Gift,
  GraduationCap,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import "./App.css";

// 3D Components
import ThreeBackground from "./components/ThreeBackground";
import Hero3DVisual from "./components/Hero3DVisual";

// UI Components
import Navbar from "./components/Navbar";
import CategoryCards from "./components/CategoryCards";
import StudentDashboard from "./components/StudentDashboard";
import PracticeQuizView from "./components/PracticeQuizView";
import FeaturedMockTests from "./components/FeaturedMockTests";
import DailyChallenge from "./components/DailyChallenge";
import HowItWorks from "./components/HowItWorks";
import AuthModal from "./components/AuthModal";
import AiGeneratorView from "./components/AiGeneratorView";
import SavedTestsView from "./components/SavedTestsView";
import LeaderboardView from "./components/LeaderboardView";
import MultiplayerArenaView from "./components/MultiplayerArenaView";

// Question bank
import {
  ALL_QUESTIONS_BANK,
  getQuestionsByCategory,
  getQuestionsForMockTest,
} from "./data/aptitudeBank";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (typeof window !== "undefined" && window.location.port === "5173"
    ? "http://localhost:3000"
    : (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"));

const avatars = [
  { id: "p1", emoji: "⚡", title: "Cyber Prodigy" },
  { id: "p2", emoji: "🧠", title: "Logic Master" },
  { id: "p3", emoji: "🎯", title: "Aptitude Ace" },
  { id: "p4", emoji: "🚀", title: "Placement Star" },
  { id: "p5", emoji: "🏆", title: "Code Ninja" },
  { id: "p6", emoji: "🎓", title: "Campus Champ" },
];

const initialGlobalLeaderboard = [
  {
    rank: 1,
    name: "⚡ Niteesh Kumar",
    college: "IIT Bombay",
    target: "SDE @ Google",
    rating: 2150,
    tier: "Grandmaster",
    accuracy: "96%",
    rewards: "₹3,500 Amazon Voucher",
    avatar: "⚡",
  },
  {
    rank: 2,
    name: "🧠 Ananya Sharma",
    college: "BITS Pilani",
    target: "Quant @ Goldman Sachs",
    rating: 1980,
    tier: "Master",
    accuracy: "94%",
    rewards: "₹2,000 Flipkart Voucher",
    avatar: "🧠",
  },
  {
    rank: 3,
    name: "🎯 Abhay Verma",
    college: "DTU Delhi",
    target: "Software Engineer @ Microsoft",
    rating: 1890,
    tier: "Master",
    accuracy: "91%",
    rewards: "₹1,500 Amazon Voucher",
    avatar: "🎯",
  },
  {
    rank: 4,
    name: "🚀 Rohan Gupta",
    college: "IIT Delhi",
    target: "Product Manager @ Uber",
    rating: 1760,
    tier: "Knight",
    accuracy: "89%",
    rewards: "₹1,000 Amazon Voucher",
    avatar: "🚀",
  },
  {
    rank: 5,
    name: "🏆 Sneha Patel",
    college: "Anna University",
    target: "Data Scientist @ Amazon",
    rating: 1680,
    tier: "Knight",
    accuracy: "87%",
    rewards: "₹500 Swag Pack",
    avatar: "🏆",
  },
  {
    rank: 6,
    name: "🎓 Vikram Singh",
    college: "NIT Trichy",
    target: "Systems Engineer @ NVIDIA",
    rating: 1610,
    tier: "Knight",
    accuracy: "85%",
    rewards: "₹500 Amazon Voucher",
    avatar: "🎓",
  },
];

function App() {
  // Navigation view: "home" | "dashboard" | "ai_generator" | "saved_tests" | "leaderboard"
  const [currentView, setCurrentView] = useState("home");

  // User profile state
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("aptitude_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      name: "Abhay",
      avatar: "⚡",
      college: "BITS Pilani / IIT",
      targetCompany: "Software Engineer @ Google",
      authMethod: "Gmail",
      rating: 1650,
      globalRank: 12,
      accuracy: "92%",
      rewards: "₹500 Gift Voucher",
    };
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Single player / Test experience state
  const [activeQuiz, setActiveQuiz] = useState(null); // { title: string, questions: Array }
  const [isTestSaved, setIsTestSaved] = useState(false);

  // Saved tests state
  const [savedTests, setSavedTests] = useState(() => {
    try {
      const saved = localStorage.getItem("aptitude_saved_tests");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedSavedTest, setSelectedSavedTest] = useState(null);

  // Gemini AI generator state
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [aiCategory, setAiCategory] = useState("Quantitative Aptitude");
  const [aiCount, setAiCount] = useState(10);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Multiplayer Room state
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState(() => userProfile?.name || "Abhay");
  const [roomCode, setRoomCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hostTotalQuestions, setHostTotalQuestions] = useState(5);

  const [mpQuestion, setMpQuestion] = useState(null);
  const [mpSelectedOption, setMpSelectedOption] = useState(null);
  const [mpAnswerResult, setMpAnswerResult] = useState(null);
  const [mpRevealData, setMpRevealData] = useState(null);
  const [mpTimeLeft, setMpTimeLeft] = useState(15);
  const [revealCountdown, setRevealCountdown] = useState(5);

  // Initialize Socket.io connection safely
  useEffect(() => {
    const socketInstance = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      setErrorMessage("");
    });

    socketInstance.on("room:updated", (updatedRoom) => {
      setRoom(updatedRoom);
      if (updatedRoom.status === "lobby") {
        setMpRevealData(null);
        setMpQuestion(null);
      } else if (updatedRoom.status === "playing") {
        setMpRevealData(null);
      }
    });

    socketInstance.on("game:question", (questionData) => {
      setMpQuestion(questionData);
      setMpSelectedOption(null);
      setMpAnswerResult(null);
      setMpRevealData(null);
    });

    socketInstance.on("game:reveal", (revealData) => {
      setMpRevealData(revealData);
      if (revealData?.nextCountdown) {
        setRevealCountdown(revealData.nextCountdown);
      }
    });

    const initTimer = setTimeout(() => {
      setSocket(socketInstance);
    }, 0);

    return () => {
      clearTimeout(initTimer);
      socketInstance.disconnect();
    };
  }, []);

  // Multiplayer question timer
  useEffect(() => {
    if (!mpQuestion || mpRevealData) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((mpQuestion.deadline - Date.now()) / 1000)
      );
      setMpTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [mpQuestion, mpRevealData]);

  // Intermission countdown
  useEffect(() => {
    if (!mpRevealData || mpRevealData.isLastQuestion) return;

    const timer = setInterval(() => {
      setRevealCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [mpRevealData]);

  // Update profile handler
  const handleSaveProfile = useCallback((newProfile) => {
    setUserProfile(newProfile);
    setPlayerName(newProfile.name);
    localStorage.setItem("aptitude_user", JSON.stringify(newProfile));
  }, []);

  // Start single-player practice session
  const startPracticeSession = useCallback((title = "Practice Aptitude Assessment", questionList = null) => {
    setIsTestSaved(false);
    const questionsToUse = questionList || ALL_QUESTIONS_BANK.slice(0, 10);
    setActiveQuiz({
      title,
      questions: questionsToUse,
    });
  }, []);

  // Category practice trigger
  const handleSelectCategory = useCallback((categoryId, categoryTitle) => {
    const questions = getQuestionsByCategory(categoryId, 10);
    startPracticeSession(`${categoryTitle} Practice Test`, questions);
  }, [startPracticeSession]);

  // Mock test trigger
  const handleSelectMockTest = useCallback((mockId, mockTitle) => {
    const questions = getQuestionsForMockTest(mockId);
    startPracticeSession(mockTitle, questions);
  }, [startPracticeSession]);

  // Save completed test session
  const handleSaveCompletedTest = useCallback((questions, userAnswers, score) => {
    const questionsToSave = questions.map((q, idx) => {
      let correctOpt = 0;
      if (typeof q.answer === "number") {
        correctOpt = q.answer;
      } else if (q.correctOptionId) {
        const found = q.options?.findIndex((o) =>
          typeof o === "object" ? o.id === q.correctOptionId : o === q.correctOptionId
        );
        correctOpt = found !== -1 ? found : 0;
      }

      const userChoice = userAnswers[idx];

      return {
        question: q.question || q.text,
        options: Array.isArray(q.options) && typeof q.options[0] === "object"
          ? q.options.map((o) => o.text)
          : q.options,
        userAnswer: userChoice !== undefined && userChoice !== null ? userChoice : null,
        correctAnswer: correctOpt,
        explanation: q.explanation || "Step-by-step mathematical breakdown for this aptitude problem.",
      };
    });

    const newSavedTest = {
      id: `test_${Date.now()}`,
      title: activeQuiz?.title || "Aptitude Assessment",
      date: new Date().toLocaleString(),
      totalQuestions: questionsToSave.length,
      score: score,
      accuracy: `${Math.round((score / questionsToSave.length) * 100)}%`,
      questions: questionsToSave,
    };

    const updated = [newSavedTest, ...savedTests];
    setSavedTests(updated);
    localStorage.setItem("aptitude_saved_tests", JSON.stringify(updated));
    setIsTestSaved(true);
  }, [activeQuiz, savedTests]);

  // Gemini AI Question & PYQ Generation
  const handleGenerateAiMCQs = async (params = {}) => {
    setIsGeneratingAI(true);
    setErrorMessage("");
    try {
      const targetCategory = params.category || aiCategory;
      const targetCount = params.count || aiCount;
      const targetCompany = params.company || "All Placement PYQs";
      const targetYear = params.year || "2024";
      const targetDifficulty = params.difficulty || "Medium";
      const isPyq = params.isPyq !== undefined ? params.isPyq : true;
      const keyToUse = (params.apiKey || geminiApiKey || "").trim();

      if (keyToUse) {
        localStorage.setItem("gemini_api_key", keyToUse);
      }

      const response = await fetch(`${SERVER_URL}/api/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: targetCategory,
          count: targetCount,
          apiKey: keyToUse,
          company: targetCompany,
          year: targetYear,
          difficulty: targetDifficulty,
          isPyq,
        }),
      });

      const data = await response.json();
      if (data?.questions && data.questions.length > 0) {
        const formatted = data.questions.map((q) => {
          const optTexts = q.options.map((o) => (typeof o === "object" ? o.text : o));
          const correctIdx = q.options.findIndex((o) =>
            typeof o === "object" ? o.id === q.correctOptionId : o === q.correctOptionId
          );
          return {
            question: q.question,
            options: optTexts,
            answer: correctIdx !== -1 ? correctIdx : 0,
            explanation: q.explanation,
            category: q.category || targetCategory,
            company: q.company || (isPyq ? targetCompany : null),
            year: q.year || targetYear,
            topic: q.topic || "Placement Aptitude",
            difficulty: q.difficulty || targetDifficulty,
          };
        });

        const sessionTitle = isPyq && targetCompany !== "General Aptitude"
          ? `🎯 ${targetCompany} PYQ Assessment (${formatted.length} Qs • ${data.source || 'AI'})`
          : `⚡ Gemini AI ${targetCategory} Sprint (${formatted.length} Qs)`;

        startPracticeSession(sessionTitle, formatted);
      } else {
        // Fallback to local questions
        const local = getQuestionsByCategory(targetCategory.toLowerCase().replace(/ /g, "_"), targetCount);
        startPracticeSession(`PYQ Practice: ${targetCompany || targetCategory}`, local);
      }
    } catch (err) {
      // Local fallback on connection failure
      const local = getQuestionsByCategory(aiCategory.toLowerCase().replace(/ /g, "_"), aiCount);
      startPracticeSession(`Simulated Assessment: ${aiCategory}`, local);
      console.warn("AI generation fallback:", err.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Multiplayer handlers
  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setShowLoginModal(true);
      return;
    }
    if (!socket) {
      setErrorMessage("Connecting to multiplayer server...");
      return;
    }
    setErrorMessage("");
    const displayName = `${userProfile?.avatar || "⚡"} ${playerName.trim()}`;
    socket.emit("room:create", { name: displayName }, (response) => {
      if (response?.error) {
        setErrorMessage(response.error);
      } else if (response?.room) {
        setRoom(response.room);
        setRoomCode(response.room.code);
      }
    });
  };

  const handleJoinRoom = (customCode = null) => {
    if (!playerName.trim()) {
      setShowLoginModal(true);
      return;
    }
    const targetCode = customCode || roomCode;
    if (!targetCode.trim()) {
      setErrorMessage("Please enter a room code.");
      return;
    }
    if (!socket) {
      setErrorMessage("Connecting to multiplayer server...");
      return;
    }
    setErrorMessage("");
    const displayName = `${userProfile?.avatar || "⚡"} ${playerName.trim()}`;
    socket.emit(
      "room:join",
      { code: targetCode.trim().toUpperCase(), name: displayName },
      (response) => {
        if (response?.error) {
          setErrorMessage(response.error);
        } else if (response?.room) {
          setRoom(response.room);
          setRoomCode(targetCode.trim().toUpperCase());
        }
      }
    );
  };

  const handleStartGame = () => {
    if (!room || !socket) return;
    setErrorMessage("");
    socket.emit(
      "room:start",
      { code: room.code, totalQuestions: hostTotalQuestions },
      (response) => {
        if (response?.error) {
          setErrorMessage(response.error);
        }
      }
    );
  };

  const handleSubmitMpAnswer = (optionId) => {
    if (!room || !socket || !mpQuestion || mpSelectedOption !== null) return;
    setMpSelectedOption(optionId);
    socket.emit(
      "answer:submit",
      {
        code: room.code,
        questionId: mpQuestion.questionId,
        optionId,
      },
      (response) => {
        if (response?.error) {
          setErrorMessage(response.error);
        } else {
          setMpAnswerResult(response);
        }
      }
    );
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
    setRoom(null);
    setMpQuestion(null);
    setMpRevealData(null);
    setMpSelectedOption(null);
    setMpAnswerResult(null);
    setErrorMessage("");
  };

  const copyRoomCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const isHost = Boolean(socket && room && socket.id === room.hostId);

  // -------------------------------------------------------------
  // RENDER CONDITIONAL VIEWS
  // -------------------------------------------------------------

  return (
    <div className="arena-app">
      {/* 3D BACKGROUND CANVAS */}
      <ThreeBackground />

      {/* TOP NAVIGATION BAR */}
      <Navbar
        currentView={activeQuiz ? "quiz" : room ? "multiplayer" : currentView}
        setCurrentView={(view) => {
          setActiveQuiz(null);
          setCurrentView(view);
        }}
        userProfile={userProfile}
        onOpenAuth={() => setShowLoginModal(true)}
        onStartPractice={() => startPracticeSession("Practice Aptitude Assessment")}
      />

      {/* MAIN BODY AREA */}
      <div className="arena-main-content">
        {/* VIEW 1: ACTIVE MULTIPLAYER ARENA ROOM */}
        {room ? (
          <MultiplayerArenaView
            room={room}
            socket={socket}
            isHost={isHost}
            copiedCode={copiedCode}
            copyRoomCode={copyRoomCode}
            hostTotalQuestions={hostTotalQuestions}
            setHostTotalQuestions={setHostTotalQuestions}
            handleStartGame={handleStartGame}
            handleLeaveRoom={handleLeaveRoom}
            mpQuestion={mpQuestion}
            mpSelectedOption={mpSelectedOption}
            mpAnswerResult={mpAnswerResult}
            handleSubmitMpAnswer={handleSubmitMpAnswer}
            mpTimeLeft={mpTimeLeft}
            mpRevealData={mpRevealData}
            revealCountdown={revealCountdown}
            errorMessage={errorMessage}
          />
        ) : activeQuiz ? (
          /* VIEW 2: ACTIVE PRACTICE TEST ENVIRONMENT */
          <PracticeQuizView
            testTitle={activeQuiz.title}
            questions={activeQuiz.questions}
            onBackToHome={() => setActiveQuiz(null)}
            onOpenDashboard={() => {
              setActiveQuiz(null);
              setCurrentView("dashboard");
            }}
            onSaveTest={handleSaveCompletedTest}
            isTestSaved={isTestSaved}
          />
        ) : currentView === "dashboard" ? (
          /* VIEW 3: STUDENT LEARNING DASHBOARD */
          <StudentDashboard
            userProfile={userProfile}
            savedTests={savedTests}
            onStartPracticeCategory={handleSelectCategory}
            onStartPractice={() => startPracticeSession("Placement Aptitude Sprint")}
            onSelectSavedTest={(test) => {
              setSelectedSavedTest(test);
              setCurrentView("saved_tests");
            }}
            onOpenAiGenerator={() => setCurrentView("ai_generator")}
          />
        ) : currentView === "ai_generator" ? (
          /* VIEW 4: GEMINI AI GENERATOR */
          <AiGeneratorView
            aiCategory={aiCategory}
            setAiCategory={setAiCategory}
            aiCount={aiCount}
            setAiCount={setAiCount}
            isGeneratingAI={isGeneratingAI}
            onGenerateAiMCQs={handleGenerateAiMCQs}
          />
        ) : currentView === "saved_tests" ? (
          /* VIEW 5: SAVED TESTS & MISTAKE ANALYSIS */
          <SavedTestsView
            savedTests={savedTests}
            selectedSavedTest={selectedSavedTest}
            setSelectedSavedTest={setSelectedSavedTest}
            onOpenAiGenerator={() => setCurrentView("ai_generator")}
            onStartPractice={() => startPracticeSession("Placement Aptitude Sprint")}
          />
        ) : currentView === "leaderboard" ? (
          /* VIEW 6: GLOBAL LEETCODE-STYLE LEADERBOARD */
          <LeaderboardView
            userProfile={userProfile}
            initialGlobalLeaderboard={initialGlobalLeaderboard}
          />
        ) : (
          /* VIEW 7: ARENA HOME LANDING PAGE */
          <main>
            {/* HERO SECTION */}
            <section className="hero-section">
              <div className="hero-copy">
                <div className="hero-pill-badge">
                  <span className="pulse-dot" />
                  NEXT-GEN 3D APTITUDE & REASONING ARENA
                </div>

                <h1 className="hero-title">
                  Train Your Mind.
                  <br />
                  <span className="hero-gradient-text">Master Every Challenge.</span>
                </h1>

                <p className="hero-desc">
                  Interactive 3D aptitude learning, high-velocity placement test simulations, real-time multiplayer arena battles, and AI-powered custom assessments.
                </p>

                <div className="hero-actions">
                  <button
                    className="btn-hero-primary"
                    onClick={() => startPracticeSession("Comprehensive Placement Mock")}
                    id="hero-start-btn"
                  >
                    <span>Start Practicing</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    className="btn-hero-secondary"
                    onClick={() => {
                      document.getElementById("weekend-arena")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Gift size={18} color="#f59e0b" />
                    <span>Explore Mock Tests</span>
                  </button>
                </div>

                {/* ANIMATED REAL-DATA STATS */}
                <div className="hero-stats-row">
                  <div className="hero-stat-item">
                    <span className="hero-stat-num">50</span>
                    <span className="hero-stat-lbl">Players / Room</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-num">9</span>
                    <span className="hero-stat-lbl">Core Categories</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-num">2.4k+</span>
                    <span className="hero-stat-lbl">Candidates Ranked</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-num">LIVE</span>
                    <span className="hero-stat-lbl">Placement ELO</span>
                  </div>
                </div>
              </div>

              {/* 3D INTERACTIVE VISUAL BESIDE HERO CONTENT */}
              <Hero3DVisual
                onStartPractice={() => startPracticeSession("Rapid Placement Assessment")}
                onExploreTests={() => setCurrentView("dashboard")}
              />
            </section>

            {/* DAILY CHALLENGE SECTION */}
            <DailyChallenge
              onStartChallenge={() => startPracticeSession("Daily Brain Sprint (Speed Math & Logic)")}
            />

            {/* 9 PREMIUM APTITUDE CATEGORY CARDS */}
            <CategoryCards onSelectCategory={handleSelectCategory} />

            {/* FEATURED PLACEMENT MOCK TESTS */}
            <FeaturedMockTests onSelectMockTest={handleSelectMockTest} />

            {/* MULTIPLAYER ARENA ROOM & WEEKEND CLASH */}
            <section className="weekend-clash-section" id="weekend-arena" style={{ margin: "70px 0" }}>
              <div className="daily-challenge-card" style={{ borderColor: "rgba(139, 92, 246, 0.4)" }}>
                <div className="challenge-left">
                  <div className="challenge-tag" style={{ color: "#a855f7" }}>
                    <Gift size={16} color="#a855f7" /> OFFICIAL PLACEMENT ARENA BATTLES
                  </div>
                  <h2 className="challenge-title">Real-Time Multiplayer Arena</h2>
                  <p className="challenge-desc">
                    Host private rooms for your campus batch or join live competitive matches to earn high ELO badges and Amazon voucher rewards.
                  </p>

                  <div className="challenge-rewards-row">
                    <div className="reward-chip">
                      <Users size={16} color="#38bdf8" /> Up to 50 Live Candidates
                    </div>
                    <div className="reward-chip">
                      <Trophy size={16} color="#f59e0b" /> Official Weekend Pool: ₹5,000
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="mp-error-banner" style={{ margin: "10px 0" }}>
                      <AlertCircle size={16} /> {errorMessage}
                    </div>
                  )}

                  {/* JOIN OR CREATE QUICK CONTROLS */}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        placeholder="ROOM CODE (e.g. AX42Q)"
                        value={roomCode}
                        onChange={(e) => {
                          setRoomCode(e.target.value.toUpperCase());
                          setErrorMessage("");
                        }}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "12px",
                          background: "rgba(10, 16, 36, 0.8)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#fff",
                          fontFamily: "var(--font-heading)",
                          fontSize: "14px",
                          width: "200px",
                          outline: "none",
                        }}
                      />
                      <button
                        className="btn-start-daily"
                        style={{ background: "linear-gradient(135deg, #38bdf8, #8b5cf6)" }}
                        onClick={() => handleJoinRoom()}
                      >
                        Join Room
                      </button>
                    </div>

                    <button className="btn-dash-secondary" onClick={handleCreateRoom}>
                      <Sparkles size={16} color="#c084fc" /> Host New Room
                    </button>
                  </div>
                </div>

                <div className="challenge-right-visual">
                  <div className="preview-question-box" style={{ borderColor: "rgba(139, 92, 246, 0.3)" }}>
                    <div className="box-header">
                      <span className="box-badge" style={{ color: "#a855f7" }}>
                        TOURNAMENT LOBBY ACTIVE
                      </span>
                      <span className="box-timer">WEEKEND2026</span>
                    </div>
                    <p className="box-q">
                      Sunday Placement Clash with 248+ candidates registered.
                    </p>
                    <button
                      className="btn-take-mock full-width"
                      style={{ width: "100%", justifyContent: "center", padding: "10px" }}
                      onClick={() => {
                        setRoomCode("WEEKEND2026");
                        handleJoinRoom("WEEKEND2026");
                      }}
                    >
                      Enter Lobby (Code: WEEKEND2026) →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <HowItWorks />
          </main>
        )}
      </div>

      {/* MULTI-OPTION AUTH & PROFILE MODAL */}
      {showLoginModal && (
        <AuthModal
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          onClose={() => setShowLoginModal(false)}
          avatars={avatars}
        />
      )}

      {/* CLEAN FOOTER */}
      <footer className="footer-wrapper">
        <div className="footer">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="brand-text" style={{ fontSize: "16px" }}>
              Aptitude<span className="brand-accent">Arena 3D</span>
            </span>
            <span style={{ color: "#64748b" }}>•</span>
            <span>Next-generation 3D campus recruitment & aptitude mastery platform.</span>
          </div>
          <div>
            <span>Targeting Tier-1 Engineering & Global Placement Drives</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
