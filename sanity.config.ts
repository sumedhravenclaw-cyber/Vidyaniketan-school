import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schema";

/**
 * Sanity Studio configuration.
 *
 * The Studio is deliberately NOT mounted inside the Next.js app. Embedding it
 * would pull the `sanity` package (and its CLI dependency tree, which currently
 * carries several advisories) into the deployed serverless bundle. Instead it is
 * hosted by Sanity:
 *
 *   npm run studio          # http://localhost:3333
 *   npm run studio:deploy   # https://<project>.sanity.studio
 *
 * The website itself only ever talks to the read-only content API through
 * @sanity/client, which keeps the production dependency tree clean.
 */
export default defineConfig({
  name: "vidyaniketan",
  title: "The Chikhli Urban Vidyaniketan",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
