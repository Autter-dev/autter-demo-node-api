import { describe, expect, test } from "vitest";
import { authenticate } from "./auth.js";
import { buildApp } from "./app.js";

describe("planted API bugs", () => {
  test.fails("rejects inactive keys", () => {
    expect(authenticate("revoked-token")).toBeNull();
  });

  test("does not trust admin role from body", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/admin/users",
      payload: { role: "admin" },
    });

    expect(res.json()).toEqual({ ok: false });
  });

  test("grants admin only for trusted server-side roles", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/api/admin/users",
      headers: { authorization: "Bearer admin-token" },
      payload: { role: "admin" },
    });

    expect(res.json()).toEqual({ ok: true, granted: "admin" });
  });

  test("server responds", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/tokens" });
    expect(res.statusCode).toBe(200);
  });
});
