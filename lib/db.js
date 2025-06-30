import Database from "better-sqlite3";

const db = new Database("./data/db.sqlite");

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    discord_id TEXT,
    subscription_status TEXT
  )
`).run();

export default db;
