import { z } from "zod";
import { publisherSnapshotSchema } from "./profile.js";
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
export const submissionStatusSchema = z.enum([
    "awaiting_upload",
    "uploaded",
    "validation_queued",
    "validating",
    "validated",
    "validation_passed",
    "validation_failed",
    "published",
    "hidden",
    "removed",
    "rejected",
    "archived",
    "canceled"
]);
export const validationStatusSchema = z.enum(["pending", "queued", "running", "passed", "failed"]);
export const reviewStatusSchema = z.enum(["pending", "approved", "rejected"]);
/** Whether a submission registers a brand-new kit or a new version of an existing one. */
export const submissionTypeSchema = z.enum(["new_kit", "version_update"]);
export const listingDraftSchema = z.object({
    name: z.string(),
    summary: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
    tags: z.array(z.string())
});
/** Payload market-app sends to the backend to open a Forge submission. */
export const forgeUploadBackendRequestSchema = z.object({
    fileName: z.string().endsWith(".agentkit.zip"),
    version: z.string().min(1),
    /** The publisher's AgentKitProfile display name (server-resolved, required). */
    publisherId: z.string().min(1),
    listingDraft: listingDraftSchema,
    submittedByUserId: z.string().min(1),
    submittedByEmail: z.string().min(1),
    publisherSnapshot: publisherSnapshotSchema.optional(),
    /** new_kit (default) or version_update of an existing owned kit. */
    submissionType: submissionTypeSchema.optional(),
    /** For version_update: the kitId being updated. Ownership is enforced server-side. */
    targetKitId: z.string().min(1).optional()
});
/** Response Forge receives from POST /api/forge/submissions/upload-url. */
export const forgeUploadUrlResponseSchema = z.object({
    submissionId: z.string().min(1),
    uploadUrl: z.string().url(),
    method: z.enum(["PUT", "POST"]),
    fields: z.record(z.string()),
    headers: z.record(z.string())
});
/**
 * Response Forge receives from POST /api/forge/kits/{slug}/download.
 * Carries the presigned download URL plus provenance used by installed-kit
 * metadata / update detection (Bridge 5).
 */
export const forgeDownloadResponseSchema = z.object({
    downloadUrl: z.string().url(),
    marketKitId: z.string().optional(),
    marketSlug: z.string().optional(),
    version: z.string().optional(),
    sha256: z.string().optional(),
    packageSizeBytes: z.number().optional(),
    publishedAt: z.string().optional(),
    sourceUrl: z.string().optional(),
    fileName: z.string().optional(),
    expiresIn: z.number().optional()
});
/** Routes Forge calls on the Market web app (Seam A). */
export const forgeMarketRoutes = {
    download: (slug) => `/api/forge/kits/${encodeURIComponent(slug)}/download`,
    submissionUploadUrl: () => "/api/forge/submissions/upload-url",
    submissionValidate: (submissionId) => `/api/forge/submissions/${encodeURIComponent(submissionId)}/validate`,
    publisherProfile: () => "/api/forge/publisher-profile"
};
/** Routes market-app calls on the Market backend API Gateway (Seam B). */
export const marketBackendRoutes = {
    health: () => "/health",
    listKits: () => "/kits",
    kitBySlug: (slug) => `/kits/${encodeURIComponent(slug)}`,
    adminCreateUploadUrl: () => "/admin/submissions/upload-url",
    adminValidateSubmission: (submissionId) => `/admin/submissions/${encodeURIComponent(submissionId)}/validate`,
    adminApproveSubmission: (submissionId) => `/admin/submissions/${encodeURIComponent(submissionId)}/approve`,
    adminRejectSubmission: (submissionId) => `/admin/submissions/${encodeURIComponent(submissionId)}/reject`,
    adminArchiveSubmission: (submissionId) => `/admin/submissions/${encodeURIComponent(submissionId)}/archive`,
    adminPublishSubmission: (submissionId) => `/admin/submissions/${encodeURIComponent(submissionId)}/publish`,
    adminListSubmissions: () => "/admin/submissions",
    adminGetSubmission: (submissionId) => `/admin/submissions/${encodeURIComponent(submissionId)}`,
    adminRemoveSubmission: (submissionId) => `/admin/submissions/${encodeURIComponent(submissionId)}/remove`,
    adminDownloadUrlBySlug: (slug) => `/admin/kits/by-slug/${encodeURIComponent(slug)}/download-url`,
    adminDownloadUrlByKitId: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/download-url`,
    adminHideKit: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/hide`,
    adminUnhideKit: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/unhide`,
    adminRemoveKit: (kitId) => `/admin/kits/${encodeURIComponent(kitId)}/remove`,
    userCancelSubmission: (submissionId) => `/users/submissions/${encodeURIComponent(submissionId)}/cancel`,
    userRemoveKit: (kitId) => `/users/kits/${encodeURIComponent(kitId)}/remove`
};
/** Server-to-server auth header for Seam B. Server-only — never in browser bundles or Forge. */
export const marketBackendAuthHeader = "x-agentkitmarket-admin-key";
