import { z } from "zod";
/**
 * AgentKitMarket Audit Log contracts.
 *
 * An append-only record of significant mutations across the Market. Records are
 * never updated or deleted. The canonical store lives in the Market backend;
 * audit is admin-only — there is no public or Forge-facing route.
 *
 * Route builders:
 *   marketBackendAuditRoutes — Seam B (market-app ↔ infra, admin-key)
 *   browserAuditRoutes       — market-app browser (AuthKit cookie, admin only)
 */
export declare const auditActorTypeSchema: z.ZodEnum<["user", "admin", "system"]>;
export type AuditActorType = z.infer<typeof auditActorTypeSchema>;
export declare const auditTargetTypeSchema: z.ZodEnum<["submission", "kit", "org", "membership", "entitlement", "favorite"]>;
export type AuditTargetType = z.infer<typeof auditTargetTypeSchema>;
export declare const auditActionSchema: z.ZodEnum<["submission.created", "submission.validated", "submission.approved", "submission.rejected", "submission.archived", "submission.canceled", "submission.published", "kit.published", "kit.hidden", "kit.unhidden", "kit.removed", "kit.pricing_set", "kit.visibility_set", "kit.transferred", "org.created", "org.member_added", "org.member_removed", "org.invite_accepted", "org.deleted", "entitlement.granted", "entitlement.revoked", "entitlement.subscription_status_set"]>;
export type AuditAction = z.infer<typeof auditActionSchema>;
/** Small JSON record for context (e.g. {fromStatus,toStatus} or {priceCents}). */
export declare const auditMetadataSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>;
export type AuditMetadata = z.infer<typeof auditMetadataSchema>;
export declare const auditEventSchema: z.ZodObject<{
    auditId: z.ZodString;
    timestamp: z.ZodString;
    actorUserId: z.ZodString;
    actorEmail: z.ZodOptional<z.ZodString>;
    actorType: z.ZodEnum<["user", "admin", "system"]>;
    action: z.ZodEnum<["submission.created", "submission.validated", "submission.approved", "submission.rejected", "submission.archived", "submission.canceled", "submission.published", "kit.published", "kit.hidden", "kit.unhidden", "kit.removed", "kit.pricing_set", "kit.visibility_set", "kit.transferred", "org.created", "org.member_added", "org.member_removed", "org.invite_accepted", "org.deleted", "entitlement.granted", "entitlement.revoked", "entitlement.subscription_status_set"]>;
    targetType: z.ZodEnum<["submission", "kit", "org", "membership", "entitlement", "favorite"]>;
    targetId: z.ZodString;
    orgId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    ip: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    auditId: string;
    timestamp: string;
    actorUserId: string;
    actorType: "user" | "admin" | "system";
    action: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set";
    targetType: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite";
    targetId: string;
    actorEmail?: string | undefined;
    orgId?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    ip?: string | undefined;
}, {
    auditId: string;
    timestamp: string;
    actorUserId: string;
    actorType: "user" | "admin" | "system";
    action: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set";
    targetType: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite";
    targetId: string;
    actorEmail?: string | undefined;
    orgId?: string | undefined;
    metadata?: Record<string, string | number | boolean | null> | undefined;
    ip?: string | undefined;
}>;
export type AuditEvent = z.infer<typeof auditEventSchema>;
export declare const listAuditLogsQuerySchema: z.ZodObject<{
    actorUserId: z.ZodOptional<z.ZodString>;
    targetType: z.ZodOptional<z.ZodEnum<["submission", "kit", "org", "membership", "entitlement", "favorite"]>>;
    targetId: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodEnum<["submission.created", "submission.validated", "submission.approved", "submission.rejected", "submission.archived", "submission.canceled", "submission.published", "kit.published", "kit.hidden", "kit.unhidden", "kit.removed", "kit.pricing_set", "kit.visibility_set", "kit.transferred", "org.created", "org.member_added", "org.member_removed", "org.invite_accepted", "org.deleted", "entitlement.granted", "entitlement.revoked", "entitlement.subscription_status_set"]>>;
    since: z.ZodOptional<z.ZodString>;
    until: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    nextToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    actorUserId?: string | undefined;
    action?: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set" | undefined;
    targetType?: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite" | undefined;
    targetId?: string | undefined;
    since?: string | undefined;
    until?: string | undefined;
    limit?: number | undefined;
    nextToken?: string | undefined;
}, {
    actorUserId?: string | undefined;
    action?: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set" | undefined;
    targetType?: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite" | undefined;
    targetId?: string | undefined;
    since?: string | undefined;
    until?: string | undefined;
    limit?: number | undefined;
    nextToken?: string | undefined;
}>;
export type ListAuditLogsQuery = z.infer<typeof listAuditLogsQuerySchema>;
export declare const listAuditLogsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        auditId: z.ZodString;
        timestamp: z.ZodString;
        actorUserId: z.ZodString;
        actorEmail: z.ZodOptional<z.ZodString>;
        actorType: z.ZodEnum<["user", "admin", "system"]>;
        action: z.ZodEnum<["submission.created", "submission.validated", "submission.approved", "submission.rejected", "submission.archived", "submission.canceled", "submission.published", "kit.published", "kit.hidden", "kit.unhidden", "kit.removed", "kit.pricing_set", "kit.visibility_set", "kit.transferred", "org.created", "org.member_added", "org.member_removed", "org.invite_accepted", "org.deleted", "entitlement.granted", "entitlement.revoked", "entitlement.subscription_status_set"]>;
        targetType: z.ZodEnum<["submission", "kit", "org", "membership", "entitlement", "favorite"]>;
        targetId: z.ZodString;
        orgId: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
        ip: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        auditId: string;
        timestamp: string;
        actorUserId: string;
        actorType: "user" | "admin" | "system";
        action: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set";
        targetType: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite";
        targetId: string;
        actorEmail?: string | undefined;
        orgId?: string | undefined;
        metadata?: Record<string, string | number | boolean | null> | undefined;
        ip?: string | undefined;
    }, {
        auditId: string;
        timestamp: string;
        actorUserId: string;
        actorType: "user" | "admin" | "system";
        action: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set";
        targetType: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite";
        targetId: string;
        actorEmail?: string | undefined;
        orgId?: string | undefined;
        metadata?: Record<string, string | number | boolean | null> | undefined;
        ip?: string | undefined;
    }>, "many">;
    nextToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        auditId: string;
        timestamp: string;
        actorUserId: string;
        actorType: "user" | "admin" | "system";
        action: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set";
        targetType: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite";
        targetId: string;
        actorEmail?: string | undefined;
        orgId?: string | undefined;
        metadata?: Record<string, string | number | boolean | null> | undefined;
        ip?: string | undefined;
    }[];
    nextToken?: string | undefined;
}, {
    items: {
        auditId: string;
        timestamp: string;
        actorUserId: string;
        actorType: "user" | "admin" | "system";
        action: "submission.created" | "submission.validated" | "submission.approved" | "submission.rejected" | "submission.archived" | "submission.canceled" | "submission.published" | "kit.published" | "kit.hidden" | "kit.unhidden" | "kit.removed" | "kit.pricing_set" | "kit.visibility_set" | "kit.transferred" | "org.created" | "org.member_added" | "org.member_removed" | "org.invite_accepted" | "org.deleted" | "entitlement.granted" | "entitlement.revoked" | "entitlement.subscription_status_set";
        targetType: "submission" | "kit" | "org" | "membership" | "entitlement" | "favorite";
        targetId: string;
        actorEmail?: string | undefined;
        orgId?: string | undefined;
        metadata?: Record<string, string | number | boolean | null> | undefined;
        ip?: string | undefined;
    }[];
    nextToken?: string | undefined;
}>;
export type ListAuditLogsResponse = z.infer<typeof listAuditLogsResponseSchema>;
export declare const marketBackendAuditRoutes: {
    /** GET /admin/audit-logs?actorUserId&targetType&targetId&action&since&until&limit&nextToken */
    readonly adminListAuditLogs: () => string;
};
export declare const browserAuditRoutes: {
    /** GET /api/admin/audit-logs */
    readonly auditLogs: () => string;
};
