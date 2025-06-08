import express from 'express';
import OrdersControllers from '../controllers/orders.js';
//import { isAdmin } from '../middleware/authMiddleware.js';
import { serverError } from '../helpers/httpResponses.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const ordersRouter = express.Router();
const ordersControllers = new OrdersControllers();

//pegar todas as ordens
ordersRouter.get('/',  isAdmin, async (req, res) => {
  try {
    const { body, success, statusCode } = await ordersControllers.getOrders();
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

ordersRouter.get('/user/:userId', async (req, res) => {
  try {
    const { body, success, statusCode } = await ordersControllers.getOrdersByUserId(req.params.userId);
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

ordersRouter.post('/', async (req, res) => {
  try {
    const { body, success, statusCode } = await ordersControllers.addOrder(req.body);
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

ordersRouter.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { body, success, statusCode } = await ordersControllers.deleteOrder(req.params.id);
    console.log('Roteador: Enviando resposta:', { body, success, statusCode });
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    console.error('Roteador: Erro inesperado:', error.message);
    res.status(500).send(serverError(error.message));
  }
});

ordersRouter.put('/:id', isAdmin, async (req, res) => {
  try {
    const { body, success, statusCode } = await ordersControllers.updateOrder(req.params.id, req.body);
    console.log('Roteador: Enviando resposta:', { body, success, statusCode });
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    console.error('Roteador: Erro inesperado:', error.message);
    res.status(500).send(serverError(error.message));
  }
});

export default ordersRouter;