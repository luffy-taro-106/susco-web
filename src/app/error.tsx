"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="wrap page-section">
      <div className="empty-state">
        <p className="eyebrow">A SMALL DETOUR</p>
        <h1 style={{ fontSize: 42, marginTop: 18 }}>Let’s try that again.</h1>
        <p>
          We couldn’t load this page. Your saved choices remain in this browser.
        </p>
        <button className="primary-button" onClick={reset}>
          Try again
        </button>
        <Link href="/search" className="text-link" style={{ marginTop: 22 }}>
          Back to discovery
        </Link>
      </div>
    </div>
  );
}
