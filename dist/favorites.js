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
// ---------------------------------------------------------------------------
// Object schemas
// ---------------------------------------------------------------------------
export const favoriteSchema = z.object({
    userId: z.string().min(1),
    kitId: z.string().min(1),
    slug: z.string().min(1),
    addedAt: z.string(),
    /** Cached display metadata — optional/best-effort, never a kit copy. */
    displayName: z.string().optional(),
    summary: z.string().optional(),
    publisherName: z.string().optional()
});
// ---------------------------------------------------------------------------
// Request / response schemas
// ---------------------------------------------------------------------------
/** Add a favorite by slug or kitId (at least one required). */
export const addFavoriteRequestSchema = z
    .object({
    slug: z.string().min(1).optional(),
    kitId: z.string().min(1).optional()
})
    .refine((v) => Boolean(v.slug || v.kitId), {
    message: "Either slug or kitId is required."
});
export const listFavoritesResponseSchema = z.object({
    items: z.array(favoriteSchema)
});
export const removeFavoriteResponseSchema = z.object({
    ok: z.literal(true),
    kitId: z.string().min(1)
});
// ---------------------------------------------------------------------------
// Route builders (Seam B — market-app ↔ agentkitmarket-infra, admin-key auth)
// ---------------------------------------------------------------------------
export const marketBackendFavoritesRoutes = {
    /** GET /admin/users/{userId}/favorites */
    adminListUserFavorites: (userId) => `/admin/users/${encodeURIComponent(userId)}/favorites`,
    /** POST /admin/users/{userId}/favorites — body {slug|kitId}. */
    adminAddUserFavorite: (userId) => `/admin/users/${encodeURIComponent(userId)}/favorites`,
    /** DELETE /admin/users/{userId}/favorites/{kitId} */
    adminRemoveUserFavorite: (userId, kitId) => `/admin/users/${encodeURIComponent(userId)}/favorites/${encodeURIComponent(kitId)}`
};
// ---------------------------------------------------------------------------
// Route builders (Forge bearer — desktop + web Forge ↔ market-app)
// ---------------------------------------------------------------------------
export const forgeFavoritesRoutes = {
    /** GET/POST /api/forge/favorites */
    favorites: () => "/api/forge/favorites",
    /** DELETE /api/forge/favorites/{kitId} */
    favorite: (kitId) => `/api/forge/favorites/${encodeURIComponent(kitId)}`
};
// ---------------------------------------------------------------------------
// Route builders (market-app browser — AuthKit cookie auth)
// ---------------------------------------------------------------------------
export const browserFavoritesRoutes = {
    /** GET/POST /api/favorites */
    favorites: () => "/api/favorites",
    /** DELETE /api/favorites/{kitId} */
    favorite: (kitId) => `/api/favorites/${encodeURIComponent(kitId)}`
};
