"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { clearCompare, removeFromCompare } from "@/lib/compare/compare-store";
import { getProductsByIds } from "@/lib/services/product-service";
import { EmptyState, price, ProductPhoto, Rating } from "./shared";
import { persist, useCompare } from "./state";
export function CompareExperience({ initialIds }: { initialIds: string[] }) {
  const stored = useCompare();
  const [removed, setRemoved] = useState<string[]>([]);
  const [cleared, setCleared] = useState(false);
  const ids = Array.from(new Set([...(cleared ? [] : initialIds), ...stored]))
    .filter((id) => !removed.includes(id))
    .slice(0, 4);
  const products = getProductsByIds(ids);
  const remove = (id: string) =>
    persist(() => {
      removeFromCompare(id);
      setRemoved([...removed, id]);
    });
  return (
    <div className="wrap page-section">
      <div className="page-intro-row">
        <div className="page-intro">
          <p className="eyebrow">SIDE BY SIDE. STORY BY STORY.</p>
          <h1>A little clarity goes a long way.</h1>
          <p>
            Compare up to four finds. Look beyond the rating to the evidence,
            the uncertainty, and what matters to you.
          </p>
        </div>
        <Link href="/search" className="secondary-button">
          Add a discovery
          <Plus size={16} />
        </Link>
      </div>
      {products.length === 0 ? (
        <div style={{ marginTop: 35 }}>
          <EmptyState
            title="Good choices deserve a closer look."
            description="Tap Compare on a product to bring it here. You can compare ratings, confidence, prices and evidence for up to four finds."
          />
        </div>
      ) : (
        <>
          <div className="results-toolbar" style={{ marginTop: 30 }}>
            <span>{products.length} of 4 products selected</span>
            <button
              onClick={() =>
                persist(() => {
                  clearCompare();
                  setCleared(true);
                })
              }
              style={{ textDecoration: "underline" }}
            >
              Clear comparison
            </button>
          </div>
          <p className="soft-note">
            {new Set(products.map((p) => p.categoryId)).size > 1
              ? "These products are from different categories. Each category uses different assessment criteria; rating bands are not directly equivalent."
              : "A like-for-like comparison starts with the same category. All prices and assessments below are illustrative."}
          </p>
          <div className="compare-table-scroll">
            <table className="compare-table">
              <caption className="sr-only">
                Product sustainability and evidence comparison
              </caption>
              <thead>
                <tr>
                  <th scope="col">Your discoveries</th>
                  {products.map((p) => (
                    <th key={p.id} scope="col">
                      <div className="compare-product-image">
                        <ProductPhoto product={p} />
                      </div>
                      <p className="eyebrow" style={{ fontSize: 8 }}>
                        {p.brandName}
                      </p>
                      <h3>
                        <Link href={`/product/${p.slug}`}>
                          {p.canonicalName}
                        </Link>
                      </h3>
                      <button
                        className="remove-compare"
                        onClick={() => remove(p.id)}
                        aria-label={`Remove ${p.canonicalName}`}
                      >
                        <X size={12} />
                        Remove
                      </button>
                    </th>
                  ))}
                  {products.length === 1 && (
                    <th scope="col">
                      <Link className="compare-empty-slot" href="/search">
                        <Plus size={20} /> Add another find
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Sustainability",
                    products.map((p) => (
                      <Rating key={p.id} band={p.rating.band} />
                    )),
                  ],
                  [
                    "Evidence confidence",
                    products.map((p) => (
                      <span key={p.id}>{p.rating.confidence}</span>
                    )),
                  ],
                  [
                    "Example price from",
                    products.map((p) => (
                      <strong key={p.id}>
                        {price(Math.min(...p.listings.map((l) => l.price)))}
                      </strong>
                    )),
                  ],
                  [
                    "The short story",
                    products.map((p) => (
                      <span key={p.id}>
                        {p.rating.shortReason
                          .replaceAll("seed products", "examples")
                          .replaceAll("seed rating", "example rating")}
                      </span>
                    )),
                  ],
                  [
                    "What’s missing",
                    products.map((p) => (
                      <ul key={p.id}>
                        {p.rating.missingData.length ? (
                          p.rating.missingData.map((x) => <li key={x}>{x}</li>)
                        ) : (
                          <li>No additional gaps listed in the example.</li>
                        )}
                      </ul>
                    )),
                  ],
                  [
                    "Store options",
                    products.map((p) => (
                      <span key={p.id}>
                        {p.listings.map((l) => l.platform).join(" · ")}
                      </span>
                    )),
                  ],
                  [
                    "Make it your choice",
                    products.map((p) => (
                      <Link
                        key={p.id}
                        className="text-link"
                        href={`/product/${p.slug}`}
                        style={{ fontSize: 13 }}
                      >
                        Evidence & stores
                        <ArrowRight size={13} />
                      </Link>
                    )),
                  ],
                ].map(([label, cells], i) => (
                  <tr
                    key={label as string}
                    className={i === 0 ? "positive" : ""}
                  >
                    <th scope="row">{label}</th>
                    {(cells as React.ReactNode[]).map((cell, j) => (
                      <td key={products[j].id}>{cell}</td>
                    ))}
                    {products.length === 1 && <td>—</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
