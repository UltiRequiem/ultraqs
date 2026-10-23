import { expect, it as test } from "vitest";

import { query } from "./query-builder.js";

test("query: fluent chaining", () => {
  const result = query("https://site.com")
    .set("page", 1)
    .append("tags", "a")
    .append("tags", "b")
    .delete("draft")
    .toString();

  expect(result).toBe("https://site.com/?page=1&tags=a&tags=b");
});

test("query: set replaces an existing value", () => {
  expect(query("https://site.com?page=1").set("page", 2).toString()).toBe(
    "https://site.com/?page=2",
  );
});

test("query: append adds alongside an existing value", () => {
  expect(query("https://site.com?page=1").append("page", 2).toString()).toBe(
    "https://site.com/?page=1&page=2",
  );
});

test("query: toURL returns a URL instance", () => {
  const result = query("https://site.com").set("page", 1).toURL();
  expect(result instanceof URL).toBeTruthy();
  expect(result.search).toBe("?page=1");
});
