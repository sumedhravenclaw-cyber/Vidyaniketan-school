import type { SchemaTypeDefinition } from "sanity";

/**
 * CMS schema.
 *
 * These document types mirror the shapes in lib/types.ts, so content authored
 * here drops straight into the same components that render the seed content.
 * Field names match the GROQ projections in lib/content.ts.
 */

const school: SchemaTypeDefinition = {
  name: "school",
  title: "School details",
  type: "document",
  // One record only — the site reads [0].
  fields: [
    { name: "name", title: "Full name", type: "string", validation: (r) => r.required() },
    { name: "shortName", title: "Short name", type: "string" },
    {
      name: "motto",
      title: "Motto",
      type: "object",
      fields: [
        { name: "sanskrit", title: "Sanskrit (Devanagari)", type: "string" },
        { name: "translation", title: "English translation", type: "string" },
      ],
    },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "affiliationNo", title: "CBSE affiliation number", type: "string" },
    { name: "schoolCode", title: "CBSE school code", type: "string" },
    { name: "board", title: "Board", type: "string" },
    {
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        { name: "line1", type: "string", title: "Line 1" },
        { name: "line2", type: "string", title: "Line 2" },
        { name: "city", type: "string", title: "City" },
        { name: "district", type: "string", title: "District" },
        { name: "state", type: "string", title: "State" },
        { name: "pin", type: "string", title: "PIN code" },
      ],
    },
    {
      name: "primaryPhone",
      title: "Primary phone",
      description:
        "The one number published across the whole site. Add any others below, each labelled by purpose.",
      type: "string",
    },
    { name: "altPhones", title: "Other phone numbers", type: "array", of: [{ type: "string" }] },
    { name: "email", title: "Email", type: "string" },
    { name: "officeHours", title: "Office hours", type: "string" },
    {
      name: "social",
      title: "Social channels",
      type: "object",
      fields: [
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "youtube", type: "url", title: "YouTube" },
      ],
    },
  ],
  preview: { select: { title: "name" } },
};

const page: SchemaTypeDefinition = {
  name: "page",
  title: "Content page",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r) => r.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    },
    { name: "metaTitle", title: "Meta title (optional)", type: "string" },
    {
      name: "metaDescription",
      title: "Meta description",
      description: "Around 150 characters. This is what shows under the link in Google.",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(200),
    },
    { name: "intro", title: "Intro paragraph", type: "text", rows: 3 },
    { name: "body", title: "Body paragraphs", type: "array", of: [{ type: "text" }] },
    { name: "bullets", title: "Bullet points", type: "array", of: [{ type: "string" }] },
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
};

const facility: SchemaTypeDefinition = {
  name: "facility",
  title: "Facility",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r) => r.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    },
    { name: "summary", title: "One-line summary", type: "text", rows: 2 },
    { name: "details", title: "Detail paragraphs", type: "array", of: [{ type: "text" }] },
    { name: "order", title: "Sort order", type: "number" },
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
};

const circular: SchemaTypeDefinition = {
  name: "circular",
  title: "Circular or event",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r) => r.required() },
    { name: "date", title: "Date", type: "date", validation: (r) => r.required() },
    {
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Circular", value: "circular" },
          { title: "Event", value: "event" },
          { title: "Result", value: "result" },
          { title: "Admission notice", value: "admission" },
        ],
        layout: "radio",
      },
      initialValue: "circular",
      validation: (r) => r.required(),
    },
    { name: "summary", title: "Summary", type: "text", rows: 3 },
    { name: "href", title: "Link or attachment URL", type: "url" },
  ],
  preview: { select: { title: "title", subtitle: "date" } },
};

const album: SchemaTypeDefinition = {
  name: "album",
  title: "Photo album",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r) => r.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    },
    { name: "description", title: "Description", type: "text", rows: 2 },
    {
      name: "images",
      title: "Photographs",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describe what is happening in the photograph. This is what a blind visitor hears and what image search reads.",
              validation: (r) => r.required(),
            },
          ],
        },
      ],
    },
  ],
  preview: { select: { title: "title", subtitle: "description" } },
};

export const schemaTypes: SchemaTypeDefinition[] = [
  school,
  page,
  facility,
  circular,
  album,
];
