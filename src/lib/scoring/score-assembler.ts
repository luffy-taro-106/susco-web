import { dimensionLabels } from "@/lib/scoring/dimensions";
import type { EvidenceItem } from "@/lib/types/evidence";
import type {
  ConfidenceLevel,
  RatingDimension,
  RatingDimensionKey,
  ReasonCode,
  SustainabilityBand,
  SustainabilityMetric,
  SustainabilityRating,
} from "@/lib/types/scoring";

type AssembleScoreInput = {
  id: string;
  entityId: string;
  band: SustainabilityBand;
  confidence: ConfidenceLevel;
  numericScore?: number;
  metrics: SustainabilityMetric[];
  dimensions: Array<{
    key: RatingDimensionKey;
    status: RatingDimension["status"];
    score?: number;
    confidence: ConfidenceLevel;
    evidenceItemIds?: string[];
    missingData?: string[];
    description?: string;
  }>;
  explanation: string;
  shortReason: string;
  reasonCodes: ReasonCode[];
  missingData: string[];
  evidence: EvidenceItem[];
  updatedAt: string;
};

export function assembleProductRating(
  input: AssembleScoreInput
): SustainabilityRating {
  return {
    id: input.id,
    entityType: "product",
    entityId: input.entityId,
    ratingVersion: "susco-v0.1-category-seed",
    band: input.band,
    numericScore: input.numericScore,
    metrics: input.metrics,
    confidence: input.confidence,
    perDimension: input.dimensions.map((dimension) => ({
      key: dimension.key,
      label: dimensionLabels[dimension.key],
      description:
        dimension.description ??
        `${dimensionLabels[dimension.key]} is scored from source-linked evidence and explicit missing data.`,
      status: dimension.status,
      score: dimension.score,
      confidence: dimension.confidence,
      evidenceItemIds: dimension.evidenceItemIds ?? [],
      missingData: dimension.missingData ?? [],
    })),
    explanation: input.explanation,
    shortReason: input.shortReason,
    reasonCodes: input.reasonCodes,
    missingData: input.missingData,
    evidenceItemIds: input.evidence.map((item) => item.id),
    capsApplied:
      input.missingData.length > 0 ? ["Missing data reduces confidence"] : [],
    inputsSnapshotRef: `mock://ratings/${input.id}`,
    updatedAt: input.updatedAt,
  };
}
