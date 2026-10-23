import { expect, it as test } from "vitest";

import { parseUrlLike, reassemble } from "./url-like.js";

test("parseUrlLike: absolute URL", () => {
  const parsed = parseUrlLike("https://example.com/api?a=1#top");
  expect(parsed.absolute).toBe(true);
  expect(parsed.prefix).toBe("https://example.com");
  expect(parsed.pathname).toBe("/api");
  expect(parsed.search).toBe("a=1");
  expect(parsed.hash).toBe("top");
});

test("parseUrlLike: relative path", () => {
  const parsed = parseUrlLike("/users/1?page=2#section");
  expect(parsed.absolute).toBe(false);
  expect(parsed.prefix).toBe("");
  expect(parsed.pathname).toBe("/users/1");
  expect(parsed.search).toBe("page=2");
  expect(parsed.hash).toBe("section");
});

test("parseUrlLike: bare query string", () => {
  const parsed = parseUrlLike("?page=1&tags=a");
  expect(parsed.absolute).toBe(false);
  expect(parsed.pathname).toBe("");
  expect(parsed.search).toBe("page=1&tags=a");
});

test("reassemble: absolute, string and URL", () => {
  const parsed = parseUrlLike("https://example.com/api");
  expect(reassemble(parsed, "a=1", false)).toBe("https://example.com/api?a=1");
  expect(reassemble(parsed, "a=1", true) instanceof URL).toBeTruthy();
});

test("reassemble: relative stays a string", () => {
  const parsed = parseUrlLike("/users/1");
  expect(reassemble(parsed, "a=1", false)).toBe("/users/1?a=1");
});

test("reassemble: asURL throws for relative input", () => {
  const parsed = parseUrlLike("/users/1");
  expect(() => reassemble(parsed, "a=1", true)).toThrow(TypeError);
});
