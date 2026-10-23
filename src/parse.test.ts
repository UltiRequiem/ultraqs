import { expect, it as test } from "vitest";

import { parse } from "./parse.js";
import { stringify } from "./stringify.js";
import { t } from "./schema.js";

test("parse: bare query string, no schema", () => {
  expect(parse("?page=1&tags=a&tags=b")).toStrictEqual({
    page: "1",
    tags: ["a", "b"],
  });
});

test("parse round-trips stringify: default repeat + dot", () => {
  const input = {
    page: 1,
    tags: ["a", "b"],
    filter: { price: { min: 10 } },
  };
  const encoded = stringify(input);
  expect(parse(encoded)).toStrictEqual({
    page: "1",
    tags: ["a", "b"],
    filter: { price: { min: "10" } },
  });
});

test("parse round-trips stringify: comma array", () => {
  const encoded = stringify({ tags: ["a", "b"] }, { array: "comma" });
  expect(parse(encoded, { array: "comma" })).toStrictEqual({
    tags: ["a", "b"],
  });
});

test("parse round-trips stringify: bracket array", () => {
  const encoded = stringify({ tags: ["a", "b"] }, { array: "bracket" });
  expect(parse(encoded, { array: "bracket" })).toStrictEqual({
    tags: ["a", "b"],
  });
});

test("parse round-trips stringify: bracket nested", () => {
  const encoded = stringify(
    { filter: { price: { min: 10 } } },
    {
      nested: "bracket",
    },
  );
  expect(parse(encoded, { nested: "bracket" })).toStrictEqual({
    filter: { price: { min: "10" } },
  });
});

test("parse: schema option produces typed output", () => {
  const result = parse("?page=2&tags=js,ts", {
    array: "comma",
    schema: { page: t.number(), tags: t.array(t.string()) },
  });
  expect(result).toStrictEqual({ page: 2, tags: ["js", "ts"] });
});

test("parse: schema works with a Zod-shaped (duck-typed) schema, no Zod dependency", () => {
  const zodLike = {
    parse(value: unknown): number {
      if (typeof value !== "string") throw new TypeError("expected string");
      return Number(value) * 2;
    },
  };
  const result = parse("?page=3", { schema: { page: zodLike } });
  expect(result).toStrictEqual({ page: 6 });
});
