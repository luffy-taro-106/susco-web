import type {
  SustainabilityMetric,
  SustainabilityMetricKey,
} from "@/lib/types/scoring";

export const sustainabilityMetricDefinitions: Record<
  SustainabilityMetricKey,
  Omit<SustainabilityMetric, "score">
> = {
  materials_ingredients: {
    key: "materials_ingredients",
    label: "Materials & ingredients",
    shortLabel: "Materials",
    description:
      "Composition disclosure, preferred inputs, ingredient or material impacts, and verified recycled, renewable, or certified content.",
    weight: 20,
  },
  packaging_circularity: {
    key: "packaging_circularity",
    label: "Packaging & circularity",
    shortLabel: "Circularity",
    description:
      "Packaging reduction, refill or reuse, recyclability, durability, repair, and take-back pathways relevant to the category.",
    weight: 20,
  },
  sourcing_people: {
    key: "sourcing_people",
    label: "Sourcing & people",
    shortLabel: "People",
    description:
      "Origin traceability, supplier disclosure, labour and human-rights due diligence, and responsible sourcing evidence.",
    weight: 20,
  },
  claims_certifications: {
    key: "claims_certifications",
    label: "Claims & certifications",
    shortLabel: "Claims",
    description:
      "Specificity and verification of environmental or ethical claims, including credible product-level certifications.",
    weight: 20,
  },
  evidence_transparency: {
    key: "evidence_transparency",
    label: "Evidence & transparency",
    shortLabel: "Evidence",
    description:
      "Source independence, recency, relevance, completeness, and how clearly missing or conflicting information is disclosed.",
    weight: 20,
  },
};

export const sustainabilityMetricOrder = Object.keys(
  sustainabilityMetricDefinitions,
) as SustainabilityMetricKey[];

export type SustainabilityMetricScores = Record<
  SustainabilityMetricKey,
  number
>;

export function assembleSustainabilityMetrics(
  scores: SustainabilityMetricScores,
): SustainabilityMetric[] {
  return sustainabilityMetricOrder.map((key) => ({
    ...sustainabilityMetricDefinitions[key],
    score: Math.max(0, Math.min(100, Math.round(scores[key]))),
  }));
}

export function calculateOverallScore(metrics: SustainabilityMetric[]) {
  const totalWeight = metrics.reduce((total, metric) => total + metric.weight, 0);
  return Math.round(
    metrics.reduce(
      (total, metric) => total + metric.score * metric.weight,
      0,
    ) / totalWeight,
  );
}
