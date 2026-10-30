import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { buildApp } from "./app.js";

// Load the lockfile so the test can verify the resolved dependency versions
// without relying on a specific package manager or import path.
const lock = JSON.parse(
  readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
) as {
  packages: Record<string, { version?: string }>;
};

const resolved = (name: string) =>
  lock.packages[`node_modules/${name}`]?.version;

function atLeast(actual: string | undefined, minimum: string) {
  if (!actual) return false;
  const a = actual.split(".").map(Number);
  const m = minimum.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, m.length); i++) {
    if ((a[i] ?? 0) > (m[i] ?? 0)) return true;
    if ((a[i] ?? 0) < (m[i] ?? 0)) return false;
  }
  return true;
}

describe("dependency security upgrades", () => {
  test("API still works and advisory-fixed package versions are resolved", async () => {
    // The upgraded Fastify + Zod stack must still boot and route requests.
    const res = await buildApp().inject({
      method: "POST",
      url: "/api/projects",
      payload: { name: "demo", config: { retries: 3 } },
    });
    expect(res.statusCode).toBe(200);

    // Minimum versions that cover every advisory listed in the update notes:
    // fastify >= 5.12.5 (GHSA-4mh8-r7rc-xpvc and earlier),
    // zod >= 4.6.6 (GHSA-mrhx-c7xc-m3w5),
    // vitest/@vitest/mocker >= 4.1.12 (GHSA-82fw-gwwq-j7x9, GHSA-qxg6-89mg-rqv8),
    // vite >= 7.3.7 (the 7.x-line fix for GHSA-587h-7wmj-h5pm,
    // GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw, GHSA-rq7h-c2jc-7f22;
    // 8.3.3 is the equivalent fix on the 8.x line),
    // fast-uri >= 3.1.9 (all ten fast-uri advisories in the 3.x line),
    // find-my-way >= 9.7.0 (GHSA-c96f-x56v-gq3h),
    // postcss >= 8.5.23 (GHSA-r28c-9q8g-f849, GHSA-fxqj-rqcc-2cmp),
    // source-map-js >= 1.2.2 (GHSA-68fv-2mgg-jv7q),
    // nanoid >= 3.3.18 (GHSA-28wg-ghj8-5hjv, GHSA-2v37-7h3g-55p8).
    const minimum = {
      "fastify": "5.12.5",
      "zod": "4.6.6",
      "vitest": "4.1.12",
      "@vitest/mocker": "4.1.12",
      "vite": "7.3.7",
      "fast-uri": "3.1.9",
      "find-my-way": "9.7.0",
      "postcss": "8.5.23",
      "source-map-js": "1.2.2",
      "nanoid": "3.3.18",
    };
    for (const [name, version] of Object.entries(minimum)) {
      expect(atLeast(resolved(name), version), `${name} >= ${version} (got ${resolved(name)})`).toBe(true);
    }

    // Vitest 4 removed tinypool (replaced by obug), so the vulnerable package is
    // gone from the tree; if it were ever present again it must be >= 2.1.2
    // (GHSA-5gmw-xhrv-c9v3, GHSA-85c8-ppgw-ccpr).
    const tinypoolVersion = resolved("tinypool");
    expect(tinypoolVersion === undefined || atLeast(tinypoolVersion, "2.1.2"))
      .toBe(true);
  });
});
