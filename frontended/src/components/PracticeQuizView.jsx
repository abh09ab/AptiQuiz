import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Save,
  RotateCcw,
  Home,
  LayoutDashboard,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function PracticeQuizView({
  testTitle = "Practice Aptitude Assessment",
  questions = [],
  onFinishQuiz,
  onBackToHome,
  onOpenDashboard,
  onSaveTest,
  isTestSaved = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [index]: selectedOptionIndex }
  const [markedForReview, setMarkedForReview] = useState({}); // { [index]: true }
  const [timeLeft, setTimeLeft] = useState(20); // 20s per question or test
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all"); // "all" | "mistakes" | "correct"

  const totalQuestions = questions.length || 1;
  const currentQ = questions[currentIndex] || {};

  // Countdown timer effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // If time expires on this question, auto-advance or trigger submit if last
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, currentIndex]);

  // Reset timer on question change
  const handleSelectQuestion = (index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
      setTimeLeft(20);
    }
  };

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(20);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTimeLeft(20);
    }
  };

  const handleSubmitTest = () => {
    setShowConfirmModal(false);
    setIsSubmitted(true);
    if (onFinishQuiz) {
      onFinishQuiz(userAnswers, questions);
    }
  };

  // Compute results
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q, idx) => {
    const userChoice = userAnswers[idx];
    let correctOpt = 0;
    if (typeof q.answer === "number") {
      correctOpt = q.answer;
    } else if (q.correctOptionId) {
      const found = q.options?.findIndex((o) =>
        typeof o === "object" ? o.id === q.correctOptionId : o === q.correctOptionId
      );
      correctOpt = found !== -1 ? found : 0;
    }

    if (userChoice === undefined || userChoice === null) {
      unansweredCount++;
    } else if (userChoice === correctOpt) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const accuracyPct = Math.round((correctCount / totalQuestions) * 100);
  const answeredCount = totalQuestions - unansweredCount;

  // -------------------------------------------------------------
  // POST-SUBMISSION RESULTS SCREEN
  // -------------------------------------------------------------
  if (isSubmitted) {
    return (
      <main className="quiz-results-container">
        <div className="results-hero-card">
          <div className="results-badge-wrap">
            <span className="results-icon">
              {accuracyPct >= 80 ? "🏆" : accuracyPct >= 50 ? "🎯" : "💪"}
            </span>
          </div>

          <h1 className="results-title">Assessment Completed!</h1>
          <p className="results-subtitle">{testTitle}</p>

          {/* RESULTS SCORE METRICS */}
          <div className="results-metrics-grid">
            <div className="metric-box box-score">
              <span className="metric-lbl">FINAL SCORE</span>
              <strong className="metric-num">
                {correctCount} / {totalQuestions}
              </strong>
            </div>

            <div className="metric-box box-accuracy">
              <span className="metric-lbl">ACCURACY</span>
              <strong className="metric-num">{accuracyPct}%</strong>
            </div>

            <div className="metric-box box-correct">
              <span className="metric-lbl">CORRECT</span>
              <strong className="metric-num text-emerald">{correctCount}</strong>
            </div>

            <div className="metric-box box-wrong">
              <span className="metric-lbl">MISTAKES</span>
              <strong className="metric-num text-rose">{wrongCount}</strong>
            </div>

            <div className="metric-box box-skipped">
              <span className="metric-lbl">UNANSWERED</span>
              <strong className="metric-num text-amber">{unansweredCount}</strong>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="results-action-row">
            {!isTestSaved ? (
              <button
                className="btn-save-test"
                onClick={() => onSaveTest(questions, userAnswers, correctCount)}
              >
                <Save size={18} /> Save Test & Track Mistakes
              </button>
            ) : (
              <div className="saved-confirm-pill">
                <Check size={16} /> Saved to Mistake Review Hub!
              </div>
            )}

            <button
              className="btn-results-secondary"
              onClick={() => {
                setIsSubmitted(false);
                setCurrentIndex(0);
                setUserAnswers({});
                setMarkedForReview({});
                setTimeLeft(20);
              }}
            >
              <RotateCcw size={16} /> Retake Test
            </button>

            <button className="btn-results-secondary" onClick={onOpenDashboard}>
              <LayoutDashboard size={16} /> Student Dashboard
            </button>

            <button className="btn-results-secondary" onClick={onBackToHome}>
              <Home size={16} /> Back to Home
            </button>
          </div>
        </div>

        {/* DETAILED MISTAKE & SOLUTION BREAKDOWN */}
        <section className="results-review-section">
          <div className="review-header">
            <div>
              <h2>Detailed Solutions & Mistake Analysis</h2>
              <p>Step-by-step mathematical explanations to improve your test accuracy.</p>
            </div>

            {/* FILTER TABS */}
            <div className="review-filter-tabs">
              <button
                className={`filter-btn ${reviewFilter === "all" ? "active" : ""}`}
                onClick={() => setReviewFilter("all")}
              >
                All ({totalQuestions})
              </button>
              <button
                className={`filter-btn ${reviewFilter === "mistakes" ? "active" : ""}`}
                onClick={() => setReviewFilter("mistakes")}
              >
                Mistakes Only ❌ ({wrongCount})
              </button>
              <button
                className={`filter-btn ${reviewFilter === "correct" ? "active" : ""}`}
                onClick={() => setReviewFilter("correct")}
              >
                Correct Only ✅ ({correctCount})
              </button>
            </div>
          </div>

          <div className="review-questions-list">
            {questions
              .map((q, idx) => {
                const userChoice = userAnswers[idx];
                let correctOpt = 0;
                if (typeof q.answer === "number") {
                  correctOpt = q.answer;
                } else if (q.correctOptionId) {
                  const found = q.options?.findIndex((o) =>
                    typeof o === "object" ? o.id === q.correctOptionId : o === q.correctOptionId
                  );
                  correctOpt = found !== -1 ? found : 0;
                }

                const isCorrect = userChoice === correctOpt;
                const isSkipped = userChoice === undefined || userChoice === null;

                return {
                  ...q,
                  originalIndex: idx,
                  userChoice,
                  correctOpt,
                  isCorrect,
                  isSkipped,
                };
              })
              .filter((item) => {
                if (reviewFilter === "mistakes") return !item.isCorrect && !item.isSkipped;
                if (reviewFilter === "correct") return item.isCorrect;
                return true;
              })
              .map((item) => (
                <div
                  key={item.originalIndex}
                  className={`review-card ${
                    item.isCorrect ? "card-correct" : item.isSkipped ? "card-skipped" : "card-wrong"
                  }`}
                >
                  <div className="review-card-top">
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <span className="q-badge">Question {item.originalIndex + 1}</span>
                      {item.company && (
                        <span className="q-company-tag-sm">
                          🎯 {item.company} {item.year ? `'${item.year.slice(-2)}` : ""}
                        </span>
                      )}
                    </div>
                    <span
                      className={`status-pill ${
                        item.isCorrect
                          ? "pill-correct"
                          : item.isSkipped
                          ? "pill-skipped"
                          : "pill-wrong"
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 size={14} /> CORRECT (+10 XP)
                        </>
                      ) : item.isSkipped ? (
                        <>
                          <HelpCircle size={14} /> UNANSWERED
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> INCORRECT CHOICE
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="review-q-text">{item.question || item.text}</h3>

                  {/* OPTIONS LIST */}
                  <div className="review-options-list">
                    {item.options.map((opt, optIdx) => {
                      const optText = typeof opt === "object" ? opt.text : opt;
                      const isUserChoice = item.userChoice === optIdx;
                      const isCorrectAnswer = item.correctOpt === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`review-opt-row ${
                            isCorrectAnswer
                              ? "opt-correct"
                              : isUserChoice
                              ? "opt-user-wrong"
                              : ""
                          }`}
                        >
                          <span className="opt-letter">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="opt-text">{optText}</span>

                          {isCorrectAnswer && (
                            <span className="badge-correct">
                              <CheckCircle2 size={14} /> Correct Answer
                            </span>
                          )}

                          {isUserChoice && !isCorrectAnswer && (
                            <span className="badge-mistake">
                              <XCircle size={14} /> Your Mistake
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* SOLUTION BREAKDOWN */}
                  {item.explanation && (
                    <div className="solution-box">
                      <div className="solution-title">
                        💡 <strong>Step-by-Step Mathematical Explanation:</strong>
                      </div>
                      <p className="solution-text">{item.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      </main>
    );
  }

  // -------------------------------------------------------------
  // ACTIVE TEST ENVIRONMENT SCREEN
  // -------------------------------------------------------------
  const optionsList = Array.isArray(currentQ.options) ? currentQ.options : [];
  const selectedForCurrent = userAnswers[currentIndex];
  const isMarkedCurrent = Boolean(markedForReview[currentIndex]);

  return (
    <main className="active-quiz-container">
      {/* 1. TOP HEADER BAR */}
      <div className="quiz-topbar">
        <div className="quiz-topbar-left">
          <button className="btn-back-exit" onClick={() => setShowConfirmModal(true)}>
            <ArrowLeft size={16} /> Exit
          </button>
          <div>
            <h2 className="quiz-topbar-title">{testTitle}</h2>
            <span className="quiz-topbar-meta">
              Question {currentIndex + 1} of {totalQuestions} • {currentQ.category || "Aptitude"}
            </span>
          </div>
        </div>

        {/* TIMER DISPLAY */}
        <div className={`quiz-timer-pill ${timeLeft <= 5 ? "timer-danger" : ""}`}>
          <Clock size={18} />
          <span className="timer-val">{`00:${String(timeLeft).padStart(2, "0")}`}</span>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: QUESTION AREA + QUESTION PALETTE */}
      <div className="quiz-main-layout">
        {/* LEFT COLUMN: QUESTION CONTENT */}
        <div className="quiz-question-column">
          <div className="question-card-3d">
            <div className="question-card-top">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span className="q-number-tag">QUESTION {currentIndex + 1}</span>
                {currentQ.company && (
                  <span className="q-company-tag">
                    🎯 {currentQ.company} PYQ {currentQ.year ? `(${currentQ.year})` : ""}
                  </span>
                )}
              </div>
              <span className="q-diff-badge">
                {currentQ.difficulty || "Medium"} Difficulty
              </span>
            </div>

            <h1 className="question-text">{currentQ.question || currentQ.text}</h1>

            {/* MULTIPLE CHOICE OPTIONS */}
            <div className="options-grid">
              {optionsList.map((opt, optIdx) => {
                const optText = typeof opt === "object" ? opt.text : opt;
                const isSelected = selectedForCurrent === optIdx;

                return (
                  <button
                    key={optIdx}
                    className={`option-btn ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectOption(optIdx)}
                  >
                    <span className="option-key">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="option-label">{optText}</span>
                    {isSelected && <CheckCircle2 size={18} className="option-check" />}
                  </button>
                );
              })}
            </div>

            {/* CONTROLS BAR: PREV, MARK REVIEW, NEXT, SUBMIT */}
            <div className="quiz-controls-bar">
              <button
                className="btn-ctrl-secondary"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <button
                className={`btn-ctrl-review ${isMarkedCurrent ? "marked" : ""}`}
                onClick={toggleMarkForReview}
              >
                <Flag size={16} />
                <span>{isMarkedCurrent ? "Marked for Review" : "Mark for Review"}</span>
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button className="btn-ctrl-primary" onClick={handleNext}>
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  className="btn-ctrl-submit"
                  onClick={() => setShowConfirmModal(true)}
                >
                  <Check size={16} /> Submit Test
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUESTION PALETTE */}
        <aside className="quiz-palette-sidebar">
          <div className="palette-card">
            <h3 className="palette-title">Question Palette</h3>

            {/* LEGEND */}
            <div className="palette-legend">
              <div className="legend-item">
                <span className="legend-dot dot-answered" /> Answered ({answeredCount})
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-marked" /> Review ({Object.values(markedForReview).filter(Boolean).length})
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-unanswered" /> Unanswered ({unansweredCount})
              </div>
            </div>

            {/* NUMBERED BUTTONS GRID */}
            <div className="palette-grid">
              {questions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
                const isMarked = Boolean(markedForReview[idx]);
                const isCurrent = currentIndex === idx;

                let stateClass = "p-unanswered";
                if (isCurrent) stateClass += " p-current";
                if (isAnswered) stateClass += " p-answered";
                if (isMarked) stateClass += " p-marked";

                return (
                  <button
                    key={idx}
                    className={`palette-num-btn ${stateClass}`}
                    onClick={() => handleSelectQuestion(idx)}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                    {isMarked && <span className="mini-flag-dot" />}
                  </button>
                );
              })}
            </div>

            {/* SUBMIT BUTTON IN SIDEBAR */}
            <button
              className="btn-sidebar-submit"
              onClick={() => setShowConfirmModal(true)}
            >
              Submit Assessment ({answeredCount}/{totalQuestions} Answered)
            </button>
          </div>
        </aside>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={44} color="#f59e0b" style={{ margin: "0 auto 16px" }} />
            <h2>Ready to Submit Assessment?</h2>
            <p>Please review your test progress before submitting:</p>

            <div className="confirm-summary-grid">
              <div className="summary-chip chip-answered">
                <span>Answered</span>
                <strong>{answeredCount}</strong>
              </div>
              <div className="summary-chip chip-unanswered">
                <span>Unanswered</span>
                <strong>{unansweredCount}</strong>
              </div>
              <div className="summary-chip chip-marked">
                <span>Marked for Review</span>
                <strong>{Object.values(markedForReview).filter(Boolean).length}</strong>
              </div>
            </div>

            <div className="confirm-actions">
              <button
                className="btn-modal-cancel"
                onClick={() => setShowConfirmModal(false)}
              >
                Keep Practicing
              </button>
              <button className="btn-modal-submit" onClick={handleSubmitTest}>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
