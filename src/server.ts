// src/server.ts

import express from 'express';
import routes from './interfaces/routes';

const app = express();
const port = 3000;

// Middleware para usar el enrutador
app.use('/', routes);

app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});
