import {
  getResource,
  updateResource,
  deleteResource,
} from "@/lib/admin-api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: { id: string };
};

export function GET(
  _request: Request,
  context: RouteContext
) {
  return getResource("companies", Number(context.params.id));
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  return updateResource(
    "companies",
    Number(context.params.id),
    request
  );
}

export function DELETE(
  _request: Request,
  context: RouteContext
) {
  return deleteResource("companies", Number(context.params.id));
}
