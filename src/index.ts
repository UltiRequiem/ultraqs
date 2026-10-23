/**
 * This module is browser compatible.
 *
 * ultraqs — the safest way to build URLs in TypeScript.
 *
 * https://github.com/UltiRequiem/ultraqs
 *
 * https://ulti.js.org/ultraqs
 *
 * Copyright (c) Eliaz Bobadilla.
 *
 * Released under the MIT License.
 *
 * @module
 */

export { addParams } from "./add-params.js";
export { removeParams } from "./remove-params.js";
export { mergeParams } from "./merge-params.js";
export { parse } from "./parse.js";
export { stringify } from "./stringify.js";
export { query } from "./query-builder.js";
export type { QueryBuilder } from "./query-builder.js";
export { build } from "./template.js";
export { t, validateParams } from "./schema.js";
export type {
  InferSchema,
  NumberSchema,
  Parseable,
  Schema,
  SchemaBuilder,
  SchemaMap,
} from "./schema.js";
export type {
  ArrayStrategy,
  MergeStrategy,
  NestedStrategy,
  SerializeOptions,
} from "./types.js";
