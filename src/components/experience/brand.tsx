export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`brand-lockup ${compact ? "compact" : ""}`}
      aria-hidden="true"
    >
      <svg
        className="brand-symbol"
        viewBox="465 110 610 540"
        xmlns="http://www.w3.org/2000/svg"
      >
        <image
          href="/images/susco-logo-original.png"
          width="1536"
          height="1024"
        />
      </svg>
      {!compact && (
        <svg
          className="brand-name"
          viewBox="375 650 785 230"
          xmlns="http://www.w3.org/2000/svg"
        >
          <image
            href="/images/susco-logo-original.png"
            width="1536"
            height="1024"
          />
        </svg>
      )}
    </span>
  );
}
