import { EmptyState } from "@/components/experience/shared";
export default function NotFound() {
  return (
    <div className="wrap page-section">
      <EmptyState
        title="This find has wandered off."
        description="We couldn’t find this page in the preview. There are plenty of other stories to explore."
      />
    </div>
  );
}
