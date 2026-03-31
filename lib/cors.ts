/** Hulk Form Builder origin — included when using `*` (all origins). */
export const FORM_BUILDER_ORIGIN = "https://formbuilder.hulkapps.com";

/** `*` = any site; form builder and all other URLs are allowed. */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;
