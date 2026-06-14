import { z } from "zod";
/**
 * Schema for environments.json — the public service-domain manifest.
 * API Gateway base URLs are environment-specific infrastructure and are NOT
 * part of the published manifest; services read those from their own env.
 */
export declare const serviceManifestSchema: z.ZodObject<{
    marketApp: z.ZodString;
    profileApp: z.ZodString;
    forgeSite: z.ZodString;
    projectSite: z.ZodString;
}, "strip", z.ZodTypeAny, {
    marketApp: string;
    profileApp: string;
    forgeSite: string;
    projectSite: string;
}, {
    marketApp: string;
    profileApp: string;
    forgeSite: string;
    projectSite: string;
}>;
export type ServiceManifest = z.infer<typeof serviceManifestSchema>;
