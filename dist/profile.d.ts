import { z } from "zod";
/**
 * AgentKitProfile seam (provider: agentkitprofile-infra profile-api Lambda).
 *
 * Consumers: agentkitprofile-app (trusted /me routes), agentkitmarket-app
 * (public publisher snapshots), future AgentKitAuto.
 */
/** Public-safe profile served by GET /profiles/{userId} and /profiles/handle/{handle}. */
export declare const publicPublisherProfileSchema: z.ZodObject<{
    userId: z.ZodString;
    displayName: z.ZodNullable<z.ZodString>;
    handle: z.ZodNullable<z.ZodString>;
    avatarInitials: z.ZodNullable<z.ZodString>;
    bio: z.ZodNullable<z.ZodString>;
    websiteUrl: z.ZodNullable<z.ZodString>;
    verified: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    userId: string;
    displayName: string | null;
    handle: string | null;
    avatarInitials: string | null;
    bio: string | null;
    websiteUrl: string | null;
    verified: boolean;
}, {
    userId: string;
    displayName: string | null;
    handle: string | null;
    avatarInitials: string | null;
    bio: string | null;
    websiteUrl: string | null;
    verified: boolean;
}>;
export type PublicPublisherProfile = z.infer<typeof publicPublisherProfileSchema>;
/** Snapshot frozen into Market submissions and published kits. */
export declare const publisherSnapshotSchema: z.ZodObject<{
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
}>;
export type PublisherSnapshot = z.infer<typeof publisherSnapshotSchema>;
/**
 * Route builders for the Profile API Gateway.
 * The base URL must be the agentkitprofile-infra API Gateway stage
 * (see environments.json `profileApi`), NOT the profile web app — the web app
 * does not serve these routes.
 *
 * There is intentionally no `/public` suffix on these paths.
 */
export declare const profileRoutes: {
    readonly publicByUserId: (userId: string) => string;
    readonly publicByHandle: (handle: string) => string;
    /** Trusted route — requires x-profile-service-key + x-agentkit-user-* headers. */
    readonly me: () => string;
};
/** Trusted-context headers for the Profile API /me routes. */
export declare const profileTrustedHeaders: {
    readonly serviceKey: "x-profile-service-key";
    readonly userId: "x-agentkit-user-id";
    readonly userRole: "x-agentkit-user-role";
    readonly userEmail: "x-agentkit-user-email";
};
