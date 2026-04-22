import {
    defineCollections,
    frontmatterSchema,
    defineDocs,
    metaSchema,
} from "fumadocs-mdx/config";

export const docs = defineCollections({
    type: "doc",
    dir: "content/docs",
    schema: frontmatterSchema, // zod schema to validate frontmatter
});


export const meta = defineCollections({
    type: "meta",
    dir: "content/docs",
    schema: metaSchema, // zod schema to validate JSON data
});

export const authdocs = defineCollections({
  type: "doc",
  dir: 'content/authdocs',
  schema: frontmatterSchema,
});

export const authmeta = defineCollections({
  type: "meta",
  dir: "content/authdocs",
  schema: metaSchema,
});


export const backgrounds = defineCollections({
  type: "doc",
  dir: 'content/backgrounds',
  schema: frontmatterSchema,
});

export const backgroundsmeta = defineCollections({
  type: "meta",
  dir: "content/backgrounds",
  schema: metaSchema,
});



