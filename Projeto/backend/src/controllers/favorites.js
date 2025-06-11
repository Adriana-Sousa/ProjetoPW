import FavoritesDataAccess from "../models/favorites.js";
import { ok, notFound, badRequest, serverError } from "../helpers/httpResponses.js";

export default class FavoritesControllers {
  constructor() {
    this.dataAccess = new FavoritesDataAccess();
  }

  async getFavorites(userId) {
    try {
      console.log('Controlador: Buscando favoritos do usuário:', userId);
      const favorites = await this.dataAccess.getFavorites(userId);
      return ok(favorites);
    } catch (error) {
      console.error('Controlador: Erro ao buscar favoritos:', error.message);
      if (error.message.includes('inválido')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async addFavorite(userId, plateId) {
    try {
      console.log('Controlador: Adicionando favorito:', { userId, plateId });
      const result = await this.dataAccess.addFavorite(userId, plateId);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao adicionar favorito:', error.message);
      if (error.message.includes('inválido') || error.message.includes('não encontrado')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async updateFavorites(userId, plateIds) {
    try {
      console.log('Controlador: Adicionando favorito:', { userId, plateIds });
      const result = await this.dataAccess.updateFavorites(userId, plateIds);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao adicionar favorito:', error.message);
      if (error.message.includes('inválido') || error.message.includes('não encontrado')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async removeFavorite(userId, plateId) {
    try {
      console.log('Controlador: Removendo favorito:', { userId, plateId });
      const result = await this.dataAccess.removeFavorite(userId, plateId);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao remover favorito:', error.message);
      if (error.message.includes('inválido')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }
}