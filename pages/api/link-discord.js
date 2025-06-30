import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, discord_id } = req.body;

  if (!email || !discord_id) {
    return res.status(400).json({ error: 'Missing email or discord_id' });
  }

  const dataPath = path.join(process.cwd(), 'data', 'users.json');

  let users = [];
  if (fs.existsSync(dataPath)) {
    const fileData = fs.readFileSync(dataPath, 'utf-8');
    users = JSON.parse(fileData);
  }

  // Actualiza o añade el usuario
  const existingUserIndex = users.findIndex(u => u.email === email);
  if (existingUserIndex !== -1) {
    users[existingUserIndex].discord_id = discord_id;
  } else {
    users.push({ email, discord_id });
  }

  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));

  res.status(200).json({ success: true });
}
