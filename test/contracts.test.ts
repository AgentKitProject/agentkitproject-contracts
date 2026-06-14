import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  forgeMarketRoutes,
  forgeUploadBackendRequestSchema,
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

  it("environments.json satisfies the service manifest schema", () => {
    const environments = JSON.parse(
      readFileSync(new URL("../environments.json", import.meta.url), "utf8")
    );
    serviceManifestSchema.parse(environments.production);
  });
});
