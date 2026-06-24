import { NextRequest, NextResponse } from "next/server";
import { BFHLProcessor } from "@/lib/bfhl-processor";

const USER_ID = "Anmol_28072005";
const EMAIL_ID = "anmol1692.be23@chitkara.edu.in";
const ROLL_NUMBER = "2310991692";

// Enable CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    if (!body.data || !Array.isArray(body.data)) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid request body. Expected { data: [...] }",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Process the data with fixed challenge credentials
    const processor = new BFHLProcessor();
    const response = processor.process(body.data, USER_ID, EMAIL_ID, ROLL_NUMBER);

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
