import { z } from "zod";

/**
 * AgentKitMarket Tier-2 paid/licensed-kit contracts (Market Phase 2).
 *
 * Seam B (market-app ↔ agentkitmarket-infra backend): admin-key authenticated
 * routes for setting kit pricing/license, granting/checking entitlements, and
 * fetching the per-buyer watermarked package.
 *
 * Phase A (this slice): no payment provider. Entitlements are created by
 * admin/free grants or manual testing; Stripe webhooks call the same grant
 * route in Phase B. Core stays payment-provider-agnostic.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const kitPricingSchema = z.enum(["free", "paid"]);
export type KitPricing = z.infer<typeof kitPricingSchema>;

export const priceModelSchema = z.enum(["one_time", "subscription"]);
export type PriceModel = z.infer<typeof priceModelSchema>;

export const priceIntervalSchema = z.enum(["month", "year"]);
export type PriceInterval = z.infer<typeof priceIntervalSchema>;

export const kitCurrencySchema = z.enum(["USD"]);
export type KitCurrency = z.infer<typeof kitCurrencySchema>;

export const licenseTypeSchema = z.enum(["default", "custom"]);
export type LicenseType = z.infer<typeof licenseTypeSchema>;

export const entitlementStatusSchema = z.enum(["active", "revoked", "expired"]);
export type EntitlementStatus = z.infer<typeof entitlementStatusSchema>;

export const entitlementSourceSchema = z.enum(["purchase", "admin_grant", "free"]);
export type EntitlementSource = z.infer<typeof entitlementSourceSchema>;

/** The default platform EULA version id applied when licenseType === 'default'. */
export const DEFAULT_KIT_LICENSE_VERSION = "default-v1" as const;

// ---------------------------------------------------------------------------
// Object schemas
// ---------------------------------------------------------------------------

/** Pricing + license metadata carried on a kit. All optional/defaulted (free-safe). */
export const kitPricingMetadataSchema = z.object({
  pricing: kitPricingSchema.default("free"),
  priceModel: priceModelSchema.optional(),
  priceCents: z.number().int().nonnegative().optional(),
  currency: kitCurrencySchema.default("USD"),
  interval: priceIntervalSchema.optional(),
  /**
   * Optional subscription free-trial length in days. Only meaningful when
   * priceModel === 'subscription'; ignored/zeroed otherwise. Maps to Stripe's
   * subscription `trial_period_days` at checkout.
   */
  trialDays: z.number().int().nonnegative().optional(),
  /** Paid kits default false (online-only); free kits are treated as downloadable. */
  downloadable: z.boolean().optional(),
  licenseType: licenseTypeSchema.default("default"),
  licenseText: z.string().optional(),
  licenseVersion: z.string().optional()
});
export type KitPricingMetadata = z.infer<typeof kitPricingMetadataSchema>;

export const entitlementSchema = z.object({
  entitlementId: z.string().min(1),
  kitId: z.string().min(1),
  userId: z.string().min(1),
  status: entitlementStatusSchema,
  source: entitlementSourceSchema,
  licenseVersion: z.string().min(1),
  licenseAcceptedAt: z.string(),
  licenseTextSnapshot: z.string(),
  grantedAt: z.string(),
  expiresAt: z.string().optional(),
  stripeSubscriptionId: z.string().nullable().optional()
});
export type Entitlement = z.infer<typeof entitlementSchema>;

// ---------------------------------------------------------------------------
// Request schemas
// ---------------------------------------------------------------------------

/**
 * POST /admin/kits/{kitId}/pricing. actorUserId must be the kit owner or an
 * admin/owner of the kit's owning org (role-gated server-side).
 * Validation: paid requires priceCents>0 and priceModel; subscription requires interval.
 */
export const setKitPricingRequestSchema = z.object({
  actorUserId: z.string().min(1),
  pricing: kitPricingSchema,
  priceModel: priceModelSchema.optional(),
  priceCents: z.number().int().nonnegative().optional(),
  currency: kitCurrencySchema.optional(),
  interval: priceIntervalSchema.optional(),
  /** Subscription free-trial length in days; only meaningful for subscription kits. */
  trialDays: z.number().int().nonnegative().optional(),
  downloadable: z.boolean().optional(),
  licenseType: licenseTypeSchema.optional(),
  licenseText: z.string().optional()
});
export type SetKitPricingRequest = z.infer<typeof setKitPricingRequestSchema>;

/** POST /admin/kits/{kitId}/entitlements — grant. Idempotent on (userId,kitId). */
export const grantEntitlementRequestSchema = z.object({
  userId: z.string().min(1),
  source: entitlementSourceSchema,
  licenseVersion: z.string().min(1),
  licenseAcceptedAt: z.string().min(1),
  licenseTextSnapshot: z.string(),
  expiresAt: z.string().optional(),
  stripeSubscriptionId: z.string().nullable().optional()
});
export type GrantEntitlementRequest = z.infer<typeof grantEntitlementRequestSchema>;

/** POST /admin/kits/{kitId}/licensed-package — entitlement-gated watermarked fetch. */
export const licensedPackageRequestSchema = z.object({
  userId: z.string().min(1)
});
export type LicensedPackageRequest = z.infer<typeof licensedPackageRequestSchema>;

/** Response from the licensed-package route: base64 watermarked bytes + metadata. */
export const licensedPackageResponseSchema = z.object({
  kitId: z.string().min(1),
  userId: z.string().min(1),
  entitlementId: z.string().min(1),
  fileName: z.string().min(1),
  contentBase64: z.string(),
  sha256: z.string(),
  licenseVersion: z.string().min(1),
  watermark: z.object({
    entitlementId: z.string(),
    userId: z.string(),
    kitId: z.string(),
    grantedAt: z.string(),
    hash: z.string()
  })
});
export type LicensedPackageResponse = z.infer<typeof licensedPackageResponseSchema>;

export const listEntitlementsResponseSchema = z.object({
  items: z.array(entitlementSchema)
});
export type ListEntitlementsResponse = z.infer<typeof listEntitlementsResponseSchema>;

// ---------------------------------------------------------------------------
// Route builders (Seam B — market-app ↔ agentkitmarket-infra, admin-key auth)
// ---------------------------------------------------------------------------

export const marketBackendPricingRoutes = {
  /** POST /admin/kits/{kitId}/pricing */
  adminSetKitPricing: (kitId: string) =>
    `/admin/kits/${encodeURIComponent(kitId)}/pricing`,
  /** GET /admin/users/{userId}/entitlements */
  adminListUserEntitlements: (userId: string) =>
    `/admin/users/${encodeURIComponent(userId)}/entitlements`,
  /** GET /admin/kits/{kitId}/entitlements/{userId} */
  adminGetEntitlement: (kitId: string, userId: string) =>
    `/admin/kits/${encodeURIComponent(kitId)}/entitlements/${encodeURIComponent(userId)}`,
  /** POST /admin/kits/{kitId}/entitlements */
  adminGrantEntitlement: (kitId: string) =>
    `/admin/kits/${encodeURIComponent(kitId)}/entitlements`,
  /** POST /admin/kits/{kitId}/licensed-package */
  adminLicensedPackage: (kitId: string) =>
    `/admin/kits/${encodeURIComponent(kitId)}/licensed-package`
} as const;

// ---------------------------------------------------------------------------
// Route builders (Seam A — Forge ↔ market-app, Bearer auth; for later CLI use)
// ---------------------------------------------------------------------------

export const forgePricingRoutes = {
  /** GET /api/forge/me/entitlements — list the authenticated user's entitlements. */
  myEntitlements: () => "/api/forge/me/entitlements",
  /** POST /api/forge/kits/{slug}/licensed-package — entitlement-gated fetch. */
  licensedPackage: (slug: string) =>
    `/api/forge/kits/${encodeURIComponent(slug)}/licensed-package`
} as const;
