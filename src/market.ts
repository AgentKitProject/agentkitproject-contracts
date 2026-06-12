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
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;

export const validationStatusSchema = z.enum(["pending", "queued", "running", "passed", "failed"]);
export type ValidationStatus = z.infer<typeof validationStatusSchema>;

export const reviewStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const listingDraftSchema = z.object({
  name: z.string(),
  summary: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string())
});
export type ListingDraft = z.infer<typeof listingDraftSchema>;

/** Payload market-app sends to the backend to open a Forge submission. */
export const forgeUploadBackendRequestSchema = z.object({
  fileName: z.string().endsWith(".agentkit.zip"),
  version: z.string().min(1),
  /** The publisher's AgentKitProfile display name (server-resolved, required). */
  publisherId: z.string().min(1),
  listingDraft: listingDraftSchema,
  submittedByUserId: z.string().min(1),
  submittedByEmail: z.string().min(1),
  publisherSnapshot: publisherSnapshotSchema.optional()
});
export type ForgeUploadBackendRequest = z.infer<typeof forgeUploadBackendRequestSchema>;

/** Response Forge receives from POST /api/forge/submissions/upload-url. */
export const forgeUploadUrlResponseSchema = z.object({
  submissionId: z.string().min(1),
  uploadUrl: z.string().url(),
  method: z.enum(["PUT", "POST"]),
  fields: z.record(z.string()),
  headers: z.record(z.string())
});
export type ForgeUploadUrlResponse = z.infer<typeof forgeUploadUrlResponseSchema>;

/** Routes Forge calls on the Market web app (Seam A). */
export const forgeMarketRoutes = {
  download: (slug: string) => `/api/forge/kits/${encodeURIComponent(slug)}/download`,
  submissionUploadUrl: () => "/api/forge/submissions/upload-url",
  submissionValidate: (submissionId: string) =>
    `/api/forge/submissions/${encodeURIComponent(submissionId)}/validate`,
  publisherProfile: () => "/api/forge/publisher-profile"
} as const;

/** Routes market-app calls on the Market backend API Gateway (Seam B). */
export const marketBackendRoutes = {
  health: () => "/health",
  listKits: () => "/kits",
  kitBySlug: (slug: string) => `/kits/${encodeURIComponent(slug)}`,
  adminCreateUploadUrl: () => "/admin/submissions/upload-url",
  adminValidateSubmission: (submissionId: string) =>
    `/admin/submissions/${encodeURIComponent(submissionId)}/validate`,
  adminApproveSubmission: (submissionId: string) =>
    `/admin/submissions/${encodeURIComponent(submissionId)}/approve`,
  adminRejectSubmission: (submissionId: string) =>
    `/admin/submissions/${encodeURIComponent(submissionId)}/reject`,
  adminArchiveSubmission: (submissionId: string) =>
    `/admin/submissions/${encodeURIComponent(submissionId)}/archive`,
  adminPublishSubmission: (submissionId: string) =>
    `/admin/submissions/${encodeURIComponent(submissionId)}/publish`,
  adminListSubmissions: () => "/admin/submissions",
  adminDownloadUrlBySlug: (slug: string) => `/admin/kits/by-slug/${encodeURIComponent(slug)}/download-url`,
  adminHideKit: (kitId: string) => `/admin/kits/${encodeURIComponent(kitId)}/hide`,
  adminUnhideKit: (kitId: string) => `/admin/kits/${encodeURIComponent(kitId)}/unhide`,
  userCancelSubmission: (submissionId: string) =>
    `/users/submissions/${encodeURIComponent(submissionId)}/cancel`,
  userRemoveKit: (kitId: string) => `/users/kits/${encodeURIComponent(kitId)}/remove`
} as const;

/** Server-to-server auth header for Seam B. Server-only — never in browser bundles or Forge. */
export const marketBackendAuthHeader = "x-agentkitmarket-admin-key" as const;
