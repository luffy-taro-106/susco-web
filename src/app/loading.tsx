export default function Loading() {
  return (
    <div
      className="wrap page-section"
      role="status"
      aria-label="Loading discoveries"
    >
      <div className="page-intro">
        <p className="eyebrow">A MOMENT FOR SOMETHING GOOD</p>
        <h1>Taking a closer look…</h1>
      </div>
      <div className="product-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} aria-hidden="true">
            <div className="loading-skeleton" />
            <div className="loading-line" />
            <div className="loading-line" style={{ width: "45%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
