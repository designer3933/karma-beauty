import Airtable from "airtable";
import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  return NextResponse.json(null, { headers: corsHeaders });
}

const TABLE_NAME = "Third-Store";

export async function GET(request: NextRequest) {
  const token = process.env.AIRTABLE_API_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return NextResponse.json(
      {
        error:
          "Missing required environment variables: AIRTABLE_API_TOKEN, AIRTABLE_BASE_ID",
      },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const base = new Airtable({ apiKey: token }).base(baseId);
    const warrentyId = request.nextUrl.searchParams.get("warrentyid");

    const selectOptions: Record<string, string> = {};

    if (warrentyId) {
      selectOptions.filterByFormula = `{Warrenty Number} = '${warrentyId}'`;
    }

    const records = await base(TABLE_NAME).select(selectOptions).all();

    const data = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    return NextResponse.json(
      { data },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data from Airtable" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = process.env.AIRTABLE_API_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return NextResponse.json(
      {
        error:
          "Missing required environment variables: AIRTABLE_API_TOKEN, AIRTABLE_BASE_ID",
      },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();

    console.log("[POST /api/third-store] Raw body received:", JSON.stringify(body, null, 2));
    console.log("[POST /api/third-store] Body keys:", Object.keys(body));
    console.log("[POST /api/third-store] Attachment value:", body["Attachment"]);

    const allowedFields = [
      "Full Name",
      "Email",
      "Warrenty Number",
      "Selected Tool",
      "Date",
      "Attachment",
    ];

    const fields: Airtable.FieldSet = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) fields[key] = body[key];
    }

    console.log("[POST /api/third-store] Fields to send to Airtable:", JSON.stringify(fields, null, 2));

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided" },
        { status: 400, headers: corsHeaders }
      );
    }

    const base = new Airtable({ apiKey: token }).base(baseId);
    const created = await base(TABLE_NAME).create(fields);

    console.log("[POST /api/third-store] Record created:", created.getId());

    return NextResponse.json(
      {
        received: body,
        data: {
          id: created.getId(),
          ...created.fields,
        },
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[POST /api/third-store] Error:", error);
    return NextResponse.json(
      { error: "Failed to create record in Airtable" },
      { status: 500, headers: corsHeaders }
    );
  }
}
