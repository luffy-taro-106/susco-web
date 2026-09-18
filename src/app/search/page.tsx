import { DiscoverExperience } from "@/components/experience/discover";
import { searchProductsService } from "@/lib/services/product-service";
import type { ProductSearchFilters } from "@/lib/search/filters";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params[key] = value;
  }
  const amount = (s?: string) =>
    s && Number.isFinite(Number(s)) && Number(s) >= 0 ? Number(s) : undefined;
  const result = searchProductsService({
    query: params.q,
    category: params.category,
    rating: params.rating as ProductSearchFilters["rating"],
    confidence: params.confidence as ProductSearchFilters["confidence"],
    platform: params.platform as ProductSearchFilters["platform"],
    sort: params.sort as ProductSearchFilters["sort"],
    ...(amount(params.maxPrice) !== undefined
      ? { maxPrice: amount(params.maxPrice) }
      : {}),
    ...(amount(params.minPrice) !== undefined
      ? { minPrice: amount(params.minPrice) }
      : {}),
  });
  return <DiscoverExperience products={result.products} params={params} />;
}
