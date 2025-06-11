import express from 'express';
import FavoritesControllers from '../controllers/favorites.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { serverError } from '../helpers/httpResponses.js';

const favoritesRouter = express.Router();
const favoritesControllers = new FavoritesControllers();

favoritesRouter.get('/', isAuthenticated, async (req, res) => {
  try {
    const { body, success, statusCode } = await favoritesControllers.getFavorites(req.user.userId);
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

favoritesRouter.post('/:plateId', isAuthenticated, async (req, res) => {
  try {
    const { body, success, statusCode } = await favoritesControllers.addFavorite(
      req.user.userId,
      req.params.plateId
    );
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

favoritesRouter.put('/', isAuthenticated, async (req, res) => {
  try {
    const { plateIds } = req.body;
    const { body, success, statusCode } = await favoritesControllers.updateFavorites(
      req.user.userId,
      plateIds
    );
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

favoritesRouter.delete('/:plateId', isAuthenticated, async (req, res) => {
  try {
    const { body, success, statusCode } = await favoritesControllers.removeFavorite(
      req.user.userId,
      req.params.plateId
    );
    res.status(statusCode).send({ body, success, statusCode });
  } catch (error) {
    res.status(500).send(serverError(error.message));
  }
});

export default favoritesRouter;