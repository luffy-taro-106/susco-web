"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/types/product";
import { addToCompare, removeFromCompare } from "@/lib/compare/compare-store";
import { toggleChoice } from "@/lib/tracker/tracker-store";
import { notify, persist, useChoices, useCompare } from "./state";
import { price, ProductPhoto, Rating } from "./shared";
import { MetricStrip } from "./scorecard";

export function SaveButton({
  product,
  label = false,
}: {
  product: Product;
  label?: boolean;
}) {
  const saved = useChoices().some(
    (c) => c.productId === product.id && c.action === "saved",
  );
  return (
    <button
      className={label ? "secondary-button" : "save-button"}
      aria-label={`${saved ? "Unsave" : "Save"} ${product.canonicalName}`}
      aria-pressed={saved}
      onClick={() =>
        persist(() => {
          const added = toggleChoice(product.id, "saved", product.rating);
          notify(
            added ? "Saved to your collection" : "Removed from saved products",
          );
        })
      }
    >
      <Heart size={18} fill={saved ? "currentColor" : "none"} />
      {label && (saved ? "Saved" : "Save for later")}
    </button>
  );
}
export function CompareButton({ product }: { product: Product }) {
  const selected = useCompare().includes(product.id);
  return (
    <button
      className={`compare-button ${selected ? "selected" : ""}`}
      aria-label={`${selected ? "Remove" : "Compare"} ${product.canonicalName}`}
      aria-pressed={selected}
      onClick={() =>
        persist(() => {
          if (selected) removeFromCompare(product.id);
          else {
            const result = addToCompare(product.id);
            notify(
              result === "limit_reached"
                ? "You can compare four products. Remove one to add another."
                : "Added to comparison",
            );
          }
        })
      }
    >
      {selected ? <Check size={14} /> : <Plus size={14} />}{" "}
      {selected ? "Comparing" : "Compare"}
    </button>
  );
}
export function EditorialProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="product-card">
      <div className="product-visual">
        <Link
          href={`/product/${product.slug}`}
          aria-label={`View ${product.canonicalName}`}
        >
          <ProductPhoto product={product} priority={priority} />
        </Link>
        <SaveButton product={product} />
        <div className="photo-rating">
          <Rating
            band={product.rating.band}
            numericScore={product.rating.numericScore}
          />
        </div>
      </div>
      <div className="product-meta">
        <span>{product.brandName}</span>
        <span>{product.rating.confidence} confidence</span>
      </div>
      <h3>
        <Link href={`/product/${product.slug}`}>{product.canonicalName}</Link>
      </h3>
      <p className="product-reason">
        {product.rating.shortReason
          .replace(/seed products/g, "examples")
          .replace(/seed evidence/g, "illustrative evidence")
          .replace(/seed rating/g, "example rating")}
      </p>
      <MetricStrip metrics={product.rating.metrics} compact />
      <div className="product-card-bottom">
        <div>
          <strong>
            {price(Math.min(...product.listings.map((l) => l.price)))}
          </strong>
          <span>example price</span>
        </div>
        <CompareButton product={product} />
      </div>
      <Link className="product-view" href={`/product/${product.slug}`}>
        View evidence & stores <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
