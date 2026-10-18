import { Brain, Sparkles, Trophy, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Select Domain & Topic",
      desc: "Pick from 9 core aptitude categories or practice custom company mocks designed for TCS, Google, and Infosys.",
      icon: Brain,
      color: "#38bdf8",
      gradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(6, 182, 212, 0.05))",
    },
    {
      step: "02",
      title: "Interactive Practice & Explanations",
      desc: "Solve timed questions with realistic pressure. Receive instant step-by-step mathematical breakdowns for every mistake.",
      icon: Sparkles,
      color: "#a855f7",
      gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.05))",
    },
    {
      step: "03",
      title: "Compete Live & Track ELO",
      desc: "Enter real-time 3D multiplayer arena rooms or Sunday placement clashes to climb national ranks and win tech vouchers.",
      icon: Trophy,
      color: "#10b981",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))",
    },
  ];

  return (
    <section className="how-it-works-section">
      <div className="section-header-center">
        <span className="section-pill-tag">
          <Sparkles size={14} /> METHODOLOGY
        </span>
        <h2 className="section-title-3d">How Aptitude Arena Works</h2>
        <p className="section-subtitle">
          Engineered to systematically transform your reasoning speed, accuracy, and placement confidence.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="step-card" style={{ background: s.gradient }}>
              <div className="step-num-badge" style={{ color: s.color }}>
                {s.step}
              </div>

              <div className="step-icon-box" style={{ background: `${s.color}25`, color: s.color }}>
                <Icon size={28} />
              </div>

              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
