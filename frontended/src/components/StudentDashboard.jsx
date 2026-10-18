import {
  Trophy,
  Flame,
  Target,
  BarChart3,
  TrendingUp,
  Brain,
  AlertTriangle,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
  FileText,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { CATEGORIES_DATA } from "../data/aptitudeBank";

export default function StudentDashboard({
  userProfile,
  savedTests,
  onStartPracticeCategory,
  onStartPractice,
  onSelectSavedTest,
  onOpenAiGenerator,
}) {
  // Compute analytics from saved tests or defaults
  const totalSavedTests = savedTests?.length || 0;
  const totalQuestionsAttempted = savedTests?.reduce(
    (acc, test) => acc + (test.totalQuestions || 0),
    0
  ) || 48;

  const totalCorrectAnswers = savedTests?.reduce(
    (acc, test) => acc + (test.score || 0),
    0
  ) || 42;

  const dynamicAccuracy = totalQuestionsAttempted > 0
    ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
    : 88;

  // Weekly Activity Data (Mon-Sun)
  const weeklyData = [
    { day: "Mon", count: 18, height: "70%" },
    { day: "Tue", count: 24, height: "92%" },
    { day: "Wed", count: 15, height: "60%" },
    { day: "Thu", count: 28, height: "100%" },
    { day: "Fri", count: 20, height: "80%" },
    { day: "Sat", count: 22, height: "88%" },
    { day: "Sun", count: 12, height: "48%" },
  ];

  // Weak Topics requiring attention
  const weakTopics = [
    {
      topic: "Probability & Bayes' Theorem",
      category: "Probability",
      categoryId: "probability",
      accuracy: "42%",
      reason: "High mistake rate in dice & conditional probability",
      badge: "High Priority",
    },
    {
      topic: "Permutations & Selections",
      category: "Permutation & Combination",
      categoryId: "permutation_combination",
      accuracy: "56%",
      reason: "Time taken exceeds target average (>90s)",
      badge: "Needs Speed",
    },
    {
      topic: "Data Interpretation (Pie Charts)",
      category: "Data Interpretation",
      categoryId: "data_interpretation",
      accuracy: "64%",
      reason: "Misread multi-variable angle percentages",
      badge: "Accuracy Dip",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. STUDENT WELCOME & HERO BANNER */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-left">
          <div className="welcome-avatar-wrap">
            <span className="welcome-avatar">{userProfile?.avatar || "⚡"}</span>
            <span className="welcome-online-dot" />
          </div>

          <div className="welcome-text-group">
            <div className="welcome-meta-pill">
              <Sparkles size={14} color="#f59e0b" /> CANDIDATE LEARNING PORTAL
            </div>
            <h1 className="welcome-headline">
              Welcome back, {userProfile?.name || "Candidate"}!
            </h1>
            <p className="welcome-subtext">
              Target: <strong style={{ color: "#38bdf8" }}>{userProfile?.targetCompany || "SDE @ Google"}</strong> • {userProfile?.college || "BITS Pilani / IIT"}
            </p>
          </div>
        </div>

        <div className="welcome-right-actions">
          <button className="btn-dash-primary" onClick={() => onStartPractice()}>
            <Play size={16} fill="currentColor" /> Quick Practice Test
          </button>
          <button className="btn-dash-secondary" onClick={onOpenAiGenerator}>
            <Sparkles size={16} color="#c084fc" /> AI Custom Drill
          </button>
        </div>
      </div>

      {/* 2. KEY METRICS STATS CARDS */}
      <div className="dashboard-stats-grid">
        <div className="dash-stat-card glow-cyan">
          <div className="stat-card-top">
            <span className="stat-icon-pill icon-cyan"><Target size={20} /></span>
            <span className="stat-badge-trend positive">+14% this week</span>
          </div>
          <div className="stat-value">{totalQuestionsAttempted}</div>
          <div className="stat-label">Questions Attempted</div>
          <div className="stat-progress-line">
            <div className="line-fill bg-cyan" style={{ width: "75%" }} />
          </div>
        </div>

        <div className="dash-stat-card glow-emerald">
          <div className="stat-card-top">
            <span className="stat-icon-pill icon-emerald"><TrendingUp size={20} /></span>
            <span className="stat-badge-trend positive">Placement Ready</span>
          </div>
          <div className="stat-value">{dynamicAccuracy}%</div>
          <div className="stat-label">Overall Accuracy Rate</div>
          <div className="stat-progress-line">
            <div className="line-fill bg-emerald" style={{ width: `${dynamicAccuracy}%` }} />
          </div>
        </div>

        <div className="dash-stat-card glow-amber">
          <div className="stat-card-top">
            <span className="stat-icon-pill icon-amber"><Flame size={20} /></span>
            <span className="stat-badge-trend highlight">Super Active</span>
          </div>
          <div className="stat-value">7 Days</div>
          <div className="stat-label">Current Practice Streak 🔥</div>
          <div className="stat-progress-line">
            <div className="line-fill bg-amber" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="dash-stat-card glow-violet">
          <div className="stat-card-top">
            <span className="stat-icon-pill icon-violet"><Trophy size={20} /></span>
            <span className="stat-badge-trend top-tier">Master Tier</span>
          </div>
          <div className="stat-value">{userProfile?.rating || 1650} ELO</div>
          <div className="stat-label">Global Rank #{userProfile?.globalRank || 12}</div>
          <div className="stat-progress-line">
            <div className="line-fill bg-violet" style={{ width: "85%" }} />
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: DAILY GOAL & WEEKLY ANALYTICS */}
      <div className="dash-analytics-row">
        {/* DAILY LEARNING GOAL */}
        <div className="dash-card daily-goal-card">
          <div className="dash-card-header">
            <div>
              <span className="dash-card-kicker"><Clock size={14} /> TODAY'S TARGET</span>
              <h3>Daily Learning Goal</h3>
            </div>
            <span className="goal-pct-chip">80% Met</span>
          </div>

          <div className="goal-visual-wrap">
            <div className="goal-circle-outer">
              <div className="goal-circle-inner">
                <strong>16</strong>
                <span>of 20 Qs</span>
              </div>
            </div>

            <div className="goal-details-col">
              <p className="goal-statement">
                You're just <strong>4 questions away</strong> from completing today's aptitude mastery target.
              </p>
              <div className="goal-reward-pill">
                <Trophy size={14} color="#f59e0b" /> Daily Reward: +150 Arena XP
              </div>
              <button
                className="btn-complete-goal"
                onClick={() => onStartPractice()}
              >
                Solve Remaining 4 Questions <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* WEEKLY QUESTIONS BAR CHART */}
        <div className="dash-card weekly-chart-card">
          <div className="dash-card-header">
            <div>
              <span className="dash-card-kicker"><BarChart3 size={14} /> WEEKLY INTENSITY</span>
              <h3>Practice Activity (139 Qs)</h3>
            </div>
            <span className="chart-legend">Mon - Sun</span>
          </div>

          <div className="weekly-bars-container">
            {weeklyData.map((d) => (
              <div key={d.day} className="chart-col">
                <span className="bar-count-tooltip">{d.count}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: d.height }}
                  />
                </div>
                <span className="bar-day">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DOMAIN MASTERY & WEAK TOPICS SPLIT */}
      <div className="dash-analytics-row">
        {/* DOMAIN MASTERY PROGRESS */}
        <div className="dash-card domain-mastery-card">
          <div className="dash-card-header">
            <div>
              <span className="dash-card-kicker"><Brain size={14} /> KNOWLEDGE RETENTION</span>
              <h3>Domain Performance</h3>
            </div>
          </div>

          <div className="mastery-list">
            {CATEGORIES_DATA.slice(0, 5).map((cat) => {
              const pct = Math.round((cat.completedQuestions / cat.totalQuestions) * 100);
              return (
                <div key={cat.id} className="mastery-item">
                  <div className="mastery-item-top">
                    <span className="mastery-title">{cat.title}</span>
                    <span className="mastery-pct">{pct}% Mastery</span>
                  </div>
                  <div className="mastery-bar-bg">
                    <div
                      className="mastery-bar-fill"
                      style={{ width: `${pct}%`, background: cat.gradient }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WEAK TOPICS REQUIRING ATTENTION */}
        <div className="dash-card weak-topics-card">
          <div className="dash-card-header">
            <div>
              <span className="dash-card-kicker" style={{ color: "#f87171" }}>
                <AlertTriangle size={14} /> ACTIONABLE FOCUS
              </span>
              <h3>Weak Topics to Improve</h3>
            </div>
          </div>

          <div className="weak-topics-list">
            {weakTopics.map((item, idx) => (
              <div key={idx} className="weak-topic-item">
                <div className="weak-topic-info">
                  <div className="weak-topic-header">
                    <h4>{item.topic}</h4>
                    <span className="weak-badge">{item.badge}</span>
                  </div>
                  <p className="weak-reason">{item.reason}</p>
                  <span className="weak-acc">Current Accuracy: <strong>{item.accuracy}</strong></span>
                </div>

                <button
                  className="btn-practice-weak"
                  onClick={() => onStartPracticeCategory(item.categoryId, item.category)}
                  title="Practice questions specifically for this topic"
                >
                  <Play size={14} /> Practice Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECENT TEST ATTEMPTS & MISTAKE ANALYSIS */}
      <div className="dash-card recent-tests-card">
        <div className="dash-card-header">
          <div>
            <span className="dash-card-kicker"><FileText size={14} /> TEST HISTORY</span>
            <h3>Recent Assessments & Mistake Analysis</h3>
          </div>
          <span className="test-count-badge">{totalSavedTests} Tests Saved</span>
        </div>

        {savedTests && savedTests.length > 0 ? (
          <div className="recent-tests-table-wrap">
            <table className="recent-tests-table">
              <thead>
                <tr>
                  <th>Assessment Title</th>
                  <th>Date & Time</th>
                  <th>Questions</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {savedTests.slice(0, 5).map((test) => (
                  <tr key={test.id}>
                    <td className="test-name-cell">
                      <FileText size={16} color="#38bdf8" />
                      <strong>{test.title}</strong>
                    </td>
                    <td style={{ color: "#94a3b8" }}>{test.date}</td>
                    <td>{test.totalQuestions} Qs</td>
                    <td style={{ color: "#10b981", fontWeight: "bold" }}>{test.score} / {test.totalQuestions}</td>
                    <td>
                      <span className="table-accuracy-chip">{test.accuracy}</span>
                    </td>
                    <td>
                      <button
                        className="btn-review-test-inline"
                        onClick={() => onSelectSavedTest(test)}
                      >
                        <Eye size={14} /> Review Mistakes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-tests-state">
            <CheckCircle2 size={36} color="#8b5cf6" />
            <p>No test sessions saved yet. Take a practice quiz and click "Save Test & Review Mistakes" to track history here!</p>
            <button className="btn-dash-primary" onClick={() => onStartPractice()}>
              Take Your First Test →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
