import type {
  SustainabilityMetric,
  SustainabilityRating,
} from "@/lib/types/scoring";

export function MetricStrip({
  metrics,
  compact = false,
}: {
  metrics: SustainabilityMetric[];
  compact?: boolean;
}) {
  return (
    <div
      className={`metric-strip ${compact ? "compact" : ""}`}
      aria-label="Five sustainability metric scores"
    >
      {metrics.map((metric) => (
        <div
          className="metric-strip-item"
          key={metric.key}
          title={`${metric.label}: ${metric.score} out of 100`}
        >
          <span className="metric-strip-number">{metric.score}</span>
          <span className="metric-strip-label">{metric.shortLabel}</span>
          <span className="metric-strip-track" aria-hidden="true">
            <span style={{ width: `${metric.score}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function MetricScorecard({
  rating,
}: {
  rating: SustainabilityRating;
}) {
  return (
    <div className="metric-scorecard">
      <div className="metric-scorecard-heading">
        <div>
          <span className="score-kicker">Five metric breakdown</span>
          <strong>20% each</strong>
        </div>
        <p>
          Five equally weighted metrics. Scores are normalized within the
          product category.
        </p>
      </div>
      <div className="metric-scorecard-list">
        {rating.metrics.map((metric) => (
          <div className="metric-score-row" key={metric.key}>
            <div>
              <span>{metric.label}</span>
              <strong>{metric.score}</strong>
            </div>
            <span className="metric-score-track" aria-hidden="true">
              <span style={{ width: `${metric.score}%` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
