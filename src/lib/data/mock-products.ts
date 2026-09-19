import { assembleProductRating } from "@/lib/scoring/score-assembler";
import {
  assembleSustainabilityMetrics,
  calculateOverallScore,
  type SustainabilityMetricScores,
} from "@/lib/scoring/metric-framework";
import { getEvidenceForProduct } from "@/lib/data/mock-evidence";
import type { CommercePlatform, PlatformListing } from "@/lib/types/commerce";
import type { Product } from "@/lib/types/product";
import type {
  ConfidenceLevel,
  RatingDimension,
  RatingDimensionKey,
  ReasonCode,
  SustainabilityBand,
} from "@/lib/types/scoring";

const updatedAt = "2026-06-02";

const productMetricScores: Record<string, SustainabilityMetricScores> = {
  "auraa-daily-sun-fluid": {
    materials_ingredients: 78,
    packaging_circularity: 46,
    sourcing_people: 55,
    claims_certifications: 61,
    evidence_transparency: 80,
  },
  "meadow-skin-gel-cleanser": {
    materials_ingredients: 74,
    packaging_circularity: 42,
    sourcing_people: 48,
    claims_certifications: 50,
    evidence_transparency: 91,
  },
  "root-ritual-refill-shampoo": {
    materials_ingredients: 78,
    packaging_circularity: 86,
    sourcing_people: 72,
    claims_certifications: 88,
    evidence_transparency: 86,
  },
  "loopkind-barrier-moisturizer": {
    materials_ingredients: 55,
    packaging_circularity: 38,
    sourcing_people: 34,
    claims_certifications: 35,
    evidence_transparency: 48,
  },
  "civic-denim-recycled-jeans": {
    materials_ingredients: 78,
    packaging_circularity: 72,
    sourcing_people: 70,
    claims_certifications: 66,
    evidence_transparency: 94,
  },
  "threadlane-organic-tee": {
    materials_ingredients: 92,
    packaging_circularity: 82,
    sourcing_people: 86,
    claims_certifications: 96,
    evidence_transparency: 94,
  },
  "stridefield-everyday-sneaker": {
    materials_ingredients: 42,
    packaging_circularity: 32,
    sourcing_people: 31,
    claims_certifications: 37,
    evidence_transparency: 53,
  },
  "reknit-compressive-leggings": {
    materials_ingredients: 70,
    packaging_circularity: 84,
    sourcing_people: 73,
    claims_certifications: 76,
    evidence_transparency: 92,
  },
  "origin-cup-shade-grown-coffee": {
    materials_ingredients: 88,
    packaging_circularity: 62,
    sourcing_people: 72,
    claims_certifications: 78,
    evidence_transparency: 85,
  },
  "harvest-bar-nut-protein": {
    materials_ingredients: 58,
    packaging_circularity: 28,
    sourcing_people: 44,
    claims_certifications: 38,
    evidence_transparency: 52,
  },
  "nimbo-sparkling-lemon-drink": {
    materials_ingredients: 65,
    packaging_circularity: 56,
    sourcing_people: 45,
    claims_certifications: 43,
    evidence_transparency: 51,
  },
  "better-bites-millet-snack": {
    materials_ingredients: 90,
    packaging_circularity: 72,
    sourcing_people: 88,
    claims_certifications: 94,
    evidence_transparency: 96,
  },
};

type ListingSeed = {
  platform: CommercePlatform;
  price: number;
  url: string;
  availability?: PlatformListing["availability"];
  seller?: string;
};

type RatingDimensionSeed = {
  key: RatingDimensionKey;
  status: RatingDimension["status"];
  score?: number;
  confidence: ConfidenceLevel;
  missingData?: string[];
};

type ProductSeed = {
  id: string;
  canonicalName: string;
  brandName: string;
  categoryId: Product["categoryId"];
  category: string;
  subcategory: string;
  productType: string;
  imageUrl: string;
  description: string;
  ingredientsOrMaterials?: string;
  claimTags: string[];
  listings: ListingSeed[];
  band: SustainabilityBand;
  confidence: ConfidenceLevel;
  numericScore?: number;
  explanation: string;
  shortReason: string;
  reasonCodes: ReasonCode[];
  missingData: string[];
  dimensions: RatingDimensionSeed[];
  productFactors: string[];
  brandFactors: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function listing(productId: string, productName: string, seed: ListingSeed): PlatformListing {
  return {
    id: `${productId}-${slugify(seed.platform)}`,
    productId,
    platform: seed.platform,
    platformProductId: `${slugify(seed.platform)}-${productId}`,
    title: productName,
    price: seed.price,
    currency: "INR",
    url: seed.url,
    availability: seed.availability ?? "In Stock",
    seller: seed.seller,
    lastSeenAt: updatedAt,
  };
}

function makeProduct(seed: ProductSeed): Product {
  const evidence = getEvidenceForProduct(seed.id);
  const metrics = assembleSustainabilityMetrics(productMetricScores[seed.id]);
  const numericScore = calculateOverallScore(metrics);

  if (seed.numericScore !== undefined && seed.numericScore !== numericScore) {
    throw new Error(`Metric score mismatch for ${seed.id}`);
  }

  return {
    id: seed.id,
    canonicalName: seed.canonicalName,
    slug: seed.id,
    brandId: slugify(seed.brandName),
    brandName: seed.brandName,
    categoryId: seed.categoryId,
    category: seed.category,
    subcategory: seed.subcategory,
    productType: seed.productType,
    imageUrls: [seed.imageUrl],
    description: seed.description,
    ingredientsOrMaterials: seed.ingredientsOrMaterials,
    claimTags: seed.claimTags,
    listings: seed.listings.map((item) =>
      listing(seed.id, seed.canonicalName, item)
    ),
    rating: assembleProductRating({
      id: `${seed.id}-rating-v01`,
      entityId: seed.id,
      band: seed.band,
      confidence: seed.confidence,
      numericScore,
      metrics,
      dimensions: seed.dimensions.map((dimension) => ({
        ...dimension,
        evidenceItemIds: evidence
          .filter((item) => item.dimension === dimension.key)
          .map((item) => item.id),
      })),
      explanation: seed.explanation,
      shortReason: seed.shortReason,
      reasonCodes: seed.reasonCodes,
      missingData: seed.missingData,
      evidence,
      updatedAt,
    }),
    productFactors: seed.productFactors,
    brandFactors: seed.brandFactors,
    createdAt: "2026-05-28",
    updatedAt,
  };
}

export const mockProducts: Product[] = [
  makeProduct({
    id: "auraa-daily-sun-fluid",
    canonicalName: "Daily Sun Fluid SPF 50",
    brandName: "Auraa Lab",
    categoryId: "beauty",
    category: "Beauty / Personal Care",
    subcategory: "Sun care",
    productType: "Sunscreen",
    imageUrl:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    description:
      "Lightweight daily sunscreen with visible ingredient disclosure and multi-platform availability.",
    ingredientsOrMaterials: "Aqua, UV filters, humectants, emollients",
    claimTags: ["spf", "ingredient list", "daily use", "tube packaging"],
    listings: [
      { platform: "Nykaa", price: 549, url: "https://www.nykaa.com/" },
      { platform: "Amazon", price: 529, url: "https://www.amazon.in/" },
    ],
    band: "Moderate",
    confidence: "Medium",
    numericScore: 64,
    explanation:
      "Ingredients are visible and basic product information is accessible, but packaging proof and third-party environmental evidence are not yet linked.",
    shortReason:
      "Ingredient transparency is useful; packaging and certification evidence are still limited.",
    reasonCodes: [
      "PRODUCT_DISCLOSURE_FOUND",
      "PACKAGING_EVIDENCE_LIMITED",
      "MISSING_DATA_CAP_APPLIED",
    ],
    missingData: [
      "Packaging recyclability proof",
      "Product-level environmental certification",
      "Manufacturing or supplier disclosure",
    ],
    dimensions: [
      { key: "ingredient_transparency", status: "positive", score: 78, confidence: "Medium" },
      { key: "packaging", status: "mixed", score: 46, confidence: "Low" },
      { key: "certifications", status: "missing", confidence: "Low", missingData: ["Certification not linked"] },
      { key: "brand_context", status: "mixed", score: 55, confidence: "Medium" },
    ],
    productFactors: [
      "Full ingredient list is visible before purchase",
      "Tube and carton packaging are identified but not independently verified",
      "No product-level environmental certification in seed data",
    ],
    brandFactors: [
      "Brand-level product disclosure is accessible",
      "Company-level sustainability reporting needs deeper verification",
    ],
  }),
  makeProduct({
    id: "meadow-skin-gel-cleanser",
    canonicalName: "Calm Gel Face Wash",
    brandName: "Meadow Skin",
    categoryId: "beauty",
    category: "Beauty / Personal Care",
    subcategory: "Cleansers",
    productType: "Face wash",
    imageUrl:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1200&auto=format&fit=crop",
    description:
      "Gentle gel cleanser with disclosed ingredients and unverified vegan-positioned copy.",
    ingredientsOrMaterials: "Surfactant blend, glycerin, botanical extract",
    claimTags: ["vegan claim", "low fragrance", "gel cleanser"],
    listings: [
      { platform: "Amazon", price: 425, url: "https://www.amazon.in/" },
      { platform: "Brand Site", price: 450, url: "https://example.com/meadow-skin" },
    ],
    band: "Moderate",
    confidence: "Medium",
    numericScore: 61,
    explanation:
      "The cleanser has decent ingredient transparency, but vegan and packaging claims need stronger provenance before confidence can move higher.",
    shortReason:
      "Ingredient disclosure is visible, while claim verification and packaging evidence remain thin.",
    reasonCodes: [
      "PRODUCT_DISCLOSURE_FOUND",
      "CLAIMS_UNVERIFIED",
      "PACKAGING_EVIDENCE_LIMITED",
    ],
    missingData: [
      "Independent vegan or cruelty-free registry match",
      "Packaging material and recycling documentation",
      "Supplier/manufacturing disclosure",
    ],
    dimensions: [
      { key: "ingredient_transparency", status: "positive", score: 74, confidence: "Medium" },
      { key: "vegan", status: "mixed", score: 48, confidence: "Low" },
      { key: "packaging", status: "missing", confidence: "Low", missingData: ["Packaging evidence missing"] },
      { key: "claim_credibility", status: "mixed", score: 50, confidence: "Low" },
    ],
    productFactors: [
      "Ingredient list is available",
      "Vegan-positioned claim is not independently matched in seed data",
      "Packaging evidence is incomplete",
    ],
    brandFactors: [
      "Brand copy is transparent on use-case and ingredients",
      "Formal sustainability disclosure not present in mock corpus",
    ],
  }),
  makeProduct({
    id: "root-ritual-refill-shampoo",
    canonicalName: "Refill Daily Shampoo",
    brandName: "Root & Ritual",
    categoryId: "beauty",
    category: "Beauty / Personal Care",
    subcategory: "Hair care",
    productType: "Shampoo",
    imageUrl:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
    description:
      "Daily shampoo with a refill SKU and a sample certification match in the evidence registry.",
    ingredientsOrMaterials: "Mild surfactants, conditioning agent, fragrance",
    claimTags: ["refill", "cruelty-free registry", "hair care"],
    listings: [
      { platform: "Nykaa", price: 699, url: "https://www.nykaa.com/" },
      { platform: "Brand Site", price: 675, url: "https://example.com/root-ritual" },
    ],
    band: "Strong",
    confidence: "High",
    numericScore: 82,
    explanation:
      "Refillability and a stronger certification signal give the product a stronger rating, though supplier and lifecycle details are still not complete.",
    shortReason:
      "Refill availability and stronger certification evidence support a high-confidence Strong rating.",
    reasonCodes: [
      "PRODUCT_DISCLOSURE_FOUND",
      "CERTIFICATION_VERIFIED",
      "BRAND_DISCLOSURE_PRESENT",
    ],
    missingData: [
      "Supplier-level manufacturing details",
      "Packaging lifecycle data",
    ],
    dimensions: [
      { key: "refillability", status: "positive", score: 86, confidence: "Medium" },
      { key: "certifications", status: "positive", score: 88, confidence: "High" },
      { key: "packaging", status: "mixed", score: 68, confidence: "Medium" },
      { key: "brand_context", status: "positive", score: 76, confidence: "Medium" },
    ],
    productFactors: [
      "Refill pouch SKU appears in sample product data",
      "Sample certification registry match exists",
      "Lifecycle and supplier evidence are not complete",
    ],
    brandFactors: [
      "Brand provides product-level refill information",
      "Company disclosure is not yet independently audited in seed data",
    ],
  }),
  makeProduct({
    id: "loopkind-barrier-moisturizer",
    canonicalName: "Barrier Repair Moisturizer",
    brandName: "LoopKind",
    categoryId: "beauty",
    category: "Beauty / Personal Care",
    subcategory: "Moisturizer",
    productType: "Moisturizer",
    imageUrl:
      "https://images.unsplash.com/photo-1629198735660-e39ea93f5c18?q=80&w=1200&auto=format&fit=crop",
    description:
      "Moisturizer with common sustainability-adjacent claims but limited source-linked proof.",
    ingredientsOrMaterials: "Ceramide blend, emollients, humectants",
    claimTags: ["barrier care", "jar packaging", "claims need review"],
    listings: [
      { platform: "Amazon", price: 799, url: "https://www.amazon.in/" },
      { platform: "Flipkart", price: 779, url: "https://www.flipkart.com/" },
    ],
    band: "Weak",
    confidence: "Low",
    numericScore: 42,
    explanation:
      "The product is not penalized for being unproven, but the current evidence corpus has low-tier claim support and major missing packaging data.",
    shortReason:
      "Several claims are visible, but the seed evidence is low-tier and packaging data is missing.",
    reasonCodes: [
      "CLAIMS_UNVERIFIED",
      "LOW_EVIDENCE_TIER",
      "MISSING_DATA_CAP_APPLIED",
    ],
    missingData: [
      "Recyclability or PCR share",
      "Cruelty-free or vegan verification",
      "Brand sustainability policy",
      "Supplier disclosure",
    ],
    dimensions: [
      { key: "packaging", status: "mixed", score: 38, confidence: "Low" },
      { key: "claim_credibility", status: "negative", score: 34, confidence: "Low" },
      { key: "ingredient_transparency", status: "mixed", score: 55, confidence: "Medium" },
      { key: "missing_data", status: "negative", score: 28, confidence: "Low" },
    ],
    productFactors: [
      "Packaging format is visible, but supporting proof is absent",
      "Sustainability-adjacent claims need independent source links",
      "Ingredient disclosure is partial",
    ],
    brandFactors: [
      "Brand context is limited in current corpus",
      "No company-level sustainability source attached",
    ],
  }),
  makeProduct({
    id: "civic-denim-recycled-jeans",
    canonicalName: "Recycled Cotton Straight Jeans",
    brandName: "Civic Denim",
    categoryId: "fashion",
    category: "Fashion",
    subcategory: "Denim",
    productType: "Denim jeans",
    imageUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Straight-fit jeans with recycled cotton material disclosure and repair guidance.",
    ingredientsOrMaterials: "82% cotton, 18% recycled cotton",
    claimTags: ["recycled cotton", "denim", "repair guidance"],
    listings: [
      { platform: "Myntra", price: 3299, url: "https://www.myntra.com/" },
      { platform: "Brand Site", price: 3490, url: "https://example.com/civic-denim" },
    ],
    band: "Strong",
    confidence: "Medium",
    numericScore: 76,
    explanation:
      "Recycled cotton share and repair guidance support a stronger product rating, while supplier and dyeing evidence are still missing.",
    shortReason:
      "Material disclosure and repair guidance are positive; supply-chain evidence still needs depth.",
    reasonCodes: [
      "MATERIALS_PARTIAL",
      "BRAND_DISCLOSURE_PRESENT",
      "SUPPLY_CHAIN_MISSING",
    ],
    missingData: [
      "Factory or supplier list",
      "Dyeing/water process evidence",
      "Labor audit source",
    ],
    dimensions: [
      { key: "materials", status: "positive", score: 78, confidence: "Medium" },
      { key: "repairability", status: "positive", score: 72, confidence: "Medium" },
      { key: "labor_transparency", status: "missing", confidence: "Low", missingData: ["Factory data missing"] },
      { key: "brand_context", status: "mixed", score: 66, confidence: "Medium" },
    ],
    productFactors: [
      "Material composition includes recycled cotton share",
      "Care and repair guidance is visible",
      "No dyeing or water impact evidence attached yet",
    ],
    brandFactors: [
      "Brand disclosure includes repair positioning",
      "Supplier-level labor evidence remains absent",
    ],
  }),
  makeProduct({
    id: "threadlane-organic-tee",
    canonicalName: "Organic Cotton Boxy T-Shirt",
    brandName: "Threadlane",
    categoryId: "fashion",
    category: "Fashion",
    subcategory: "Tops",
    productType: "Cotton T-shirt",
    imageUrl:
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1200&auto=format&fit=crop",
    description:
      "Everyday T-shirt with organic cotton registry evidence and material transparency.",
    ingredientsOrMaterials: "100% organic cotton",
    claimTags: ["organic cotton", "registry match", "basics"],
    listings: [
      { platform: "Myntra", price: 1499, url: "https://www.myntra.com/" },
      { platform: "Flipkart", price: 1399, url: "https://www.flipkart.com/" },
    ],
    band: "Excellent",
    confidence: "High",
    numericScore: 90,
    explanation:
      "The seed corpus includes high-tier certification evidence and clear material composition, with only operational details still pending.",
    shortReason:
      "High-tier material certification and clear composition make this one of the strongest seed products.",
    reasonCodes: [
      "CERTIFICATION_VERIFIED",
      "PRODUCT_DISCLOSURE_FOUND",
      "BRAND_DISCLOSURE_PRESENT",
    ],
    missingData: [
      "Factory-level audit attachment",
      "Packaging weight",
    ],
    dimensions: [
      { key: "materials", status: "positive", score: 92, confidence: "High" },
      { key: "certifications", status: "positive", score: 96, confidence: "High" },
      { key: "labor_transparency", status: "mixed", score: 66, confidence: "Medium" },
      { key: "packaging", status: "mixed", score: 62, confidence: "Medium" },
    ],
    productFactors: [
      "Organic cotton certification appears in sample registry",
      "Material composition is clear",
      "Factory-level evidence still pending",
    ],
    brandFactors: [
      "Brand disclosure supports material claim",
      "Operational reporting is incomplete but not absent",
    ],
  }),
  makeProduct({
    id: "stridefield-everyday-sneaker",
    canonicalName: "Everyday Recycled Upper Sneaker",
    brandName: "Stridefield",
    categoryId: "fashion",
    category: "Fashion",
    subcategory: "Footwear",
    productType: "Sneakers",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    description:
      "Sneaker with recycled-upper copy but no audited recycled percentage or repair pathway in current evidence.",
    ingredientsOrMaterials: "Synthetic upper, rubber outsole",
    claimTags: ["sneakers", "recycled upper claim", "repair missing"],
    listings: [
      { platform: "Myntra", price: 4999, url: "https://www.myntra.com/" },
      { platform: "Amazon", price: 4699, url: "https://www.amazon.in/" },
    ],
    band: "Weak",
    confidence: "Low",
    numericScore: 39,
    explanation:
      "A recycled material claim appears, but the current evidence is low-tier and repairability, take-back, and supplier data are missing.",
    shortReason:
      "Recycled-upper copy exists, but audited material, repair, and take-back evidence are missing.",
    reasonCodes: [
      "CLAIMS_UNVERIFIED",
      "LOW_EVIDENCE_TIER",
      "SUPPLY_CHAIN_MISSING",
    ],
    missingData: [
      "Audited recycled content percentage",
      "Repair or take-back pathway",
      "Factory/supplier list",
      "Durability testing",
    ],
    dimensions: [
      { key: "materials", status: "mixed", score: 42, confidence: "Low" },
      { key: "repairability", status: "missing", confidence: "Low", missingData: ["No repair path found"] },
      { key: "circularity", status: "missing", confidence: "Low" },
      { key: "labor_transparency", status: "missing", confidence: "Low" },
    ],
    productFactors: [
      "Recycled-upper claim is not audited in seed data",
      "No repair or take-back route found",
      "Durability evidence is missing",
    ],
    brandFactors: [
      "Brand-level disclosures are sparse",
      "Supplier and labor transparency not mapped yet",
    ],
  }),
  makeProduct({
    id: "reknit-compressive-leggings",
    canonicalName: "Compressive ReKnit Leggings",
    brandName: "ReKnit Studio",
    categoryId: "fashion",
    category: "Fashion",
    subcategory: "Activewear",
    productType: "Activewear",
    imageUrl:
      "https://images.unsplash.com/photo-1506629905607-d405b7a30db9?q=80&w=1200&auto=format&fit=crop",
    description:
      "Activewear leggings with take-back program evidence and partial company disclosure.",
    ingredientsOrMaterials: "Recycled nylon blend, elastane",
    claimTags: ["activewear", "take-back", "recycled nylon"],
    listings: [
      { platform: "Brand Site", price: 4290, url: "https://example.com/reknit" },
      { platform: "Myntra", price: 4499, url: "https://www.myntra.com/" },
    ],
    band: "Strong",
    confidence: "Medium",
    numericScore: 79,
    explanation:
      "Circularity evidence and company disclosure are promising, but audited supplier and recycled-content documentation are incomplete.",
    shortReason:
      "Take-back evidence and company disclosure support the score; audited material proof is still pending.",
    reasonCodes: [
      "BRAND_DISCLOSURE_PRESENT",
      "MATERIALS_PARTIAL",
      "SUPPLY_CHAIN_MISSING",
    ],
    missingData: [
      "Audited recycled nylon percentage",
      "Supplier-level labor evidence",
      "Packaging footprint",
    ],
    dimensions: [
      { key: "circularity", status: "positive", score: 84, confidence: "Medium" },
      { key: "materials", status: "mixed", score: 70, confidence: "Medium" },
      { key: "brand_context", status: "positive", score: 76, confidence: "Medium" },
      { key: "labor_transparency", status: "mixed", score: 58, confidence: "Low" },
    ],
    productFactors: [
      "Take-back program appears in product evidence",
      "Recycled nylon claim needs audited percentage",
      "Packaging footprint not available",
    ],
    brandFactors: [
      "Company disclosure includes sourcing principles",
      "Supplier transparency is partial",
    ],
  }),
  makeProduct({
    id: "origin-cup-shade-grown-coffee",
    canonicalName: "Shade-Grown Estate Coffee",
    brandName: "Origin Cup",
    categoryId: "food",
    category: "Food / Beverages",
    subcategory: "Coffee",
    productType: "Coffee",
    imageUrl:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1200&auto=format&fit=crop",
    description:
      "Roasted coffee with origin and process notes; packaging material still needs stronger proof.",
    ingredientsOrMaterials: "Arabica coffee beans",
    claimTags: ["coffee", "origin disclosed", "shade-grown claim"],
    listings: [
      { platform: "Brand Site", price: 520, url: "https://example.com/origin-cup" },
      { platform: "Amazon", price: 549, url: "https://www.amazon.in/" },
    ],
    band: "Strong",
    confidence: "Medium",
    numericScore: 77,
    explanation:
      "Farm-origin visibility improves the sourcing score, while packaging barrier material and certification details remain unresolved.",
    shortReason:
      "Good sourcing transparency; packaging and independent certification still need more evidence.",
    reasonCodes: [
      "PRODUCT_DISCLOSURE_FOUND",
      "PACKAGING_EVIDENCE_LIMITED",
      "MISSING_DATA_CAP_APPLIED",
    ],
    missingData: [
      "Packaging material and recycling route",
      "Independent sourcing certification",
      "Company-level sustainability report",
    ],
    dimensions: [
      { key: "sourcing", status: "positive", score: 84, confidence: "Medium" },
      { key: "packaging", status: "mixed", score: 48, confidence: "Low" },
      { key: "certifications", status: "missing", confidence: "Low" },
      { key: "brand_context", status: "mixed", score: 62, confidence: "Medium" },
    ],
    productFactors: [
      "Origin and process notes are visible",
      "Packaging details are incomplete",
      "Certification status requires verification",
    ],
    brandFactors: [
      "Brand positioning emphasizes sourcing transparency",
      "Company-level reporting is not attached",
    ],
  }),
  makeProduct({
    id: "harvest-bar-nut-protein",
    canonicalName: "Nut & Seed Protein Bar",
    brandName: "Harvest Bar",
    categoryId: "food",
    category: "Food / Beverages",
    subcategory: "Protein bars",
    productType: "Protein bar",
    imageUrl:
      "https://images.unsplash.com/photo-1622484211777-65be1efb706c?q=80&w=1200&auto=format&fit=crop",
    description:
      "Single-serve protein bar with partial ingredient disclosure and weak packaging evidence.",
    ingredientsOrMaterials: "Nuts, seeds, dates, plant protein blend",
    claimTags: ["protein bar", "single-serve wrapper", "ingredient origin partial"],
    listings: [
      { platform: "Amazon", price: 89, url: "https://www.amazon.in/" },
      { platform: "Flipkart", price: 95, url: "https://www.flipkart.com/" },
    ],
    band: "Weak",
    confidence: "Low",
    numericScore: 44,
    explanation:
      "Ingredient information is available at a basic level, but sourcing depth and single-serve packaging documentation are missing.",
    shortReason:
      "Basic ingredient disclosure exists; sourcing and wrapper evidence are weak.",
    reasonCodes: [
      "PRODUCT_DISCLOSURE_FOUND",
      "PACKAGING_EVIDENCE_LIMITED",
      "LOW_EVIDENCE_TIER",
    ],
    missingData: [
      "Supplier or origin details",
      "Certification evidence",
      "Wrapper material and recovery pathway",
      "Company-level sourcing policy",
    ],
    dimensions: [
      { key: "sourcing", status: "mixed", score: 44, confidence: "Low" },
      { key: "packaging", status: "negative", score: 28, confidence: "Low" },
      { key: "certifications", status: "missing", confidence: "Low" },
      { key: "brand_context", status: "missing", confidence: "Low" },
    ],
    productFactors: [
      "Ingredients are listed at a high level",
      "Single-serve wrapper has no material proof",
      "Origin and supplier data are missing",
    ],
    brandFactors: [
      "Brand context is sparse in current evidence corpus",
      "Company-level sourcing policy not attached",
    ],
  }),
  makeProduct({
    id: "nimbo-sparkling-lemon-drink",
    canonicalName: "Sparkling Lemon Drink",
    brandName: "Nimbo Drinks",
    categoryId: "food",
    category: "Food / Beverages",
    subcategory: "Packaged drinks",
    productType: "Packaged drink",
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1200&auto=format&fit=crop",
    description:
      "Canned sparkling drink with visible packaging format but little ingredient sourcing evidence.",
    ingredientsOrMaterials: "Carbonated water, lemon flavor, sweetener",
    claimTags: ["canned drink", "aluminium can", "sourcing missing"],
    listings: [
      { platform: "Amazon", price: 120, url: "https://www.amazon.in/" },
      { platform: "Brand Site", price: 115, url: "https://example.com/nimbo" },
    ],
    band: "Moderate",
    confidence: "Low",
    numericScore: 52,
    explanation:
      "A can format is visible and may be recoverable in some systems, but sourcing and regional recycling evidence are thin.",
    shortReason:
      "Packaging format is visible; fruit sourcing and recovery evidence are incomplete.",
    reasonCodes: [
      "PACKAGING_EVIDENCE_LIMITED",
      "SUPPLY_CHAIN_MISSING",
      "MISSING_DATA_CAP_APPLIED",
    ],
    missingData: [
      "Fruit sourcing origin",
      "Regional recycling/recovery evidence",
      "Company sustainability disclosure",
    ],
    dimensions: [
      { key: "packaging", status: "mixed", score: 56, confidence: "Low" },
      { key: "sourcing", status: "missing", confidence: "Low" },
      { key: "brand_context", status: "missing", confidence: "Low" },
      { key: "missing_data", status: "negative", score: 34, confidence: "Low" },
    ],
    productFactors: [
      "Aluminium can format is visible",
      "Fruit sourcing is not documented",
      "Recovery evidence is regional and missing in seed data",
    ],
    brandFactors: [
      "Company context has not been mapped",
      "No disclosure source attached",
    ],
  }),
  makeProduct({
    id: "better-bites-millet-snack",
    canonicalName: "Millet Crunch Snack",
    brandName: "Better Bites",
    categoryId: "food",
    category: "Food / Beverages",
    subcategory: "Snacks",
    productType: "Snack",
    imageUrl:
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1200&auto=format&fit=crop",
    description:
      "Millet-based snack with a sample ingredient certification and company sourcing disclosure.",
    ingredientsOrMaterials: "Millet, spices, oil, salt",
    claimTags: ["millet", "certification registry", "snack"],
    listings: [
      { platform: "Flipkart", price: 145, url: "https://www.flipkart.com/" },
      { platform: "Amazon", price: 149, url: "https://www.amazon.in/" },
      { platform: "ONDC", price: 139, url: "https://ondc.org/" },
    ],
    band: "Excellent",
    confidence: "High",
    numericScore: 88,
    explanation:
      "The product has high-tier ingredient certification evidence and company sourcing disclosure, with packaging details still the main gap.",
    shortReason:
      "High-tier ingredient evidence and sourcing disclosure support an Excellent seed rating.",
    reasonCodes: [
      "CERTIFICATION_VERIFIED",
      "BRAND_DISCLOSURE_PRESENT",
      "PRODUCT_DISCLOSURE_FOUND",
    ],
    missingData: [
      "Detailed packaging material composition",
      "Supplier names behind disclosed sourcing principles",
    ],
    dimensions: [
      { key: "sourcing", status: "positive", score: 88, confidence: "High" },
      { key: "certifications", status: "positive", score: 94, confidence: "High" },
      { key: "brand_context", status: "positive", score: 82, confidence: "Medium" },
      { key: "packaging", status: "mixed", score: 62, confidence: "Medium" },
    ],
    productFactors: [
      "Ingredient certification appears in sample registry",
      "Sourcing principles are disclosed",
      "Packaging material composition still needs detail",
    ],
    brandFactors: [
      "Company disclosure is available in seed data",
      "Supplier names are not yet included",
    ],
  }),
];

export function getProductByIdOrSlug(idOrSlug: string) {
  return mockProducts.find(
    (product) => product.id === idOrSlug || product.slug === idOrSlug
  );
}
