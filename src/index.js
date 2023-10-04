// Importar las dependencias
const express = require('express');
const bodyParser = require('body-parser');

// Crear una instancia de Express
const app = express();

// Configurar body-parser para analizar las solicitudes POST
app.use(bodyParser.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola desde el backend en Node.js!');
});

// Iniciar el servidor
const port = 3000; // Puedes cambiar el puerto si lo deseas
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
