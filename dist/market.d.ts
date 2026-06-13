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
/** Whether a submission registers a brand-new kit or a new version of an existing one. */
export declare const submissionTypeSchema: z.ZodEnum<["new_kit", "version_update"]>;
export type SubmissionType = z.infer<typeof submissionTypeSchema>;
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
    /** new_kit (default) or version_update of an existing owned kit. */
    submissionType: z.ZodOptional<z.ZodEnum<["new_kit", "version_update"]>>;
    /** For version_update: the kitId being updated. Ownership is enforced server-side. */
    targetKitId: z.ZodOptional<z.ZodString>;
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
    submissionType?: "new_kit" | "version_update" | undefined;
    targetKitId?: string | undefined;
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
    submissionType?: "new_kit" | "version_update" | undefined;
    targetKitId?: string | undefined;
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
/**
 * Response Forge receives from POST /api/forge/kits/{slug}/download.
 * Carries the presigned download URL plus provenance used by installed-kit
 * metadata / update detection (Bridge 5).
 */
export declare const forgeDownloadResponseSchema: z.ZodObject<{
    downloadUrl: z.ZodString;
    marketKitId: z.ZodOptional<z.ZodString>;
    marketSlug: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
    sha256: z.ZodOptional<z.ZodString>;
    packageSizeBytes: z.ZodOptional<z.ZodNumber>;
    publishedAt: z.ZodOptional<z.ZodString>;
    sourceUrl: z.ZodOptional<z.ZodString>;
    fileName: z.ZodOptional<z.ZodString>;
    expiresIn: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    downloadUrl: string;
    fileName?: string | undefined;
    version?: string | undefined;
    marketKitId?: string | undefined;
    marketSlug?: string | undefined;
    sha256?: string | undefined;
    packageSizeBytes?: number | undefined;
    publishedAt?: string | undefined;
    sourceUrl?: string | undefined;
    expiresIn?: number | undefined;
}, {
    downloadUrl: string;
    fileName?: string | undefined;
    version?: string | undefined;
    marketKitId?: string | undefined;
    marketSlug?: string | undefined;
    sha256?: string | undefined;
    packageSizeBytes?: number | undefined;
    publishedAt?: string | undefined;
    sourceUrl?: string | undefined;
    expiresIn?: number | undefined;
}>;
export type ForgeDownloadResponse = z.infer<typeof forgeDownloadResponseSchema>;
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
