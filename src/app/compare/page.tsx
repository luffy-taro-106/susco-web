import { CompareExperience } from "@/components/experience/compare";
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  return (
    <CompareExperience initialIds={ids?.split(",").filter(Boolean) ?? []} />
  );
}
