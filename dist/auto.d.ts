import { z } from "zod";
/**
 * AgentKitAuto seams — hosted autonomous Agent Kit runs.
 *
 * These contracts cross the Forge-desktop ↔ web-forge boundary (and the
 * web-forge ↔ worker boundary). They are the contracts-first promotion of the
 * shapes that previously lived locally in `@agentkitforge/auto-core`
 * (src/core/types.ts) and the web-forge Auto route handlers.
 *
 * Auth surfaces (four distinct paths — never conflated):
 *   Seam A (browser):  /api/auto/*          — AuthKit cookie session.
 *   Seam B (Forge):    /api/forge/auto/*    — WorkOS device-auth JWT (Bearer),
 *                       verified server-side via JWKS by requireForgeUser().
 *   Seam C (ingest):   /api/hooks/auto/{webhookId} — per-webhook shared secret
 *                       (header `x-auto-webhook-secret` or `?token=`).
 *   Seam D (internal): /api/internal/auto/* — service key
 *                       (header `x-service-key` or Bearer), server-only.
 *
 * SECRET HANDLING: a webhook is authenticated by a shared secret of which only a
 * sha256 hex HASH (`secretHash`) is ever stored. The plaintext is shown to the
 * user ONCE in the CREATE response (`secret`) and is NEVER present in any
 * list/get response schema. See `autoWebhookSchema` (no secret) vs
 * `createAutoWebhookResponseSchema` (one-time plaintext).
 */
export declare const autoRunStatusSchema: z.ZodEnum<["queued", "running", "succeeded", "failed", "canceled", "budget_exceeded"]>;
export type AutoRunStatus = z.infer<typeof autoRunStatusSchema>;
/** How a run was triggered. Defaults to "on_demand" for pre-Phase-B records. */
export declare const runTriggerSchema: z.ZodEnum<["on_demand", "schedule", "webhook"]>;
export type RunTrigger = z.infer<typeof runTriggerSchema>;
/** How a run's model inference is billed. */
export declare const inferenceModeSchema: z.ZodEnum<["managed", "byo"]>;
export type InferenceMode = z.infer<typeof inferenceModeSchema>;
/** Outcome of one recorded tool call in the run audit trail. */
export declare const auditOutcomeSchema: z.ZodEnum<["ok", "error", "rejected"]>;
export type AuditOutcome = z.infer<typeof auditOutcomeSchema>;
/** Phase A scope: a per-run ephemeral workspace the run may read + write. */
export declare const approvalScopeSchema: z.ZodLiteral<"workspace_read_write">;
export type ApprovalScope = z.infer<typeof approvalScopeSchema>;
/** Where a run's kit comes from (mirrors Bridge 5 provenance: market | local). */
export declare const kitRefSchema: z.ZodEffects<z.ZodObject<{
    source: z.ZodEnum<["market", "local"]>;
    /** Market kit id (source === "market"). */
    marketKitId: z.ZodOptional<z.ZodString>;
    /** Market slug, denormalised for display (source === "market"). */
    slug: z.ZodOptional<z.ZodString>;
    /** Local kit id (source === "local"). */
    localKitId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    source: "market" | "local";
    marketKitId?: string | undefined;
    slug?: string | undefined;
    localKitId?: string | undefined;
}, {
    source: "market" | "local";
    marketKitId?: string | undefined;
    slug?: string | undefined;
    localKitId?: string | undefined;
}>, {
    source: "market" | "local";
    marketKitId?: string | undefined;
    slug?: string | undefined;
    localKitId?: string | undefined;
}, {
    source: "market" | "local";
    marketKitId?: string | undefined;
    slug?: string | undefined;
    localKitId?: string | undefined;
}>;
export type KitRef = z.infer<typeof kitRefSchema>;
/**
 * Network egress policy for autonomous runs (Phase C).
 *   - `deny_all` (DEFAULT): no egress; the `http_fetch` sandbox tool is absent.
 *   - `allowlist`: egress only to the listed hosts (exact hostname or `*.suffix`
 *     wildcard-suffix), https-only and SSRF-guarded.
 */
export declare const networkPolicySchema: z.ZodUnion<[z.ZodObject<{
    mode: z.ZodLiteral<"deny_all">;
}, "strip", z.ZodTypeAny, {
    mode: "deny_all";
}, {
    mode: "deny_all";
}>, z.ZodObject<{
    mode: z.ZodLiteral<"allowlist">;
    /** Exact hostnames or `*.suffix` wildcard-suffix patterns. */
    hosts: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    mode: "allowlist";
    hosts: string[];
}, {
    mode: "allowlist";
    hosts: string[];
}>]>;
export type NetworkPolicy = z.infer<typeof networkPolicySchema>;
/** The canonical deny-all policy (the default for every approval). */
export declare const DENY_ALL_NETWORK_POLICY: NetworkPolicy;
/**
 * A standing approval: the user's pre-authorization for autonomous runs of a
 * specific kit. The toolAllowlist is the consent surface.
 */
export declare const autoApprovalSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    scope: z.ZodLiteral<"workspace_read_write">;
    /** Tool names the user authorizes for autonomous use. */
    toolAllowlist: z.ZodArray<z.ZodString, "many">;
    /** Network egress policy. Defaults to `{ mode: "deny_all" }`. */
    networkPolicy: z.ZodUnion<[z.ZodObject<{
        mode: z.ZodLiteral<"deny_all">;
    }, "strip", z.ZodTypeAny, {
        mode: "deny_all";
    }, {
        mode: "deny_all";
    }>, z.ZodObject<{
        mode: z.ZodLiteral<"allowlist">;
        /** Exact hostnames or `*.suffix` wildcard-suffix patterns. */
        hosts: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        mode: "allowlist";
        hosts: string[];
    }, {
        mode: "allowlist";
        hosts: string[];
    }>]>;
    /** Ceiling (US cents) a single run under this approval may budget. */
    maxBudgetCents: z.ZodNumber;
    createdAt: z.ZodString;
    /** Set when revoked; a revoked approval never permits a run. */
    revokedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    scope: "workspace_read_write";
    toolAllowlist: string[];
    networkPolicy: {
        mode: "deny_all";
    } | {
        mode: "allowlist";
        hosts: string[];
    };
    maxBudgetCents: number;
    createdAt: string;
    revokedAt: string | null;
}, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    scope: "workspace_read_write";
    toolAllowlist: string[];
    networkPolicy: {
        mode: "deny_all";
    } | {
        mode: "allowlist";
        hosts: string[];
    };
    maxBudgetCents: number;
    createdAt: string;
    revokedAt: string | null;
}>;
export type AutoApproval = z.infer<typeof autoApprovalSchema>;
/** Request body: POST /api/auto/approvals (and the Forge mirror). */
export declare const createAutoApprovalRequestSchema: z.ZodObject<{
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    toolAllowlist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    maxBudgetCents: z.ZodNumber;
    networkPolicy: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        mode: z.ZodLiteral<"deny_all">;
    }, "strip", z.ZodTypeAny, {
        mode: "deny_all";
    }, {
        mode: "deny_all";
    }>, z.ZodObject<{
        mode: z.ZodLiteral<"allowlist">;
        /** Exact hostnames or `*.suffix` wildcard-suffix patterns. */
        hosts: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        mode: "allowlist";
        hosts: string[];
    }, {
        mode: "allowlist";
        hosts: string[];
    }>]>>;
}, "strip", z.ZodTypeAny, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    maxBudgetCents: number;
    toolAllowlist?: string[] | undefined;
    networkPolicy?: {
        mode: "deny_all";
    } | {
        mode: "allowlist";
        hosts: string[];
    } | undefined;
}, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    maxBudgetCents: number;
    toolAllowlist?: string[] | undefined;
    networkPolicy?: {
        mode: "deny_all";
    } | {
        mode: "allowlist";
        hosts: string[];
    } | undefined;
}>;
export type CreateAutoApprovalRequest = z.infer<typeof createAutoApprovalRequestSchema>;
/** Response body: GET /api/auto/approvals. */
export declare const listAutoApprovalsResponseSchema: z.ZodObject<{
    approvals: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        kitRef: z.ZodEffects<z.ZodObject<{
            source: z.ZodEnum<["market", "local"]>;
            /** Market kit id (source === "market"). */
            marketKitId: z.ZodOptional<z.ZodString>;
            /** Market slug, denormalised for display (source === "market"). */
            slug: z.ZodOptional<z.ZodString>;
            /** Local kit id (source === "local"). */
            localKitId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>;
        scope: z.ZodLiteral<"workspace_read_write">;
        /** Tool names the user authorizes for autonomous use. */
        toolAllowlist: z.ZodArray<z.ZodString, "many">;
        /** Network egress policy. Defaults to `{ mode: "deny_all" }`. */
        networkPolicy: z.ZodUnion<[z.ZodObject<{
            mode: z.ZodLiteral<"deny_all">;
        }, "strip", z.ZodTypeAny, {
            mode: "deny_all";
        }, {
            mode: "deny_all";
        }>, z.ZodObject<{
            mode: z.ZodLiteral<"allowlist">;
            /** Exact hostnames or `*.suffix` wildcard-suffix patterns. */
            hosts: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            mode: "allowlist";
            hosts: string[];
        }, {
            mode: "allowlist";
            hosts: string[];
        }>]>;
        /** Ceiling (US cents) a single run under this approval may budget. */
        maxBudgetCents: z.ZodNumber;
        createdAt: z.ZodString;
        /** Set when revoked; a revoked approval never permits a run. */
        revokedAt: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        scope: "workspace_read_write";
        toolAllowlist: string[];
        networkPolicy: {
            mode: "deny_all";
        } | {
            mode: "allowlist";
            hosts: string[];
        };
        maxBudgetCents: number;
        createdAt: string;
        revokedAt: string | null;
    }, {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        scope: "workspace_read_write";
        toolAllowlist: string[];
        networkPolicy: {
            mode: "deny_all";
        } | {
            mode: "allowlist";
            hosts: string[];
        };
        maxBudgetCents: number;
        createdAt: string;
        revokedAt: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    approvals: {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        scope: "workspace_read_write";
        toolAllowlist: string[];
        networkPolicy: {
            mode: "deny_all";
        } | {
            mode: "allowlist";
            hosts: string[];
        };
        maxBudgetCents: number;
        createdAt: string;
        revokedAt: string | null;
    }[];
}, {
    approvals: {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        scope: "workspace_read_write";
        toolAllowlist: string[];
        networkPolicy: {
            mode: "deny_all";
        } | {
            mode: "allowlist";
            hosts: string[];
        };
        maxBudgetCents: number;
        createdAt: string;
        revokedAt: string | null;
    }[];
}>;
export type ListAutoApprovalsResponse = z.infer<typeof listAutoApprovalsResponseSchema>;
/** A per-run input file the user supplies inline (seeded at workspace root). */
export declare const autoRunInputFileSchema: z.ZodObject<{
    /** Workspace-relative path. */
    path: z.ZodString;
    /** UTF-8 file contents. */
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    content: string;
}, {
    path: string;
    content: string;
}>;
export type AutoRunInputFile = z.infer<typeof autoRunInputFileSchema>;
/**
 * A manifest entry for a per-run input file staged OUT-OF-BAND (Phase C).
 * References content staged in the InputStore; hydrated into `inputs/`.
 */
export declare const autoRunInputFileRefSchema: z.ZodObject<{
    /** Workspace-relative path under `inputs/` (path-confined; no traversal). */
    path: z.ZodString;
    /** Backing object key in the InputStore (e.g. an S3 key). Optional for local. */
    s3Key: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path: string;
    s3Key?: string | undefined;
}, {
    path: string;
    s3Key?: string | undefined;
}>;
export type AutoRunInputFileRef = z.infer<typeof autoRunInputFileRefSchema>;
export declare const autoRunInputSchema: z.ZodObject<{
    /** User-provided per-run instruction string (the task). */
    prompt: z.ZodString;
    /** Optional inline files seeded into the workspace root before execution. */
    files: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Workspace-relative path. */
        path: z.ZodString;
        /** UTF-8 file contents. */
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        content: string;
    }, {
        path: string;
        content: string;
    }>, "many">>;
    /** Optional structured trigger event (Phase C webhooks). */
    event: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    files?: {
        path: string;
        content: string;
    }[] | undefined;
    event?: unknown;
}, {
    prompt: string;
    files?: {
        path: string;
        content: string;
    }[] | undefined;
    event?: unknown;
}>;
export type AutoRunInput = z.infer<typeof autoRunInputSchema>;
/** One file produced by the run, surfaced in the result manifest. */
export declare const workspaceFileEntrySchema: z.ZodObject<{
    /** Workspace-relative path. */
    path: z.ZodString;
    /** Byte size of the file. */
    sizeBytes: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    path: string;
    sizeBytes: number;
}, {
    path: string;
    sizeBytes: number;
}>;
export type WorkspaceFileEntry = z.infer<typeof workspaceFileEntrySchema>;
/** Terminal result of a successful (or partially-progressed) run. */
export declare const autoRunResultSchema: z.ZodObject<{
    /** Final assistant output text. */
    output: z.ZodString;
    /** Manifest of files present in the workspace at completion. */
    files: z.ZodArray<z.ZodObject<{
        /** Workspace-relative path. */
        path: z.ZodString;
        /** Byte size of the file. */
        sizeBytes: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        path: string;
        sizeBytes: number;
    }, {
        path: string;
        sizeBytes: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    files: {
        path: string;
        sizeBytes: number;
    }[];
    output: string;
}, {
    files: {
        path: string;
        sizeBytes: number;
    }[];
    output: string;
}>;
export type AutoRunResult = z.infer<typeof autoRunResultSchema>;
/** A single recorded tool call (the audit trail of what the agent did). */
export declare const auditEntrySchema: z.ZodObject<{
    /** The tool invoked. */
    tool: z.ZodString;
    /** A short, non-sensitive summary of the args (e.g. the path). */
    argsSummary: z.ZodString;
    outcome: z.ZodEnum<["ok", "error", "rejected"]>;
    /** ISO 8601 timestamp. */
    ts: z.ZodString;
    /** Optional short detail (error message / rejection reason). */
    detail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tool: string;
    argsSummary: string;
    outcome: "ok" | "error" | "rejected";
    ts: string;
    detail?: string | undefined;
}, {
    tool: string;
    argsSummary: string;
    outcome: "ok" | "error" | "rejected";
    ts: string;
    detail?: string | undefined;
}>;
export type AuditEntry = z.infer<typeof auditEntrySchema>;
/** The persisted record of one autonomous run. */
export declare const autoRunSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    status: z.ZodEnum<["queued", "running", "succeeded", "failed", "canceled", "budget_exceeded"]>;
    input: z.ZodObject<{
        /** User-provided per-run instruction string (the task). */
        prompt: z.ZodString;
        /** Optional inline files seeded into the workspace root before execution. */
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            /** Workspace-relative path. */
            path: z.ZodString;
            /** UTF-8 file contents. */
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            content: string;
        }, {
            path: string;
            content: string;
        }>, "many">>;
        /** Optional structured trigger event (Phase C webhooks). */
        event: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }>;
    /** REQUIRED per-run budget in US cents. No default. */
    budgetCents: z.ZodNumber;
    /** Cents debited so far (sum of per-turn settled debits). */
    spentCents: z.ZodNumber;
    /** Cents debited for INFERENCE only. 0 in BYO mode. Absent on legacy records. */
    spentInferenceCents: z.ZodOptional<z.ZodNumber>;
    /** Cents debited for the per-minute cloud-run compute fee (BYO + cloud only). */
    spentComputeCents: z.ZodOptional<z.ZodNumber>;
    /** How inference is billed. Defaults to "managed" for legacy records. */
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
    /** True when the run executes on OUR hosted compute. */
    isCloudRun: z.ZodOptional<z.ZodBoolean>;
    /** Per-minute cloud-run compute fee (cents); only meaningful for BYO + cloud. */
    cloudRunCentsPerMin: z.ZodOptional<z.ZodNumber>;
    /** Canonical model id (e.g. "claude-sonnet-4-6"). */
    model: z.ZodString;
    createdAt: z.ZodString;
    startedAt: z.ZodOptional<z.ZodString>;
    finishedAt: z.ZodOptional<z.ZodString>;
    /** Final output + workspace manifest (set on success / partial completion). */
    result: z.ZodOptional<z.ZodObject<{
        /** Final assistant output text. */
        output: z.ZodString;
        /** Manifest of files present in the workspace at completion. */
        files: z.ZodArray<z.ZodObject<{
            /** Workspace-relative path. */
            path: z.ZodString;
            /** Byte size of the file. */
            sizeBytes: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            path: string;
            sizeBytes: number;
        }, {
            path: string;
            sizeBytes: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        files: {
            path: string;
            sizeBytes: number;
        }[];
        output: string;
    }, {
        files: {
            path: string;
            sizeBytes: number;
        }[];
        output: string;
    }>>;
    /** Failure message (status === "failed"). */
    error: z.ZodOptional<z.ZodString>;
    /** Append-only audit log of tool calls. */
    auditLog: z.ZodArray<z.ZodObject<{
        /** The tool invoked. */
        tool: z.ZodString;
        /** A short, non-sensitive summary of the args (e.g. the path). */
        argsSummary: z.ZodString;
        outcome: z.ZodEnum<["ok", "error", "rejected"]>;
        /** ISO 8601 timestamp. */
        ts: z.ZodString;
        /** Optional short detail (error message / rejection reason). */
        detail: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tool: string;
        argsSummary: string;
        outcome: "ok" | "error" | "rejected";
        ts: string;
        detail?: string | undefined;
    }, {
        tool: string;
        argsSummary: string;
        outcome: "ok" | "error" | "rejected";
        ts: string;
        detail?: string | undefined;
    }>, "many">;
    /** The ephemeral workspace backing this run (set when execution starts). */
    workspaceId: z.ZodOptional<z.ZodString>;
    /** True when a kill-switch cancel was requested for this run. */
    cancelRequested: z.ZodOptional<z.ZodBoolean>;
    /** How this run was triggered. Defaults to "on_demand" when absent. */
    trigger: z.ZodOptional<z.ZodEnum<["on_demand", "schedule", "webhook"]>>;
    /** The AutoSchedule that produced this run (iff trigger === "schedule"). */
    scheduleId: z.ZodOptional<z.ZodString>;
    /** The AutoWebhook that produced this run (iff trigger === "webhook"). */
    webhookId: z.ZodOptional<z.ZodString>;
    /** Out-of-band staged input-file manifest (Phase C). */
    inputFiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Workspace-relative path under `inputs/` (path-confined; no traversal). */
        path: z.ZodString;
        /** Backing object key in the InputStore (e.g. an S3 key). Optional for local. */
        s3Key: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        s3Key?: string | undefined;
    }, {
        path: string;
        s3Key?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    input: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    };
    budgetCents: number;
    spentCents: number;
    model: string;
    auditLog: {
        tool: string;
        argsSummary: string;
        outcome: "ok" | "error" | "rejected";
        ts: string;
        detail?: string | undefined;
    }[];
    error?: string | undefined;
    spentInferenceCents?: number | undefined;
    spentComputeCents?: number | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    isCloudRun?: boolean | undefined;
    cloudRunCentsPerMin?: number | undefined;
    startedAt?: string | undefined;
    finishedAt?: string | undefined;
    result?: {
        files: {
            path: string;
            sizeBytes: number;
        }[];
        output: string;
    } | undefined;
    workspaceId?: string | undefined;
    cancelRequested?: boolean | undefined;
    trigger?: "on_demand" | "schedule" | "webhook" | undefined;
    scheduleId?: string | undefined;
    webhookId?: string | undefined;
    inputFiles?: {
        path: string;
        s3Key?: string | undefined;
    }[] | undefined;
}, {
    status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    input: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    };
    budgetCents: number;
    spentCents: number;
    model: string;
    auditLog: {
        tool: string;
        argsSummary: string;
        outcome: "ok" | "error" | "rejected";
        ts: string;
        detail?: string | undefined;
    }[];
    error?: string | undefined;
    spentInferenceCents?: number | undefined;
    spentComputeCents?: number | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    isCloudRun?: boolean | undefined;
    cloudRunCentsPerMin?: number | undefined;
    startedAt?: string | undefined;
    finishedAt?: string | undefined;
    result?: {
        files: {
            path: string;
            sizeBytes: number;
        }[];
        output: string;
    } | undefined;
    workspaceId?: string | undefined;
    cancelRequested?: boolean | undefined;
    trigger?: "on_demand" | "schedule" | "webhook" | undefined;
    scheduleId?: string | undefined;
    webhookId?: string | undefined;
    inputFiles?: {
        path: string;
        s3Key?: string | undefined;
    }[] | undefined;
}>;
export type AutoRun = z.infer<typeof autoRunSchema>;
/**
 * Request body: POST /api/auto/runs (and the Forge mirror). `input` may be a
 * full AutoRunInput, or a bare top-level `prompt` is accepted for convenience.
 */
export declare const createAutoRunRequestSchema: z.ZodObject<{
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    input: z.ZodOptional<z.ZodObject<{
        /** User-provided per-run instruction string (the task). */
        prompt: z.ZodString;
        /** Optional inline files seeded into the workspace root before execution. */
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            /** Workspace-relative path. */
            path: z.ZodString;
            /** UTF-8 file contents. */
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            content: string;
        }, {
            path: string;
            content: string;
        }>, "many">>;
        /** Optional structured trigger event (Phase C webhooks). */
        event: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }>>;
    /** Convenience: top-level prompt when `input` is omitted. */
    prompt: z.ZodOptional<z.ZodString>;
    budgetCents: z.ZodNumber;
    model: z.ZodOptional<z.ZodString>;
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
    inputFiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Workspace-relative path under `inputs/` (path-confined; no traversal). */
        path: z.ZodString;
        /** Backing object key in the InputStore (e.g. an S3 key). Optional for local. */
        s3Key: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        s3Key?: string | undefined;
    }, {
        path: string;
        s3Key?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    budgetCents: number;
    prompt?: string | undefined;
    input?: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    } | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    model?: string | undefined;
    inputFiles?: {
        path: string;
        s3Key?: string | undefined;
    }[] | undefined;
}, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    budgetCents: number;
    prompt?: string | undefined;
    input?: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    } | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    model?: string | undefined;
    inputFiles?: {
        path: string;
        s3Key?: string | undefined;
    }[] | undefined;
}>;
export type CreateAutoRunRequest = z.infer<typeof createAutoRunRequestSchema>;
/** Compact acknowledgement returned when a run is created (or fired). */
export declare const autoRunAckSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["queued", "running", "succeeded", "failed", "canceled", "budget_exceeded"]>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
    id: string;
    createdAt: string;
}, {
    status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
    id: string;
    createdAt: string;
}>;
export type AutoRunAck = z.infer<typeof autoRunAckSchema>;
/** Response body: GET /api/auto/runs. */
export declare const listAutoRunsResponseSchema: z.ZodObject<{
    runs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        kitRef: z.ZodEffects<z.ZodObject<{
            source: z.ZodEnum<["market", "local"]>;
            /** Market kit id (source === "market"). */
            marketKitId: z.ZodOptional<z.ZodString>;
            /** Market slug, denormalised for display (source === "market"). */
            slug: z.ZodOptional<z.ZodString>;
            /** Local kit id (source === "local"). */
            localKitId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>;
        status: z.ZodEnum<["queued", "running", "succeeded", "failed", "canceled", "budget_exceeded"]>;
        input: z.ZodObject<{
            /** User-provided per-run instruction string (the task). */
            prompt: z.ZodString;
            /** Optional inline files seeded into the workspace root before execution. */
            files: z.ZodOptional<z.ZodArray<z.ZodObject<{
                /** Workspace-relative path. */
                path: z.ZodString;
                /** UTF-8 file contents. */
                content: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                path: string;
                content: string;
            }, {
                path: string;
                content: string;
            }>, "many">>;
            /** Optional structured trigger event (Phase C webhooks). */
            event: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        }, {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        }>;
        /** REQUIRED per-run budget in US cents. No default. */
        budgetCents: z.ZodNumber;
        /** Cents debited so far (sum of per-turn settled debits). */
        spentCents: z.ZodNumber;
        /** Cents debited for INFERENCE only. 0 in BYO mode. Absent on legacy records. */
        spentInferenceCents: z.ZodOptional<z.ZodNumber>;
        /** Cents debited for the per-minute cloud-run compute fee (BYO + cloud only). */
        spentComputeCents: z.ZodOptional<z.ZodNumber>;
        /** How inference is billed. Defaults to "managed" for legacy records. */
        inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
        /** True when the run executes on OUR hosted compute. */
        isCloudRun: z.ZodOptional<z.ZodBoolean>;
        /** Per-minute cloud-run compute fee (cents); only meaningful for BYO + cloud. */
        cloudRunCentsPerMin: z.ZodOptional<z.ZodNumber>;
        /** Canonical model id (e.g. "claude-sonnet-4-6"). */
        model: z.ZodString;
        createdAt: z.ZodString;
        startedAt: z.ZodOptional<z.ZodString>;
        finishedAt: z.ZodOptional<z.ZodString>;
        /** Final output + workspace manifest (set on success / partial completion). */
        result: z.ZodOptional<z.ZodObject<{
            /** Final assistant output text. */
            output: z.ZodString;
            /** Manifest of files present in the workspace at completion. */
            files: z.ZodArray<z.ZodObject<{
                /** Workspace-relative path. */
                path: z.ZodString;
                /** Byte size of the file. */
                sizeBytes: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                path: string;
                sizeBytes: number;
            }, {
                path: string;
                sizeBytes: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            files: {
                path: string;
                sizeBytes: number;
            }[];
            output: string;
        }, {
            files: {
                path: string;
                sizeBytes: number;
            }[];
            output: string;
        }>>;
        /** Failure message (status === "failed"). */
        error: z.ZodOptional<z.ZodString>;
        /** Append-only audit log of tool calls. */
        auditLog: z.ZodArray<z.ZodObject<{
            /** The tool invoked. */
            tool: z.ZodString;
            /** A short, non-sensitive summary of the args (e.g. the path). */
            argsSummary: z.ZodString;
            outcome: z.ZodEnum<["ok", "error", "rejected"]>;
            /** ISO 8601 timestamp. */
            ts: z.ZodString;
            /** Optional short detail (error message / rejection reason). */
            detail: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            tool: string;
            argsSummary: string;
            outcome: "ok" | "error" | "rejected";
            ts: string;
            detail?: string | undefined;
        }, {
            tool: string;
            argsSummary: string;
            outcome: "ok" | "error" | "rejected";
            ts: string;
            detail?: string | undefined;
        }>, "many">;
        /** The ephemeral workspace backing this run (set when execution starts). */
        workspaceId: z.ZodOptional<z.ZodString>;
        /** True when a kill-switch cancel was requested for this run. */
        cancelRequested: z.ZodOptional<z.ZodBoolean>;
        /** How this run was triggered. Defaults to "on_demand" when absent. */
        trigger: z.ZodOptional<z.ZodEnum<["on_demand", "schedule", "webhook"]>>;
        /** The AutoSchedule that produced this run (iff trigger === "schedule"). */
        scheduleId: z.ZodOptional<z.ZodString>;
        /** The AutoWebhook that produced this run (iff trigger === "webhook"). */
        webhookId: z.ZodOptional<z.ZodString>;
        /** Out-of-band staged input-file manifest (Phase C). */
        inputFiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
            /** Workspace-relative path under `inputs/` (path-confined; no traversal). */
            path: z.ZodString;
            /** Backing object key in the InputStore (e.g. an S3 key). Optional for local. */
            s3Key: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            s3Key?: string | undefined;
        }, {
            path: string;
            s3Key?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        spentCents: number;
        model: string;
        auditLog: {
            tool: string;
            argsSummary: string;
            outcome: "ok" | "error" | "rejected";
            ts: string;
            detail?: string | undefined;
        }[];
        error?: string | undefined;
        spentInferenceCents?: number | undefined;
        spentComputeCents?: number | undefined;
        inferenceMode?: "managed" | "byo" | undefined;
        isCloudRun?: boolean | undefined;
        cloudRunCentsPerMin?: number | undefined;
        startedAt?: string | undefined;
        finishedAt?: string | undefined;
        result?: {
            files: {
                path: string;
                sizeBytes: number;
            }[];
            output: string;
        } | undefined;
        workspaceId?: string | undefined;
        cancelRequested?: boolean | undefined;
        trigger?: "on_demand" | "schedule" | "webhook" | undefined;
        scheduleId?: string | undefined;
        webhookId?: string | undefined;
        inputFiles?: {
            path: string;
            s3Key?: string | undefined;
        }[] | undefined;
    }, {
        status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        spentCents: number;
        model: string;
        auditLog: {
            tool: string;
            argsSummary: string;
            outcome: "ok" | "error" | "rejected";
            ts: string;
            detail?: string | undefined;
        }[];
        error?: string | undefined;
        spentInferenceCents?: number | undefined;
        spentComputeCents?: number | undefined;
        inferenceMode?: "managed" | "byo" | undefined;
        isCloudRun?: boolean | undefined;
        cloudRunCentsPerMin?: number | undefined;
        startedAt?: string | undefined;
        finishedAt?: string | undefined;
        result?: {
            files: {
                path: string;
                sizeBytes: number;
            }[];
            output: string;
        } | undefined;
        workspaceId?: string | undefined;
        cancelRequested?: boolean | undefined;
        trigger?: "on_demand" | "schedule" | "webhook" | undefined;
        scheduleId?: string | undefined;
        webhookId?: string | undefined;
        inputFiles?: {
            path: string;
            s3Key?: string | undefined;
        }[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    runs: {
        status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        spentCents: number;
        model: string;
        auditLog: {
            tool: string;
            argsSummary: string;
            outcome: "ok" | "error" | "rejected";
            ts: string;
            detail?: string | undefined;
        }[];
        error?: string | undefined;
        spentInferenceCents?: number | undefined;
        spentComputeCents?: number | undefined;
        inferenceMode?: "managed" | "byo" | undefined;
        isCloudRun?: boolean | undefined;
        cloudRunCentsPerMin?: number | undefined;
        startedAt?: string | undefined;
        finishedAt?: string | undefined;
        result?: {
            files: {
                path: string;
                sizeBytes: number;
            }[];
            output: string;
        } | undefined;
        workspaceId?: string | undefined;
        cancelRequested?: boolean | undefined;
        trigger?: "on_demand" | "schedule" | "webhook" | undefined;
        scheduleId?: string | undefined;
        webhookId?: string | undefined;
        inputFiles?: {
            path: string;
            s3Key?: string | undefined;
        }[] | undefined;
    }[];
}, {
    runs: {
        status: "queued" | "running" | "succeeded" | "failed" | "canceled" | "budget_exceeded";
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        spentCents: number;
        model: string;
        auditLog: {
            tool: string;
            argsSummary: string;
            outcome: "ok" | "error" | "rejected";
            ts: string;
            detail?: string | undefined;
        }[];
        error?: string | undefined;
        spentInferenceCents?: number | undefined;
        spentComputeCents?: number | undefined;
        inferenceMode?: "managed" | "byo" | undefined;
        isCloudRun?: boolean | undefined;
        cloudRunCentsPerMin?: number | undefined;
        startedAt?: string | undefined;
        finishedAt?: string | undefined;
        result?: {
            files: {
                path: string;
                sizeBytes: number;
            }[];
            output: string;
        } | undefined;
        workspaceId?: string | undefined;
        cancelRequested?: boolean | undefined;
        trigger?: "on_demand" | "schedule" | "webhook" | undefined;
        scheduleId?: string | undefined;
        webhookId?: string | undefined;
        inputFiles?: {
            path: string;
            s3Key?: string | undefined;
        }[] | undefined;
    }[];
}>;
export type ListAutoRunsResponse = z.infer<typeof listAutoRunsResponseSchema>;
/** Response body: POST /api/auto/runs/{id}/cancel. */
export declare const cancelAutoRunResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    canceling: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    canceling: true;
}, {
    ok: true;
    canceling: true;
}>;
export type CancelAutoRunResponse = z.infer<typeof cancelAutoRunResponseSchema>;
/** Request body: POST /api/auto/runs/inputs/upload-url. */
export declare const autoRunInputUploadRequestSchema: z.ZodObject<{
    files: z.ZodArray<z.ZodObject<{
        /** Workspace-relative path under `inputs/`. */
        path: z.ZodString;
        contentType: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        contentType?: string | undefined;
    }, {
        path: string;
        contentType?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    files: {
        path: string;
        contentType?: string | undefined;
    }[];
}, {
    files: {
        path: string;
        contentType?: string | undefined;
    }[];
}>;
export type AutoRunInputUploadRequest = z.infer<typeof autoRunInputUploadRequestSchema>;
/** Response body: POST /api/auto/runs/inputs/upload-url. */
export declare const autoRunInputUploadResponseSchema: z.ZodObject<{
    stagingId: z.ZodString;
    slots: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        s3Key: z.ZodString;
        uploadUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        s3Key: string;
        uploadUrl: string;
    }, {
        path: string;
        s3Key: string;
        uploadUrl: string;
    }>, "many">;
    /** The manifest to pass back as `inputFiles` on the create-run request. */
    inputFiles: z.ZodArray<z.ZodObject<{
        /** Workspace-relative path under `inputs/` (path-confined; no traversal). */
        path: z.ZodString;
        /** Backing object key in the InputStore (e.g. an S3 key). Optional for local. */
        s3Key: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        s3Key?: string | undefined;
    }, {
        path: string;
        s3Key?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    inputFiles: {
        path: string;
        s3Key?: string | undefined;
    }[];
    stagingId: string;
    slots: {
        path: string;
        s3Key: string;
        uploadUrl: string;
    }[];
}, {
    inputFiles: {
        path: string;
        s3Key?: string | undefined;
    }[];
    stagingId: string;
    slots: {
        path: string;
        s3Key: string;
        uploadUrl: string;
    }[];
}>;
export type AutoRunInputUploadResponse = z.infer<typeof autoRunInputUploadResponseSchema>;
/** A standing schedule: fires an autonomous run on a recurring cron cadence. */
export declare const autoScheduleSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    /** Standard 5-field cron expression (minute hour dom month dow). */
    cron: z.ZodString;
    /** IANA timezone the cron is evaluated in. Defaults to "UTC". */
    timezone: z.ZodString;
    /** The per-run task input (same shape Phase A runs use). */
    input: z.ZodObject<{
        /** User-provided per-run instruction string (the task). */
        prompt: z.ZodString;
        /** Optional inline files seeded into the workspace root before execution. */
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            /** Workspace-relative path. */
            path: z.ZodString;
            /** UTF-8 file contents. */
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            content: string;
        }, {
            path: string;
            content: string;
        }>, "many">>;
        /** Optional structured trigger event (Phase C webhooks). */
        event: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }>;
    /** REQUIRED per-run budget in US cents. */
    budgetCents: z.ZodNumber;
    /** Canonical model id for fired runs. */
    model: z.ZodString;
    /** The standing AutoApproval id this schedule runs under (denormalised). */
    approvalId: z.ZodString;
    /** Inference billing mode hint for fired runs. Defaults to "managed". */
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
    /** Whether the schedule is active. Disabled schedules never fire. */
    enabled: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    /** ISO of the last fire (null until first fire). */
    lastRunAt: z.ZodNullable<z.ZodString>;
    /** Run id produced by the last fire (null until first successful dispatch). */
    lastRunId: z.ZodNullable<z.ZodString>;
    /** Computed ISO of the NEXT scheduled fire (the due-selection key). */
    nextRunAt: z.ZodString;
    /** Last fire error; null when the last fire was clean. */
    lastError: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    input: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    };
    budgetCents: number;
    model: string;
    cron: string;
    timezone: string;
    approvalId: string;
    enabled: boolean;
    updatedAt: string;
    lastRunAt: string | null;
    lastRunId: string | null;
    nextRunAt: string;
    lastError: string | null;
    inferenceMode?: "managed" | "byo" | undefined;
}, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    input: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    };
    budgetCents: number;
    model: string;
    cron: string;
    timezone: string;
    approvalId: string;
    enabled: boolean;
    updatedAt: string;
    lastRunAt: string | null;
    lastRunId: string | null;
    nextRunAt: string;
    lastError: string | null;
    inferenceMode?: "managed" | "byo" | undefined;
}>;
export type AutoSchedule = z.infer<typeof autoScheduleSchema>;
/** Request body: POST /api/auto/schedules (and the Forge mirror). */
export declare const createAutoScheduleRequestSchema: z.ZodObject<{
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    cron: z.ZodString;
    timezone: z.ZodOptional<z.ZodString>;
    input: z.ZodOptional<z.ZodObject<{
        /** User-provided per-run instruction string (the task). */
        prompt: z.ZodString;
        /** Optional inline files seeded into the workspace root before execution. */
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            /** Workspace-relative path. */
            path: z.ZodString;
            /** UTF-8 file contents. */
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            content: string;
        }, {
            path: string;
            content: string;
        }>, "many">>;
        /** Optional structured trigger event (Phase C webhooks). */
        event: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }>>;
    /** Convenience: top-level prompt when `input` is omitted. */
    prompt: z.ZodOptional<z.ZodString>;
    budgetCents: z.ZodNumber;
    model: z.ZodOptional<z.ZodString>;
    approvalId: z.ZodString;
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
}, "strip", z.ZodTypeAny, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    budgetCents: number;
    cron: string;
    approvalId: string;
    prompt?: string | undefined;
    input?: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    } | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    model?: string | undefined;
    timezone?: string | undefined;
}, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    budgetCents: number;
    cron: string;
    approvalId: string;
    prompt?: string | undefined;
    input?: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    } | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    model?: string | undefined;
    timezone?: string | undefined;
}>;
export type CreateAutoScheduleRequest = z.infer<typeof createAutoScheduleRequestSchema>;
/** Request body: PATCH /api/auto/schedules/{id}. All fields optional. */
export declare const updateAutoScheduleRequestSchema: z.ZodObject<{
    cron: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
    input: z.ZodOptional<z.ZodObject<{
        /** User-provided per-run instruction string (the task). */
        prompt: z.ZodString;
        /** Optional inline files seeded into the workspace root before execution. */
        files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            /** Workspace-relative path. */
            path: z.ZodString;
            /** UTF-8 file contents. */
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            content: string;
        }, {
            path: string;
            content: string;
        }>, "many">>;
        /** Optional structured trigger event (Phase C webhooks). */
        event: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }, {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    }>>;
    prompt: z.ZodOptional<z.ZodString>;
    budgetCents: z.ZodOptional<z.ZodNumber>;
    model: z.ZodOptional<z.ZodString>;
    approvalId: z.ZodOptional<z.ZodString>;
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    prompt?: string | undefined;
    input?: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    } | undefined;
    budgetCents?: number | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    model?: string | undefined;
    cron?: string | undefined;
    timezone?: string | undefined;
    approvalId?: string | undefined;
    enabled?: boolean | undefined;
}, {
    prompt?: string | undefined;
    input?: {
        prompt: string;
        files?: {
            path: string;
            content: string;
        }[] | undefined;
        event?: unknown;
    } | undefined;
    budgetCents?: number | undefined;
    inferenceMode?: "managed" | "byo" | undefined;
    model?: string | undefined;
    cron?: string | undefined;
    timezone?: string | undefined;
    approvalId?: string | undefined;
    enabled?: boolean | undefined;
}>;
export type UpdateAutoScheduleRequest = z.infer<typeof updateAutoScheduleRequestSchema>;
/** Response body: GET /api/auto/schedules. */
export declare const listAutoSchedulesResponseSchema: z.ZodObject<{
    schedules: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        kitRef: z.ZodEffects<z.ZodObject<{
            source: z.ZodEnum<["market", "local"]>;
            /** Market kit id (source === "market"). */
            marketKitId: z.ZodOptional<z.ZodString>;
            /** Market slug, denormalised for display (source === "market"). */
            slug: z.ZodOptional<z.ZodString>;
            /** Local kit id (source === "local"). */
            localKitId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>;
        /** Standard 5-field cron expression (minute hour dom month dow). */
        cron: z.ZodString;
        /** IANA timezone the cron is evaluated in. Defaults to "UTC". */
        timezone: z.ZodString;
        /** The per-run task input (same shape Phase A runs use). */
        input: z.ZodObject<{
            /** User-provided per-run instruction string (the task). */
            prompt: z.ZodString;
            /** Optional inline files seeded into the workspace root before execution. */
            files: z.ZodOptional<z.ZodArray<z.ZodObject<{
                /** Workspace-relative path. */
                path: z.ZodString;
                /** UTF-8 file contents. */
                content: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                path: string;
                content: string;
            }, {
                path: string;
                content: string;
            }>, "many">>;
            /** Optional structured trigger event (Phase C webhooks). */
            event: z.ZodOptional<z.ZodUnknown>;
        }, "strip", z.ZodTypeAny, {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        }, {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        }>;
        /** REQUIRED per-run budget in US cents. */
        budgetCents: z.ZodNumber;
        /** Canonical model id for fired runs. */
        model: z.ZodString;
        /** The standing AutoApproval id this schedule runs under (denormalised). */
        approvalId: z.ZodString;
        /** Inference billing mode hint for fired runs. Defaults to "managed". */
        inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
        /** Whether the schedule is active. Disabled schedules never fire. */
        enabled: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        /** ISO of the last fire (null until first fire). */
        lastRunAt: z.ZodNullable<z.ZodString>;
        /** Run id produced by the last fire (null until first successful dispatch). */
        lastRunId: z.ZodNullable<z.ZodString>;
        /** Computed ISO of the NEXT scheduled fire (the due-selection key). */
        nextRunAt: z.ZodString;
        /** Last fire error; null when the last fire was clean. */
        lastError: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        model: string;
        cron: string;
        timezone: string;
        approvalId: string;
        enabled: boolean;
        updatedAt: string;
        lastRunAt: string | null;
        lastRunId: string | null;
        nextRunAt: string;
        lastError: string | null;
        inferenceMode?: "managed" | "byo" | undefined;
    }, {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        model: string;
        cron: string;
        timezone: string;
        approvalId: string;
        enabled: boolean;
        updatedAt: string;
        lastRunAt: string | null;
        lastRunId: string | null;
        nextRunAt: string;
        lastError: string | null;
        inferenceMode?: "managed" | "byo" | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    schedules: {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        model: string;
        cron: string;
        timezone: string;
        approvalId: string;
        enabled: boolean;
        updatedAt: string;
        lastRunAt: string | null;
        lastRunId: string | null;
        nextRunAt: string;
        lastError: string | null;
        inferenceMode?: "managed" | "byo" | undefined;
    }[];
}, {
    schedules: {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        input: {
            prompt: string;
            files?: {
                path: string;
                content: string;
            }[] | undefined;
            event?: unknown;
        };
        budgetCents: number;
        model: string;
        cron: string;
        timezone: string;
        approvalId: string;
        enabled: boolean;
        updatedAt: string;
        lastRunAt: string | null;
        lastRunId: string | null;
        nextRunAt: string;
        lastError: string | null;
        inferenceMode?: "managed" | "byo" | undefined;
    }[];
}>;
export type ListAutoSchedulesResponse = z.infer<typeof listAutoSchedulesResponseSchema>;
/**
 * The PERSISTED webhook record (server-internal). Carries `secretHash` (sha256
 * hex of the shared secret) — the plaintext is NEVER stored. This schema must
 * NOT be used to shape any HTTP response; use `publicAutoWebhookSchema` or
 * `createAutoWebhookResponseSchema` instead.
 */
export declare const autoWebhookSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    /** The standing AutoApproval id this webhook runs under (denormalised). */
    approvalId: z.ZodString;
    /** REQUIRED per-fire budget in US cents. */
    budgetCents: z.ZodNumber;
    /** Canonical model id for fired runs. */
    model: z.ZodString;
    /** Inference billing mode hint for fired runs. Defaults to "managed". */
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
    /** Whether the webhook is active. Disabled webhooks never fire. */
    enabled: z.ZodBoolean;
    /** sha256 HEX hash of the shared secret. The plaintext is NEVER stored. */
    secretHash: z.ZodString;
    createdAt: z.ZodString;
    /** ISO of the last fire (null until first fire). */
    lastFiredAt: z.ZodNullable<z.ZodString>;
    /** Run id produced by the last fire (null until first successful dispatch). */
    lastRunId: z.ZodNullable<z.ZodString>;
    /** Last fire error; null when the last fire was clean. */
    lastError: z.ZodNullable<z.ZodString>;
    /** Number of times this webhook has fired (created a run). */
    fireCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    budgetCents: number;
    model: string;
    approvalId: string;
    enabled: boolean;
    lastRunId: string | null;
    lastError: string | null;
    secretHash: string;
    lastFiredAt: string | null;
    fireCount: number;
    inferenceMode?: "managed" | "byo" | undefined;
}, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    budgetCents: number;
    model: string;
    approvalId: string;
    enabled: boolean;
    lastRunId: string | null;
    lastError: string | null;
    secretHash: string;
    lastFiredAt: string | null;
    fireCount: number;
    inferenceMode?: "managed" | "byo" | undefined;
}>;
export type AutoWebhook = z.infer<typeof autoWebhookSchema>;
/**
 * The PUBLIC webhook projection returned by list/get responses. It OMITS
 * `secretHash` (and never carries the plaintext `secret`) and adds the public
 * `ingestUrl` the user POSTs events to. This is the only webhook shape a
 * non-create response may use.
 */
export declare const publicAutoWebhookSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    userId: z.ZodString;
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    /** The standing AutoApproval id this webhook runs under (denormalised). */
    approvalId: z.ZodString;
    /** REQUIRED per-fire budget in US cents. */
    budgetCents: z.ZodNumber;
    /** Canonical model id for fired runs. */
    model: z.ZodString;
    /** Inference billing mode hint for fired runs. Defaults to "managed". */
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
    /** Whether the webhook is active. Disabled webhooks never fire. */
    enabled: z.ZodBoolean;
    /** sha256 HEX hash of the shared secret. The plaintext is NEVER stored. */
    secretHash: z.ZodString;
    createdAt: z.ZodString;
    /** ISO of the last fire (null until first fire). */
    lastFiredAt: z.ZodNullable<z.ZodString>;
    /** Run id produced by the last fire (null until first successful dispatch). */
    lastRunId: z.ZodNullable<z.ZodString>;
    /** Last fire error; null when the last fire was clean. */
    lastError: z.ZodNullable<z.ZodString>;
    /** Number of times this webhook has fired (created a run). */
    fireCount: z.ZodNumber;
}, "secretHash"> & {
    /** Public fire endpoint: /api/hooks/auto/{id}. */
    ingestUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    budgetCents: number;
    model: string;
    approvalId: string;
    enabled: boolean;
    lastRunId: string | null;
    lastError: string | null;
    lastFiredAt: string | null;
    fireCount: number;
    ingestUrl: string;
    inferenceMode?: "managed" | "byo" | undefined;
}, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    budgetCents: number;
    model: string;
    approvalId: string;
    enabled: boolean;
    lastRunId: string | null;
    lastError: string | null;
    lastFiredAt: string | null;
    fireCount: number;
    ingestUrl: string;
    inferenceMode?: "managed" | "byo" | undefined;
}>;
export type PublicAutoWebhook = z.infer<typeof publicAutoWebhookSchema>;
/** Request body: POST /api/auto/webhooks (and the Forge mirror). */
export declare const createAutoWebhookRequestSchema: z.ZodObject<{
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    budgetCents: z.ZodNumber;
    model: z.ZodOptional<z.ZodString>;
    approvalId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    budgetCents: number;
    approvalId: string;
    model?: string | undefined;
}, {
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    budgetCents: number;
    approvalId: string;
    model?: string | undefined;
}>;
export type CreateAutoWebhookRequest = z.infer<typeof createAutoWebhookRequestSchema>;
/**
 * Response body: POST /api/auto/webhooks. This is the ONLY response that carries
 * the one-time plaintext `secret`; it is shown to the user once and can never be
 * retrieved again. `secretHash` is never present here.
 */
export declare const createAutoWebhookResponseSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    userId: z.ZodString;
    kitRef: z.ZodEffects<z.ZodObject<{
        source: z.ZodEnum<["market", "local"]>;
        /** Market kit id (source === "market"). */
        marketKitId: z.ZodOptional<z.ZodString>;
        /** Market slug, denormalised for display (source === "market"). */
        slug: z.ZodOptional<z.ZodString>;
        /** Local kit id (source === "local"). */
        localKitId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }, {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    }>;
    /** The standing AutoApproval id this webhook runs under (denormalised). */
    approvalId: z.ZodString;
    /** REQUIRED per-fire budget in US cents. */
    budgetCents: z.ZodNumber;
    /** Canonical model id for fired runs. */
    model: z.ZodString;
    /** Inference billing mode hint for fired runs. Defaults to "managed". */
    inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
    /** Whether the webhook is active. Disabled webhooks never fire. */
    enabled: z.ZodBoolean;
    /** sha256 HEX hash of the shared secret. The plaintext is NEVER stored. */
    secretHash: z.ZodString;
    createdAt: z.ZodString;
    /** ISO of the last fire (null until first fire). */
    lastFiredAt: z.ZodNullable<z.ZodString>;
    /** Run id produced by the last fire (null until first successful dispatch). */
    lastRunId: z.ZodNullable<z.ZodString>;
    /** Last fire error; null when the last fire was clean. */
    lastError: z.ZodNullable<z.ZodString>;
    /** Number of times this webhook has fired (created a run). */
    fireCount: z.ZodNumber;
}, "secretHash"> & {
    /** Public fire endpoint: /api/hooks/auto/{id}. */
    ingestUrl: z.ZodString;
} & {
    /** One-time plaintext shared secret. Shown ONCE; never retrievable again. */
    secret: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    budgetCents: number;
    model: string;
    approvalId: string;
    enabled: boolean;
    lastRunId: string | null;
    lastError: string | null;
    lastFiredAt: string | null;
    fireCount: number;
    ingestUrl: string;
    secret: string;
    inferenceMode?: "managed" | "byo" | undefined;
}, {
    id: string;
    userId: string;
    kitRef: {
        source: "market" | "local";
        marketKitId?: string | undefined;
        slug?: string | undefined;
        localKitId?: string | undefined;
    };
    createdAt: string;
    budgetCents: number;
    model: string;
    approvalId: string;
    enabled: boolean;
    lastRunId: string | null;
    lastError: string | null;
    lastFiredAt: string | null;
    fireCount: number;
    ingestUrl: string;
    secret: string;
    inferenceMode?: "managed" | "byo" | undefined;
}>;
export type CreateAutoWebhookResponse = z.infer<typeof createAutoWebhookResponseSchema>;
/** Request body: PATCH /api/auto/webhooks/{id} (enable/disable). */
export declare const updateAutoWebhookRequestSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
}, {
    enabled: boolean;
}>;
export type UpdateAutoWebhookRequest = z.infer<typeof updateAutoWebhookRequestSchema>;
/** Response body: GET /api/auto/webhooks. */
export declare const listAutoWebhooksResponseSchema: z.ZodObject<{
    webhooks: z.ZodArray<z.ZodObject<Omit<{
        id: z.ZodString;
        userId: z.ZodString;
        kitRef: z.ZodEffects<z.ZodObject<{
            source: z.ZodEnum<["market", "local"]>;
            /** Market kit id (source === "market"). */
            marketKitId: z.ZodOptional<z.ZodString>;
            /** Market slug, denormalised for display (source === "market"). */
            slug: z.ZodOptional<z.ZodString>;
            /** Local kit id (source === "local"). */
            localKitId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }, {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        }>;
        /** The standing AutoApproval id this webhook runs under (denormalised). */
        approvalId: z.ZodString;
        /** REQUIRED per-fire budget in US cents. */
        budgetCents: z.ZodNumber;
        /** Canonical model id for fired runs. */
        model: z.ZodString;
        /** Inference billing mode hint for fired runs. Defaults to "managed". */
        inferenceMode: z.ZodOptional<z.ZodEnum<["managed", "byo"]>>;
        /** Whether the webhook is active. Disabled webhooks never fire. */
        enabled: z.ZodBoolean;
        /** sha256 HEX hash of the shared secret. The plaintext is NEVER stored. */
        secretHash: z.ZodString;
        createdAt: z.ZodString;
        /** ISO of the last fire (null until first fire). */
        lastFiredAt: z.ZodNullable<z.ZodString>;
        /** Run id produced by the last fire (null until first successful dispatch). */
        lastRunId: z.ZodNullable<z.ZodString>;
        /** Last fire error; null when the last fire was clean. */
        lastError: z.ZodNullable<z.ZodString>;
        /** Number of times this webhook has fired (created a run). */
        fireCount: z.ZodNumber;
    }, "secretHash"> & {
        /** Public fire endpoint: /api/hooks/auto/{id}. */
        ingestUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        budgetCents: number;
        model: string;
        approvalId: string;
        enabled: boolean;
        lastRunId: string | null;
        lastError: string | null;
        lastFiredAt: string | null;
        fireCount: number;
        ingestUrl: string;
        inferenceMode?: "managed" | "byo" | undefined;
    }, {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        budgetCents: number;
        model: string;
        approvalId: string;
        enabled: boolean;
        lastRunId: string | null;
        lastError: string | null;
        lastFiredAt: string | null;
        fireCount: number;
        ingestUrl: string;
        inferenceMode?: "managed" | "byo" | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    webhooks: {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        budgetCents: number;
        model: string;
        approvalId: string;
        enabled: boolean;
        lastRunId: string | null;
        lastError: string | null;
        lastFiredAt: string | null;
        fireCount: number;
        ingestUrl: string;
        inferenceMode?: "managed" | "byo" | undefined;
    }[];
}, {
    webhooks: {
        id: string;
        userId: string;
        kitRef: {
            source: "market" | "local";
            marketKitId?: string | undefined;
            slug?: string | undefined;
            localKitId?: string | undefined;
        };
        createdAt: string;
        budgetCents: number;
        model: string;
        approvalId: string;
        enabled: boolean;
        lastRunId: string | null;
        lastError: string | null;
        lastFiredAt: string | null;
        fireCount: number;
        ingestUrl: string;
        inferenceMode?: "managed" | "byo" | undefined;
    }[];
}>;
export type ListAutoWebhooksResponse = z.infer<typeof listAutoWebhooksResponseSchema>;
/** Generic `{ ok: true }` acknowledgement (DELETE schedules/webhooks). */
export declare const autoOkResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    ok: true;
}, {
    ok: true;
}>;
export type AutoOkResponse = z.infer<typeof autoOkResponseSchema>;
/** Request body: POST /api/internal/auto/resolve-context. */
export declare const resolveContextRequestSchema: z.ZodObject<{
    runId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    runId: string;
}, {
    runId: string;
}>;
export type ResolveContextRequest = z.infer<typeof resolveContextRequestSchema>;
/**
 * Response body: POST /api/internal/auto/resolve-context. The resolved kit
 * execution context the worker needs to run. Lenient (passthrough): the worker
 * reads a stable subset; the resolver may add fields without a breaking change.
 */
export declare const resolveContextResponseSchema: z.ZodObject<{
    /** Composed system prompt for the run. */
    systemPrompt: z.ZodString;
    /** Tool definitions available to the run (provider tool schema; opaque here). */
    tools: z.ZodArray<z.ZodUnknown, "many">;
    /** Convenience list of tool names (intersection of consent + kit + sandbox). */
    toolNames: z.ZodArray<z.ZodString, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    /** Composed system prompt for the run. */
    systemPrompt: z.ZodString;
    /** Tool definitions available to the run (provider tool schema; opaque here). */
    tools: z.ZodArray<z.ZodUnknown, "many">;
    /** Convenience list of tool names (intersection of consent + kit + sandbox). */
    toolNames: z.ZodArray<z.ZodString, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    /** Composed system prompt for the run. */
    systemPrompt: z.ZodString;
    /** Tool definitions available to the run (provider tool schema; opaque here). */
    tools: z.ZodArray<z.ZodUnknown, "many">;
    /** Convenience list of tool names (intersection of consent + kit + sandbox). */
    toolNames: z.ZodArray<z.ZodString, "many">;
}, z.ZodTypeAny, "passthrough">>;
export type ResolveContextResponse = z.infer<typeof resolveContextResponseSchema>;
/** Response body: POST /api/internal/auto/sweep (schedule sweep summary). */
export declare const scheduleSweepSummarySchema: z.ZodObject<{
    processed: z.ZodNumber;
    dispatched: z.ZodNumber;
    skipped: z.ZodNumber;
    errors: z.ZodArray<z.ZodObject<{
        scheduleId: z.ZodString;
        error: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        error: string;
        scheduleId: string;
    }, {
        error: string;
        scheduleId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    processed: number;
    dispatched: number;
    skipped: number;
    errors: {
        error: string;
        scheduleId: string;
    }[];
}, {
    processed: number;
    dispatched: number;
    skipped: number;
    errors: {
        error: string;
        scheduleId: string;
    }[];
}>;
export type ScheduleSweepSummary = z.infer<typeof scheduleSweepSummarySchema>;
/**
 * The complete set of machine-readable error codes returned across the Auto
 * surface (in a `{ error: <code> }` body). `insufficient_balance` responses
 * also carry a `requiredCents` number.
 */
export declare const autoErrorCodeSchema: z.ZodEnum<["invalid_request", "approval_denied", "insufficient_balance", "not_found", "inputs_unconfigured", "unauthorized", "internal_auth_unconfigured"]>;
export type AutoErrorCode = z.infer<typeof autoErrorCodeSchema>;
/** Standard Auto error envelope. */
export declare const autoErrorResponseSchema: z.ZodObject<{
    error: z.ZodEnum<["invalid_request", "approval_denied", "insufficient_balance", "not_found", "inputs_unconfigured", "unauthorized", "internal_auth_unconfigured"]>;
    /** Present on `insufficient_balance`: cents the caller must top up to. */
    requiredCents: z.ZodOptional<z.ZodNumber>;
    /** Optional human-readable detail. */
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    error: "invalid_request" | "approval_denied" | "insufficient_balance" | "not_found" | "inputs_unconfigured" | "unauthorized" | "internal_auth_unconfigured";
    message?: string | undefined;
    requiredCents?: number | undefined;
}, {
    error: "invalid_request" | "approval_denied" | "insufficient_balance" | "not_found" | "inputs_unconfigured" | "unauthorized" | "internal_auth_unconfigured";
    message?: string | undefined;
    requiredCents?: number | undefined;
}>;
export type AutoErrorResponse = z.infer<typeof autoErrorResponseSchema>;
/** Seam C: per-webhook shared secret header for inbound ingest fires. */
export declare const autoWebhookSecretHeader: "x-auto-webhook-secret";
/** Seam D: internal worker service-key header (server-only). */
export declare const autoInternalServiceKeyHeader: "x-service-key";
/** Seam A — browser routes (/api/auto/*, AuthKit cookie). */
export declare const autoRoutes: {
    readonly approvals: () => string;
    readonly revokeApproval: (id: string) => string;
    readonly runs: () => string;
    readonly run: (id: string) => string;
    readonly cancelRun: (id: string) => string;
    readonly runInputsUploadUrl: () => string;
    readonly schedules: () => string;
    readonly schedule: (id: string) => string;
    readonly webhooks: () => string;
    readonly webhook: (id: string) => string;
};
/** Seam B — Forge device-auth routes (/api/forge/auto/*, Bearer JWT). */
export declare const forgeAutoRoutes: {
    readonly approvals: () => string;
    readonly revokeApproval: (id: string) => string;
    readonly runs: () => string;
    readonly run: (id: string) => string;
    readonly cancelRun: (id: string) => string;
    readonly runInputsUploadUrl: () => string;
    readonly schedules: () => string;
    readonly schedule: (id: string) => string;
    readonly webhooks: () => string;
    readonly webhook: (id: string) => string;
};
/** Seam C — public webhook ingest (per-webhook shared secret). */
export declare const autoHookRoutes: {
    readonly ingest: (webhookId: string) => string;
};
/** Seam D — internal worker routes (service-key, server-only). */
export declare const autoInternalRoutes: {
    readonly resolveContext: () => string;
    readonly sweep: () => string;
};
