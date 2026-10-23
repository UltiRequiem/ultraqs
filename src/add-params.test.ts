import { expect, it as test } from "vitest";

import { addParams } from "./add-params.js";

test("addParams: basic usage", () => {
  expect(addParams("https://ulti.js.org", { quantity: 3 })).toBe(
    "https://ulti.js.org/?quantity=3",
  );

  expect(addParams("https://ulti.js.org", { quantity: 3, share: false })).toBe(
    "https://ulti.js.org/?quantity=3&share=false",
  );

  expect(
    addParams(
      new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/toto"),
      { year: 2001, month: "May" },
    ),
  ).toBe("https://developer.mozilla.org/en-US/docs?year=2001&month=May");
});

test("addParams: asURL option returns a URL instance", () => {
  const result = addParams(
    "https://ultirequiem.com",
    { hey: 34 },
    {
      asURL: true,
    },
  );
  expect(result instanceof URL).toBeTruthy();
  expect(result.toString()).toBe("https://ultirequiem.com/?hey=34");
});

test("addParams: arrays, nested objects, and defaults from the polished example", () => {
  expect(
    addParams("https://api.com", {
      page: 1,
      tags: ["tech", "ai"],
      filter: { price: { min: 10, max: 100 } },
      draft: false,
    }),
  ).toBe(
    "https://api.com/?page=1&tags=tech&tags=ai&filter.price.min=10&filter.price.max=100&draft=false",
  );
});

test("addParams: default merge is replace", () => {
  expect(addParams("https://site.com?page=1", { page: 2 })).toBe(
    "https://site.com/?page=2",
  );
});

test("addParams: merge append keeps both values", () => {
  expect(
    addParams("https://site.com?page=1", { page: 2 }, { merge: "append" }),
  ).toBe("https://site.com/?page=1&page=2");
});

test("addParams: merge preserve keeps the existing value", () => {
  expect(
    addParams("https://site.com?page=1", { page: 2 }, { merge: "preserve" }),
  ).toBe("https://site.com/?page=1");
});

test("addParams: relative URLs work without a base", () => {
  expect(addParams("/api", { day: 2 })).toBe("/api?day=2");
});
