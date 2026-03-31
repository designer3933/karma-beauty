/** Origin for HulkApps Form Builder (https://formbuilder.hulkapps.com) */
export const FORM_BUILDER_ORIGIN = "https://formbuilder.hulkapps.com";

export const corsHeaders = {
  "Access-Control-Allow-Origin": FORM_BUILDER_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;
