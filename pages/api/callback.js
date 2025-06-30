import fetch from 'node-fetch'; // npm i node-fetch@2

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const data = new URLSearchParams();
  data.append('client_id', process.env.DISCORD_CLIENT_ID);
  data.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
  data.append('grant_type', 'authorization_code');
  data.append('code', code);
  data.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);
  data.append('scope', 'identify email');

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const tokenJson = await tokenResponse.json();

    if (tokenJson.error) {
      return res.status(400).json(tokenJson);
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
      },
    });

    const userJson = await userResponse.json();

    res.status(200).json({ user: userJson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
