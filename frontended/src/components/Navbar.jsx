import { useState } from "react";
import {
  Zap,
  Sparkles,
  FileText,
  Trophy,
  LayoutDashboard,
  Grid,
  Menu,
  X,
  Play,
  ShieldCheck,
} from "lucide-react";

export default function Navbar({
  currentView,
  setCurrentView,
  userProfile,
  onOpenAuth,
  onStartPractice,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view, anchorId = null) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      {/* 1. TOP MARQUEE TICKER */}
      <div className="winner-ticker-bar">
        <div className="ticker-track">
          <span>⚡ Live Arena: 2,480+ candidates actively practicing nationwide!</span>
          <span>🏆 Weekend Clash: ₹5,000 Amazon Vouchers pool ready this Sunday!</span>
          <span>🎯 Abhay V. climbed to Master Rank (#12 Global • 1,650 ELO)</span>
          <span>🧠 Niteesh (IIT Bombay) scored 100% in Quantitative Aptitude mock!</span>
          <span>🚀 New Gemini 2.5 AI Question Engine active with step-by-step solutions</span>
          <span>⚡ Live Arena: 2,480+ candidates actively practicing nationwide!</span>
        </div>
      </div>

      {/* 2. MAIN 3D GLASS NAVBAR */}
      <header className="navbar-wrapper">
        <nav className="navbar" aria-label="Main Navigation">
          {/* BRAND LOGO */}
          <button
            className="brand-btn"
            onClick={() => handleNavClick("home")}
            aria-label="Aptitude Arena 3D Home"
          >
            <div className="brand-icon-wrap">
              <Zap size={22} className="brand-zap" />
            </div>
            <div className="brand-text">
              Aptitude<span className="brand-accent">Arena 3D</span>
            </div>
          </button>

          {/* DESKTOP NAV LINKS */}
          <div className="nav-links-desktop">
            <button
              className={`nav-link ${currentView === "home" ? "active" : ""}`}
              onClick={() => handleNavClick("home")}
            >
              Home
            </button>

            <button
              className="nav-link"
              onClick={() => handleNavClick("home", "categories-section")}
            >
              <Grid size={15} /> Categories
            </button>

            <button
              className={`nav-link ${currentView === "dashboard" ? "active" : ""}`}
              onClick={() => handleNavClick("dashboard")}
            >
              <LayoutDashboard size={15} /> Student Dashboard
            </button>

            <button
              className={`nav-link ${currentView === "ai_generator" ? "active" : ""}`}
              onClick={() => handleNavClick("ai_generator")}
            >
              <Sparkles size={15} color="#c084fc" /> AI & PYQ Generator
            </button>

            <button
              className={`nav-link ${currentView === "saved_tests" ? "active" : ""}`}
              onClick={() => handleNavClick("saved_tests")}
            >
              <FileText size={15} color="#38bdf8" /> Saved & Review
            </button>

            <button
              className={`nav-link ${currentView === "leaderboard" ? "active" : ""}`}
              onClick={() => handleNavClick("leaderboard")}
            >
              <Trophy size={15} color="#f59e0b" /> Leaderboard
            </button>
          </div>

          {/* RIGHT SIDE: PROFILE & CTA */}
          <div className="nav-right-actions">
            {/* USER PROFILE PILL */}
            <button
              className="user-profile-badge"
              onClick={onOpenAuth}
              title="Click to view or edit candidate profile"
            >
              <span className="user-avatar">{userProfile?.avatar || "⚡"}</span>
              <div className="user-info-text">
                <span className="user-title">{userProfile?.name || "Candidate"}</span>
                <span className="user-rank">
                  #{userProfile?.globalRank || 12} • {userProfile?.rating || 1650} ELO
                </span>
              </div>
            </button>

            {/* START PRACTICING CTA */}
            <button
              className="btn-start-practice"
              onClick={onStartPractice}
              id="nav-start-practice"
            >
              <Play size={16} fill="currentColor" />
              <span>Start Practicing</span>
            </button>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              className="mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <div className="mobile-nav-items">
              <button
                className={`mobile-nav-item ${currentView === "home" ? "active" : ""}`}
                onClick={() => handleNavClick("home")}
              >
                🏠 Arena Home
              </button>

              <button
                className="mobile-nav-item"
                onClick={() => handleNavClick("home", "categories-section")}
              >
                <Grid size={18} /> Aptitude Categories
              </button>

              <button
                className={`mobile-nav-item ${currentView === "dashboard" ? "active" : ""}`}
                onClick={() => handleNavClick("dashboard")}
              >
                <LayoutDashboard size={18} /> Student Dashboard
              </button>

              <button
                className={`mobile-nav-item ${currentView === "ai_generator" ? "active" : ""}`}
                onClick={() => handleNavClick("ai_generator")}
              >
                <Sparkles size={18} color="#c084fc" /> Gemini AI & PYQ Generator
              </button>

              <button
                className={`mobile-nav-item ${currentView === "saved_tests" ? "active" : ""}`}
                onClick={() => handleNavClick("saved_tests")}
              >
                <FileText size={18} color="#38bdf8" /> Saved Tests & Mistakes
              </button>

              <button
                className={`mobile-nav-item ${currentView === "leaderboard" ? "active" : ""}`}
                onClick={() => handleNavClick("leaderboard")}
              >
                <Trophy size={18} color="#f59e0b" /> Global Leaderboard
              </button>

              <button
                className="mobile-nav-item"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
              >
                <ShieldCheck size={18} /> Edit Profile & Login
              </button>

              <button
                className="btn-start-practice full-width"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartPractice();
                }}
              >
                <Play size={18} fill="currentColor" /> Start Practicing Now
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
