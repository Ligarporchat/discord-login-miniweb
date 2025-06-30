export default function handler(req, res) {
  res.json({
    clientId: process.env.DISCORD_CLIENT_ID || null,
    redirectUri: process.env.DISCORD_REDIRECT_URI || null
  });
}
