import { useState } from "react";
import {
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  Calendar,
  Award,
} from "lucide-react";

export default function SavedTestsView({
  savedTests = [],
  selectedSavedTest,
  setSelectedSavedTest,
  onOpenAiGenerator,
  onStartPractice,
}) {
  const [reviewFilter, setReviewFilter] = useState("all");

  return (
    <main className="saved-tests-page">
      <div className="section-header-center" style={{ marginBottom: "28px" }}>
        <span className="section-pill-tag">
          <FileText size={14} /> MISTAKE ANALYSIS HUB
        </span>
        <h1 className="section-title-3d">Saved Tests & Mistake Reviews</h1>
        <p className="section-subtitle">
          Review past test attempts, analyze incorrect choices, and learn from detailed solutions.
        </p>
      </div>

      {selectedSavedTest ? (
        /* DETAILED TEST MISTAKE INSPECTOR */
        <div className="saved-test-inspector-card">
          <button
            className="btn-back-to-list"
            onClick={() => setSelectedSavedTest(null)}
          >
            <ArrowLeft size={16} /> Back to Saved Tests List
          </button>

          {/* INSPECTOR HEADER */}
          <div className="inspector-summary-banner">
            <div>
              <h2 className="inspector-title">{selectedSavedTest.title}</h2>
              <div className="inspector-meta-row">
                <span className="meta-date">
                  <Calendar size={14} /> Saved on {selectedSavedTest.date}
                </span>
                <span className="meta-q-count">
                  {selectedSavedTest.questions?.length || 0} Questions
                </span>
              </div>
            </div>

            <div className="inspector-score-pill">
              <span className="score-lbl">SCORE</span>
              <strong className="score-val">
                {selectedSavedTest.score} / {selectedSavedTest.totalQuestions}
              </strong>
              <span className="score-acc-tag">{selectedSavedTest.accuracy} Accuracy</span>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="inspector-filter-tabs">
            <button
              className={`filter-pill ${reviewFilter === "all" ? "active" : ""}`}
              onClick={() => setReviewFilter("all")}
            >
              All Questions ({selectedSavedTest.questions?.length || 0})
            </button>
            <button
              className={`filter-pill ${reviewFilter === "mistakes" ? "active" : ""}`}
              onClick={() => setReviewFilter("mistakes")}
            >
              Mistakes Only ❌ (
              {selectedSavedTest.questions?.filter((q) => q.userAnswer !== q.correctAnswer).length || 0}
              )
            </button>
            <button
              className={`filter-pill ${reviewFilter === "correct" ? "active" : ""}`}
              onClick={() => setReviewFilter("correct")}
            >
              Correct Only ✅ (
              {selectedSavedTest.questions?.filter((q) => q.userAnswer === q.correctAnswer).length || 0}
              )
            </button>
          </div>

          {/* QUESTIONS LIST */}
          <div className="inspector-questions-list">
            {selectedSavedTest.questions
              ?.filter((q) => {
                if (reviewFilter === "mistakes") return q.userAnswer !== q.correctAnswer;
                if (reviewFilter === "correct") return q.userAnswer === q.correctAnswer;
                return true;
              })
              .map((q, qIdx) => {
                const isCorrect = q.userAnswer === q.correctAnswer;
                const isUnanswered = q.userAnswer === null || q.userAnswer === undefined;

                return (
                  <div
                    key={qIdx}
                    className={`inspector-q-card ${
                      isCorrect ? "card-correct" : isUnanswered ? "card-unanswered" : "card-incorrect"
                    }`}
                  >
                    <div className="q-card-header">
                      <span className="q-index-pill">Question {qIdx + 1}</span>
                      <span
                        className={`q-status-badge ${
                          isCorrect ? "badge-correct" : isUnanswered ? "badge-unanswered" : "badge-incorrect"
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 size={14} /> CORRECT
                          </>
                        ) : isUnanswered ? (
                          <>
                            <HelpCircle size={14} /> UNANSWERED
                          </>
                        ) : (
                          <>
                            <XCircle size={14} /> INCORRECT MISTAKE
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="q-title-text">{q.question}</h3>

                    <div className="q-options-stack">
                      {q.options?.map((optText, optIdx) => {
                        const isUserChoice = q.userAnswer === optIdx;
                        const isCorrectAnswer = q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`inspector-opt-row ${
                              isCorrectAnswer
                                ? "opt-correct"
                                : isUserChoice
                                ? "opt-user-mistake"
                                : ""
                            }`}
                          >
                            <span className="opt-marker">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className="opt-content">{optText}</span>

                            {isCorrectAnswer && (
                              <span className="opt-tag-correct">
                                <CheckCircle2 size={13} /> Correct Answer
                              </span>
                            )}
                            {isUserChoice && !isCorrectAnswer && (
                              <span className="opt-tag-mistake">
                                <XCircle size={13} /> Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="solution-breakdown-box">
                        <span className="sol-badge">💡 Solution Breakdown</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        /* SAVED TESTS LIST VIEW */
        <div className="saved-tests-list-wrap">
          {savedTests.length === 0 ? (
            <div className="saved-empty-state">
              <FileText size={48} color="#8b5cf6" />
              <h3>No Saved Test Sessions Yet</h3>
              <p>
                Complete any practice assessment or AI-generated quiz and click "Save Test & Review Mistakes" to build your error log here.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
                <button className="btn-ai-generate-main" onClick={onOpenAiGenerator}>
                  <Sparkles size={16} /> Generate AI Test
                </button>
                <button className="btn-practice-weak" onClick={onStartPractice}>
                  Start Practice Test →
                </button>
              </div>
            </div>
          ) : (
            <div className="saved-cards-stack">
              {savedTests.map((test) => (
                <div
                  key={test.id}
                  className="saved-test-item-card"
                  onClick={() => {
                    setSelectedSavedTest(test);
                    setReviewFilter("all");
                  }}
                  title="Click to review mistakes"
                >
                  <div className="item-left">
                    <div className="item-icon-circle">
                      <FileText size={20} color="#38bdf8" />
                    </div>
                    <div>
                      <h3 className="item-title">{test.title}</h3>
                      <span className="item-date">Saved on {test.date}</span>
                    </div>
                  </div>

                  <div className="item-right">
                    <div className="item-score-col">
                      <strong className="item-score">
                        {test.score} / {test.totalQuestions}
                      </strong>
                      <span className="item-accuracy">{test.accuracy} Accuracy</span>
                    </div>
                    <Eye size={20} color="#67e8f9" className="eye-icon" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
