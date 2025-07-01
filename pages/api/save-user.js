import { google } from 'googleapis';

export default async function handler(req, res) {
  console.log("API /api/save-user llamada");
  
  if (req.method !== 'POST') {
    console.log("Método no permitido:", req.method);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, discord_id, username } = req.body;
  console.log("Datos recibidos:", { email, discord_id, username });

  if (!email || !discord_id || !username) {
    console.log("Faltan datos obligatorios");
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    // Autenticación con Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = 'Hoja1!A:D'; // Cambia 'Hoja1' si tu hoja tiene otro nombre

    const fecha = new Date().toISOString();

    console.log("Añadiendo fila a Google Sheets...");
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[email, discord_id, username, fecha]],
      },
    });

    console.log("Fila añadida correctamente");

    // Intentamos asignar rol, pero si falla, mostramos error con detalles
    if (process.env.BOT_ASSIGN_ROLE_URL) {
      console.log("Asignando rol...");
      const assignRoleResponse = await fetch(process.env.BOT_ASSIGN_ROLE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_id }),
      });

      if (!assignRoleResponse.ok) {
        const errorText = await assignRoleResponse.text();
        console.error("Error asignando rol:", errorText);
        return res.status(500).json({ error: 'No se pudo asignar rol', details: errorText });
      }
      console.log("Rol asignado correctamente");
    }

    res.status(200).json({ success: true, message: 'Usuario guardado y rol asignado' });
  } catch (error) {
    console.error("Error en /api/save-user:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
