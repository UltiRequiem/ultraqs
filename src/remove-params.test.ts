import { expect, it as test } from "vitest";

import { removeParams } from "./remove-params.js";

test("removeParams: single key", () => {
  expect(removeParams("https://api.com?page=1&draft=true", "draft")).toBe(
    "https://api.com/?page=1",
  );
});

test("removeParams: multiple keys", () => {
  expect(
    removeParams("https://api.com?page=1&draft=true&x=1", ["draft", "x"]),
  ).toBe("https://api.com/?page=1");
});

test("removeParams: asURL option", () => {
  const result = removeParams("https://api.com?page=1", "page", {
    asURL: true,
  });
  expect(result instanceof URL).toBeTruthy();
  expect(result.search).toBe("");
});
