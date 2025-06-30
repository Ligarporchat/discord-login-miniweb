import express from 'express';
import bodyParser from 'body-parser';
import { assignRoleToUser, removeRoleFromUser } from './index.js';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const dataPath = path.join(process.cwd(), 'data', 'users.json');

app.post('/webhook', async (req, res) => {
  const { email, action } = req.body; // action puede ser 'subscribe' o 'unsubscribe'

  if (!email || !action) {
    return res.status(400).json({ error: 'Email y action son obligatorios' });
  }

  if (!fs.existsSync(dataPath)) {
    return res.status(404).json({ error: 'No hay usuarios vinculados aún' });
  }

  const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  try {
    if (action === 'subscribe') {
      await assignRoleToUser(user.discord_id);
    } else if (action === 'unsubscribe') {
      await removeRoleFromUser(user.discord_id);
    } else {
      return res.status(400).json({ error: 'Action inválida' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
