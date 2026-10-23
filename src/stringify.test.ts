import { expect, it as test } from "vitest";

import { stringify } from "./stringify.js";

test("stringify: basic object", () => {
  expect(stringify({ page: 2, tags: ["js", "ts"] })).toBe(
    "page=2&tags=js&tags=ts",
  );
});

test("stringify: comma array strategy", () => {
  expect(stringify({ tags: ["js", "ts"] }, { array: "comma" })).toBe(
    "tags=js,ts",
  );
});

test("stringify: sort option", () => {
  expect(stringify({ b: 2, a: 1 }, { sort: true })).toBe("a=1&b=2");
});
