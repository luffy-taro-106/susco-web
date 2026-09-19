export type SustainabilityBand =
  | "Excellent"
  | "Strong"
  | "Moderate"
  | "Weak"
  | "Insufficient Evidence";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type RatingEntityType = "product" | "brand" | "company";

export type SustainabilityMetricKey =
  | "materials_ingredients"
  | "packaging_circularity"
  | "sourcing_people"
  | "claims_certifications"
  | "evidence_transparency";

export type SustainabilityMetric = {
  key: SustainabilityMetricKey;
  label: string;
  shortLabel: string;
  description: string;
  score: number;
  weight: number;
};

export type RatingDimensionStatus =
  | "positive"
  | "mixed"
  | "negative"
  | "missing";

export type RatingDimensionKey =
  | "packaging"
  | "refillability"
  | "cruelty_free"
  | "vegan"
  | "ingredient_transparency"
  | "certifications"
  | "claim_credibility"
  | "brand_context"
  | "materials"
  | "durability"
  | "repairability"
  | "circularity"
  | "labor_transparency"
  | "sourcing"
  | "animal_welfare"
  | "palm_oil_deforestation"
  | "missing_data";

export type ReasonCode =
  | "PRODUCT_DISCLOSURE_FOUND"
  | "CERTIFICATION_VERIFIED"
  | "PACKAGING_EVIDENCE_LIMITED"
  | "MATERIALS_PARTIAL"
  | "SUPPLY_CHAIN_MISSING"
  | "CLAIMS_UNVERIFIED"
  | "BRAND_DISCLOSURE_PRESENT"
  | "COMPANY_CONTEXT_LIMITED"
  | "MISSING_DATA_CAP_APPLIED"
  | "LOW_EVIDENCE_TIER";

export type RatingDimension = {
  key: RatingDimensionKey;
  label: string;
  description: string;
  status: RatingDimensionStatus;
  score?: number;
  confidence: ConfidenceLevel;
  evidenceItemIds: string[];
  missingData: string[];
};

export type SustainabilityRating = {
  id: string;
  entityType: RatingEntityType;
  entityId: string;
  ratingVersion: string;
  band: SustainabilityBand;
  numericScore?: number;
  metrics: SustainabilityMetric[];
  confidence: ConfidenceLevel;
  perDimension: RatingDimension[];
  capsApplied?: string[];
  controversyPenalty?: number;
  explanation: string;
  shortReason: string;
  reasonCodes: ReasonCode[];
  missingData: string[];
  evidenceItemIds: string[];
  inputsSnapshotRef?: string;
  updatedAt: string;
};
