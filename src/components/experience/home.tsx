import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Fingerprint,
  Heart,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { getAllProducts } from "@/lib/services/product-service";
import { EditorialProductCard } from "./product-card";
import { SectionHeading } from "./shared";

export const editorialCategories = [
  {
    name: "Beauty & care",
    key: "Beauty",
    description: "A fresh take on your daily ritual.",
    image: "/images/susco-still-life.png",
    position: "center 47%",
    label: "YOUR EVERYDAY, UPGRADED",
  },
  {
    name: "Fashion",
    key: "Fashion",
    description: "Great style. More of the story.",
    image: "/images/susco-campaign.png",
    position: "82% center",
    label: "WEAR YOUR CURIOSITY",
  },
  {
    name: "Food & drink",
    key: "Food",
    description: "Know what goes into the good stuff.",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=85",
    position: "center",
    label: "A LITTLE MORE TO SAVOUR",
  },
];
export function CategoryTiles() {
  return (
    <div className="category-grid">
      {editorialCategories.map((c) => (
        <Link
          className={`category-tile category-${c.key.toLowerCase()}`}
          href={`/search?category=${c.key}`}
          key={c.key}
        >
          <div className="category-image">
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(max-width: 600px) 90vw, 33vw"
              style={{ objectPosition: c.position }}
            />
          </div>
          <span className="category-kicker">{c.label}</span>
          <div className="category-label">
            <div>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
            </div>
            <span>
              <ArrowUpRight size={20} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function TrustBlock() {
  return (
    <section className="proof-banner">
      <div className="proof-graphic" aria-hidden="true">
        <Fingerprint />
        <span className="proof-label">OPEN THE EVIDENCE</span>
        <span className="proof-orbit one" />
        <span className="proof-orbit two" />
      </div>
      <div className="proof-content">
        <span className="pill-label">
          <span className="tiny-dot" /> BEHIND EVERY RATING
        </span>
        <h2>
          Less green talk.
          <br />
          More <span>to go on.</span>
        </h2>
        <p>
          What’s supported. What’s uncertain. What’s missing.
          <br />A clear picture, so you can make your own call.
        </p>
        <Link href="/about" className="pill-action light">
          Meet our approach
          <span>
            <ArrowUpRight size={20} />
          </span>
        </Link>
      </div>
      <div className="proof-facts">
        <div>
          <ScanLine size={20} />
          <span>Evidence you can follow</span>
        </div>
        <div>
          <Fingerprint size={20} />
          <span>Confidence shown separately</span>
        </div>
        <div>
          <Sparkles size={20} />
          <span>Ratings brands can’t buy</span>
        </div>
      </div>
    </section>
  );
}
export function HomeExperience() {
  const products = [
    "root-ritual-refill-shampoo",
    "threadlane-organic-tee",
    "origin-cup-shade-grown-coffee",
    "meadow-skin-gel-cleanser",
  ].map((id) => getAllProducts().find((p) => p.id === id)!);
  const affordable = getAllProducts()
    .filter((p) => Math.min(...p.listings.map((l) => l.price)) <= 700)
    .slice(0, 4);
  return (
    <div className="wrap home-wrap">
      <section className="campaign-grid" aria-label="Featured discoveries">
        <div className="campaign-main">
          <Image
            src="/images/susco-campaign.png"
            alt="A woman in a forest-green overshirt in a sunlit mint courtyard"
            fill
            sizes="(max-width: 760px) 100vw, 70vw"
            loading="eager"
            fetchPriority="high"
          />
          <div className="campaign-shade" />
          <div className="campaign-copy">
            <span className="pill-label">GOOD FINDS. FULL STORIES.</span>
            <h1>
              Every choice
              <br />
              has a <span>story.</span>
            </h1>
            <p>
              Find your favourites.
              <br />
              Know what’s behind them.
            </p>
            <Link href="/search" className="pill-action">
              Find your next better
              <span>
                <ArrowUpRight size={22} />
              </span>
            </Link>
          </div>
          <div className="campaign-bottom">
            <span>LOOK CLOSER. CHOOSE BETTER.</span>
            <span className="campaign-bottom-note">
              Beauty · Fashion · Food
            </span>
          </div>
        </div>
        <Link href="/search?category=Beauty" className="campaign-beauty">
          <Image
            src="/images/susco-still-life.png"
            alt="Refillable skincare and natural linen"
            fill
            sizes="(max-width: 760px) 50vw, 28vw"
          />
          <span className="small-capsule">THE DAILY RITUAL EDIT</span>
          <div className="campaign-tile-label">
            <h2>
              A fresh
              <br />
              perspective.
            </h2>
            <span className="round-arrow">
              <ArrowUpRight size={22} />
            </span>
          </div>
        </Link>
        <Link href="/about#ratings" className="campaign-proof">
          <div>
            <span className="eyebrow">LOOKS GOOD. BUT IS IT?</span>
            <h2>
              See past
              <br />
              the label.
            </h2>
            <span className="proof-link">
              Get the full picture <ArrowUpRight size={18} />
            </span>
          </div>
          <Fingerprint
            className="campaign-fingerprint"
            strokeWidth={0.85}
            aria-hidden="true"
          />
        </Link>
      </section>
      <div className="retailer-strip">
        <p>
          <strong>Your discovery starts here.</strong>
          <span>Checkout happens with the original store.</span>
        </p>
        <div className="retailer-names">
          <span className="amazon-word">
            amazon
            <ArrowUpRight size={13} />
          </span>
          <span className="myntra-word">
            Myntra
            <ArrowUpRight size={13} />
          </span>
          <span className="nykaa-word">
            Nykaa
            <ArrowUpRight size={13} />
          </span>
          <span className="brand-sites">
            & brand websites
            <ArrowUpRight size={13} />
          </span>
        </div>
        <Link href="/about#retailers" aria-label="How retailer redirects work">
          <ArrowUpRight size={20} />
        </Link>
      </div>
      <section className="featured-section">
        <SectionHeading
          eyebrow="THE DISCOVERY EDIT"
          title="Good finds. Worth a closer look."
          href="/search"
          link="Explore all"
        />
        <div className="product-grid">
          {products.map((p) => (
            <EditorialProductCard product={p} key={p.id} />
          ))}
        </div>
      </section>
      <section className="category-section">
        <SectionHeading
          title="A little better, in every aisle."
          href="/categories"
          link="All categories"
        />
        <CategoryTiles />
      </section>
      <section className="split-promo">
        <Link href="/search?category=Fashion" className="wardrobe-promo">
          <Image
            src="/images/susco-campaign.png"
            alt="A fresh green wardrobe edit"
            fill
            sizes="(max-width: 600px) 100vw, 60vw"
          />
          <div>
            <span className="small-capsule">THE WARDROBE EDIT</span>
            <h2>
              Good on you.
              <br />
              More to the story.
            </h2>
            <span className="pill-action">
              Explore fashion
              <span>
                <ArrowUpRight size={20} />
              </span>
            </span>
          </div>
        </Link>
        <div className="collection-promo">
          <div className="collection-promo-top">
            <span className="small-capsule">CURATED BY YOU</span>
            <Heart size={24} />
          </div>
          <h2>
            Your taste.
            <br />
            Your values.
            <br />
            <span>Your collection.</span>
          </h2>
          <p>
            Save the finds you love.
            <br />
            Come back when it feels right.
          </p>
          <Link href="/tracker" className="pill-action dark">
            Make it yours
            <span>
              <ArrowUpRight size={20} />
            </span>
          </Link>
          <span className="collection-art-word" aria-hidden="true">
            YOU.
          </span>
        </div>
      </section>
      <section className="featured-section budget-section">
        <SectionHeading
          eyebrow="SMALL PRICE. SAME CURIOSITY."
          title="Finds under ₹700."
          href="/search?maxPrice=700"
          link="See the edit"
        />
        <div className="product-grid">
          {affordable.map((p) => (
            <EditorialProductCard product={p} key={p.id} />
          ))}
        </div>
      </section>
      <TrustBlock />
      <div className="closing-note">
        <span className="tiny-dot" />
        <p>Better choices start with a little curiosity.</p>
        <Link href="/search">
          Follow yours
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
