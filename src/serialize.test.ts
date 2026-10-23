import { expect, it as test } from "vitest";

import { combine, flatten, serializePairs } from "./serialize.js";

test("flatten: value normalization table", () => {
  expect(
    flatten({
      undef: undefined,
      nil: null,
      yes: true,
      no: false,
      empty: "",
      num: 3,
      emptyArray: [],
    }),
  ).toStrictEqual([
    ["yes", "true"],
    ["no", "false"],
    ["empty", ""],
    ["num", "3"],
  ]);
});

test("flatten: keepNull keeps null as empty string", () => {
  expect(flatten({ nil: null }, { keepNull: true })).toStrictEqual([
    ["nil", ""],
  ]);
});

test("flatten: array strategies", () => {
  expect(flatten({ tags: ["a", "b"] }, { array: "repeat" })).toStrictEqual([
    ["tags", "a"],
    ["tags", "b"],
  ]);
  expect(flatten({ tags: ["a", "b"] }, { array: "comma" })).toStrictEqual([
    ["tags", "a,b"],
  ]);
  expect(flatten({ tags: ["a", "b"] }, { array: "bracket" })).toStrictEqual([
    ["tags[]", "a"],
    ["tags[]", "b"],
  ]);
});

test("flatten: nested object strategies", () => {
  const input = { filter: { price: { min: 10, max: 50 } } };
  expect(flatten(input, { nested: "dot" })).toStrictEqual([
    ["filter.price.min", "10"],
    ["filter.price.max", "50"],
  ]);
  expect(flatten(input, { nested: "bracket" })).toStrictEqual([
    ["filter[price][min]", "10"],
    ["filter[price][max]", "50"],
  ]);
});

test("flatten: strict mode throws on unsupported values", () => {
  expect(() => flatten({ fn: () => {} }, { strict: true })).toThrow(TypeError);
  expect(() => flatten({ fn: () => {} })).not.toThrow();
});

test("flatten: signatureSafe rejects arrays and nested objects", () => {
  expect(() => flatten({ tags: ["a"] }, { signatureSafe: true })).toThrow(
    TypeError,
  );
  expect(() => flatten({ nested: { a: 1 } }, { signatureSafe: true })).toThrow(
    TypeError,
  );
});

test("combine: replace/append/preserve merge strategies", () => {
  const existing: [string, string][] = [["page", "1"]];
  const incoming: [string, string][] = [["page", "2"]];

  expect(combine(existing, incoming, "replace")).toStrictEqual([["page", "2"]]);
  expect(combine(existing, incoming, "append")).toStrictEqual([
    ["page", "1"],
    ["page", "2"],
  ]);
  expect(combine(existing, incoming, "preserve")).toStrictEqual([
    ["page", "1"],
  ]);
});

test("serializePairs: sort produces deterministic order", () => {
  const pairs: [string, string][] = [
    ["b", "2"],
    ["a", "1"],
  ];
  expect(serializePairs(pairs, { sort: true })).toBe("a=1&b=2");
});

test("serializePairs: encode:false emits raw, unescaped output", () => {
  expect(serializePairs([["greeting", "hello world"]], { encode: false })).toBe(
    "greeting=hello world",
  );
});

test("serializePairs: signatureSafe produces AWS SigV4-style canonical encoding", () => {
  const pairs: [string, string][] = [
    ["b", "value!"],
    ["a", "with space"],
  ];
  expect(serializePairs(pairs, { signatureSafe: true })).toBe(
    "a=with%20space&b=value%21",
  );
});
