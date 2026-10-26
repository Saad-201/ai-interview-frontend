
import db from "./db";
import { createTables } from "./schema";

createTables();

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (email, password, role)
  VALUES (?, ?, ?)
`);

const insertTenant = db.prepare(`
  INSERT OR IGNORE INTO tenants (name, slug, plan, status)
  VALUES (?, ?, ?, ?)
`);

const insertCompany = db.prepare(`
  INSERT OR IGNORE INTO companies (tenant_id, name, slug, status)
  VALUES (?, ?, ?, ?)
`);

const insertDepartment = db.prepare(`
  INSERT OR IGNORE INTO departments (company_id, name, status)
  VALUES (?, ?, ?)
`);

const insertRole = db.prepare(`
  INSERT OR IGNORE INTO roles (name, permissions)
  VALUES (?, ?)
`);

const seed = db.transaction(() => {
  // Preserve the existing demo accounts.
  insertUser.run("admin@techhire.com", "password123", "Tenant Admin");
  insertUser.run("recruiter@techhire.com", "password123", "Recruiter");
  insertUser.run("candidate1@gmail.com", "password123", "Candidate");

  // Initial tenants.
  insertTenant.run(
    "TechHire Global",
    "techhire-global",
    "Enterprise",
    "Active"
  );
  insertTenant.run(
    "Northstar Solutions",
    "northstar-solutions",
    "Professional",
    "Active"
  );
  insertTenant.run(
    "BrightPath Careers",
    "brightpath-careers",
    "Starter",
    "Active"
  );
  insertTenant.run(
    "Vertex Talent Group",
    "vertex-talent",
    "Trial",
    "Inactive"
  );

  const tenant = db.prepare(
    "SELECT id FROM tenants WHERE slug = ?"
  );
  const company = db.prepare(
    "SELECT id FROM companies WHERE tenant_id = ? AND slug = ?"
  );

  const techHire = tenant.get("techhire-global") as { id: number };
  const northstar = tenant.get("northstar-solutions") as { id: number };
  const brightPath = tenant.get("brightpath-careers") as { id: number };
  const vertex = tenant.get("vertex-talent") as { id: number };

  // Initial companies, linked to their real tenant IDs.
  insertCompany.run(techHire.id, "TechHire Egypt", "techhire-egypt", "Active");
  insertCompany.run(techHire.id, "TechHire Gulf", "techhire-gulf", "Active");
  insertCompany.run(northstar.id, "Northstar UK", "northstar-uk", "Active");
  insertCompany.run(northstar.id, "Northstar Canada", "northstar-canada", "Inactive");
  insertCompany.run(brightPath.id, "BrightPath Careers", "brightpath-careers", "Active");
  insertCompany.run(vertex.id, "Vertex Talent", "vertex-talent", "Active");

  // Departments belong to companies.
  const egypt = company.get(techHire.id, "techhire-egypt") as { id: number };
  const gulf = company.get(techHire.id, "techhire-gulf") as { id: number };
  const uk = company.get(northstar.id, "northstar-uk") as { id: number };
  const canada = company.get(northstar.id, "northstar-canada") as { id: number };
  const brightPathCompany = company.get(
    brightPath.id,
    "brightpath-careers"
  ) as { id: number };
  const vertexCompany = company.get(
    vertex.id,
    "vertex-talent"
  ) as { id: number };

  for (const [companyId, names] of [
    [egypt.id, ["Engineering", "Product", "Marketing"]],
    [gulf.id, ["Engineering", "Sales"]],
    [uk.id, ["Engineering", "Product", "Marketing", "Sales"]],
    [canada.id, ["Engineering", "Sales"]],
    [brightPathCompany.id, ["Engineering", "Product", "Marketing"]],
    [vertexCompany.id, ["Engineering", "Sales"]],
  ] as [number, string[]][]) {
    for (const name of names) {
      insertDepartment.run(companyId, name, "Active");
    }
  }

  // Initial roles. The permissions are starter examples.
  const rolePermissions: Record<string, string[]> = {
    "Super Admin": ["*"],
    "Tenant Admin": ["tenants:read", "companies:*", "departments:*", "users:*"],
    "Company Admin": ["companies:read", "departments:*", "users:*"],
    Recruiter: ["interviews:*", "candidates:read"],
    Candidate: ["interviews:own", "profile:own"],
  };

  for (const [name, permissions] of Object.entries(rolePermissions)) {
    insertRole.run(name, JSON.stringify(permissions));
  }
});

seed();

console.log("Database tables and initial data are ready.");



// ps db.ts is for database connection and schema.ts is for creating the database structure and seed.ts is for puting the data into the database.