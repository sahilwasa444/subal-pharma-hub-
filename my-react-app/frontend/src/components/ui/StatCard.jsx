import { motion } from "framer-motion";

const TONE_STYLES = {
  blue: {
    background: "rgba(37, 99, 235, 0.12)",
    color: "#2563eb"
  },
  emerald: {
    background: "rgba(34, 197, 94, 0.14)",
    color: "#15803d"
  },
  amber: {
    background: "rgba(245, 158, 11, 0.14)",
    color: "#b45309"
  },
  rose: {
    background: "rgba(239, 68, 68, 0.14)",
    color: "#b91c1c"
  },
  slate: {
    background: "rgba(148, 163, 184, 0.14)",
    color: "#334155"
  }
};

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  tone = "blue",
  delay = 0
}) {
  const toneStyle = TONE_STYLES[tone] || TONE_STYLES.blue;

  return (
    <motion.article
      className="stat-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="stat-card__icon" style={toneStyle}>
        {Icon ? <Icon size={18} aria-hidden="true" /> : null}
      </div>

      <div>
        <span className="stat-card__label">{label}</span>
        <strong className="stat-card__value">{value}</strong>
        {description ? (
          <p className="stat-card__description">{description}</p>
        ) : null}
      </div>

      {trend ? <span className="stat-card__trend">{trend}</span> : null}
    </motion.article>
  );
}

export default StatCard;
