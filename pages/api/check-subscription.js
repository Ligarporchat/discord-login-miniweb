import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = 'Hoja1!A2:F'; // asume que fila 1 es encabezado

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    const usersToRemove = [];

    for (const row of rows) {
      const [email, discord_id, username, fecha, tipo, origen] = row;

      if (!email || !email.includes('@')) continue;
      if (!discord_id || discord_id === 'pending') continue;

      // Skip si fue tipo suscripción (se mantiene activo por pago recurrente)
      if (tipo === 'suscripcion') continue;

      // Lógica para validar suscripción Stripe
      const stripeRes = await fetch(`${process.env.STRIPE_CHECK_URL}?email=${encodeURIComponent(email)}`);
      const { active } = await stripeRes.json();

      if (!active) {
        usersToRemove.push({ discord_id, email });
      }
    }

    // Lógica para remover rol
    const results = [];
    for (const user of usersToRemove) {
      const remove = await fetch(process.env.BOT_REMOVE_ROLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_id: user.discord_id }),
      });

      const result = await remove.text();
      results.push({ ...user, result });
    }

    res.status(200).json({
      message: 'Verificación completada.',
      total: rows.length,
      removidos: results.length,
      detalles: results,
    });

  } catch (error) {
    console.error('Error en /check-subs:', error);
    res.status(500).json({ error: error.message });
  }
}
