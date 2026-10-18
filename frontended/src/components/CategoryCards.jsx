import {
  Target,
  Brain,
  GraduationCap,
  BarChart3,
  Hash,
  Sparkles,
  Dices,
  Clock,
  Code2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { CATEGORIES_DATA } from "../data/aptitudeBank";

const ICON_MAP = {
  Target: Target,
  Brain: Brain,
  GraduationCap: GraduationCap,
  BarChart3: BarChart3,
  Hash: Hash,
  Sparkles: Sparkles,
  Dice: Dices,
  Clock: Clock,
  Code2: Code2,
};

export default function CategoryCards({ onSelectCategory }) {
  return (
    <section className="categories-showcase" id="categories-section">
      <div className="section-header-center">
        <span className="section-pill-tag">
          <Sparkles size={14} /> 9 CORE PLACEMENT DOMAINS
        </span>
        <h2 className="section-title-3d">
          Master Every Aptitude Category
        </h2>
        <p className="section-subtitle">
          Comprehensive curriculum tailored for top Tier-1 tech firms, quant funds, and national campus hiring drives.
        </p>
      </div>

      <div className="category-cards-grid">
        {CATEGORIES_DATA.map((cat) => {
          const IconComponent = ICON_MAP[cat.iconName] || Target;
          const progressPercent = Math.round((cat.completedQuestions / cat.totalQuestions) * 100);

          return (
            <div
              key={cat.id}
              className="premium-category-card"
              onClick={() => onSelectCategory(cat.id, cat.title)}
            >
              {/* Card Top: 3D Icon & Difficulty Pill */}
              <div className="cat-card-header">
                <div
                  className="cat-3d-icon-badge"
                  style={{
                    background: cat.gradient,
                    boxShadow: `0 8px 24px ${cat.glowColor}`,
                  }}
                >
                  <IconComponent size={24} color="#ffffff" />
                </div>

                <div className="cat-header-right">
                  <span
                    className={`difficulty-pill diff-${cat.difficulty.toLowerCase()}`}
                  >
                    {cat.difficulty}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="cat-card-body">
                <h3 className="cat-card-title">{cat.title}</h3>
                <p className="cat-card-desc">{cat.description}</p>

                {/* Subtopic Chips */}
                <div className="cat-subtopics">
                  {cat.topics.map((t, i) => (
                    <span key={i} className="subtopic-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Questions Count */}
              <div className="cat-card-footer">
                <div className="cat-progress-meta">
                  <div className="meta-left">
                    <span className="meta-label">Progress</span>
                    <strong className="meta-val">{progressPercent}%</strong>
                  </div>
                  <div className="meta-right">
                    <span className="meta-label">Questions</span>
                    <strong className="meta-val">{cat.completedQuestions} / {cat.totalQuestions}</strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-fill"
                    style={{
                      width: `${progressPercent}%`,
                      background: cat.gradient,
                    }}
                  />
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  className="btn-practice-cat"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat.id, cat.title);
                  }}
                >
                  <span>Practice Topic</span>
                  <ArrowRight size={16} className="btn-arrow" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
