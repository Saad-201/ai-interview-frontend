
import db from "./db";
import { createTables } from "./schema";

createTables();

export type AdminResource =
  | "tenants"
  | "companies"
  | "departments"
  | "users"
  | "roles";

const fields: Record<AdminResource, string[]> = {
  tenants: [
    "name",
    "slug",
    "plan",
    "status",
    "max_users",
    "max_companies",
    "features",
  ],
  companies: ["tenant_id", "name", "slug", "status"],
  departments: ["company_id", "name", "status"],
  users: [
    "full_name",
    "email",
    "password",
    "role",
    "status",
    "tenant_id",
    "company_id",
    "department_id",
  ],
  roles: ["name", "permissions"],
};

const queries: Record<AdminResource, string> = {
  tenants: `
    SELECT t.*,
      (SELECT COUNT(*) FROM companies c WHERE c.tenant_id = t.id)
        AS company_count,
      (SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id)
        AS user_count
    FROM tenants t
    ORDER BY t.id DESC
  `,
  companies: `
    SELECT c.*, t.name AS tenant_name,
      (SELECT COUNT(*) FROM departments d WHERE d.company_id = c.id)
        AS department_count,
      (SELECT COUNT(*) FROM users u WHERE u.company_id = c.id)
        AS user_count
    FROM companies c
    JOIN tenants t ON t.id = c.tenant_id
    ORDER BY c.id DESC
  `,
  departments: `
    SELECT d.*, c.name AS company_name, t.name AS tenant_name
    FROM departments d
    JOIN companies c ON c.id = d.company_id
    JOIN tenants t ON t.id = c.tenant_id
    ORDER BY d.id DESC
  `,
  users: `
    SELECT u.id, u.full_name, u.email, u.role, u.status,
      u.tenant_id, u.company_id, u.department_id,
      t.name AS tenant_name, c.name AS company_name,
      d.name AS department_name
    FROM users u
    LEFT JOIN tenants t ON t.id = u.tenant_id
    LEFT JOIN companies c ON c.id = u.company_id
    LEFT JOIN departments d ON d.id = u.department_id
    ORDER BY u.id DESC
  `,
  roles: `
    SELECT id, name, permissions, created_at
    FROM roles
    ORDER BY id DESC
  `,
};

function error(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function publicUser(user: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== "password")
  );
}

function publicRole<T extends Record<string, unknown>>(role: T) {
  let permissions: unknown = role.permissions ?? [];

  if (typeof permissions === "string") {
    try {
      permissions = JSON.parse(permissions);
    } catch {
      permissions = [];
    }
  }

  return { ...role, permissions };
}

function normalize(
  resource: AdminResource,
  input: Record<string, unknown>
) {
  const aliases: Record<string, string> = {
    tenantId: "tenant_id",
    companyId: "company_id",
    departmentId: "department_id",
    fullName: "full_name",
    maxUsers: "max_users",
    maxCompanies: "max_companies",
  };

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    const column = aliases[key] ?? key;

    if (fields[resource].includes(column)) {
      result[column] = value;
    }
  }

  if (typeof result.features === "object" && result.features !== null) {
    result.features = JSON.stringify(result.features);
  }

  if (
    typeof result.permissions === "object" &&
    result.permissions !== null
  ) {
    result.permissions = JSON.stringify(result.permissions);
  }

  return result;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validate(
  resource: AdminResource,
  data: Record<string, unknown>,
  creating: boolean
) {
  if (resource === "tenants" || resource === "companies") {
    if (creating && !String(data.name ?? "").trim()) {
      return "Name is required.";
    }

    if (creating && !String(data.slug ?? "").trim()) {
      data.slug = slugify(String(data.name ?? ""));
    }
  }

  if (resource === "departments") {
    if (creating && !String(data.name ?? "").trim()) {
      return "Department name is required.";
    }

    if (creating && !data.company_id) {
      return "A company must be selected.";
    }
  }

  if (resource === "companies" && creating && !data.tenant_id) {
    return "A tenant must be selected.";
  }

  if (resource === "roles") {
    if (!String(data.name ?? "").trim()) {
      return "Role name is required.";
    }
  }

  if (resource === "users") {
    if (creating && !String(data.email ?? "").trim()) {
      return "Email is required.";
    }

    if (creating && !String(data.password ?? "")) {
      return "Password is required when creating a user.";
    }

    if (creating && !String(data.role ?? "").trim()) {
      return "Role is required.";
    }
  }

  return null;
}

function getOne(resource: AdminResource, id: number) {
  const rows = db.prepare(queries[resource]).all() as Record<
    string,
    unknown
  >[];

  return rows.find((row) => row.id === id);
}

function publicRecord(resource: AdminResource, record: Record<string, unknown>) {
  if (resource === "users") return publicUser(record);

  if (resource === "roles") return publicRole(record);

  if (resource === "tenants") {
    let features: unknown = record.features ?? [];

    if (typeof features === "string") {
      try {
        features = JSON.parse(features);
      } catch {
        features = [];
      }
    }

    return { ...record, features };
  }

  return record;
}

export function listResource(resource: AdminResource) {
  const rows = db.prepare(queries[resource]).all() as Record<
    string,
    unknown
  >[];

  return Response.json(rows.map((row) => publicRecord(resource, row)));
}

export async function createResource(
  resource: AdminResource,
  request: Request
) {
  try {
    const input = await request.json();
    const data = normalize(resource, input);

    const validationError = validate(resource, data, true);
    if (validationError) return error(validationError);

    const columns = Object.keys(data);

    if (!columns.length) {
      return error("No valid fields were provided.");
    }

    const sql = `
      INSERT INTO "${resource}" (${columns.map((column) => `"${column}"`).join(", ")})
      VALUES (${columns.map(() => "?").join(", ")})
    `;

    const result = db.prepare(sql).run(
      ...columns.map((column) => data[column])
    );

    const created = getOne(resource, Number(result.lastInsertRowid));

    if (!created) {
      return error("The record was created but could not be retrieved.", 500);
    }

    return Response.json(publicRecord(resource, created), { status: 201 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unable to create record.";

    return error(
      message.includes("UNIQUE constraint")
        ? "A record with that unique value already exists."
        : message
    );
  }
}

export function getResource(resource: AdminResource, id: number) {
  if (!Number.isInteger(id) || id < 1) {
    return error("Invalid record ID.");
  }

  const record = getOne(resource, id);

  if (!record) return error("Record not found.", 404);

  return Response.json(publicRecord(resource, record));
}

export async function updateResource(
  resource: AdminResource,
  id: number,
  request: Request
) {
  try {
    if (!Number.isInteger(id) || id < 1) {
      return error("Invalid record ID.");
    }

    const existing = getOne(resource, id);
    if (!existing) return error("Record not found.", 404);

    const input = await request.json();
    const data = normalize(resource, input);

    const validationError = validate(resource, data, false);
    if (validationError) return error(validationError);

    const columns = Object.keys(data);

    if (!columns.length) {
      return error("No valid fields were provided.");
    }

    db.prepare(`
      UPDATE "${resource}"
      SET ${columns.map((column) => `"${column}" = ?`).join(", ")}
      WHERE id = ?
    `).run(...columns.map((column) => data[column]), id);

    const updated = getOne(resource, id);

    if (!updated) return error("Unable to retrieve updated record.", 500);

    return Response.json(publicRecord(resource, updated));
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unable to update record.";

    return error(
      message.includes("UNIQUE constraint")
        ? "A record with that unique value already exists."
        : message
    );
  }
}

export function deleteResource(resource: AdminResource, id: number) {
  if (!Number.isInteger(id) || id < 1) {
    return error("Invalid record ID.");
  }

  try {
    const result = db.prepare(
      `DELETE FROM "${resource}" WHERE id = ?`
    ).run(id);

    if (result.changes === 0) {
      return error("Record not found.", 404);
    }

    return Response.json({ success: true });
  } catch {
    return error(
      "This record is still linked to other records. Reassign or delete those records first.",
      409
    );
  }
}
