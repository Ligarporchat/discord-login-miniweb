export default function handler(req, res) {
  res.status(200).json({
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ? "*****" : null,
    DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "*****" : null,
  });
}
