import { useState } from "react";
import { Trophy, Award, ShieldCheck, X, Sparkles, Target, Zap } from "lucide-react";

export default function LeaderboardView({
  userProfile,
  initialGlobalLeaderboard = [],
}) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <main className="leaderboard-page-container">
      {/* HEADER */}
      <div className="section-header-center">
        <span className="section-pill-tag">
          <Award size={14} /> NATIONAL CAMPUS RANKINGS
        </span>
        <h1 className="section-title-3d">LeetCode-Style Placement Arena Leaderboard</h1>
        <p className="section-subtitle">
          Top candidate coders, quant prodigies, and aptitude champions competing across premier engineering institutions.
        </p>
      </div>

      {/* TABLE CONTAINER */}
      <div className="table-responsive-wrapper">
        <table className="table-glass-3d">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Candidate</th>
              <th>Institution / College</th>
              <th>Target Role</th>
              <th>ELO Rating</th>
              <th>Accuracy</th>
              <th>Rewards</th>
            </tr>
          </thead>
          <tbody>
            {/* CURRENT USER ROW */}
            <tr className="current-user-row">
              <td className="rank-cell user-rank">
                <span className="rank-tag">#{userProfile?.globalRank || 12} (YOU)</span>
              </td>
              <td className="candidate-cell">
                <span className="cand-avatar">{userProfile?.avatar || "⚡"}</span>
                <span className="cand-name">{userProfile?.name || "Abhay"}</span>
              </td>
              <td className="college-cell">{userProfile?.college || "BITS Pilani / IIT"}</td>
              <td className="target-cell">{userProfile?.targetCompany || "SDE @ Google"}</td>
              <td>
                <span className="rating-badge rating-master">
                  {userProfile?.rating || 1650} ELO
                </span>
              </td>
              <td className="accuracy-cell">{userProfile?.accuracy || "92%"}</td>
              <td className="rewards-cell">{userProfile?.rewards || "₹500 Gift Card"}</td>
            </tr>

            {/* GLOBAL CANDIDATES ROWS */}
            {initialGlobalLeaderboard.map((row) => (
              <tr
                key={row.rank}
                onClick={() => setSelectedCandidate(row)}
                className="cand-row-clickable"
                title="Click to view candidate profile card"
              >
                <td className="rank-cell">
                  <span
                    className={`rank-num rank-${
                      row.rank === 1 ? "gold" : row.rank === 2 ? "silver" : row.rank === 3 ? "bronze" : "default"
                    }`}
                  >
                    #{row.rank}
                  </span>
                </td>
                <td className="candidate-cell">
                  <span className="cand-avatar">{row.avatar}</span>
                  <span className="cand-name">{row.name}</span>
                </td>
                <td className="college-cell">{row.college}</td>
                <td className="target-cell">{row.target}</td>
                <td>
                  <span
                    className={`rating-badge ${
                      row.tier === "Grandmaster"
                        ? "rating-grandmaster"
                        : row.tier === "Master"
                        ? "rating-master"
                        : "rating-knight"
                    }`}
                  >
                    {row.rating} {row.tier}
                  </span>
                </td>
                <td className="accuracy-cell">{row.accuracy}</td>
                <td className="rewards-cell">{row.rewards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CANDIDATE INSPECTOR MODAL */}
      {selectedCandidate && (
        <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="candidate-profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-close-btn" onClick={() => setSelectedCandidate(null)}>
              <X size={20} />
            </button>

            <div className="modal-avatar-big">{selectedCandidate.avatar || "⚡"}</div>
            <h2 className="modal-cand-name">{selectedCandidate.name}</h2>
            <p className="modal-cand-sub">
              {selectedCandidate.college} • {selectedCandidate.target}
            </p>

            <div className="modal-stats-triad">
              <div className="modal-triad-box">
                <span className="triad-lbl">ELO RATING</span>
                <strong className="triad-val text-cyan">{selectedCandidate.rating}</strong>
                <span className="triad-tag">{selectedCandidate.tier}</span>
              </div>
              <div className="modal-triad-box">
                <span className="triad-lbl">ACCURACY</span>
                <strong className="triad-val text-emerald">{selectedCandidate.accuracy}</strong>
              </div>
              <div className="modal-triad-box">
                <span className="triad-lbl">REWARDS</span>
                <strong className="triad-val text-amber">{selectedCandidate.rewards}</strong>
              </div>
            </div>

            <button
              className="btn-modal-submit full-width"
              onClick={() => setSelectedCandidate(null)}
            >
              Close Candidate Profile
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
