"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Download, Sprout } from "lucide-react";
import { toggleChoice, removeChoice } from "@/lib/tracker/tracker-store";
import { getAllProducts } from "@/lib/services/product-service";
import type { Product } from "@/lib/types/product";
import { EditorialProductCard } from "./product-card";
import { EmptyState } from "./shared";
import { notify, persist, useChoices } from "./state";
import type { UserChoiceAction } from "@/lib/types/tracker";
export function CollectionExperience() {
  const choices = useChoices();
  const [tab, setTab] = useState<UserChoiceAction>("saved");
  const products = getAllProducts().filter((p) =>
    choices.some((c) => c.productId === p.id && c.action === tab),
  );
  const bought = choices.filter((c) => c.action === "bought");
  const considered = new Set(choices.map((c) => c.productId)).size;
  function log(product: Product, action: UserChoiceAction) {
    persist(() => {
      const added = toggleChoice(product.id, action, product.rating);
      if (added)
        removeChoice(product.id, action === "bought" ? "avoided" : "bought");
      notify(
        added
          ? action === "bought"
            ? "Logged as chosen — you can undo this anytime."
            : "Logged as passed on — you can undo this anytime."
          : "Choice removed from your log.",
      );
    });
  }
  function download() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><rect width="1080" height="1080" fill="#173f35"/><text x="90" y="145" fill="#dfecab" font-size="56" font-family="sans-serif">susco.</text><text x="90" y="305" fill="#f7f7f0" font-size="63" font-family="Georgia">A little more considered.</text><text x="90" y="455" fill="#dfecab" font-size="110" font-family="Georgia">${considered}</text><text x="90" y="510" fill="#f7f7f0" font-size="30" font-family="sans-serif">products in my story</text><text x="90" y="660" fill="#dfecab" font-size="90" font-family="Georgia">${bought.length}</text><text x="90" y="715" fill="#f7f7f0" font-size="30" font-family="sans-serif">choices I manually logged</text><path d="M90 845h900" stroke="#78917a"/><text x="90" y="920" fill="#f7f7f0" font-size="24" font-family="sans-serif">Personal log · illustrative catalog · no impact claims</text><text x="90" y="977" fill="#b7c9a6" font-size="22" font-family="sans-serif">${new Date().toLocaleDateString("en-IN")}</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-susco-story.svg";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Your personal story card is ready to download.");
  }
  return (
    <div className="wrap page-section">
      <div className="page-intro-row">
        <div className="page-intro">
          <p className="eyebrow">YOUR FINDS. YOUR PACE.</p>
          <h1>A collection that’s all you.</h1>
          <p>
            A home for the things you’re considering, and the choices you’ve
            made. Saved on this browser, just for you.
          </p>
        </div>
        <Link href="/search" className="secondary-button">
          Find something new
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="collection-stats">
        <div>
          <strong>{considered.toString().padStart(2, "0")}</strong>
          <span>Products considered</span>
        </div>
        <div>
          <strong>
            {choices
              .filter((c) => c.action === "saved")
              .length.toString()
              .padStart(2, "0")}
          </strong>
          <span>Saved for later</span>
        </div>
        <div>
          <strong>{bought.length.toString().padStart(2, "0")}</strong>
          <span>Choices manually logged</span>
        </div>
      </div>
      <div
        className="collection-tabs"
        role="tablist"
        aria-label="Collection views"
      >
        {[
          ["saved", "Saved finds"],
          ["bought", "Chose it"],
          ["avoided", "Passed on it"],
        ].map(([value, label]) => (
          <button
            key={value}
            role="tab"
            id={`tab-${value}`}
            aria-controls="collection-products"
            aria-selected={tab === value}
            tabIndex={tab === value ? 0 : -1}
            onKeyDown={(event) => {
              const values: UserChoiceAction[] = ["saved", "bought", "avoided"];
              const index = values.indexOf(tab);
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (index + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : -1;
              if (next < 0) return;
              event.preventDefault();
              setTab(values[next]);
              (
                event.currentTarget.parentElement?.querySelectorAll("button")[
                  next
                ] as HTMLButtonElement | undefined
              )?.focus();
            }}
            onClick={() => setTab(value as UserChoiceAction)}
          >
            {label}{" "}
            <span className="small-label">
              {choices.filter((c) => c.action === value).length}
            </span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="collection-products"
        aria-labelledby={`tab-${tab}`}
      >
        {products.length === 0 ? (
          <EmptyState
            title={
              tab === "saved"
                ? "Your next good find belongs here."
                : tab === "bought"
                  ? "Every considered choice starts somewhere."
                  : "Room for what feels right."
            }
            description={
              tab === "saved"
                ? "Tap the heart on a product to save it. Come back when you’re ready to take a closer look."
                : "Open Saved finds and record a choice to begin your story. These are your personal notes, not purchase confirmations."
            }
          />
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id}>
                <EditorialProductCard product={product} />
                <div className="collection-item-actions">
                  <button
                    aria-pressed={choices.some(
                      (c) =>
                        c.productId === product.id && c.action === "bought",
                    )}
                    onClick={() => log(product, "bought")}
                  >
                    ✓ Chose it
                  </button>
                  <button
                    aria-pressed={choices.some(
                      (c) =>
                        c.productId === product.id && c.action === "avoided",
                    )}
                    onClick={() => log(product, "avoided")}
                  >
                    − Passed on it
                  </button>
                </div>
                <p className="small-label" style={{ marginTop: 8 }}>
                  Manual log · tap again to undo
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <section className="progress-section">
        <div>
          <p className="eyebrow" style={{ marginBottom: 13 }}>
            A STORY, NOT A SCOREBOARD
          </p>
          <h2>Make space for progress.</h2>
          <p>
            Small decisions are worth remembering. Your log keeps the rating
            snapshot from the time you made each choice.
          </p>
          {["beauty", "fashion", "food"].map((category, i) => {
            const count = bought.filter(
              (c) =>
                getAllProducts().find((p) => p.id === c.productId)
                  ?.categoryId === category,
            ).length;
            return (
              <div className="progress-category" key={category}>
                {["Beauty & care", "What you wear", "Food & drink"][i]}
                <span>
                  {count} {count === 1 ? "choice" : "choices"} logged
                </span>
              </div>
            );
          })}
          <p className="small-label" style={{ marginTop: 17 }}>
            A purchase link never automatically counts as a purchase. Only you
            can log a choice.
          </p>
        </div>
        <div className="progress-card">
          <Sprout size={27} />
          <h3>
            Little choices.
            <br />
            <i>A story worth keeping.</i>
          </h3>
          <p>
            {considered === 0
              ? "Your first saved find is the beginning."
              : "Keep a personal snapshot of what you’ve considered and chosen."}
          </p>
          <button className="secondary-button" onClick={download}>
            <Download size={16} />
            Download my story
          </button>
          <p style={{ fontSize: 9, marginTop: 13 }}>
            An image card from your local log. Nothing is published.
          </p>
        </div>
      </section>
    </div>
  );
}
