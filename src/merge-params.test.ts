import { expect, it as test } from "vitest";

import { mergeParams } from "./merge-params.js";

test("mergeParams: replaces by default", () => {
  expect(mergeParams("https://site.com?page=1", { page: 2 })).toBe(
    "https://site.com/?page=2",
  );
});

test("mergeParams: asURL option", () => {
  const result = mergeParams(
    "https://site.com?page=1",
    { page: 2 },
    {
      asURL: true,
    },
  );
  expect(result instanceof URL).toBeTruthy();
  expect(result.search).toBe("?page=2");
});
