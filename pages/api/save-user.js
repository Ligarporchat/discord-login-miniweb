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
    // Autenticación con Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const range = 'Sheet1!A:D'; // Cambia Sheet1 si tu hoja se llama distinto

    const fecha = new Date().toISOString();

    // Añadir una fila con los datos
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, discord_id, username, fecha]],
      },
    });

    // Llamar al endpoint del bot para asignar rol
    const assignRoleResponse = await fetch(process.env.BOT_ASSIGN_ROLE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discord_id }),
    });

    if (!assignRoleResponse.ok) {
      throw new Error('No se pudo asignar rol');
    }

    res.status(200).json({ success: true, message: 'Usuario guardado y rol asignado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
