
import db from "./db";

function ensureColumn(
  table: string,
  column: string,
  definition: string
) {
  const columns = db
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];

  if (!columns.some((item) => item.name === column)) {
    db.exec(
      `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`
    );
  }
}

export function createTables() {
  // Keep the existing users table compatible with your login API.
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tenants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      plan TEXT NOT NULL DEFAULT 'Starter',
      status TEXT NOT NULL DEFAULT 'Active',
      max_users INTEGER NOT NULL DEFAULT 100,
      max_companies INTEGER NOT NULL DEFAULT 10,
      features TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id),
      UNIQUE (tenant_id, slug)
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      UNIQUE (company_id, name)
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      permissions TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add new user fields without deleting existing accounts.
  ensureColumn("users", "full_name", "TEXT");
  ensureColumn("users", "status", "TEXT NOT NULL DEFAULT 'Active'");
  ensureColumn("users", "tenant_id", "INTEGER REFERENCES tenants(id)");
  ensureColumn("users", "company_id", "INTEGER REFERENCES companies(id)");
  ensureColumn(
    "users",
    "department_id",
    "INTEGER REFERENCES departments(id)"
  );

  // SQLite foreign-key checks should be enabled for each connection.
  db.pragma("foreign_keys = ON");
}



// SQL implemantaion to create the tabele if it doesnt exist 