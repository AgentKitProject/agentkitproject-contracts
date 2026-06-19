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
export const priceModelSchema = z.enum(["one_time", "subscription"]);
export const priceIntervalSchema = z.enum(["month", "year"]);
export const kitCurrencySchema = z.enum(["USD"]);
export const licenseTypeSchema = z.enum(["default", "custom"]);
export const entitlementStatusSchema = z.enum(["active", "revoked", "expired"]);
export const entitlementSourceSchema = z.enum(["purchase", "admin_grant", "free"]);
/** The default platform EULA version id applied when licenseType === 'default'. */
export const DEFAULT_KIT_LICENSE_VERSION = "default-v1";
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
/**
 * POST /admin/entitlements/by-subscription/{stripeSubscriptionId}/status —
 * subscription lifecycle. Driven by the Stripe webhook (subscription.updated /
 * subscription.deleted): sets the status (and optional expiresAt) of every
 * entitlement carrying the given Stripe subscription id. Idempotent.
 */
export const setEntitlementSubscriptionStatusRequestSchema = z.object({
    status: entitlementStatusSchema,
    expiresAt: z.string().optional()
});
/** POST /admin/kits/{kitId}/licensed-package — entitlement-gated watermarked fetch. */
export const licensedPackageRequestSchema = z.object({
    userId: z.string().min(1)
});
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
export const listEntitlementsResponseSchema = z.object({
    items: z.array(entitlementSchema)
});
// ---------------------------------------------------------------------------
// Seam S (web-forge ↔ market-app, SERVICE-KEY auth) — protected-kit resolution
// for the hosted AgentKitAuto worker path.
//
// THIRD auth path on market-app's /api/forge surface — NOT the AuthKit cookie,
// NOT the Forge device-auth bearer (requireForgeUser). The web-forge SSR server
// (NOT the worker, NOT a browser) asserts an entitled user's id with a shared
// service key so it can fetch the SAME licensed package the user-authed
// /api/forge/kits/{slug}/licensed-package route returns, WITHOUT the user's live
// session — while entitlement is STILL enforced server-side (Market verifies the
// asserted userId is entitled). The service key removes the SESSION requirement,
// never the ENTITLEMENT requirement.
// ---------------------------------------------------------------------------
/** Header carrying the web-forge↔market-app shared service key (constant-time
 *  compared server-side). Value lives in MARKET_SERVICE_KEY on BOTH sides; it is
 *  server-only and never shipped to a browser bundle or to Forge/the worker. */
export const marketServiceAuthHeader = "x-agentkit-service-key";
/** Error codes returned by the service licensed-package endpoint. */
export const serviceLicensedPackageErrorSchema = z.enum([
    /** Service key env unset on the provider → endpoint disabled (503). */
    "unconfigured",
    /** Missing/!match service key (401). */
    "unauthorized",
    /** Asserted user holds no active entitlement for this kit (403). */
    "not_entitled",
    /** Kit (slug/kitId) not found (404). */
    "not_found",
    /** Malformed request body (400). */
    "invalid_request",
    /** Upstream Market backend failure (502). */
    "backend_unavailable"
]);
/**
 * POST {marketServiceRoutes.licensedPackage(slug)} body. Asserts the entitled
 * user's id (no session). `slug` is the path param; `kitId` may be supplied to
 * skip the slug→kitId resolution (optional, advisory). At least the path slug
 * always identifies the kit.
 */
export const serviceLicensedPackageRequestSchema = z.object({
    userId: z.string().min(1),
    kitId: z.string().min(1).optional()
});
/**
 * Response from the service licensed-package endpoint — the SAME watermarked
 * licensed-package payload the user-authed forge route returns (base64 bytes +
 * watermark + sha256), plus the resolved kit context fields (slug/pricing/
 * downloadable/onlineOnly) the consumer uses to enforce no-persist. The bytes
 * are held in memory only and never persisted; never log this payload.
 */
export const serviceLicensedPackageResponseSchema = licensedPackageResponseSchema.extend({
    slug: z.string().min(1),
    pricing: kitPricingSchema,
    downloadable: z.boolean(),
    onlineOnly: z.boolean()
});
// ---------------------------------------------------------------------------
// Route builder (Seam S — web-forge ↔ market-app, service-key auth)
// ---------------------------------------------------------------------------
export const marketServiceRoutes = {
    /** POST /api/forge/service/kits/{slug}/licensed-package — service-key authed,
     *  entitlement-gated, asserts userId. */
    licensedPackage: (slug) => `/api/forge/service/kits/${encodeURIComponent(slug)}/licensed-package`
};
// ---------------------------------------------------------------------------
// Route builders (Seam B — market-app ↔ agentkitmarket-infra, admin-key auth)
// ---------------------------------------------------------------------------
export const marketBackendPricingRoutes = {
    /** POST /admin/kits/{kitId}/pricing */
    adminSetKitPricing: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/pricing`,
    /** GET /admin/users/{userId}/entitlements */
    adminListUserEntitlements: (userId) => `/admin/users/${encodeURIComponent(userId)}/entitlements`,
    /** GET /admin/kits/{kitId}/entitlements/{userId} */
    adminGetEntitlement: (kitId, userId) => `/admin/kits/${encodeURIComponent(kitId)}/entitlements/${encodeURIComponent(userId)}`,
    /** POST /admin/kits/{kitId}/entitlements */
    adminGrantEntitlement: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/entitlements`,
    /** POST /admin/entitlements/by-subscription/{stripeSubscriptionId}/status */
    adminSetEntitlementSubscriptionStatus: (stripeSubscriptionId) => `/admin/entitlements/by-subscription/${encodeURIComponent(stripeSubscriptionId)}/status`,
    /** POST /admin/kits/{kitId}/licensed-package */
    adminLicensedPackage: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/licensed-package`
};
// ---------------------------------------------------------------------------
// Route builders (Seam A — Forge ↔ market-app, Bearer auth; for later CLI use)
// ---------------------------------------------------------------------------
export const forgePricingRoutes = {
    /** GET /api/forge/me/entitlements — list the authenticated user's entitlements. */
    myEntitlements: () => "/api/forge/me/entitlements",
    /** POST /api/forge/kits/{slug}/licensed-package — entitlement-gated fetch. */
    licensedPackage: (slug) => `/api/forge/kits/${encodeURIComponent(slug)}/licensed-package`
};
