import Link from "next/link";
import { ArrowRight, ArrowUpRight, Fingerprint } from "lucide-react";
import { Rating } from "@/components/experience/shared";
import type { SustainabilityBand } from "@/lib/types/scoring";
import {
  sustainabilityMetricDefinitions,
  sustainabilityMetricOrder,
} from "@/lib/scoring/metric-framework";
const bands: Array<[SustainabilityBand, string]> = [
  ["Excellent", "85–100 · The strongest assessment band within a category."],
  ["Strong", "70–84 · Positive evidence across important category factors."],
  ["Moderate", "50–69 · A mixed picture with meaningful room to improve."],
  ["Weak", "30–49 · Significant concerns within the available assessment."],
  [
    "Insufficient Evidence",
    "Not enough reliable information to form a rating.",
  ],
];
export default function AboutPage() {
  return (
    <div className="wrap page-section">
      <section className="approach-hero">
        <div>
          <p className="eyebrow" style={{ marginBottom: 18 }}>
            OUR APPROACH
          </p>
          <h1>
            Less green talk.
            <br />
            <i>More to go on.</i>
          </h1>
          <p>
            You shouldn’t need a research degree to understand the things you
            buy. SusCo brings the available evidence into one clear picture, so
            you can make a choice that feels right for you.
          </p>
          <Link href="/search" className="text-link" style={{ marginTop: 25 }}>
            Explore a product’s story
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="approach-emblem">
          <Fingerprint size={55} strokeWidth={1} />
          <span>
            Independent.
            <br />
            <i>By design.</i>
          </span>
        </div>
      </section>
      <div className="method-grid">
        {[
          [
            "01 / FIND",
            "Start with your everyday.",
            "Search for the product you already had in mind. Beauty, what you wear, or your morning coffee.",
          ],
          [
            "02 / UNDERSTAND",
            "Look beyond the label.",
            "Read the assessment, follow the sources, and see what remains unknown. Compare alternatives side by side.",
          ],
          [
            "03 / CHOOSE",
            "Make it your choice.",
            "Continue to the original retailer when you’re ready. Save and log your choices at your own pace.",
          ],
        ].map(([n, title, description]) => (
          <div key={n}>
            <p className="eyebrow">{n}</p>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <section className="rating-guide" id="ratings">
        <div>
          <p className="eyebrow" style={{ marginBottom: 15 }}>
            TWO DIFFERENT QUESTIONS
          </p>
          <h2>
            How does it look?
            <br />
            <i>How much do we know?</i>
          </h2>
          <p>
            A rating describes a product’s assessment within its category.
            Evidence confidence describes how well the available information
            supports that assessment. A strong rating with low confidence should
            invite more questions.
          </p>
          <p style={{ marginTop: 20 }}>
            Materials matter for clothing. Ingredients and packaging matter for
            personal care. Sourcing matters for food. Category-specific criteria
            help keep comparisons meaningful.
          </p>
        </div>
        <div>
          {bands.map(([band, description]) => (
            <div className="band-row" key={band}>
              <div>
                <Rating band={band} />
              </div>
              <span>{description}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="metric-methodology" aria-labelledby="metric-method-title">
        <div className="metric-method-intro">
          <p className="eyebrow">THE FIVE-METRIC SCORE</p>
          <h2 id="metric-method-title">
            Five numbers.
            <br />
            <i>One readable score.</i>
          </h2>
          <p>
            Every product receives five 0–100 subscores. Each metric contributes
            20% to the overall score. Criteria are normalized within the product
            category so a shampoo is assessed against relevant shampoo evidence,
            while a T-shirt uses relevant apparel evidence.
          </p>
        </div>
        <div className="metric-method-list">
          {sustainabilityMetricOrder.map((key, index) => {
            const metric = sustainabilityMetricDefinitions[key];
            return (
              <article key={key}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{metric.label}</h3>
                  <p>{metric.description}</p>
                </div>
                <strong>{metric.weight}%</strong>
              </article>
            );
          })}
        </div>
        <div className="method-sources">
          <p>
            The framework is informed by lifecycle, circularity, supply-chain,
            certification, and product-claim guidance. This prototype does not
            claim formal alignment or certification.
          </p>
          <div>
            <a
              href="https://green-forum.ec.europa.eu/green-business/environmental-footprint-methods/pef-method_en"
              target="_blank"
              rel="noopener noreferrer"
            >
              EU Product Environmental Footprint <ArrowUpRight size={13} />
            </a>
            <a
              href="https://www.ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview"
              target="_blank"
              rel="noopener noreferrer"
            >
              Circular economy principles <ArrowUpRight size={13} />
            </a>
            <a
              href="https://www.oecd.org/en/topics/sub-issues/due-diligence-guidance-for-responsible-business-conduct/responsible-garment-and-footwear-supply-chains.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              OECD supply-chain due diligence <ArrowUpRight size={13} />
            </a>
            <a
              href="https://wedocs.unep.org/handle/20.500.11822/22180"
              target="_blank"
              rel="noopener noreferrer"
            >
              UNEP product claims guidance <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>
      <section className="trust-block" style={{ marginTop: 20 }}>
        <div>
          <p className="eyebrow">TRUST IS THE PRODUCT</p>
          <h2>
            The full picture.
            <br />
            <i>Even when it’s incomplete.</i>
          </h2>
        </div>
        <div className="trust-points">
          {[
            [
              "01",
              "Sources you can follow.",
              "Our evidence model records the source, publication date, evidence tier and assessment context.",
            ],
            [
              "02",
              "Room for “we don’t know.”",
              "Missing, outdated or conflicting evidence belongs in the explanation. Missing evidence is not automatically proof of poor performance.",
            ],
            [
              "03",
              "Ratings that can’t be bought.",
              "Brands may submit evidence. They cannot pay for a better rating or ranking.",
            ],
          ].map(([n, title, copy]) => (
            <div className="trust-point" key={n}>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="faq" id="retailers" style={{ marginTop: 65 }}>
        <p className="eyebrow" style={{ marginBottom: 15 }}>
          GOOD QUESTIONS
        </p>
        <h2>A few things worth knowing.</h2>
        {[
          [
            "Do I buy products on SusCo?",
            "You discover and compare here, then follow a clearly named link to Amazon, Myntra, Nykaa, another retailer or the original brand website. The retailer handles checkout, payment, delivery and returns. SusCo has no shopping cart. In this preview, available links open retailer homepages rather than exact product listings.",
          ],
          [
            "Are the ratings and prices live?",
            "This is an interactive design preview with an illustrative 12-product catalog. Brands, ratings, evidence and example prices demonstrate the experience. Live retailer connections, verified product evidence and a validated scoring methodology are not connected yet.",
          ],
          [
            "What does evidence confidence mean?",
            "High, Medium and Low describe the strength and coverage of the information supporting an assessment. Confidence is shown separately from the sustainability band. A source’s age, independence, relevance and remaining gaps all need to be considered.",
          ],
          [
            "Where is my collection saved?",
            "Your saved finds and manually logged choices stay in this browser’s local storage. They are not synced to an account. Clearing browser data removes them. Downloading a story card saves a local image; it does not publish a profile.",
          ],
          [
            "Is visiting a store counted as a purchase?",
            "No. A store visit never counts as a purchase or environmental benefit. If you choose a product, you can manually log it in your collection. You can undo that log any time.",
          ],
          [
            "Do better choices mean buying more?",
            "No. Using what you own, repairing, refilling or deciding not to buy can be considered choices too. This experience helps when you have a decision to make; it does not measure your worth through purchases.",
          ],
        ].map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <p className="soft-note" style={{ marginTop: 35 }}>
        This preview demonstrates the interface and evidence model. It is not a
        certification, environmental guarantee, or endorsement of a retailer.
      </p>
    </div>
  );
}
