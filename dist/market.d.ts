import { z } from "zod";
/**
 * AgentKitMarket seams.
 *
 * Seam A (Forge ↔ market-app): /api/forge/* app-server routes, authenticated
 * with a WorkOS device-auth JWT (`Authorization: Bearer`), verified server-side
 * via JWKS by requireForgeUser(). Never cookie-authenticated.
 *
 * Seam B (market-app ↔ agentkitmarket-infra backend): API Gateway routes,
 * authenticated with the server-only x-agentkitmarket-admin-key header.
 */
export declare const submissionStatusSchema: z.ZodEnum<["awaiting_upload", "uploaded", "validation_queued", "validating", "validated", "validation_passed", "validation_failed", "published", "hidden", "removed", "rejected", "archived", "canceled"]>;
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;
export declare const validationStatusSchema: z.ZodEnum<["pending", "queued", "running", "passed", "failed"]>;
export type ValidationStatus = z.infer<typeof validationStatusSchema>;
export declare const reviewStatusSchema: z.ZodEnum<["pending", "approved", "rejected"]>;
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export declare const listingDraftSchema: z.ZodObject<{
    name: z.ZodString;
    summary: z.ZodString;
    description: z.ZodString;
    categories: z.ZodArray<z.ZodString, "many">;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    summary: string;
    description: string;
    categories: string[];
    tags: string[];
}, {
    name: string;
    summary: string;
    description: string;
    categories: string[];
    tags: string[];
}>;
export type ListingDraft = z.infer<typeof listingDraftSchema>;
/** Payload market-app sends to the backend to open a Forge submission. */
export declare const forgeUploadBackendRequestSchema: z.ZodObject<{
    fileName: z.ZodString;
    version: z.ZodString;
    /** The publisher's AgentKitProfile display name (server-resolved, required). */
    publisherId: z.ZodString;
    listingDraft: z.ZodObject<{
        name: z.ZodString;
        summary: z.ZodString;
        description: z.ZodString;
        categories: z.ZodArray<z.ZodString, "many">;
        tags: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        summary: string;
        description: string;
        categories: string[];
        tags: string[];
    }, {
        name: string;
        summary: string;
        description: string;
        categories: string[];
        tags: string[];
    }>;
    submittedByUserId: z.ZodString;
    submittedByEmail: z.ZodString;
    publisherSnapshot: z.ZodOptional<z.ZodObject<{
        displayName: z.ZodNullable<z.ZodString>;
        handle: z.ZodNullable<z.ZodString>;
        avatarInitials: z.ZodNullable<z.ZodString>;
        verified: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        displayName: string | null;
        handle: string | null;
        avatarInitials: string | null;
        verified: boolean;
    }, {
        displayName: string | null;
        handle: string | null;
        avatarInitials: string | null;
        verified: boolean;
    }>>;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    version: string;
    publisherId: string;
    listingDraft: {
        name: string;
        summary: string;
        description: string;
        categories: string[];
        tags: string[];
    };
    submittedByUserId: string;
    submittedByEmail: string;
    publisherSnapshot?: {
        displayName: string | null;
        handle: string | null;
        avatarInitials: string | null;
        verified: boolean;
    } | undefined;
}, {
    fileName: string;
    version: string;
    publisherId: string;
    listingDraft: {
        name: string;
        summary: string;
        description: string;
        categories: string[];
        tags: string[];
    };
    submittedByUserId: string;
    submittedByEmail: string;
    publisherSnapshot?: {
        displayName: string | null;
        handle: string | null;
        avatarInitials: string | null;
        verified: boolean;
    } | undefined;
}>;
export type ForgeUploadBackendRequest = z.infer<typeof forgeUploadBackendRequestSchema>;
/** Response Forge receives from POST /api/forge/submissions/upload-url. */
export declare const forgeUploadUrlResponseSchema: z.ZodObject<{
    submissionId: z.ZodString;
    uploadUrl: z.ZodString;
    method: z.ZodEnum<["PUT", "POST"]>;
    fields: z.ZodRecord<z.ZodString, z.ZodString>;
    headers: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    submissionId: string;
    uploadUrl: string;
    method: "PUT" | "POST";
    fields: Record<string, string>;
    headers: Record<string, string>;
}, {
    submissionId: string;
    uploadUrl: string;
    method: "PUT" | "POST";
    fields: Record<string, string>;
    headers: Record<string, string>;
}>;
export type ForgeUploadUrlResponse = z.infer<typeof forgeUploadUrlResponseSchema>;
/** Routes Forge calls on the Market web app (Seam A). */
export declare const forgeMarketRoutes: {
    readonly download: (slug: string) => string;
    readonly submissionUploadUrl: () => string;
    readonly submissionValidate: (submissionId: string) => string;
    readonly publisherProfile: () => string;
};
/** Routes market-app calls on the Market backend API Gateway (Seam B). */
export declare const marketBackendRoutes: {
    readonly health: () => string;
    readonly listKits: () => string;
    readonly kitBySlug: (slug: string) => string;
    readonly adminCreateUploadUrl: () => string;
    readonly adminValidateSubmission: (submissionId: string) => string;
    readonly adminApproveSubmission: (submissionId: string) => string;
    readonly adminRejectSubmission: (submissionId: string) => string;
    readonly adminArchiveSubmission: (submissionId: string) => string;
    readonly adminPublishSubmission: (submissionId: string) => string;
    readonly adminListSubmissions: () => string;
    readonly adminGetSubmission: (submissionId: string) => string;
    readonly adminRemoveSubmission: (submissionId: string) => string;
    readonly adminDownloadUrlBySlug: (slug: string) => string;
    readonly adminDownloadUrlByKitId: (kitId: string) => string;
    readonly adminHideKit: (kitId: string) => string;
    readonly adminUnhideKit: (kitId: string) => string;
    readonly adminRemoveKit: (kitId: string) => string;
    readonly userCancelSubmission: (submissionId: string) => string;
    readonly userRemoveKit: (kitId: string) => string;
};
/** Server-to-server auth header for Seam B. Server-only — never in browser bundles or Forge. */
export declare const marketBackendAuthHeader: "x-agentkitmarket-admin-key";
