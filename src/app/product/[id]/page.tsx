import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ShieldCheck,
} from "lucide-react";
import {
  getAllProducts,
  getProductByIdOrSlug,
  getProductEvidence,
  getSimilarProductsService,
} from "@/lib/services/product-service";
import {
  CompareButton,
  EditorialProductCard,
  SaveButton,
} from "@/components/experience/product-card";
import {
  price,
  ProductPhoto,
  Rating,
  SectionHeading,
} from "@/components/experience/shared";
export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.slug }));
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductByIdOrSlug(id);
  if (!product) notFound();
  const evidence = getProductEvidence(product.id);
  const similar = getSimilarProductsService(product.id, 4);
  return (
    <div className="wrap page-section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/search">Discover</Link>
        <ChevronRight size={11} />
        <Link
          href={`/search?category=${product.categoryId === "beauty" ? "Beauty" : product.categoryId === "fashion" ? "Fashion" : "Food"}`}
        >
          {product.category}
        </Link>
        <ChevronRight size={11} />
        <span>{product.productType}</span>
      </nav>
      <section className="product-hero">
        <div className="product-detail-photo">
          <ProductPhoto product={product} priority />
          <span className="photo-caption">
            Illustrative product photography
          </span>
        </div>
        <div className="product-story">
          <p className="eyebrow">
            {product.brandName} · {product.productType}
          </p>
          <h1>{product.canonicalName}</h1>
          <p className="description">{product.description}</p>
          <div className="product-rating-panel">
            <div>
              <Rating band={product.rating.band} />
              <span className="confidence-label">
                <ShieldCheck size={14} />
                {product.rating.confidence} evidence confidence
              </span>
            </div>
            <p>{product.rating.explanation}</p>
            <a href="#evidence">
              See what’s behind this rating <ArrowDown size={12} />
            </a>
          </div>
          <div className="detail-actions">
            <SaveButton product={product} label />
            <CompareButton product={product} />
          </div>
          <section className="stores" aria-label="Retailer destinations">
            <div className="stores-title">
              <h2>Find it at your kind of store.</h2>
              <span>Example prices</span>
            </div>
            {product.listings.map((listing) => {
              const unavailable =
                new URL(listing.url).hostname === "example.com";
              return (
                <div className="store-row" key={listing.id}>
                  <div>
                    <strong>
                      {listing.platform === "Brand Site"
                        ? `${product.brandName} website`
                        : listing.platform}
                    </strong>
                    <small>{price(listing.price)} · illustrative listing</small>
                  </div>
                  {unavailable ? (
                    <span className="store-unavailable">
                      Brand link unavailable in preview
                    </span>
                  ) : (
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${listing.platform} homepage, opens in a new tab`}
                    >
                      Visit {listing.platform}
                      <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              );
            })}
            <p className="retailer-note">
              You’ll continue to the original store in a new tab. This preview
              links to retailer homepages; product availability and current
              prices are not verified. Payment, delivery and returns are handled
              by the retailer.
            </p>
          </section>
        </div>
      </section>
      <section className="evidence-section" id="evidence">
        <div className="evidence-title">
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>
              THE STORY BEHIND THE SCORE
            </p>
            <h2>A closer look, in the open.</h2>
          </div>
          <p>
            Illustrative assessment
            <br />
            Data snapshot:{" "}
            {new Date(product.rating.updatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>
        </div>
        <div className="evidence-layout">
          <div>
            {product.rating.perDimension.map((d) => (
              <details className="dimension" key={d.key}>
                <summary>
                  <span>{d.label}</span>
                  <span className="dimension-state">
                    {d.status === "positive"
                      ? "Positive evidence"
                      : d.status === "mixed"
                        ? "Mixed evidence"
                        : d.status === "missing"
                          ? "Evidence missing"
                          : "Concerns noted"}
                    <ChevronDown size={14} />
                  </span>
                </summary>
                <p>{d.description}</p>
                <p>
                  <strong>{d.confidence} confidence</strong> ·{" "}
                  {d.evidenceItemIds.length} illustrative evidence{" "}
                  {d.evidenceItemIds.length === 1 ? "record" : "records"}
                </p>
                {d.missingData.length > 0 && (
                  <ul>
                    {d.missingData.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                )}
              </details>
            ))}
            <div className="factors-grid">
              <div>
                <h3>About this product</h3>
                <ul>
                  {product.productFactors.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Brand & company context</h3>
                <ul>
                  {product.brandFactors.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <aside className="evidence-side">
            <h3>Confidence matters.</h3>
            <p>
              A sustainability rating describes the assessment. Confidence
              describes how well the available evidence supports it. They tell
              different parts of the story.
            </p>
            <div className="gap-card">
              <h3>
                <CircleHelp size={16} />
                What we still don’t know
              </h3>
              {product.rating.missingData.length ? (
                <ul>
                  {product.rating.missingData.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  No additional gaps are listed in this illustrative assessment.
                  That does not mean the full supply chain has been
                  independently verified.
                </p>
              )}
            </div>
            <Link
              className="text-link"
              href="/about#ratings"
              style={{ marginTop: 22, fontSize: 10 }}
            >
              Understand our approach
              <ArrowUpRight size={13} />
            </Link>
          </aside>
        </div>
        <div className="sources">
          <h3>Follow the evidence.</h3>
          <p className="soft-note" style={{ marginBottom: 20 }}>
            These records demonstrate how sources will be presented. They are
            not verified findings about real products. Source links may point to
            general reference websites.
          </p>
          {evidence.map((item) => (
            <div className="source-row" key={item.id}>
              <span className="evidence-tier">Tier {item.evidenceTier}</span>
              <div>
                <h4>{item.claim}</h4>
                <p>{item.summary}</p>
                <p>
                  {item.sourceName} · {item.sourceDate} · {item.confidence}{" "}
                  confidence · {item.verificationStatus.replaceAll("_", " ")}
                </p>
              </div>
              {!item.sourceUrl.includes("example.com") ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source website
                  <ArrowUpRight size={13} />
                </a>
              ) : (
                <span className="small-label">Illustrative source</span>
              )}
            </div>
          ))}
        </div>
      </section>
      {similar.length > 0 && (
        <section style={{ marginTop: 50 }}>
          <SectionHeading
            eyebrow="KEEP YOUR OPTIONS OPEN"
            title="Another way to choose."
            href={`/search?category=${product.categoryId === "beauty" ? "Beauty" : product.categoryId === "fashion" ? "Fashion" : "Food"}`}
            link="Keep exploring"
          />
          <div className="product-grid">
            {similar.map((p) => (
              <EditorialProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
