import { z } from "zod";
/** Schema for environments.json — the ecosystem service manifest. */
export declare const serviceManifestSchema: z.ZodObject<{
    profileApi: z.ZodString;
    marketBackendApi: z.ZodString;
    marketApp: z.ZodString;
    profileApp: z.ZodString;
    forgeSite: z.ZodString;
    projectSite: z.ZodString;
}, "strip", z.ZodTypeAny, {
    profileApi: string;
    marketBackendApi: string;
    marketApp: string;
    profileApp: string;
    forgeSite: string;
    projectSite: string;
}, {
    profileApi: string;
    marketBackendApi: string;
    marketApp: string;
    profileApp: string;
    forgeSite: string;
    projectSite: string;
}>;
export type ServiceManifest = z.infer<typeof serviceManifestSchema>;
