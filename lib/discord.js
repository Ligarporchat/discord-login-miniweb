import fetch from 'node-fetch';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

export async function addDiscordRole(discordUserId, roleId) {
  const url = `https://discord.com/api/guilds/${GUILD_ID}/members/${discordUserId}/roles/${roleId}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error añadiendo rol: ${res.statusText}`);
  }
}

export async function removeDiscordRole(discordUserId, roleId) {
  const url = `https://discord.com/api/guilds/${GUILD_ID}/members/${discordUserId}/roles/${roleId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error quitando rol: ${res.statusText}`);
  }
}
