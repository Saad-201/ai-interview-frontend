import {
  listResource,
  createResource,
} from "@/lib/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return listResource("companies");
}

export async function POST(request: Request) {
  return createResource("companies", request);
}
