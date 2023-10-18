const express = require('express');
const dbConnect = require("./config/mongo");
const perros = require("./models/dogs");

const app = express();
const port = 3000; // Puedes cambiar el puerto según tus preferencias

// Rutas de ejemplo
app.get('/api', (req, res) => {
  res.send('¡Bienvenido a mi API RESTful!');
});

app.get('/api/usuarios', async (req, res) => {
  // Aquí puedes devolver una lista de usuarios en formato JSON
  const usuarios = [
    { id: 1, nombre: 'Usuario 1' },
    { id: 2, nombre: 'Usuario 2' },
    { id: 3, nombre: 'Usuario 3' },
  ];
  const p = await perros.find();

  res.json(p);
});

dbConnect().then((res) => {

  app.listen(3001, () => {
    console.log("lalala");
  });
},

  (error) => {
    
  }
);
