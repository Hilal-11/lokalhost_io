// source.config.ts
import {
  defineCollections,
  frontmatterSchema,
  metaSchema
} from "fumadocs-mdx/config";
var docs = defineCollections({
  type: "doc",
  dir: "content/docs",
  schema: frontmatterSchema
  // zod schema to validate frontmatter
});
var meta = defineCollections({
  type: "meta",
  dir: "content/docs",
  schema: metaSchema
  // zod schema to validate JSON data
});
var authdocs = defineCollections({
  type: "doc",
  dir: "content/authdocs",
  schema: frontmatterSchema
});
var authmeta = defineCollections({
  type: "meta",
  dir: "content/authdocs",
  schema: metaSchema
});
var backgrounds = defineCollections({
  type: "doc",
  dir: "content/backgrounds",
  schema: frontmatterSchema
});
var backgroundsmeta = defineCollections({
  type: "meta",
  dir: "content/backgrounds",
  schema: metaSchema
});
export {
  authdocs,
  authmeta,
  backgrounds,
  backgroundsmeta,
  docs,
  meta
};
