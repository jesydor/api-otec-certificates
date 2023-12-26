// src/interfaces/routes.ts

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hola Mundo desde el enrutador');
});

export default router;
