import db from "../../lib/db";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { email, discord_id } = req.body;

  if (!email || !discord_id) {
    return res.status(400).json({ error: "Missing email or discord_id" });
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (email, discord_id, subscription_status)
    VALUES (?, ?, COALESCE((SELECT subscription_status FROM users WHERE email = ?), 'active'))
  `);

  try {
    stmt.run(email, discord_id, email);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
