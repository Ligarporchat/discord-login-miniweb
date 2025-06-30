import { addDiscordRole, removeDiscordRole } from '../../lib/discord'; // funciones que crearemos

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { event, email } = req.body; // Kajabi enviará datos JSON con evento y email

  // Aquí asumes que tienes un sistema para relacionar email -> discord_id en tu base de datos (ej: archivo JSON, DB, etc)
  const discordId = await getDiscordIdByEmail(email); // crea esta función para buscar el discord_id

  if (!discordId) {
    return res.status(404).json({ error: 'Discord ID no encontrado para este email' });
  }

  try {
    if (event === 'subscription_created') {
      await addDiscordRole(discordId, 'ID_DEL_ROL_EN_DISCORD');
    } else if (event === 'subscription_cancelled') {
      await removeDiscordRole(discordId, 'ID_DEL_ROL_EN_DISCORD');
    }

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
