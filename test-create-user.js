const fs = require('fs');
const path = require('path');

// Ruta al archivo users.json dentro de la carpeta data
const dataPath = path.join(__dirname, 'data', 'users.json');

// Usuario de prueba que quieres añadir
const user = {
  email: 'test@example.com',
  discord_id: '1234567890',
};

let users = [];
if (fs.existsSync(dataPath)) {
  users = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

users.push(user);

fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
console.log('Usuario añadido y archivo creado o actualizado.');
