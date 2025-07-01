export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { discord_id } = req.body;

  if (!discord_id) {
    return res.status(400).json({ error: 'Missing discord_id' });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const GUILD_ID = process.env.GUILD_ID;
  const ROLE_ID = process.env.ROLE_ID; // “Alumno Mastermind”
  const CHANNEL_ID = '1388392012226498674'; // Canal con permisos

  try {
    // 1. Verificar si el usuario está en el servidor
    const memberRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discord_id}`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (memberRes.status === 200) {
      // Usuario está en el servidor → asignar rol
      await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discord_id}/roles/${ROLE_ID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      });

      return res.status(200).json({ status: 'joined', message: 'Rol asignado correctamente' });
    }

    if (memberRes.status === 404) {
      // Usuario NO está en el servidor → crear invitación en canal forzado
      const inviteRes = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/invites`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_uses: 1,
          unique: true,
          max_age: 86400, // 24h
        }),
      });

      const inviteData = await inviteRes.json();

      if (inviteRes.ok) {
        return res.status(200).json({
          status: 'not_in_server',
          invite_url: `https://discord.gg/${inviteData.code}`,
        });
      } else {
        return res.status(500).json({ error: 'No se pudo crear invitación', details: inviteData });
      }
    }

    return res.status(500).json({ error: 'Error inesperado', status: memberRes.status });

  } catch (err) {
    return res.status(500).json({ error: 'Error interno', details: err.message });
  }
}
