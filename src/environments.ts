import { z } from "zod";

/** Schema for environments.json — the ecosystem service manifest. */
export const serviceManifestSchema = z.object({
  profileApi: z.string().url(),
  marketBackendApi: z.string().url(),
  marketApp: z.string().url(),
  profileApp: z.string().url(),
  forgeSite: z.string().url(),
  projectSite: z.string().url()
});

export type ServiceManifest = z.infer<typeof serviceManifestSchema>;
