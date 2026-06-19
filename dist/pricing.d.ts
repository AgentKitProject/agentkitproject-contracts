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
export declare const kitPricingSchema: z.ZodEnum<["free", "paid"]>;
export type KitPricing = z.infer<typeof kitPricingSchema>;
export declare const priceModelSchema: z.ZodEnum<["one_time", "subscription"]>;
export type PriceModel = z.infer<typeof priceModelSchema>;
export declare const priceIntervalSchema: z.ZodEnum<["month", "year"]>;
export type PriceInterval = z.infer<typeof priceIntervalSchema>;
export declare const kitCurrencySchema: z.ZodEnum<["USD"]>;
export type KitCurrency = z.infer<typeof kitCurrencySchema>;
export declare const licenseTypeSchema: z.ZodEnum<["default", "custom"]>;
export type LicenseType = z.infer<typeof licenseTypeSchema>;
export declare const entitlementStatusSchema: z.ZodEnum<["active", "revoked", "expired"]>;
export type EntitlementStatus = z.infer<typeof entitlementStatusSchema>;
export declare const entitlementSourceSchema: z.ZodEnum<["purchase", "admin_grant", "free"]>;
export type EntitlementSource = z.infer<typeof entitlementSourceSchema>;
/** The default platform EULA version id applied when licenseType === 'default'. */
export declare const DEFAULT_KIT_LICENSE_VERSION: "default-v1";
/** Pricing + license metadata carried on a kit. All optional/defaulted (free-safe). */
export declare const kitPricingMetadataSchema: z.ZodObject<{
    pricing: z.ZodDefault<z.ZodEnum<["free", "paid"]>>;
    priceModel: z.ZodOptional<z.ZodEnum<["one_time", "subscription"]>>;
    priceCents: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodEnum<["USD"]>>;
    interval: z.ZodOptional<z.ZodEnum<["month", "year"]>>;
    /**
     * Optional subscription free-trial length in days. Only meaningful when
     * priceModel === 'subscription'; ignored/zeroed otherwise. Maps to Stripe's
     * subscription `trial_period_days` at checkout.
     */
    trialDays: z.ZodOptional<z.ZodNumber>;
    /** Paid kits default false (online-only); free kits are treated as downloadable. */
    downloadable: z.ZodOptional<z.ZodBoolean>;
    licenseType: z.ZodDefault<z.ZodEnum<["default", "custom"]>>;
    licenseText: z.ZodOptional<z.ZodString>;
    licenseVersion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    pricing: "free" | "paid";
    currency: "USD";
    licenseType: "custom" | "default";
    priceModel?: "one_time" | "subscription" | undefined;
    priceCents?: number | undefined;
    interval?: "month" | "year" | undefined;
    trialDays?: number | undefined;
    downloadable?: boolean | undefined;
    licenseText?: string | undefined;
    licenseVersion?: string | undefined;
}, {
    pricing?: "free" | "paid" | undefined;
    priceModel?: "one_time" | "subscription" | undefined;
    priceCents?: number | undefined;
    currency?: "USD" | undefined;
    interval?: "month" | "year" | undefined;
    trialDays?: number | undefined;
    downloadable?: boolean | undefined;
    licenseType?: "custom" | "default" | undefined;
    licenseText?: string | undefined;
    licenseVersion?: string | undefined;
}>;
export type KitPricingMetadata = z.infer<typeof kitPricingMetadataSchema>;
export declare const entitlementSchema: z.ZodObject<{
    entitlementId: z.ZodString;
    kitId: z.ZodString;
    userId: z.ZodString;
    status: z.ZodEnum<["active", "revoked", "expired"]>;
    source: z.ZodEnum<["purchase", "admin_grant", "free"]>;
    licenseVersion: z.ZodString;
    licenseAcceptedAt: z.ZodString;
    licenseTextSnapshot: z.ZodString;
    grantedAt: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodString>;
    stripeSubscriptionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "revoked" | "expired";
    userId: string;
    kitId: string;
    licenseVersion: string;
    entitlementId: string;
    source: "free" | "purchase" | "admin_grant";
    licenseAcceptedAt: string;
    licenseTextSnapshot: string;
    grantedAt: string;
    expiresAt?: string | undefined;
    stripeSubscriptionId?: string | null | undefined;
}, {
    status: "active" | "revoked" | "expired";
    userId: string;
    kitId: string;
    licenseVersion: string;
    entitlementId: string;
    source: "free" | "purchase" | "admin_grant";
    licenseAcceptedAt: string;
    licenseTextSnapshot: string;
    grantedAt: string;
    expiresAt?: string | undefined;
    stripeSubscriptionId?: string | null | undefined;
}>;
export type Entitlement = z.infer<typeof entitlementSchema>;
/**
 * POST /admin/kits/{kitId}/pricing. actorUserId must be the kit owner or an
 * admin/owner of the kit's owning org (role-gated server-side).
 * Validation: paid requires priceCents>0 and priceModel; subscription requires interval.
 */
export declare const setKitPricingRequestSchema: z.ZodObject<{
    actorUserId: z.ZodString;
    pricing: z.ZodEnum<["free", "paid"]>;
    priceModel: z.ZodOptional<z.ZodEnum<["one_time", "subscription"]>>;
    priceCents: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodOptional<z.ZodEnum<["USD"]>>;
    interval: z.ZodOptional<z.ZodEnum<["month", "year"]>>;
    /** Subscription free-trial length in days; only meaningful for subscription kits. */
    trialDays: z.ZodOptional<z.ZodNumber>;
    downloadable: z.ZodOptional<z.ZodBoolean>;
    licenseType: z.ZodOptional<z.ZodEnum<["default", "custom"]>>;
    licenseText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    actorUserId: string;
    pricing: "free" | "paid";
    priceModel?: "one_time" | "subscription" | undefined;
    priceCents?: number | undefined;
    currency?: "USD" | undefined;
    interval?: "month" | "year" | undefined;
    trialDays?: number | undefined;
    downloadable?: boolean | undefined;
    licenseType?: "custom" | "default" | undefined;
    licenseText?: string | undefined;
}, {
    actorUserId: string;
    pricing: "free" | "paid";
    priceModel?: "one_time" | "subscription" | undefined;
    priceCents?: number | undefined;
    currency?: "USD" | undefined;
    interval?: "month" | "year" | undefined;
    trialDays?: number | undefined;
    downloadable?: boolean | undefined;
    licenseType?: "custom" | "default" | undefined;
    licenseText?: string | undefined;
}>;
export type SetKitPricingRequest = z.infer<typeof setKitPricingRequestSchema>;
/** POST /admin/kits/{kitId}/entitlements — grant. Idempotent on (userId,kitId). */
export declare const grantEntitlementRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    source: z.ZodEnum<["purchase", "admin_grant", "free"]>;
    licenseVersion: z.ZodString;
    licenseAcceptedAt: z.ZodString;
    licenseTextSnapshot: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodString>;
    stripeSubscriptionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    licenseVersion: string;
    source: "free" | "purchase" | "admin_grant";
    licenseAcceptedAt: string;
    licenseTextSnapshot: string;
    expiresAt?: string | undefined;
    stripeSubscriptionId?: string | null | undefined;
}, {
    userId: string;
    licenseVersion: string;
    source: "free" | "purchase" | "admin_grant";
    licenseAcceptedAt: string;
    licenseTextSnapshot: string;
    expiresAt?: string | undefined;
    stripeSubscriptionId?: string | null | undefined;
}>;
export type GrantEntitlementRequest = z.infer<typeof grantEntitlementRequestSchema>;
/**
 * POST /admin/entitlements/by-subscription/{stripeSubscriptionId}/status —
 * subscription lifecycle. Driven by the Stripe webhook (subscription.updated /
 * subscription.deleted): sets the status (and optional expiresAt) of every
 * entitlement carrying the given Stripe subscription id. Idempotent.
 */
export declare const setEntitlementSubscriptionStatusRequestSchema: z.ZodObject<{
    status: z.ZodEnum<["active", "revoked", "expired"]>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "revoked" | "expired";
    expiresAt?: string | undefined;
}, {
    status: "active" | "revoked" | "expired";
    expiresAt?: string | undefined;
}>;
export type SetEntitlementSubscriptionStatusRequest = z.infer<typeof setEntitlementSubscriptionStatusRequestSchema>;
/** POST /admin/kits/{kitId}/licensed-package — entitlement-gated watermarked fetch. */
export declare const licensedPackageRequestSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export type LicensedPackageRequest = z.infer<typeof licensedPackageRequestSchema>;
/** Response from the licensed-package route: base64 watermarked bytes + metadata. */
export declare const licensedPackageResponseSchema: z.ZodObject<{
    kitId: z.ZodString;
    userId: z.ZodString;
    entitlementId: z.ZodString;
    fileName: z.ZodString;
    contentBase64: z.ZodString;
    sha256: z.ZodString;
    licenseVersion: z.ZodString;
    watermark: z.ZodObject<{
        entitlementId: z.ZodString;
        userId: z.ZodString;
        kitId: z.ZodString;
        grantedAt: z.ZodString;
        hash: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    }, {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    }>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    kitId: string;
    fileName: string;
    sha256: string;
    licenseVersion: string;
    entitlementId: string;
    contentBase64: string;
    watermark: {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    };
}, {
    userId: string;
    kitId: string;
    fileName: string;
    sha256: string;
    licenseVersion: string;
    entitlementId: string;
    contentBase64: string;
    watermark: {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    };
}>;
export type LicensedPackageResponse = z.infer<typeof licensedPackageResponseSchema>;
export declare const listEntitlementsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        entitlementId: z.ZodString;
        kitId: z.ZodString;
        userId: z.ZodString;
        status: z.ZodEnum<["active", "revoked", "expired"]>;
        source: z.ZodEnum<["purchase", "admin_grant", "free"]>;
        licenseVersion: z.ZodString;
        licenseAcceptedAt: z.ZodString;
        licenseTextSnapshot: z.ZodString;
        grantedAt: z.ZodString;
        expiresAt: z.ZodOptional<z.ZodString>;
        stripeSubscriptionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status: "active" | "revoked" | "expired";
        userId: string;
        kitId: string;
        licenseVersion: string;
        entitlementId: string;
        source: "free" | "purchase" | "admin_grant";
        licenseAcceptedAt: string;
        licenseTextSnapshot: string;
        grantedAt: string;
        expiresAt?: string | undefined;
        stripeSubscriptionId?: string | null | undefined;
    }, {
        status: "active" | "revoked" | "expired";
        userId: string;
        kitId: string;
        licenseVersion: string;
        entitlementId: string;
        source: "free" | "purchase" | "admin_grant";
        licenseAcceptedAt: string;
        licenseTextSnapshot: string;
        grantedAt: string;
        expiresAt?: string | undefined;
        stripeSubscriptionId?: string | null | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "active" | "revoked" | "expired";
        userId: string;
        kitId: string;
        licenseVersion: string;
        entitlementId: string;
        source: "free" | "purchase" | "admin_grant";
        licenseAcceptedAt: string;
        licenseTextSnapshot: string;
        grantedAt: string;
        expiresAt?: string | undefined;
        stripeSubscriptionId?: string | null | undefined;
    }[];
}, {
    items: {
        status: "active" | "revoked" | "expired";
        userId: string;
        kitId: string;
        licenseVersion: string;
        entitlementId: string;
        source: "free" | "purchase" | "admin_grant";
        licenseAcceptedAt: string;
        licenseTextSnapshot: string;
        grantedAt: string;
        expiresAt?: string | undefined;
        stripeSubscriptionId?: string | null | undefined;
    }[];
}>;
export type ListEntitlementsResponse = z.infer<typeof listEntitlementsResponseSchema>;
/** Header carrying the web-forge↔market-app shared service key (constant-time
 *  compared server-side). Value lives in MARKET_SERVICE_KEY on BOTH sides; it is
 *  server-only and never shipped to a browser bundle or to Forge/the worker. */
export declare const marketServiceAuthHeader: "x-agentkit-service-key";
/** Error codes returned by the service licensed-package endpoint. */
export declare const serviceLicensedPackageErrorSchema: z.ZodEnum<["unconfigured", "unauthorized", "not_entitled", "not_found", "invalid_request", "backend_unavailable"]>;
export type ServiceLicensedPackageError = z.infer<typeof serviceLicensedPackageErrorSchema>;
/**
 * POST {marketServiceRoutes.licensedPackage(slug)} body. Asserts the entitled
 * user's id (no session). `slug` is the path param; `kitId` may be supplied to
 * skip the slug→kitId resolution (optional, advisory). At least the path slug
 * always identifies the kit.
 */
export declare const serviceLicensedPackageRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    kitId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    kitId?: string | undefined;
}, {
    userId: string;
    kitId?: string | undefined;
}>;
export type ServiceLicensedPackageRequest = z.infer<typeof serviceLicensedPackageRequestSchema>;
/**
 * Response from the service licensed-package endpoint — the SAME watermarked
 * licensed-package payload the user-authed forge route returns (base64 bytes +
 * watermark + sha256), plus the resolved kit context fields (slug/pricing/
 * downloadable/onlineOnly) the consumer uses to enforce no-persist. The bytes
 * are held in memory only and never persisted; never log this payload.
 */
export declare const serviceLicensedPackageResponseSchema: z.ZodObject<{
    kitId: z.ZodString;
    userId: z.ZodString;
    entitlementId: z.ZodString;
    fileName: z.ZodString;
    contentBase64: z.ZodString;
    sha256: z.ZodString;
    licenseVersion: z.ZodString;
    watermark: z.ZodObject<{
        entitlementId: z.ZodString;
        userId: z.ZodString;
        kitId: z.ZodString;
        grantedAt: z.ZodString;
        hash: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    }, {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    }>;
} & {
    slug: z.ZodString;
    pricing: z.ZodEnum<["free", "paid"]>;
    downloadable: z.ZodBoolean;
    onlineOnly: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    userId: string;
    kitId: string;
    slug: string;
    fileName: string;
    sha256: string;
    pricing: "free" | "paid";
    downloadable: boolean;
    licenseVersion: string;
    entitlementId: string;
    contentBase64: string;
    watermark: {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    };
    onlineOnly: boolean;
}, {
    userId: string;
    kitId: string;
    slug: string;
    fileName: string;
    sha256: string;
    pricing: "free" | "paid";
    downloadable: boolean;
    licenseVersion: string;
    entitlementId: string;
    contentBase64: string;
    watermark: {
        userId: string;
        kitId: string;
        entitlementId: string;
        grantedAt: string;
        hash: string;
    };
    onlineOnly: boolean;
}>;
export type ServiceLicensedPackageResponse = z.infer<typeof serviceLicensedPackageResponseSchema>;
export declare const marketServiceRoutes: {
    /** POST /api/forge/service/kits/{slug}/licensed-package — service-key authed,
     *  entitlement-gated, asserts userId. */
    readonly licensedPackage: (slug: string) => string;
};
export declare const marketBackendPricingRoutes: {
    /** POST /admin/kits/{kitId}/pricing */
    readonly adminSetKitPricing: (kitId: string) => string;
    /** GET /admin/users/{userId}/entitlements */
    readonly adminListUserEntitlements: (userId: string) => string;
    /** GET /admin/kits/{kitId}/entitlements/{userId} */
    readonly adminGetEntitlement: (kitId: string, userId: string) => string;
    /** POST /admin/kits/{kitId}/entitlements */
    readonly adminGrantEntitlement: (kitId: string) => string;
    /** POST /admin/entitlements/by-subscription/{stripeSubscriptionId}/status */
    readonly adminSetEntitlementSubscriptionStatus: (stripeSubscriptionId: string) => string;
    /** POST /admin/kits/{kitId}/licensed-package */
    readonly adminLicensedPackage: (kitId: string) => string;
};
export declare const forgePricingRoutes: {
    /** GET /api/forge/me/entitlements — list the authenticated user's entitlements. */
    readonly myEntitlements: () => string;
    /** POST /api/forge/kits/{slug}/licensed-package — entitlement-gated fetch. */
    readonly licensedPackage: (slug: string) => string;
};
