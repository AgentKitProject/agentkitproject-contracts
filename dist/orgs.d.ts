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
export declare const orgTypeSchema: z.ZodEnum<["personal", "team"]>;
export type OrgType = z.infer<typeof orgTypeSchema>;
/**
 * Org-member roles.
 * Slice 1 uses: owner, member.
 * Slice 2 adds:  admin, viewer.
 */
export declare const orgRoleSchema: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
export type OrgRole = z.infer<typeof orgRoleSchema>;
export declare const orgMembershipStatusSchema: z.ZodEnum<["active", "invited", "removed"]>;
export type OrgMembershipStatus = z.infer<typeof orgMembershipStatusSchema>;
/** Kit visibility: "public" = listed in the public catalog; "private" = org-only. */
export declare const kitVisibilitySchema: z.ZodEnum<["public", "private"]>;
export type KitVisibility = z.infer<typeof kitVisibilitySchema>;
export declare const organizationSchema: z.ZodObject<{
    orgId: z.ZodString;
    slug: z.ZodString;
    displayName: z.ZodString;
    type: z.ZodEnum<["personal", "team"]>;
    ownerUserId: z.ZodString;
    handle: z.ZodOptional<z.ZodString>;
    avatarInitials: z.ZodOptional<z.ZodString>;
    verified: z.ZodOptional<z.ZodBoolean>;
    /** WorkOS Organization ID — null until SSO is configured (future). */
    workosOrganizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    /**
     * Stripe Connect seller-payout fields (Market paid-kit seller payouts).
     * `stripeAccountId` is the org's Express connected-account id. `chargesEnabled`
     * /`payoutsEnabled` mirror the connected account's capability state (synced from
     * Stripe `account.updated`). `payoutOnboardedAt` is stamped once payouts first
     * become enabled. All optional/absent until the org begins payout onboarding.
     */
    stripeAccountId: z.ZodOptional<z.ZodString>;
    chargesEnabled: z.ZodOptional<z.ZodBoolean>;
    payoutsEnabled: z.ZodOptional<z.ZodBoolean>;
    payoutOnboardedAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "personal" | "team";
    orgId: string;
    slug: string;
    displayName: string;
    updatedAt: string;
    ownerUserId: string;
    createdAt: string;
    handle?: string | undefined;
    avatarInitials?: string | undefined;
    verified?: boolean | undefined;
    workosOrganizationId?: string | null | undefined;
    stripeAccountId?: string | undefined;
    chargesEnabled?: boolean | undefined;
    payoutsEnabled?: boolean | undefined;
    payoutOnboardedAt?: string | undefined;
}, {
    type: "personal" | "team";
    orgId: string;
    slug: string;
    displayName: string;
    updatedAt: string;
    ownerUserId: string;
    createdAt: string;
    handle?: string | undefined;
    avatarInitials?: string | undefined;
    verified?: boolean | undefined;
    workosOrganizationId?: string | null | undefined;
    stripeAccountId?: string | undefined;
    chargesEnabled?: boolean | undefined;
    payoutsEnabled?: boolean | undefined;
    payoutOnboardedAt?: string | undefined;
}>;
export type Organization = z.infer<typeof organizationSchema>;
/** Public-safe subset of an Organization (catalog / profile display). */
export declare const publicOrganizationSchema: z.ZodObject<{
    orgId: z.ZodString;
    slug: z.ZodString;
    displayName: z.ZodString;
    handle: z.ZodOptional<z.ZodString>;
    avatarInitials: z.ZodOptional<z.ZodString>;
    verified: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    slug: string;
    displayName: string;
    handle?: string | undefined;
    avatarInitials?: string | undefined;
    verified?: boolean | undefined;
}, {
    orgId: string;
    slug: string;
    displayName: string;
    handle?: string | undefined;
    avatarInitials?: string | undefined;
    verified?: boolean | undefined;
}>;
export type PublicOrganization = z.infer<typeof publicOrganizationSchema>;
export declare const orgMembershipSchema: z.ZodObject<{
    orgId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
    status: z.ZodEnum<["active", "invited", "removed"]>;
    invitedByUserId: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "removed" | "active" | "invited";
    orgId: string;
    userId: string;
    createdAt: string;
    role: "admin" | "owner" | "member" | "viewer";
    invitedByUserId?: string | undefined;
}, {
    status: "removed" | "active" | "invited";
    orgId: string;
    userId: string;
    createdAt: string;
    role: "admin" | "owner" | "member" | "viewer";
    invitedByUserId?: string | undefined;
}>;
export type OrgMembership = z.infer<typeof orgMembershipSchema>;
/**
 * Pending org invite.
 * Slice 1: invites are by userId.  email is reserved for later email-invite slice.
 */
export declare const orgInviteSchema: z.ZodObject<{
    orgId: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
    invitedByUserId: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    createdAt: string;
    role: "admin" | "owner" | "member" | "viewer";
    invitedByUserId: string;
    userId?: string | undefined;
    email?: string | undefined;
}, {
    orgId: string;
    createdAt: string;
    role: "admin" | "owner" | "member" | "viewer";
    invitedByUserId: string;
    userId?: string | undefined;
    email?: string | undefined;
}>;
export type OrgInvite = z.infer<typeof orgInviteSchema>;
export declare const createOrgRequestSchema: z.ZodObject<{
    displayName: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    handle: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    displayName: string;
    slug?: string | undefined;
    handle?: string | undefined;
}, {
    displayName: string;
    slug?: string | undefined;
    handle?: string | undefined;
}>;
export type CreateOrgRequest = z.infer<typeof createOrgRequestSchema>;
export declare const addOrgMemberRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    role: z.ZodEnum<["owner", "admin", "member", "viewer"]>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    role: "admin" | "owner" | "member" | "viewer";
}, {
    userId: string;
    role: "admin" | "owner" | "member" | "viewer";
}>;
export type AddOrgMemberRequest = z.infer<typeof addOrgMemberRequestSchema>;
export declare const removeOrgMemberRequestSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export type RemoveOrgMemberRequest = z.infer<typeof removeOrgMemberRequestSchema>;
export declare const acceptOrgInviteRequestSchema: z.ZodObject<{
    orgId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orgId: string;
}, {
    orgId: string;
}>;
export type AcceptOrgInviteRequest = z.infer<typeof acceptOrgInviteRequestSchema>;
export declare const transferKitRequestSchema: z.ZodObject<{
    kitId: z.ZodString;
    targetOrgId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kitId: string;
    targetOrgId: string;
}, {
    kitId: string;
    targetOrgId: string;
}>;
export type TransferKitRequest = z.infer<typeof transferKitRequestSchema>;
export declare const setKitVisibilityRequestSchema: z.ZodObject<{
    kitId: z.ZodString;
    visibility: z.ZodEnum<["public", "private"]>;
}, "strip", z.ZodTypeAny, {
    kitId: string;
    visibility: "public" | "private";
}, {
    kitId: string;
    visibility: "public" | "private";
}>;
export type SetKitVisibilityRequest = z.infer<typeof setKitVisibilityRequestSchema>;
/** Response from a successful org deletion. */
export declare const deleteOrgResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    orgId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orgId: string;
    ok: true;
}, {
    orgId: string;
    ok: true;
}>;
export type DeleteOrgResponse = z.infer<typeof deleteOrgResponseSchema>;
/**
 * Org-related routes Forge calls on the Market web app (Seam A).
 * Extend forgeMarketRoutes in market.ts with these entries.
 */
export declare const forgeOrgRoutes: {
    /** GET /api/forge/orgs — list orgs the authenticated user belongs to. */
    readonly listMyOrgs: () => string;
    /** POST /api/forge/orgs — create a new org. */
    readonly createOrg: () => string;
    /** GET/POST /api/forge/orgs/{orgId}/members */
    readonly orgMembers: (orgId: string) => string;
    /** DELETE /api/forge/orgs/{orgId}/members/{userId} */
    readonly orgMember: (orgId: string, userId: string) => string;
    /** GET /api/forge/orgs/invites — list pending invites for the authenticated user. */
    readonly myOrgInvites: () => string;
    /** POST /api/forge/orgs/{orgId}/invites/accept */
    readonly acceptOrgInvite: (orgId: string) => string;
    /** DELETE /api/forge/orgs/{orgId} — delete a team org the user owns/admins. */
    readonly deleteOrg: (orgId: string) => string;
    /** POST /api/forge/kits/{kitId}/transfer */
    readonly transferKit: (kitId: string) => string;
    /** POST /api/forge/kits/{kitId}/visibility */
    readonly setKitVisibility: (kitId: string) => string;
};
/**
 * Seller-payout routes the Market web UI calls for Stripe Connect onboarding.
 * Browser-facing (AuthKit cookie session via requireUserForApi), gated to the
 * org's owner/admin. Stripe API calls live only in market-app — never in core.
 */
export declare const orgPayoutRoutes: {
    /** POST /api/orgs/{orgId}/payouts/onboard — create/continue Express onboarding; returns { url }. */
    readonly beginOnboarding: (orgId: string) => string;
    /** GET /api/orgs/{orgId}/payouts/status — { stripeAccountId?, chargesEnabled, payoutsEnabled, needsOnboarding }. */
    readonly payoutStatus: (orgId: string) => string;
};
/**
 * Org-related backend routes market-app calls on the Market API Gateway (Seam B).
 * Extend marketBackendRoutes in market.ts with these entries.
 */
export declare const marketBackendOrgRoutes: {
    /** GET /admin/users/{userId}/orgs */
    readonly adminListUserOrgs: (userId: string) => string;
    /** POST /admin/orgs */
    readonly adminCreateOrg: () => string;
    /** DELETE /admin/orgs/{orgId} */
    readonly adminDeleteOrg: (orgId: string) => string;
    /** GET/POST /admin/orgs/{orgId}/members */
    readonly adminOrgMembers: (orgId: string) => string;
    /** PATCH/DELETE /admin/orgs/{orgId}/members/{userId} */
    readonly adminOrgMember: (orgId: string, userId: string) => string;
    /** GET /admin/users/{userId}/invites */
    readonly adminListUserInvites: (userId: string) => string;
    /** POST /admin/orgs/{orgId}/invites/{userId}/accept */
    readonly adminAcceptInvite: (orgId: string, userId: string) => string;
    /** POST /admin/kits/{kitId}/transfer */
    readonly adminTransferKit: (kitId: string) => string;
    /** POST /admin/kits/{kitId}/visibility */
    readonly adminSetKitVisibility: (kitId: string) => string;
    /** POST /admin/orgs/{orgId}/stripe-account — persist Stripe payout fields on an org. */
    readonly adminSetOrgStripeAccount: (orgId: string) => string;
    /** GET /admin/orgs/{orgId}/payout-status — read an org's stored Stripe payout fields. */
    readonly adminOrgPayoutStatus: (orgId: string) => string;
    /** GET /admin/orgs/by-stripe-account/{id} — reverse lookup for the account.updated webhook. */
    readonly adminOrgByStripeAccount: (stripeAccountId: string) => string;
};
/**
 * Body of POST /admin/orgs/{orgId}/stripe-account. market-app resolves these
 * fields from Stripe (account create / account.updated) and the backend just
 * persists them. Core never calls Stripe.
 */
export declare const setOrgStripeAccountRequestSchema: z.ZodObject<{
    stripeAccountId: z.ZodString;
    chargesEnabled: z.ZodBoolean;
    payoutsEnabled: z.ZodBoolean;
    payoutOnboardedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    stripeAccountId: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    payoutOnboardedAt?: string | undefined;
}, {
    stripeAccountId: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    payoutOnboardedAt?: string | undefined;
}>;
export type SetOrgStripeAccountRequest = z.infer<typeof setOrgStripeAccountRequestSchema>;
