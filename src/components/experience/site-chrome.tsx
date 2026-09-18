"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Menu,
  Search,
  SlidersHorizontal,
  Sprout,
  X,
  Grid2X2,
  Droplets,
  Shirt,
  Coffee,
  Repeat2,
  ArrowDownWideNarrow,
} from "lucide-react";
import { clearCompare, removeFromCompare } from "@/lib/compare/compare-store";
import { getProductsByIds } from "@/lib/services/product-service";
import { Notices, persist, useChoices, useCompare } from "./state";
import { BrandLogo } from "./brand";
import { SearchBox } from "./shared";

function HeaderSearch() {
  const params = useSearchParams();
  return (
    <SearchBox
      key={`${params.get("q")}-${params.get("category")}`}
      value={params.get("q") || ""}
      category={params.get("category") || ""}
      label="Site search"
    />
  );
}

function CurrentBrowseRail() {
  const params = useSearchParams();
  const path = usePathname();
  const active =
    path === "/"
      ? "all"
      : path === "/search"
        ? params.get("category") ||
          (params.get("maxPrice") === "700"
            ? "budget"
            : params.get("q") === "refill"
              ? "refill"
              : "all")
        : "";
  return <BrowseRail active={active} />;
}
function BrowseRail({ active }: { active: string }) {
  return (
    <nav className="browse-rail" aria-label="Browse categories">
      <div className="rail-items">
        <Link
          href="/search"
          className={active === "all" ? "active" : ""}
          aria-current={active === "all" ? "page" : undefined}
        >
          <Grid2X2 size={16} />
          For you
        </Link>
        <Link
          href="/search?category=Beauty"
          className={active === "Beauty" ? "active" : ""}
          aria-current={active === "Beauty" ? "page" : undefined}
        >
          <Droplets size={16} />
          Beauty & care
        </Link>
        <Link
          href="/search?category=Fashion"
          className={active === "Fashion" ? "active" : ""}
          aria-current={active === "Fashion" ? "page" : undefined}
        >
          <Shirt size={16} />
          Fashion
        </Link>
        <Link
          href="/search?category=Food"
          className={active === "Food" ? "active" : ""}
          aria-current={active === "Food" ? "page" : undefined}
        >
          <Coffee size={16} />
          Food & drink
        </Link>
        <Link
          href="/search?maxPrice=700"
          className={active === "budget" ? "active" : ""}
          aria-current={active === "budget" ? "page" : undefined}
        >
          <ArrowDownWideNarrow size={16} />
          Under ₹700
        </Link>
        <Link
          href="/search?q=refill"
          className={active === "refill" ? "active" : ""}
          aria-current={active === "refill" ? "page" : undefined}
        >
          <Repeat2 size={16} />
          Refill picks
        </Link>
      </div>
      <Link className="rail-approach" href="/about">
        How we rate
        <ArrowUpRight size={15} />
      </Link>
    </nav>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const ids = useCompare();
  const products = getProductsByIds(ids);
  const saved = useChoices().filter((c) => c.action === "saved").length;
  const links = [
    ["/search", "Discover"],
    ["/categories", "Categories"],
    ["/about", "Our approach"],
  ];
  return (
    <div className="susco-experience">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="top-strip">
        <span>
          <span className="tiny-dot" /> Look closer. Choose better.
        </span>
        <span>
          Independent by design <ArrowUpRight size={12} />
        </span>
      </div>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="SusCo home">
          <BrandLogo />
        </Link>
        <div className="header-search">
          <Suspense fallback={<SearchBox label="Site search" />}>
            <HeaderSearch />
          </Suspense>
        </div>
        <div className="header-actions">
          <Link
            href="/search"
            className="icon-button"
            aria-label="Open product search"
          >
            <Search size={20} />
          </Link>
          <Link
            href="/compare"
            className="icon-button compare-header"
            aria-label={`Compare ${ids.length} products`}
          >
            <SlidersHorizontal size={19} />
            {ids.length > 0 && <small>{ids.length}</small>}
          </Link>
          <Link
            className="collection-link"
            href="/tracker"
            aria-label="My collection"
          >
            <Heart size={17} />
            <span>My collection</span>
            {saved > 0 && <small>{saved}</small>}
          </Link>
          <button
            className="icon-button menu-button"
            aria-expanded={menu}
            aria-controls="mobile-navigation"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <Suspense fallback={<BrowseRail active={path === "/" ? "all" : ""} />}>
        <CurrentBrowseRail />
      </Suspense>
      {menu && (
        <nav
          id="mobile-navigation"
          className="mobile-menu"
          aria-label="Mobile navigation"
        >
          {[
            ...links,
            ["/compare", "Compare products"],
            ["/tracker", "My collection"],
          ].map(([href, title]) => (
            <Link key={href} href={href} onClick={() => setMenu(false)}>
              {title}
              <ArrowRight size={18} />
            </Link>
          ))}
        </nav>
      )}
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Link href="/" className="wordmark" aria-label="SusCo home">
              <BrandLogo />
            </Link>
            <h2>
              A considered choice.
              <br />
              <i>A little every day.</i>
            </h2>
          </div>
          <div>
            <p className="eyebrow">EXPLORE</p>
            <Link href="/search">Discover products</Link>
            <Link href="/categories">Browse categories</Link>
            <Link href="/compare">Compare your finds</Link>
          </div>
          <div>
            <p className="eyebrow">THE DETAILS</p>
            <Link href="/about">Our approach</Link>
            <Link href="/about#ratings">How ratings work</Link>
            <Link href="/about#retailers">Shopping with SusCo</Link>
          </div>
          <div>
            <p className="eyebrow">YOUR SPACE</p>
            <Link href="/tracker">My collection</Link>
            <Link href="/profile/aanya">
              Example profile <ArrowUpRight size={13} />
            </Link>
            <span className="footer-note">
              Thoughtful choices,
              <br />
              without the guilt.
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SusCo. Made for more considered living.
          </span>
          <span>
            <Sprout size={14} /> Evidence over green promises.
          </span>
        </div>
      </footer>
      <div
        className={`preview-note ${products.length > 0 && path !== "/compare" ? "with-tray" : ""}`}
      >
        <span className="tiny-dot" /> Design preview · illustrative products,
        prices & ratings
      </div>
      {products.length > 0 && path !== "/compare" && (
        <aside
          className="comparison-tray"
          aria-label="Selected comparison products"
        >
          <div className="tray-label">
            <Check size={17} />
            <strong>{products.length}/4</strong>
            <span> selected</span>
          </div>
          <div className="tray-products">
            {products.map((p) => (
              <button
                key={p.id}
                aria-label={`Remove ${p.canonicalName} from comparison`}
                onClick={() => persist(() => removeFromCompare(p.id))}
              >
                {p.productType}
                <X size={13} />
              </button>
            ))}
          </div>
          <button className="tray-clear" onClick={() => persist(clearCompare)}>
            Clear
          </button>
          <Link href="/compare" className="primary-button">
            Compare
            <ArrowRight size={17} />
          </Link>
        </aside>
      )}
      <Notices />
    </div>
  );
}
