require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID; // ID del servidor Discord
const ROLE_ID = process.env.DISCORD_ROLE_ID;   // ID del rol que quieres asignar

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

client.once('ready', () => {
  console.log(`Bot listo! Conectado como ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  if (member.guild.id !== GUILD_ID) return;

  if (!fs.existsSync(dataPath)) {
    console.log('Archivo de usuarios no encontrado.');
    return;
  }

  const usersData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const userLinked = usersData.find(u => u.discord_id === member.id);

  if (userLinked) {
    try {
      await member.roles.add(ROLE_ID);
      console.log(`Rol asignado a ${member.user.tag}`);
    } catch (error) {
      console.error('Error asignando rol:', error);
    }
  } else {
    console.log(`Usuario ${member.user.tag} no vinculado, no se asignó rol.`);
  }
});

client.login(TOKEN);
