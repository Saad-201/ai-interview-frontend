
import db from "./db";
import { createTables } from "./schema";

createTables();
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (email, password, role)
  VALUES (?, ?, ?)
`); //preparing the sql command, inserting the role for user distinction 

insertUser.run(
  "admin@techhire.com",
  "password123",
  "Tenant Admin"
);

insertUser.run(
  "recruiter@techhire.com",
  "password123",
  "Recruiter"
);

insertUser.run(
  "candidate1@gmail.com",
  "password123",
  "Candidate"
);

console.log("Users seeded successfully.");



// ps db.ts is for database connection and schema.ts is for creating the database structure and seed.ts is for puting the data into the database.