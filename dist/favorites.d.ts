import { z } from "zod";
/**
 * AgentKitMarket Favorites contracts.
 *
 * A favorite is a cloud-synced REFERENCE to a Market kit — never a copy of kit
 * contents. The canonical store lives in the Market backend and syncs across
 * both clients: desktop AgentKitForge (device-auth bearer) and web
 * AgentKitForge (AuthKit cookie). Cached display metadata (displayName,
 * summary, publisherName) is optional/best-effort to keep favorites cheap.
 *
 * Route builders augment the canonical route table in routes.json:
 *   marketBackendFavoritesRoutes — Seam B (market-app ↔ infra, admin-key)
 *   forgeFavoritesRoutes         — Forge bearer (desktop + web Forge)
 *   browserFavoritesRoutes       — market-app browser (AuthKit cookie)
 */
export declare const favoriteSchema: z.ZodObject<{
    userId: z.ZodString;
    kitId: z.ZodString;
    slug: z.ZodString;
    addedAt: z.ZodString;
    /** Cached display metadata — optional/best-effort, never a kit copy. */
    displayName: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    publisherName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    kitId: string;
    slug: string;
    addedAt: string;
    displayName?: string | undefined;
    summary?: string | undefined;
    publisherName?: string | undefined;
}, {
    userId: string;
    kitId: string;
    slug: string;
    addedAt: string;
    displayName?: string | undefined;
    summary?: string | undefined;
    publisherName?: string | undefined;
}>;
export type Favorite = z.infer<typeof favoriteSchema>;
/** Add a favorite by slug or kitId (at least one required). */
export declare const addFavoriteRequestSchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    kitId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kitId?: string | undefined;
    slug?: string | undefined;
}, {
    kitId?: string | undefined;
    slug?: string | undefined;
}>, {
    kitId?: string | undefined;
    slug?: string | undefined;
}, {
    kitId?: string | undefined;
    slug?: string | undefined;
}>;
export type AddFavoriteRequest = z.infer<typeof addFavoriteRequestSchema>;
export declare const listFavoritesResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        kitId: z.ZodString;
        slug: z.ZodString;
        addedAt: z.ZodString;
        /** Cached display metadata — optional/best-effort, never a kit copy. */
        displayName: z.ZodOptional<z.ZodString>;
        summary: z.ZodOptional<z.ZodString>;
        publisherName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        kitId: string;
        slug: string;
        addedAt: string;
        displayName?: string | undefined;
        summary?: string | undefined;
        publisherName?: string | undefined;
    }, {
        userId: string;
        kitId: string;
        slug: string;
        addedAt: string;
        displayName?: string | undefined;
        summary?: string | undefined;
        publisherName?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        userId: string;
        kitId: string;
        slug: string;
        addedAt: string;
        displayName?: string | undefined;
        summary?: string | undefined;
        publisherName?: string | undefined;
    }[];
}, {
    items: {
        userId: string;
        kitId: string;
        slug: string;
        addedAt: string;
        displayName?: string | undefined;
        summary?: string | undefined;
        publisherName?: string | undefined;
    }[];
}>;
export type ListFavoritesResponse = z.infer<typeof listFavoritesResponseSchema>;
export declare const removeFavoriteResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    kitId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kitId: string;
    ok: true;
}, {
    kitId: string;
    ok: true;
}>;
export type RemoveFavoriteResponse = z.infer<typeof removeFavoriteResponseSchema>;
export declare const marketBackendFavoritesRoutes: {
    /** GET /admin/users/{userId}/favorites */
    readonly adminListUserFavorites: (userId: string) => string;
    /** POST /admin/users/{userId}/favorites — body {slug|kitId}. */
    readonly adminAddUserFavorite: (userId: string) => string;
    /** DELETE /admin/users/{userId}/favorites/{kitId} */
    readonly adminRemoveUserFavorite: (userId: string, kitId: string) => string;
};
export declare const forgeFavoritesRoutes: {
    /** GET/POST /api/forge/favorites */
    readonly favorites: () => string;
    /** DELETE /api/forge/favorites/{kitId} */
    readonly favorite: (kitId: string) => string;
};
export declare const browserFavoritesRoutes: {
    /** GET/POST /api/favorites */
    readonly favorites: () => string;
    /** DELETE /api/favorites/{kitId} */
    readonly favorite: (kitId: string) => string;
};
