import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getProfileByUsername, mockProfiles } from "@/lib/data/mock-users";
import { getChoicesForUser } from "@/lib/data/mock-tracker";
import { getProductsByIds } from "@/lib/services/product-service";
import { EditorialProductCard } from "@/components/experience/product-card";
import { SectionHeading } from "@/components/experience/shared";
export function generateStaticParams() {
  return mockProfiles.map((p) => ({ username: p.username }));
}
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();
  const choices = getChoicesForUser(profile.id);
  const products = getProductsByIds(
    Array.from(new Set(choices.map((c) => c.productId))),
  );
  return (
    <div className="wrap page-section">
      <p className="soft-note" style={{ marginBottom: 40 }}>
        Example profile · This is a fictional, seeded demonstration. Your
        collection stays private on your browser.
      </p>
      <div className="profile-intro">
        <div className="profile-avatar">{profile.displayName.slice(0, 1)}</div>
        <p className="eyebrow" style={{ marginBottom: 14 }}>
          A MORE CONSIDERED EVERYDAY
        </p>
        <h1>{profile.displayName}’s story.</h1>
        <p>
          {profile.bio || "Finding a little more meaning in everyday choices."}
        </p>
        <div className="profile-badges">
          <span>Curious by nature</span>
          <span>Small steps, often</span>
        </div>
        <Link href="/tracker" className="text-link">
          Start your own collection
          <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="collection-stats">
        <div>
          <strong>{products.length.toString().padStart(2, "0")}</strong>
          <span>Example products considered</span>
        </div>
        <div>
          <strong>
            {choices
              .filter((c) => c.action === "saved")
              .length.toString()
              .padStart(2, "0")}
          </strong>
          <span>Example saved finds</span>
        </div>
        <div>
          <strong>
            {choices
              .filter((c) => c.action === "bought")
              .length.toString()
              .padStart(2, "0")}
          </strong>
          <span>Example logged choices</span>
        </div>
      </div>
      <SectionHeading
        eyebrow="A FEW EVERYDAY FAVOURITES"
        title="Inside this collection."
      />
      <div className="product-grid">
        {products.map((p) => (
          <EditorialProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
