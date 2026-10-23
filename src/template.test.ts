import { expect, it as test } from "vitest";

import { build } from "./template.js";

test("build: substitutes placeholders", () => {
  expect(build("/users/:id", { id: 1 })).toBe("/users/1");
});

test("build: appends a query string", () => {
  expect(build("/users/:id", { id: 1 }, { query: { page: 2 } })).toBe(
    "/users/1?page=2",
  );
});

test("build: throws on a missing placeholder", () => {
  expect(() => build("/users/:id", {})).toThrow(TypeError);
});
