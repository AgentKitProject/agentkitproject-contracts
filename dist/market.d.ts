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
    /**
     * Organization that owns this kit.  Optional for now (personal kits have no ownerOrgId).
     * Populated by Forge when submitting on behalf of an org (Market Phase 2 orgs slice).
     */
    ownerOrgId: z.ZodOptional<z.ZodString>;
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
    ownerOrgId?: string | undefined;
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
    ownerOrgId?: string | undefined;
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
/** A published kit version's public metadata (from the catalog detail). */
export declare const publicKitVersionSchema: z.ZodObject<{
    version: z.ZodString;
    summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    version: string;
    summary?: string | null | undefined;
    sha256?: string | null | undefined;
    packageSizeBytes?: number | null | undefined;
    publishedAt?: string | null | undefined;
    schemaVersion?: string | null | undefined;
}, {
    version: string;
    summary?: string | null | undefined;
    sha256?: string | null | undefined;
    packageSizeBytes?: number | null | undefined;
    publishedAt?: string | null | undefined;
    schemaVersion?: string | null | undefined;
}>;
export type PublicKitVersion = z.infer<typeof publicKitVersionSchema>;
/**
 * Public kit detail (inside an `{ item }` envelope) returned by the Market
 * backend GET /kits/{slug} and proxied to Forge via the kit-detail route.
 * Lenient (passthrough): the backend returns more fields than consumers read;
 * `currentVersion`/`latestVersion` drive Bridge 5 update detection.
 *
 * TODO (Market Phase 2): the `publisher` field will migrate from a free-form
 * PublisherSnapshot projection to `PublicOrganizationSchema` once org-owned kits
 * ship.  Do NOT add a typed `publisher` field here until that migration is ready —
 * passthrough keeps it readable without breaking existing consumers.
 */
export declare const publicKitDetailSchema: z.ZodObject<{
    kitId: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    summary: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentVersion: z.ZodNullable<z.ZodString>;
    latestVersion: z.ZodNullable<z.ZodObject<{
        version: z.ZodString;
        summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }>>;
    versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        version: z.ZodString;
        summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }>, "many">>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    kitId: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    summary: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentVersion: z.ZodNullable<z.ZodString>;
    latestVersion: z.ZodNullable<z.ZodObject<{
        version: z.ZodString;
        summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }>>;
    versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        version: z.ZodString;
        summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }>, "many">>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    kitId: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    summary: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    currentVersion: z.ZodNullable<z.ZodString>;
    latestVersion: z.ZodNullable<z.ZodObject<{
        version: z.ZodString;
        summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }>>;
    versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        version: z.ZodString;
        summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }, {
        version: string;
        summary?: string | null | undefined;
        sha256?: string | null | undefined;
        packageSizeBytes?: number | null | undefined;
        publishedAt?: string | null | undefined;
        schemaVersion?: string | null | undefined;
    }>, "many">>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.ZodTypeAny, "passthrough">>;
export type PublicKitDetail = z.infer<typeof publicKitDetailSchema>;
/** Envelope for the kit-detail response: `{ item: PublicKitDetail }`. */
export declare const publicKitDetailResponseSchema: z.ZodObject<{
    item: z.ZodObject<{
        kitId: z.ZodString;
        slug: z.ZodString;
        name: z.ZodString;
        summary: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        currentVersion: z.ZodNullable<z.ZodString>;
        latestVersion: z.ZodNullable<z.ZodObject<{
            version: z.ZodString;
            summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }>>;
        versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            version: z.ZodString;
            summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }>, "many">>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        kitId: z.ZodString;
        slug: z.ZodString;
        name: z.ZodString;
        summary: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        currentVersion: z.ZodNullable<z.ZodString>;
        latestVersion: z.ZodNullable<z.ZodObject<{
            version: z.ZodString;
            summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }>>;
        versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            version: z.ZodString;
            summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }>, "many">>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        kitId: z.ZodString;
        slug: z.ZodString;
        name: z.ZodString;
        summary: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        currentVersion: z.ZodNullable<z.ZodString>;
        latestVersion: z.ZodNullable<z.ZodObject<{
            version: z.ZodString;
            summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }>>;
        versions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            version: z.ZodString;
            summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            schemaVersion: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            packageSizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }, {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }>, "many">>;
        publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.ZodTypeAny, "passthrough">>;
}, "strip", z.ZodTypeAny, {
    item: {
        name: string;
        summary: string;
        kitId: string;
        slug: string;
        currentVersion: string | null;
        latestVersion: {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        } | null;
        description?: string | null | undefined;
        categories?: string[] | undefined;
        tags?: string[] | undefined;
        publishedAt?: string | null | undefined;
        versions?: {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }[] | undefined;
        updatedAt?: string | null | undefined;
    } & {
        [k: string]: unknown;
    };
}, {
    item: {
        name: string;
        summary: string;
        kitId: string;
        slug: string;
        currentVersion: string | null;
        latestVersion: {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        } | null;
        description?: string | null | undefined;
        categories?: string[] | undefined;
        tags?: string[] | undefined;
        publishedAt?: string | null | undefined;
        versions?: {
            version: string;
            summary?: string | null | undefined;
            sha256?: string | null | undefined;
            packageSizeBytes?: number | null | undefined;
            publishedAt?: string | null | undefined;
            schemaVersion?: string | null | undefined;
        }[] | undefined;
        updatedAt?: string | null | undefined;
    } & {
        [k: string]: unknown;
    };
}>;
export type PublicKitDetailResponse = z.infer<typeof publicKitDetailResponseSchema>;
/** Routes Forge calls on the Market web app (Seam A). */
export declare const forgeMarketRoutes: {
    readonly download: (slug: string) => string;
    /** Public (no-auth) kit detail proxy for update checks — { item: PublicKitDetail }. */
    readonly kitDetail: (slug: string) => string;
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
