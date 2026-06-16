import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  forgeMarketRoutes,
  forgeOrgRoutes,
  forgeUploadBackendRequestSchema,
  marketBackendOrgRoutes,
  marketBackendPricingRoutes,
  forgePricingRoutes,
  entitlementSchema,
  setKitPricingRequestSchema,
  grantEntitlementRequestSchema,
  kitPricingMetadataSchema,
  DEFAULT_KIT_LICENSE_VERSION,
  organizationSchema,
  orgMembershipSchema,
  favoriteSchema,
  addFavoriteRequestSchema,
  listFavoritesResponseSchema,
  marketBackendFavoritesRoutes,
  forgeFavoritesRoutes,
  browserFavoritesRoutes,
  profileRoutes,
  publicKitDetailResponseSchema,
  publicPublisherProfileSchema,
  serviceManifestSchema
} from "../dist/index.js";

const fixture = (name: string) =>
  JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));

describe("contracts", () => {
  it("fixtures satisfy their schemas", () => {
    publicPublisherProfileSchema.parse(fixture("public-publisher-profile.json"));
    forgeUploadBackendRequestSchema.parse(fixture("forge-upload-backend-request.json"));
    publicKitDetailResponseSchema.parse(fixture("public-kit-detail.json"));
  });

  it("route builders match the canonical route table", () => {
    const routes = fixture("routes.json");
    assert.equal(profileRoutes.publicByUserId("{userId}"), routes.profileApi.publicByUserId.replace("{userId}", "%7BuserId%7D"));
    assert.equal(profileRoutes.publicByUserId("u1"), "/profiles/u1");
    assert.equal(profileRoutes.publicByHandle("h1"), "/profiles/handle/h1");
    assert.equal(forgeMarketRoutes.download("my-kit"), "/api/forge/kits/my-kit/download");
    assert.equal(forgeMarketRoutes.kitDetail("my-kit"), "/api/forge/kits/my-kit");
    assert.equal(forgeMarketRoutes.kitDetail("my-kit"), routes.forgeMarket.kitDetail.replace("{slug}", "my-kit"));
    assert.equal(forgeMarketRoutes.submissionUploadUrl(), routes.forgeMarket.submissionUploadUrl);
    assert.equal(forgeMarketRoutes.submissionValidate("s1"), "/api/forge/submissions/s1/validate");
    assert.equal(forgeMarketRoutes.publisherProfile(), routes.forgeMarket.publisherProfile);
  });

  it("profile public route has no /public suffix (regression: Bridge 4 blocker)", () => {
    assert.ok(!profileRoutes.publicByUserId("u1").endsWith("/public"));
  });

  it("org fixtures satisfy their schemas", () => {
    organizationSchema.parse(fixture("organization.json"));
    orgMembershipSchema.parse(fixture("org-membership.json"));
  });

  it("forgeOrgRoutes produce expected paths", () => {
    const routes = fixture("routes.json");
    assert.equal(forgeOrgRoutes.listMyOrgs(), routes.forgeOrgs.listMyOrgs);
    assert.equal(forgeOrgRoutes.createOrg(), routes.forgeOrgs.createOrg);
    assert.equal(
      forgeOrgRoutes.deleteOrg("org1"),
      routes.forgeOrgs.deleteOrg.replace("{orgId}", "org1")
    );
    assert.equal(
      forgeOrgRoutes.orgMembers("org1"),
      routes.forgeOrgs.orgMembers.replace("{orgId}", "org1")
    );
    assert.equal(
      forgeOrgRoutes.orgMember("org1", "user1"),
      routes.forgeOrgs.orgMember.replace("{orgId}", "org1").replace("{userId}", "user1")
    );
    assert.equal(forgeOrgRoutes.myOrgInvites(), routes.forgeOrgs.myOrgInvites);
    assert.equal(
      forgeOrgRoutes.acceptOrgInvite("org1"),
      routes.forgeOrgs.acceptOrgInvite.replace("{orgId}", "org1")
    );
    assert.equal(
      forgeOrgRoutes.transferKit("kit1"),
      routes.forgeOrgs.transferKit.replace("{kitId}", "kit1")
    );
    assert.equal(
      forgeOrgRoutes.setKitVisibility("kit1"),
      routes.forgeOrgs.setKitVisibility.replace("{kitId}", "kit1")
    );
  });

  it("marketBackendOrgRoutes produce expected paths", () => {
    const routes = fixture("routes.json");
    assert.equal(
      marketBackendOrgRoutes.adminListUserOrgs("u1"),
      routes.marketBackendOrgs.adminListUserOrgs.replace("{userId}", "u1")
    );
    assert.equal(marketBackendOrgRoutes.adminCreateOrg(), routes.marketBackendOrgs.adminCreateOrg);
    assert.equal(
      marketBackendOrgRoutes.adminDeleteOrg("org1"),
      routes.marketBackendOrgs.adminDeleteOrg.replace("{orgId}", "org1")
    );
    assert.equal(
      marketBackendOrgRoutes.adminOrgMembers("org1"),
      routes.marketBackendOrgs.adminOrgMembers.replace("{orgId}", "org1")
    );
    assert.equal(
      marketBackendOrgRoutes.adminOrgMember("org1", "u1"),
      routes.marketBackendOrgs.adminOrgMember.replace("{orgId}", "org1").replace("{userId}", "u1")
    );
    assert.equal(
      marketBackendOrgRoutes.adminListUserInvites("u1"),
      routes.marketBackendOrgs.adminListUserInvites.replace("{userId}", "u1")
    );
    assert.equal(
      marketBackendOrgRoutes.adminAcceptInvite("org1", "u1"),
      routes.marketBackendOrgs.adminAcceptInvite.replace("{orgId}", "org1").replace("{userId}", "u1")
    );
    assert.equal(
      marketBackendOrgRoutes.adminTransferKit("kit1"),
      routes.marketBackendOrgs.adminTransferKit.replace("{kitId}", "kit1")
    );
    assert.equal(
      marketBackendOrgRoutes.adminSetKitVisibility("kit1"),
      routes.marketBackendOrgs.adminSetKitVisibility.replace("{kitId}", "kit1")
    );
  });

  it("forgeUploadBackendRequestSchema accepts optional ownerOrgId", () => {
    const base = fixture("forge-upload-backend-request.json");
    forgeUploadBackendRequestSchema.parse({ ...base, ownerOrgId: "org_01HXYZ" });
    forgeUploadBackendRequestSchema.parse(base); // still valid without ownerOrgId
  });

  it("entitlement fixture satisfies its schema", () => {
    entitlementSchema.parse(fixture("entitlement.json"));
  });

  it("kit pricing metadata defaults to free/USD/default-license", () => {
    const parsed = kitPricingMetadataSchema.parse({});
    assert.equal(parsed.pricing, "free");
    assert.equal(parsed.currency, "USD");
    assert.equal(parsed.licenseType, "default");
  });

  it("set-pricing and grant requests parse", () => {
    setKitPricingRequestSchema.parse({
      actorUserId: "u1",
      pricing: "paid",
      priceModel: "subscription",
      priceCents: 999,
      interval: "month"
    });
    grantEntitlementRequestSchema.parse({
      userId: "u1",
      source: "admin_grant",
      licenseVersion: DEFAULT_KIT_LICENSE_VERSION,
      licenseAcceptedAt: "2026-06-15T00:00:00.000Z",
      licenseTextSnapshot: "..."
    });
  });

  it("marketBackendPricingRoutes produce expected paths", () => {
    const routes = fixture("routes.json");
    assert.equal(
      marketBackendPricingRoutes.adminSetKitPricing("kit1"),
      routes.marketBackendPricing.adminSetKitPricing.replace("{kitId}", "kit1")
    );
    assert.equal(
      marketBackendPricingRoutes.adminListUserEntitlements("u1"),
      routes.marketBackendPricing.adminListUserEntitlements.replace("{userId}", "u1")
    );
    assert.equal(
      marketBackendPricingRoutes.adminGetEntitlement("kit1", "u1"),
      routes.marketBackendPricing.adminGetEntitlement
        .replace("{kitId}", "kit1")
        .replace("{userId}", "u1")
    );
    assert.equal(
      marketBackendPricingRoutes.adminGrantEntitlement("kit1"),
      routes.marketBackendPricing.adminGrantEntitlement.replace("{kitId}", "kit1")
    );
    assert.equal(
      marketBackendPricingRoutes.adminLicensedPackage("kit1"),
      routes.marketBackendPricing.adminLicensedPackage.replace("{kitId}", "kit1")
    );
    assert.equal(forgePricingRoutes.myEntitlements(), routes.forgePricing.myEntitlements);
    assert.equal(
      forgePricingRoutes.licensedPackage("my-kit"),
      routes.forgePricing.licensedPackage.replace("{slug}", "my-kit")
    );
  });

  it("favorite fixture and request schemas validate", () => {
    favoriteSchema.parse(fixture("favorite.json"));
    addFavoriteRequestSchema.parse({ slug: "my-kit" });
    addFavoriteRequestSchema.parse({ kitId: "kit1" });
    assert.throws(() => addFavoriteRequestSchema.parse({}));
    listFavoritesResponseSchema.parse({ items: [fixture("favorite.json")] });
  });

  it("favorites routes produce expected paths", () => {
    const routes = fixture("routes.json");
    assert.equal(
      marketBackendFavoritesRoutes.adminListUserFavorites("u1"),
      routes.marketBackendFavorites.adminListUserFavorites.replace("{userId}", "u1")
    );
    assert.equal(
      marketBackendFavoritesRoutes.adminAddUserFavorite("u1"),
      routes.marketBackendFavorites.adminAddUserFavorite.replace("{userId}", "u1")
    );
    assert.equal(
      marketBackendFavoritesRoutes.adminRemoveUserFavorite("u1", "kit1"),
      routes.marketBackendFavorites.adminRemoveUserFavorite
        .replace("{userId}", "u1")
        .replace("{kitId}", "kit1")
    );
    assert.equal(forgeFavoritesRoutes.favorites(), routes.forgeFavorites.favorites);
    assert.equal(
      forgeFavoritesRoutes.favorite("kit1"),
      routes.forgeFavorites.favorite.replace("{kitId}", "kit1")
    );
    assert.equal(browserFavoritesRoutes.favorites(), routes.browserFavorites.favorites);
    assert.equal(
      browserFavoritesRoutes.favorite("kit1"),
      routes.browserFavorites.favorite.replace("{kitId}", "kit1")
    );
  });

  it("environments.json satisfies the service manifest schema", () => {
    const environments = JSON.parse(
      readFileSync(new URL("../environments.json", import.meta.url), "utf8")
    );
    serviceManifestSchema.parse(environments.production);
  });
});
