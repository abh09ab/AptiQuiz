import { Clock, Users, Award, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_TESTS_DATA } from "../data/aptitudeBank";

export default function FeaturedMockTests({ onSelectMockTest }) {
  return (
    <section className="featured-mocks-section">
      <div className="section-header-center">
        <span className="section-pill-tag">
          <Award size={14} /> NATIONAL RECRUITMENT TESTS
        </span>
        <h2 className="section-title-3d">Featured Placement Mock Tests</h2>
        <p className="section-subtitle">
          Curated full-length practice tests simulated for top campus recruitment patterns with live timed scoring.
        </p>
      </div>

      <div className="mocks-grid">
        {MOCK_TESTS_DATA.map((test) => (
          <div key={test.id} className="mock-test-card">
            <div className="mock-card-header">
              <span className="mock-company-tag" style={{ borderColor: test.color, color: test.color }}>
                {test.company}
              </span>
              <span className="mock-badge">{test.badge}</span>
            </div>

            <h3 className="mock-title">{test.title}</h3>

            <div className="mock-meta-row">
              <div className="mock-meta-item">
                <Clock size={15} />
                <span>{test.durationMinutes} Mins</span>
              </div>
              <div className="mock-meta-item">
                <Sparkles size={15} />
                <span>{test.questionsCount} Questions</span>
              </div>
              <div className="mock-meta-item">
                <Users size={15} />
                <span>{test.participants.toLocaleString()} Attempted</span>
              </div>
            </div>

            <div className="mock-card-footer">
              <div className="pass-rate-group">
                <span className="pass-rate-lbl">Average Pass Rate</span>
                <strong className="pass-rate-val">{test.passRate}</strong>
              </div>

              <button
                className="btn-take-mock"
                onClick={() => onSelectMockTest(test.id, test.title)}
              >
                <span>Take Test</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
