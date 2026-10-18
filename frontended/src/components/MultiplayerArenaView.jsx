import {
  Users,
  Clock,
  Sparkles,
  Trophy,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  LogOut,
  AlertCircle,
  Play,
} from "lucide-react";

export default function MultiplayerArenaView({
  room,
  socket,
  isHost,
  copiedCode,
  copyRoomCode,
  hostTotalQuestions,
  setHostTotalQuestions,
  handleStartGame,
  handleLeaveRoom,
  mpQuestion,
  mpSelectedOption,
  mpAnswerResult,
  handleSubmitMpAnswer,
  mpTimeLeft,
  mpRevealData,
  revealCountdown,
  errorMessage,
}) {
  return (
    <div className="multiplayer-room-view">
      {/* ARENA TOP BAR */}
      <header className="mp-topbar">
        <div className="mp-topbar-left">
          <div className="mp-room-badge">
            <span className="room-badge-lbl">ROOM CODE</span>
            <span className="room-code-val">{room.code}</span>
            <button
              className="btn-copy-code"
              onClick={copyRoomCode}
              title="Copy room code to clipboard"
            >
              {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className="mp-topbar-right">
          <button className="btn-leave-room" onClick={handleLeaveRoom}>
            <LogOut size={16} /> Leave Room
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="mp-error-banner">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* VIEW 1: ROOM LOBBY */}
      {room.status === "lobby" && (
        <div className="mp-lobby-card">
          <div className="lobby-header">
            <div className="lobby-tag">
              <Users size={16} color="#38bdf8" /> MULTIPLAYER LOBBY
            </div>
            <h1 className="lobby-title">Waiting for Challengers</h1>
            <p className="lobby-desc">
              Share room code <strong style={{ color: "#38bdf8" }}>{room.code}</strong> with your classmates to battle in real-time.
            </p>
          </div>

          {/* CANDIDATES IN ROOM */}
          <div className="lobby-players-section">
            <div className="lobby-players-count">
              <Users size={18} />
              <span>Candidates in Arena ({room.players?.length || 1}/50)</span>
            </div>

            <div className="lobby-players-grid">
              {room.players?.map((p) => (
                <div key={p.id} className="player-chip">
                  <span className="player-name">{p.name}</span>
                  {p.id === room.hostId && <span className="host-crown-badge">👑 Host</span>}
                  {p.id === socket?.id && <span className="you-badge">(You)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* HOST CONTROLS */}
          {isHost ? (
            <div className="host-controls-panel">
              <div className="host-q-selector">
                <label>Select Match Length (Total Questions):</label>
                <div className="host-q-btns">
                  {[3, 5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      className={`host-cnt-btn ${hostTotalQuestions === cnt ? "active" : ""}`}
                      onClick={() => setHostTotalQuestions(cnt)}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-start-match-main" onClick={handleStartGame}>
                <Sparkles size={18} /> Launch Live Battle Round
              </button>
            </div>
          ) : (
            <div className="waiting-host-notice">
              <span className="pulse-dot" />
              <span>Waiting for room host to initiate the challenge...</span>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: 5-SECOND REVEAL & INTERMISSION LEADERBOARD */}
      {room.status === "playing" && mpRevealData && (
        <div className="mp-reveal-card">
          <div className="reveal-header">
            <span className="reveal-tag">
              {mpRevealData.isLastQuestion ? "🏆 FINAL MATCH RESULTS" : "📊 ROUND REVEAL"}
            </span>
            <h2>
              {mpRevealData.isLastQuestion
                ? "Match Complete! Podium Standings"
                : `Question ${mpRevealData.currentQuestionIndex} of ${mpRevealData.totalQuestions} Complete`}
            </h2>
          </div>

          {/* QUESTION REVIEW OPTIONS */}
          {mpQuestion && (
            <div className="reveal-options-stack">
              {mpQuestion.options?.map((opt) => {
                const isCorrect = opt.id === mpRevealData.correctOptionId;
                const isSelected = opt.id === mpSelectedOption;

                return (
                  <div
                    key={opt.id}
                    className={`reveal-opt-row ${
                      isCorrect ? "opt-correct" : isSelected ? "opt-wrong" : ""
                    }`}
                  >
                    <span>
                      <strong>{opt.id.toUpperCase()}.</strong> {opt.text}
                    </span>
                    {isCorrect && (
                      <span className="badge-correct">
                        <CheckCircle2 size={16} /> Correct Answer
                      </span>
                    )}
                    {!isCorrect && isSelected && (
                      <span className="badge-wrong">
                        <XCircle size={16} /> Your Choice
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* EXPLANATION */}
          {mpRevealData.explanation && (
            <div className="reveal-explanation-box">
              💡 <strong>Step-by-Step Explanation:</strong> {mpRevealData.explanation}
            </div>
          )}

          {/* LIVE LEADERBOARD SCORES */}
          <div className="reveal-scores-box">
            <h3>Live Arena Standings</h3>
            <div className="scores-list">
              {mpRevealData.scores
                ?.sort((a, b) => b.score - a.score)
                .map((p, idx) => (
                  <div key={p.id} className="score-row-item">
                    <div className="score-rank-left">
                      <span className="podium-rank">#{idx + 1}</span>
                      <span className="podium-name">
                        {p.name} {p.id === socket?.id && "(You)"}
                      </span>
                    </div>
                    <span className="podium-xp">{p.score} XP</span>
                  </div>
                ))}
            </div>
          </div>

          {/* FOOTER COUNTDOWN OR RESTART */}
          {mpRevealData.isLastQuestion ? (
            isHost ? (
              <button className="btn-start-match-main full-width" onClick={handleStartGame}>
                <Sparkles size={18} /> Start New Match Round
              </button>
            ) : (
              <p className="waiting-subtext">Match finished! Waiting for host to launch next round...</p>
            )
          ) : (
            <p className="countdown-subtext">
              ⏳ Next question starts automatically in <strong>{revealCountdown}</strong> seconds...
            </p>
          )}
        </div>
      )}

      {/* VIEW 3: ACTIVE 3D QUESTION VIEW */}
      {room.status === "playing" && mpQuestion && !mpRevealData && (
        <div className="mp-question-card">
          <div className="mp-q-topbar">
            <span className="mp-q-counter">
              Question {mpQuestion.currentQuestionIndex || 1} of {mpQuestion.totalQuestions || 5}
            </span>
            <div className={`mp-q-timer ${mpTimeLeft <= 5 ? "danger" : ""}`}>
              <Clock size={16} />
              <span>00:{String(mpTimeLeft).padStart(2, "0")}</span>
            </div>
          </div>

          <h2 className="mp-question-heading">{mpQuestion.text}</h2>

          <div className="mp-options-grid">
            {mpQuestion.options?.map((opt) => {
              const isSelected = mpSelectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`mp-option-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSubmitMpAnswer(opt.id)}
                  disabled={mpSelectedOption !== null}
                >
                  <span className="mp-opt-key">{opt.id.toUpperCase()}</span>
                  <span className="mp-opt-text">{opt.text}</span>
                  {isSelected && <CheckCircle2 size={18} className="mp-check" />}
                </button>
              );
            })}
          </div>

          {mpSelectedOption !== null && (
            <div className="mp-answer-status-pill">
              {mpAnswerResult?.success
                ? mpAnswerResult.correct
                  ? "✅ Correct! Locked in. Waiting for other candidates..."
                  : "❌ Answer locked in! Waiting for round reveal..."
                : "Answer submitted! Waiting for other candidates..."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
