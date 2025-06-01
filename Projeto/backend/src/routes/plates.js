// src/routes/platesRouter.js
import express from 'express';
import PlatesControllers from '../controllers/plates.js';
import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../helpers/httpResponses.js';

const platesRouter = express.Router();
const platesControllers = new PlatesControllers();

// Middleware para verificar admin
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send(unauthorized('Token ausente'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).send(forbidden('Acesso restrito a administradores'));
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send(unauthorized('Token inválido'));
  }
};

// GET /plates/availables (público)
platesRouter.get('/availables', async (req, res) => {
  const { body, success, statusCode } = await platesControllers.getAvailablePlates();
  res.status(statusCode).send({ body, success, statusCode });
});

// GET /plates (protegido, admin)
platesRouter.get('/', isAdmin, async (req, res) => {
  const { body, success, statusCode } = await platesControllers.getPlates();
  res.status(statusCode).send({ body, success, statusCode });
});

// POST /plates (protegido, admin)
platesRouter.post('/', isAdmin, async (req, res) => {
  const { body, success, statusCode } = await platesControllers.addPlate(req.body);
  res.status(statusCode).send({ body, success, statusCode });
});

// DELETE /plates/:id (protegido, admin)
platesRouter.delete('/:id', isAdmin, async (req, res) => {
  const { body, success, statusCode } = await platesControllers.deletePlate(req.params.id);
  res.status(statusCode).send({ body, success, statusCode });
});

// PUT /plates/:id (protegido, admin)
platesRouter.put('/:id', isAdmin, async (req, res) => {
  const { body, success, statusCode } = await platesControllers.updatePlate(req.params.id, req.body);
  res.status(statusCode).send({ body, success, statusCode });
});

export default platesRouter;