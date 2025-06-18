// src/routes/usersRouter.js
import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js'; // Assume autenticação
import { serverError } from '../helpers/httpResponses.js';
import UsersControllers from '../controllers/users.js';

const usersRouter = express.Router();
const usersControllers = new UsersControllers();

usersRouter.get('/', isAdmin, async (req, res) => {
  try {
    const { body, success, statusCode } = await usersControllers.getUsers();
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

usersRouter.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { body, success, statusCode } = await usersControllers.deleteUser(req.params.id);
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

usersRouter.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { body, success, statusCode } = await usersControllers.updateUser(req.params.id, req.body);
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

usersRouter.post('/:id/changePassword', isAuthenticated, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { body, success, statusCode } = await usersControllers.changePassword(req.params.id, {
      oldPassword,
      newPassword,
    });
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

export default usersRouter;
