export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { discord_id } = req.body;

  if (!discord_id) {
    return res.status(400).json({ error: 'Missing discord_id in body' });
  }

const BOT_TOKEN = process.env.BOT_TOKEN;
  const GUILD_ID = '1388392010930454535';
  const ROLE_ID = '1388394284012539974';

  try {
    const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discord_id}/roles/${ROLE_ID}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      res.status(200).json({ success: true, message: 'Role assigned successfully.' });
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ error: errorText });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
