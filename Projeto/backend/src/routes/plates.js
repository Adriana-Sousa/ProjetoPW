// src/routes/platesRouter.js
import express from 'express';
import PlatesControllers from '../controllers/plates.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const platesRouter = express.Router();
const platesControllers = new PlatesControllers();

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
  try {
    const { body, success, statusCode } = await platesControllers.deletePlate(req.params.id);
    console.log('Roteador: Enviando resposta:', { body, success, statusCode });
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    console.error('Roteador: Erro inesperado:', error.message);
    res.status(500).send(serverError(error.message));
  }
});

// PUT /plates/:id (protegido, admin)
platesRouter.put('/:id', isAdmin, async (req, res) => {
  try {
    const { body, success, statusCode } = await platesControllers.updatePlate(req.params.id, req.body);
    console.log('Roteador: Enviando resposta:', { body, success, statusCode }); // Log para depuração
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    console.error('Roteador: Erro inesperado:', error.message); // Log para depuração
    res.status(500).send(serverError(error.message));
  }
});

export default platesRouter;