import { expect, it as test } from "vitest";

import { t, validateParams } from "./schema.js";

test("t.string / t.number / t.boolean parse scalar values", () => {
  expect(t.string().parse("hello")).toBe("hello");
  expect(t.number().parse("42")).toBe(42);
  expect(t.boolean().parse("true")).toBe(true);
  expect(t.boolean().parse("false")).toBe(false);
});

test("t.number throws on non-numeric input", () => {
  expect(() => t.number().parse("nope")).toThrow(TypeError);
});

test("t.boolean throws on invalid input", () => {
  expect(() => t.boolean().parse("yes")).toThrow(TypeError);
});

test("t.number().min()/.max() enforce bounds", () => {
  const schema = t.number().min(1).max(10);
  expect(schema.parse("5")).toBe(5);
  expect(() => schema.parse("0")).toThrow(RangeError);
  expect(() => schema.parse("11")).toThrow(RangeError);
});

test("t.array() maps each element through its schema", () => {
  expect(t.array(t.string()).parse(["a", "b"])).toStrictEqual(["a", "b"]);
  expect(t.array(t.number()).parse(["1", "2"])).toStrictEqual([1, 2]);
  expect(t.array(t.string()).parse("solo")).toStrictEqual(["solo"]);
});

test("optional() lets undefined through, default() substitutes a fallback", () => {
  expect(t.number().optional().parse(undefined)).toBe(undefined);
  expect(t.number().default(7).parse(undefined)).toBe(7);
  expect(t.number().default(7).parse("9")).toBe(9);
});

test("validateParams validates a plain object against a schema map", () => {
  const result = validateParams(
    { page: t.number(), active: t.boolean() },
    { page: "3", active: "true" },
  );
  expect(result).toStrictEqual({ page: 3, active: true });
});

test("validateParams accepts a Zod-shaped (duck-typed) schema, no Zod dependency", () => {
  const zodLike = {
    parse(value: unknown): string {
      if (typeof value !== "string") throw new TypeError("expected string");
      return value.toUpperCase();
    },
  };
  const result = validateParams({ name: zodLike }, { name: "eliaz" });
  expect(result).toStrictEqual({ name: "ELIAZ" });
});
