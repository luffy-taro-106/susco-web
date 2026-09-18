import Link from "next/link";
import { ArrowRight, ChevronDown, Search, Sprout } from "lucide-react";
import type { Product } from "@/lib/types/product";
import type { SustainabilityBand } from "@/lib/types/scoring";
import { RemoteProductPhoto } from "./remote-product-photo";

export const price = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
export const productImage = (product: Product) =>
  product.id === "root-ritual-refill-shampoo"
    ? "/images/susco-still-life.png"
    : product.imageUrls[0];
export function ProductPhoto({
  product,
  priority = false,
  className = "",
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const studioTiles: Record<string, [number, number]> = {
    "root-ritual-refill-shampoo": [0, 0],
    "threadlane-organic-tee": [512, 0],
    "origin-cup-shade-grown-coffee": [0, 512],
    "meadow-skin-gel-cleanser": [512, 512],
  };
  const additionalTiles: Record<string, [number, number]> = {
    "auraa-daily-sun-fluid": [0, 0],
    "loopkind-barrier-moisturizer": [512, 0],
    "reknit-compressive-leggings": [0, 512],
    "harvest-bar-nut-protein": [512, 512],
  };
  const tile = studioTiles[product.id] || additionalTiles[product.id];
  const sheet = studioTiles[product.id]
    ? "/images/susco-packshots.png"
    : "/images/susco-packshots-additional.png";
  if (tile)
    return (
      <svg
        className={`studio-photo ${className}`}
        viewBox={`${tile[0]} ${tile[1]} 512 512`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${product.canonicalName} — illustrative product photograph`}
      >
        <image href={sheet} width="1024" height="1024" />
      </svg>
    );
  return (
    <RemoteProductPhoto
      key={product.id}
      className={className}
      src={productImage(product)}
      name={product.canonicalName}
      priority={priority}
    />
  );
}
export function Rating({ band }: { band: SustainabilityBand }) {
  return (
    <span
      className={`rating rating-${band.toLowerCase().replaceAll(" ", "-")}`}
    >
      <span aria-hidden="true" />
      {band}
    </span>
  );
}
export function SearchBox({
  value = "",
  large = false,
  category = "",
  label = "Search products",
}: {
  value?: string;
  large?: boolean;
  category?: string;
  label?: string;
}) {
  return (
    <form
      className={`discovery-search ${large ? "large" : ""}`}
      action="/search"
      role="search"
      aria-label={label}
    >
      <label className="search-category">
        <span className="sr-only">Search category</span>
        <select name="category" defaultValue={category}>
          <option value="">All categories</option>
          <option value="Beauty">Beauty & care</option>
          <option value="Fashion">Fashion</option>
          <option value="Food">Food & drink</option>
        </select>
        <ChevronDown size={13} />
      </label>
      <input
        aria-label="Search products"
        type="search"
        name="q"
        defaultValue={value}
        placeholder="Search products"
      />
      <button aria-label="Search products" type="submit">
        <Search size={20} />
      </button>
    </form>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  href,
  link = "Explore all",
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function EmptyState({
  title,
  description,
  href = "/search",
  action = "Discover products",
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Sprout size={32} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href={href} className="primary-button">
        {action}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
