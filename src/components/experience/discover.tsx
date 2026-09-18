"use client";
import Link from "next/link";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types/product";
import { EditorialProductCard } from "./product-card";
import { EmptyState } from "./shared";

type Props = { products: Product[]; params: Record<string, string> };
export function DiscoverExperience({ products, params }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();
  const url = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    return `/search?${p}`;
  };
  const filters = [
    [
      "rating",
      "Sustainability",
      [
        "All",
        "Excellent",
        "Strong",
        "Moderate",
        "Weak",
        "Insufficient Evidence",
      ],
    ],
    ["confidence", "Evidence confidence", ["All", "High", "Medium", "Low"]],
    [
      "platform",
      "Shop at",
      ["All", "Amazon", "Myntra", "Nykaa", "Flipkart", "Brand Site", "ONDC"],
    ],
  ];
  const active = Object.entries(params).filter(
    ([key, value]) =>
      ["rating", "confidence", "platform", "maxPrice", "minPrice"].includes(
        key,
      ) &&
      value &&
      value !== "All",
  );
  return (
    <div className="wrap page-section">
      <div className="discover-top">
        <div>
          <p className="eyebrow">A MORE CONSIDERED EVERYDAY</p>
          <h1>
            {params.q ? "Let’s take a closer look." : "Your next good find."}
          </h1>
          <p>
            {params.q
              ? `Exploring “${params.q}”`
              : "Explore the things you love. Understand what goes into them."}
          </p>
        </div>
        <p className="discovery-tip">
          The product is only half the story.
          <br />
          <strong>Get to know the other half.</strong>
        </p>
      </div>
      <button
        className="mobile-filter-toggle"
        aria-expanded={filtersOpen}
        aria-controls="discovery-filters"
        onClick={() => setFiltersOpen(!filtersOpen)}
      >
        <span>
          Refine your finds {active.length > 0 ? `(${active.length})` : ""}
        </span>
        <SlidersHorizontal size={16} />
      </button>
      <div className="discovery-layout">
        <aside
          id="discovery-filters"
          className={`filter-panel ${filtersOpen ? "open" : "closed"}`}
        >
          <div className="filter-heading">
            <strong>Refine your finds</strong>
            <Link href="/search">Reset all</Link>
          </div>
          <form action="/search" key={JSON.stringify(params)}>
            {params.q && <input type="hidden" name="q" value={params.q} />}
            <input
              type="hidden"
              name="category"
              value={params.category || ""}
            />
            <input
              type="hidden"
              name="sort"
              value={params.sort || "relevance"}
            />
            {filters.map(([key, label, values]) => (
              <fieldset key={key as string}>
                <legend>{label}</legend>
                {(values as string[]).map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name={key as string}
                      value={value}
                      defaultChecked={
                        (params[key as string] || "All") === value
                      }
                    />
                    {value === "All" ? "Any" : value}
                  </label>
                ))}
              </fieldset>
            ))}
            <fieldset>
              <legend>Budget</legend>
              <label htmlFor="max-price">Up to ₹</label>
              <input
                type="number"
                id="max-price"
                name="maxPrice"
                min="0"
                step="1"
                placeholder="No limit"
                defaultValue={params.maxPrice}
              />
            </fieldset>
            <button className="primary-button" type="submit">
              Apply filters
            </button>
          </form>
        </aside>
        <section aria-label="Product results">
          <div className="results-toolbar">
            <span className="result-count">
              <strong>{products.length}</strong>{" "}
              {products.length === 1 ? "discovery" : "discoveries"} ·
              illustrative catalog
            </span>
            <label>
              <span className="sr-only">Sort products</span>
              <select
                value={params.sort || "relevance"}
                onChange={(e) => router.push(url("sort", e.target.value))}
              >
                <option value="relevance">Sort: Best match</option>
                <option value="sustainability">Sustainability rating</option>
                <option value="confidence">Evidence confidence</option>
                <option value="price_low">Price: Low to high</option>
                <option value="price_high">Price: High to low</option>
              </select>
            </label>
          </div>
          {active.length > 0 && (
            <div className="filter-tags">
              {active.map(([key, value]) => (
                <Link
                  key={key}
                  aria-label={`Remove ${key} filter`}
                  href={url(key, "")}
                >
                  {key === "maxPrice" ? `Under ₹${value}` : value}
                  <X size={11} />
                </Link>
              ))}
            </div>
          )}
          {products.length > 0 ? (
            <div className="product-grid results-grid">
              {products.map((product, i) => (
                <EditorialProductCard
                  key={product.id}
                  product={product}
                  priority={i < 3}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="A little too specific?"
              description="We don’t have a match in this small preview catalog yet. Try shampoo, cotton or coffee, or give your filters a little breathing room."
              action="Explore all products"
            />
          )}
          <p className="catalog-note">
            A rating tells one part of the story. Confidence tells you how much
            evidence supports it.{" "}
            <Link href="/about#ratings" style={{ textDecoration: "underline" }}>
              Understand the difference ↗
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
