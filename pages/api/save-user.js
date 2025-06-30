import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, discord_id, username } = req.body;

  if (!email || !discord_id || !username) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = 'Sheet1!A:D'; // Ajusta el nombre de tu hoja si no es Sheet1

    const fecha = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, discord_id, username, fecha]],
      },
    });

    if (process.env.BOT_ASSIGN_ROLE_URL) {
      const assignRoleResponse = await fetch(process.env.BOT_ASSIGN_ROLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_id }),
      });

      if (!assignRoleResponse.ok) {
        throw new Error('No se pudo asignar rol');
      }
    }

    res.status(200).json({ success: true, message: 'Usuario guardado y rol asignado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}