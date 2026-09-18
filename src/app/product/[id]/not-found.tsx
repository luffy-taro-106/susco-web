import { EmptyState } from "@/components/experience/shared";
export default function ProductNotFound() {
  return (
    <div className="wrap page-section">
      <EmptyState
        title="This product isn’t in our collection yet."
        description="Try another discovery from our preview catalog, or search for a category you’re curious about."
      />
    </div>
  );
}
