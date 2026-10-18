import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  Calendar,
  CheckCircle2,
  Target,
  Layers,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default function AiGeneratorView({
  aiCategory,
  setAiCategory,
  aiCount,
  setAiCount,
  isGeneratingAI,
  onGenerateAiMCQs,
}) {
  const [activeMode, setActiveMode] = useState("pyq"); // "pyq" | "topics"
  const [selectedCompany, setSelectedCompany] = useState("TCS NQT");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");

  const companyList = [
    { name: "TCS NQT", badge: "Tata Consultancy Services", color: "#38bdf8", count: "10,000+ Hires" },
    { name: "Infosys", badge: "InfyTQ & Springboard", color: "#fb923c", count: "8,500+ Hires" },
    { name: "Wipro", badge: "NLTH & Elite", color: "#a855f7", count: "6,200+ Hires" },
    { name: "Accenture", badge: "Cognitive Assessment", color: "#f43f5e", count: "12,000+ Hires" },
    { name: "Cognizant", badge: "GenC & GenC Elevate", color: "#34d399", count: "7,000+ Hires" },
    { name: "Amazon", badge: "OA & Coding Math", color: "#f59e0b", count: "High Package" },
    { name: "Capgemini", badge: "Excellence Assessment", color: "#06b6d4", count: "5,000+ Hires" },
    { name: "GATE Aptitude", badge: "CS & Engineering", color: "#ec4899", count: "Top Tier" },
    { name: "CAT / MBA", badge: "Quant & LRDI", color: "#e11d48", count: "99+ Percentile" },
    { name: "SSC / Banking", badge: "CGL & IBPS PO", color: "#10b981", count: "Govt / PSUs" },
    { name: "All Placement PYQs", badge: "Mixed Placement Papers", color: "#c084fc", count: "Comprehensive" },
  ];

  const categoryOptions = [
    "Quantitative Aptitude",
    "Logical Reasoning",
    "Verbal Ability",
    "Data Interpretation",
    "Number Systems",
    "Time and Work",
    "Probability",
    "Coding & Placement Aptitude",
    "All Mix",
  ];

  const yearOptions = ["2024", "2023", "2022", "All Recent (2020-2024)"];
  const countOptions = [5, 10, 15, 20, 30];
  const difficultyOptions = ["Easy", "Medium", "Hard", "Mixed"];

  // Trigger question generation directly without asking user for any API key
  const handleStartGeneration = () => {
    onGenerateAiMCQs({
      company: activeMode === "pyq" ? selectedCompany : "General Aptitude",
      year: selectedYear,
      category: aiCategory,
      count: aiCount,
      difficulty: selectedDifficulty,
      isPyq: activeMode === "pyq",
    });
  };

  // Quick Preset Click
  const handleQuickPreset = (company, cat, count, diff) => {
    setSelectedCompany(company);
    setAiCategory(cat);
    setAiCount(count);
    setSelectedDifficulty(diff);
    setActiveMode("pyq");

    onGenerateAiMCQs({
      company,
      year: "2024",
      category: cat,
      count,
      difficulty: diff,
      isPyq: true,
    });
  };

  return (
    <main className="ai-generator-container">
      <div className="ai-generator-card">
        {/* HEADER */}
        <div className="ai-card-header">
          <div className="ai-engine-tag">
            <Sparkles size={16} color="#c084fc" /> GOOGLE GEMINI AI & PYQ ENGINE (CONNECTED)
          </div>
          <h1 className="ai-headline">Generate Previous Year Questions (PYQs) & Placement MCQs</h1>
          <p className="ai-subtext">
            Directly synthesize authentic Previous Year Questions (PYQs) for TCS, Infosys, Wipro, Accenture, Amazon & competitive exams
            with step-by-step mathematical solutions and instant scoring.
          </p>

          {/* PRE-CONNECTED STATUS BANNER */}
          <div className="ai-connected-system-banner">
            <div className="connected-banner-left">
              <div className="pulse-indicator">
                <span className="pulse-dot-live" />
                <span className="pulse-ring" />
              </div>
              <div>
                <div className="connected-title">
                  ⚡ Google Gemini AI & PYQ System Connected
                </div>
                <div className="connected-subtext">
                  Seamlessly configured in backend. Select your target company or topic below to generate questions instantly.
                </div>
              </div>
            </div>
            <div className="connected-badge-pill">
              <ShieldCheck size={15} color="#34d399" />
              <span>LIVE & READY</span>
            </div>
          </div>

          {/* MODE SELECTOR PILLS */}
          <div className="ai-mode-toggle-group">
            <button
              type="button"
              className={`ai-mode-pill ${activeMode === "pyq" ? "active" : ""}`}
              onClick={() => setActiveMode("pyq")}
            >
              <Target size={18} />
              <span>Target Company / Exam PYQs (Previous Year)</span>
              <span className="pill-badge">Popular</span>
            </button>

            <button
              type="button"
              className={`ai-mode-pill ${activeMode === "topics" ? "active" : ""}`}
              onClick={() => setActiveMode("topics")}
            >
              <Brain size={18} />
              <span>Domain & Topic-Wise Aptitude Synthesis</span>
            </button>
          </div>
        </div>

        {/* 1-CLICK POPULAR PYQ PRESETS */}
        <div className="ai-presets-bar">
          <span className="presets-label">
            <Flame size={16} color="#f97316" /> Quick Launch PYQs:
          </span>
          <div className="presets-scroll">
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset("TCS NQT", "Quantitative Aptitude", 10, "Medium")}
            >
              🔥 TCS NQT 2024 Quant (10 Qs)
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset("Infosys", "Logical Reasoning", 10, "Medium")}
            >
              ⚡ Infosys Reasoning PYQ (10 Qs)
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset("Accenture", "Verbal Ability", 10, "Easy")}
            >
              🎯 Accenture Cognitive & Verbal (10 Qs)
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={() => handleQuickPreset("Amazon", "Quantitative Aptitude", 10, "Hard")}
            >
              🚀 Amazon OA High-Math PYQ (10 Qs)
            </button>
          </div>
        </div>

        {/* STEP 1: COMPANY SELECTION (PYQ MODE) */}
        {activeMode === "pyq" ? (
          <div className="ai-form-section">
            <label className="ai-section-label">
              <span className="step-num">1</span> Select Target Company / Examination PYQ:
            </label>
            <div className="pyq-company-grid">
              {companyList.map((comp) => {
                const isSelected = selectedCompany === comp.name;
                return (
                  <button
                    key={comp.name}
                    type="button"
                    className={`pyq-company-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedCompany(comp.name)}
                    style={{ borderColor: isSelected ? comp.color : "rgba(255, 255, 255, 0.08)" }}
                  >
                    <div className="company-card-top">
                      <span className="company-name" style={{ color: isSelected ? comp.color : "#f8fafc" }}>
                        {comp.name}
                      </span>
                      {isSelected && <CheckCircle2 size={16} color={comp.color} />}
                    </div>
                    <span className="company-badge">{comp.badge}</span>
                    <span className="company-count">{comp.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* STEP 2: CATEGORY / DOMAIN */}
        <div className="ai-form-section">
          <label className="ai-section-label">
            <span className="step-num">{activeMode === "pyq" ? "2" : "1"}</span> Select Aptitude Section:
          </label>
          <div className="ai-category-grid">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`ai-cat-btn ${aiCategory === cat ? "selected" : ""}`}
                onClick={() => setAiCategory(cat)}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3: YEAR & DIFFICULTY FILTERS */}
        <div className="ai-form-row">
          {activeMode === "pyq" && (
            <div className="ai-form-col">
              <label className="ai-section-label">
                <Calendar size={15} /> Target Exam Year:
              </label>
              <div className="ai-compact-grid">
                {yearOptions.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    className={`ai-compact-btn ${selectedYear === yr ? "selected" : ""}`}
                    onClick={() => setSelectedYear(yr)}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ai-form-col">
            <label className="ai-section-label">
              <Layers size={15} /> Difficulty Level:
            </label>
            <div className="ai-compact-grid">
              {difficultyOptions.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  className={`ai-compact-btn ${selectedDifficulty === diff ? "selected" : ""}`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 4: QUESTION COUNT */}
        <div className="ai-form-section">
          <label className="ai-section-label">
            <span className="step-num">{activeMode === "pyq" ? "3" : "2"}</span> Question Batch Size (N):
          </label>
          <div className="ai-count-grid">
            {countOptions.map((num) => (
              <button
                key={num}
                type="button"
                className={`ai-count-btn ${aiCount === num ? "selected" : ""}`}
                onClick={() => setAiCount(num)}
              >
                <strong>{num}</strong>
                <span>Questions</span>
              </button>
            ))}
          </div>
        </div>

        {/* SUMMARY BADGE BEFORE GENERATION */}
        <div className="ai-summary-bar">
          <div className="summary-tags">
            <span className="sum-tag">
              Target: <strong>{activeMode === "pyq" ? selectedCompany : "General Domain"}</strong>
            </span>
            <span className="sum-tag">
              Section: <strong>{aiCategory}</strong>
            </span>
            {activeMode === "pyq" && (
              <span className="sum-tag">
                Year: <strong>{selectedYear}</strong>
              </span>
            )}
            <span className="sum-tag">
              Batch: <strong>{aiCount} Questions</strong>
            </span>
            <span className="sum-tag">
              Engine: <strong>Google Gemini AI & PYQ Engine (Auto-Connected)</strong>
            </span>
          </div>
        </div>

        {/* MAIN GENERATE BUTTON */}
        <button
          type="button"
          className="btn-ai-generate-main"
          onClick={handleStartGeneration}
          disabled={isGeneratingAI}
        >
          {isGeneratingAI ? (
            <>
              <span className="spinner-dot" />
              <span>
                Synthesizing {aiCount} {activeMode === "pyq" ? `${selectedCompany} PYQs` : "AI Questions"} via Connected Gemini Engine...
              </span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>
                Generate {aiCount} {activeMode === "pyq" ? `${selectedCompany} PYQs` : "AI Questions"} & Start Test
              </span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </main>
  );
}
