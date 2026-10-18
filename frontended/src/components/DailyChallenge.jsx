import { Flame, Clock, Trophy, ArrowRight, Zap, Target } from "lucide-react";

export default function DailyChallenge({ onStartChallenge }) {
  return (
    <section className="daily-challenge-section">
      <div className="daily-challenge-card">
        <div className="challenge-left">
          <div className="challenge-tag">
            <Flame size={16} color="#f59e0b" /> TODAY'S TIMED APTITUDE SPRINT
          </div>
          <h2 className="challenge-title">Daily Brain Challenge: Permutations & Speed Math</h2>
          <p className="challenge-desc">
            Test your quick thinking under 15-second pressure. Complete today's 5 rapid questions to keep your 7-day streak alive and win +250 Arena XP!
          </p>

          <div className="challenge-rewards-row">
            <div className="reward-chip">
              <Trophy size={16} color="#f59e0b" />
              <span>Reward: +250 XP</span>
            </div>
            <div className="reward-chip">
              <Clock size={16} color="#38bdf8" />
              <span>Time: 2 Mins</span>
            </div>
            <div className="reward-chip">
              <Zap size={16} color="#10b981" />
              <span>Streak Bonus: 2X</span>
            </div>
          </div>

          <button className="btn-start-daily" onClick={onStartChallenge}>
            <span>Start Daily Challenge</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="challenge-right-visual">
          <div className="preview-question-box">
            <div className="box-header">
              <span className="box-badge"><Target size={14} /> SNEAK PEEK QUESTION</span>
              <span className="box-timer">⏱ 15s</span>
            </div>
            <p className="box-q">
              Find the next number in the arithmetic series: 2, 6, 12, 20, 30, ?
            </p>
            <div className="box-options-grid">
              <div className="box-opt">A. 36</div>
              <div className="box-opt">B. 40</div>
              <div className="box-opt box-correct">C. 42 (Correct)</div>
              <div className="box-opt">D. 44</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
