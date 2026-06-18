import { z } from "zod";
/**
 * AgentKitMarket Organizations contracts.
 *
 * Covers all three Market Phase 2 org slices:
 *   Slice 1 — Organizations (create, list, invite by userId, accept)
 *   Slice 2 — Team roles (owner / admin / member / viewer + role changes)
 *   Slice 3 — Private catalogs (kit visibility public / private)
 *
 * Route builders are exported as extensions of the existing forgeMarketRoutes
 * and marketBackendRoutes objects in market.ts — see that file for object
 * declarations; these symbols augment the canonical route table in routes.json.
 */
// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const orgTypeSchema = z.enum(["personal", "team"]);
/**
 * Org-member roles.
 * Slice 1 uses: owner, member.
 * Slice 2 adds:  admin, viewer.
 */
export const orgRoleSchema = z.enum(["owner", "admin", "member", "viewer"]);
export const orgMembershipStatusSchema = z.enum(["active", "invited", "removed"]);
/** Kit visibility: "public" = listed in the public catalog; "private" = org-only. */
export const kitVisibilitySchema = z.enum(["public", "private"]);
// ---------------------------------------------------------------------------
// Object schemas
// ---------------------------------------------------------------------------
export const organizationSchema = z.object({
    orgId: z.string().min(1),
    slug: z.string().min(1),
    displayName: z.string().min(1).max(80),
    type: orgTypeSchema,
    ownerUserId: z.string().min(1),
    handle: z.string().min(3).max(32).optional(),
    avatarInitials: z.string().max(3).optional(),
    verified: z.boolean().optional(),
    /** WorkOS Organization ID — null until SSO is configured (future). */
    workosOrganizationId: z.string().nullable().optional(),
    /**
     * Stripe Connect seller-payout fields (Market paid-kit seller payouts).
     * `stripeAccountId` is the org's Express connected-account id. `chargesEnabled`
     * /`payoutsEnabled` mirror the connected account's capability state (synced from
     * Stripe `account.updated`). `payoutOnboardedAt` is stamped once payouts first
     * become enabled. All optional/absent until the org begins payout onboarding.
     */
    stripeAccountId: z.string().optional(),
    chargesEnabled: z.boolean().optional(),
    payoutsEnabled: z.boolean().optional(),
    payoutOnboardedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
});
/** Public-safe subset of an Organization (catalog / profile display). */
export const publicOrganizationSchema = z.object({
    orgId: z.string().min(1),
    slug: z.string().min(1),
    displayName: z.string().min(1).max(80),
    handle: z.string().min(3).max(32).optional(),
    avatarInitials: z.string().max(3).optional(),
    verified: z.boolean().optional()
});
export const orgMembershipSchema = z.object({
    orgId: z.string().min(1),
    userId: z.string().min(1),
    role: orgRoleSchema,
    status: orgMembershipStatusSchema,
    invitedByUserId: z.string().min(1).optional(),
    createdAt: z.string()
});
/**
 * Pending org invite.
 * Slice 1: invites are by userId.  email is reserved for later email-invite slice.
 */
export const orgInviteSchema = z.object({
    orgId: z.string().min(1),
    userId: z.string().min(1).optional(),
    email: z.string().email().optional(),
    role: orgRoleSchema,
    invitedByUserId: z.string().min(1),
    createdAt: z.string()
});
// ---------------------------------------------------------------------------
// Request schemas
// ---------------------------------------------------------------------------
export const createOrgRequestSchema = z.object({
    displayName: z.string().min(1).max(80),
    slug: z.string().min(1).optional(),
    handle: z.string().min(3).max(32).optional()
});
export const addOrgMemberRequestSchema = z.object({
    userId: z.string().min(1),
    role: orgRoleSchema
});
export const removeOrgMemberRequestSchema = z.object({
    userId: z.string().min(1)
});
export const acceptOrgInviteRequestSchema = z.object({
    orgId: z.string().min(1)
});
export const transferKitRequestSchema = z.object({
    kitId: z.string().min(1),
    targetOrgId: z.string().min(1)
});
export const setKitVisibilityRequestSchema = z.object({
    kitId: z.string().min(1),
    visibility: kitVisibilitySchema
});
/** Response from a successful org deletion. */
export const deleteOrgResponseSchema = z.object({
    ok: z.literal(true),
    orgId: z.string().min(1)
});
// ---------------------------------------------------------------------------
// Route builders (Seam A — Forge ↔ market-app, Bearer auth)
// ---------------------------------------------------------------------------
/**
 * Org-related routes Forge calls on the Market web app (Seam A).
 * Extend forgeMarketRoutes in market.ts with these entries.
 */
export const forgeOrgRoutes = {
    /** GET /api/forge/orgs — list orgs the authenticated user belongs to. */
    listMyOrgs: () => "/api/forge/orgs",
    /** POST /api/forge/orgs — create a new org. */
    createOrg: () => "/api/forge/orgs",
    /** GET /api/forge/orgs/{orgId}/kits — list all kits owned by an org (incl private; requires active membership). */
    listOrgKits: (orgId) => `/api/forge/orgs/${encodeURIComponent(orgId)}/kits`,
    /** GET/POST /api/forge/orgs/{orgId}/members */
    orgMembers: (orgId) => `/api/forge/orgs/${encodeURIComponent(orgId)}/members`,
    /** DELETE /api/forge/orgs/{orgId}/members/{userId} */
    orgMember: (orgId, userId) => `/api/forge/orgs/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}`,
    /** GET /api/forge/orgs/invites — list pending invites for the authenticated user. */
    myOrgInvites: () => "/api/forge/orgs/invites",
    /** POST /api/forge/orgs/{orgId}/invites/accept */
    acceptOrgInvite: (orgId) => `/api/forge/orgs/${encodeURIComponent(orgId)}/invites/accept`,
    /** DELETE /api/forge/orgs/{orgId} — delete a team org the user owns/admins. */
    deleteOrg: (orgId) => `/api/forge/orgs/${encodeURIComponent(orgId)}`,
    /** POST /api/forge/kits/{kitId}/transfer */
    transferKit: (kitId) => `/api/forge/kits/${encodeURIComponent(kitId)}/transfer`,
    /** POST /api/forge/kits/{kitId}/visibility */
    setKitVisibility: (kitId) => `/api/forge/kits/${encodeURIComponent(kitId)}/visibility`
};
// ---------------------------------------------------------------------------
// Browser org-payout routes (market-app, AuthKit-cookie auth, owner/admin only)
// ---------------------------------------------------------------------------
/**
 * Seller-payout routes the Market web UI calls for Stripe Connect onboarding.
 * Browser-facing (AuthKit cookie session via requireUserForApi), gated to the
 * org's owner/admin. Stripe API calls live only in market-app — never in core.
 */
export const orgPayoutRoutes = {
    /** POST /api/orgs/{orgId}/payouts/onboard — create/continue Express onboarding; returns { url }. */
    beginOnboarding: (orgId) => `/api/orgs/${encodeURIComponent(orgId)}/payouts/onboard`,
    /** GET /api/orgs/{orgId}/payouts/status — { stripeAccountId?, chargesEnabled, payoutsEnabled, needsOnboarding }. */
    payoutStatus: (orgId) => `/api/orgs/${encodeURIComponent(orgId)}/payouts/status`
};
// ---------------------------------------------------------------------------
// Route builders (Seam B — market-app ↔ agentkitmarket-infra, admin-key auth)
// ---------------------------------------------------------------------------
/**
 * Org-related backend routes market-app calls on the Market API Gateway (Seam B).
 * Extend marketBackendRoutes in market.ts with these entries.
 */
export const marketBackendOrgRoutes = {
    /** GET /admin/users/{userId}/orgs */
    adminListUserOrgs: (userId) => `/admin/users/${encodeURIComponent(userId)}/orgs`,
    /** POST /admin/orgs */
    adminCreateOrg: () => "/admin/orgs",
    /** DELETE /admin/orgs/{orgId} */
    adminDeleteOrg: (orgId) => `/admin/orgs/${encodeURIComponent(orgId)}`,
    /** GET /admin/orgs/{orgId}/kits — list all kits owned by an org (incl private); actorUserId must be an active member. */
    adminListOrgKits: (orgId) => `/admin/orgs/${encodeURIComponent(orgId)}/kits`,
    /** GET/POST /admin/orgs/{orgId}/members */
    adminOrgMembers: (orgId) => `/admin/orgs/${encodeURIComponent(orgId)}/members`,
    /** PATCH/DELETE /admin/orgs/{orgId}/members/{userId} */
    adminOrgMember: (orgId, userId) => `/admin/orgs/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}`,
    /** GET /admin/users/{userId}/invites */
    adminListUserInvites: (userId) => `/admin/users/${encodeURIComponent(userId)}/invites`,
    /** POST /admin/orgs/{orgId}/invites/{userId}/accept */
    adminAcceptInvite: (orgId, userId) => `/admin/orgs/${encodeURIComponent(orgId)}/invites/${encodeURIComponent(userId)}/accept`,
    /** POST /admin/kits/{kitId}/transfer */
    adminTransferKit: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/transfer`,
    /** POST /admin/kits/{kitId}/visibility */
    adminSetKitVisibility: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/visibility`,
    /** POST /admin/orgs/{orgId}/stripe-account — persist Stripe payout fields on an org. */
    adminSetOrgStripeAccount: (orgId) => `/admin/orgs/${encodeURIComponent(orgId)}/stripe-account`,
    /** GET /admin/orgs/{orgId}/payout-status — read an org's stored Stripe payout fields. */
    adminOrgPayoutStatus: (orgId) => `/admin/orgs/${encodeURIComponent(orgId)}/payout-status`,
    /** GET /admin/orgs/by-stripe-account/{id} — reverse lookup for the account.updated webhook. */
    adminOrgByStripeAccount: (stripeAccountId) => `/admin/orgs/by-stripe-account/${encodeURIComponent(stripeAccountId)}`
};
// ---------------------------------------------------------------------------
// Seller-payout request schema (Seam B — set Stripe account fields on an org)
// ---------------------------------------------------------------------------
/**
 * Body of POST /admin/orgs/{orgId}/stripe-account. market-app resolves these
 * fields from Stripe (account create / account.updated) and the backend just
 * persists them. Core never calls Stripe.
 */
export const setOrgStripeAccountRequestSchema = z.object({
    stripeAccountId: z.string().min(1),
    chargesEnabled: z.boolean(),
    payoutsEnabled: z.boolean(),
    payoutOnboardedAt: z.string().optional()
});
