import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "database.sqlite"); //this creates the path to database file in the root directory of the project

const db = new Database(dbPath);

export default db; // allows other files to interact with database 