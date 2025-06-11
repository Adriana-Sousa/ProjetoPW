import { Mongo } from "../database/mongo.js";
import { ObjectId } from 'mongodb';

const collectionName = 'favorites';

export default class FavoritesDataAccess {
  async getFavorites(userId) {
    if (!ObjectId.isValid(userId)) {
      console.error('DataAccess: ID de usuário inválido:', userId);
      throw new Error('ID de usuário inválido');
    }
    try {
      console.log('DataAccess: Buscando favoritos do usuário:', userId);
      const favorites = await Mongo.db
        .collection(collectionName)
        .findOne({ userId: new ObjectId(userId) });
      
      if (!favorites) {
        console.log('DataAccess: Nenhum favorito encontrado, retornando vazio');
        return { userId, plateIds: [] };
      }

      // Buscar detalhes dos pratos favoritados
      const plates = await Mongo.db
        .collection('plates')
        .find({ _id: { $in: favorites.plateIds.map(id => new ObjectId(id)) } })
        .toArray();

      console.log('DataAccess: Favoritos encontrados:', plates.length);
      return { userId, plates };
    } catch (error) {
      console.error('DataAccess: Erro ao buscar favoritos:', error.message);
      throw new Error('Erro ao buscar favoritos');
    }
  }

  async updateFavorites(userId, plateIds) {
    if (!ObjectId.isValid(userId) || !Array.isArray(plateIds) || plateIds.some(id => !ObjectId.isValid(id))) {
      console.error('DataAccess: ID inválido:', { userId, plateIds });
      throw new Error('ID de usuário ou lista de pratos inválida');
    }
    try {
      console.log('DataAccess: Atualizando favoritos:', { userId, plateIds });

      // Verificar se todos os pratos existem
      const plates = await Mongo.db
        .collection('plates')
        .find({ _id: { $in: plateIds.map(id => new ObjectId(id)) } })
        .toArray();

      if (plates.length !== plateIds.length) {
        console.error('DataAccess: Um ou mais pratos não encontrados:', plateIds);
        throw new Error('Um ou mais pratos não encontrados');
      }

      const result = await Mongo.db
        .collection(collectionName)
        .updateOne(
          { userId: new ObjectId(userId) },
          {
            $set: { 
              plateIds: plateIds.map(id => new ObjectId(id)),
              updatedAt: new Date()
            },
            $setOnInsert: { createdAt: new Date() }
          },
          { upsert: true }
        );

      console.log('DataAccess: Favoritos atualizados:', { userId, modifiedCount: result.modifiedCount });
      return { userId, message: 'Favoritos atualizados com sucesso' };
    } catch (error) {
      console.error('DataAccess: Erro ao atualizar favoritos:', error.message);
      throw new Error('Erro ao atualizar favoritos');
    }
  }

  async addFavorite(userId, plateId) {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(plateId)) {
      console.error('DataAccess: ID inválido:', { userId, plateId });
      throw new Error('ID de usuário ou prato inválido');
    }
    try {
      console.log('DataAccess: Adicionando favorito:', { userId, plateId });

      // Verificar se o prato existe
      const plate = await Mongo.db
        .collection('plates')
        .findOne({ _id: new ObjectId(plateId) });
      if (!plate) {
        console.error('DataAccess: Prato não encontrado:', plateId);
        throw new Error('Prato não encontrado');
      }

      const result = await Mongo.db
        .collection(collectionName)
        .updateOne(
          { userId: new ObjectId(userId) },
          {
            $addToSet: { plateIds: new ObjectId(plateId) },
            $setOnInsert: { createdAt: new Date() },
            $set: { updatedAt: new Date() }
          },
          { upsert: true }
        );

      console.log('DataAccess: Favorito adicionado:', { userId, plateId });
      return { userId, plateId, message: 'Prato favoritado com sucesso' };
    } catch (error) {
      console.error('DataAccess: Erro ao adicionar favorito:', error.message);
      throw new Error(error.message);
    }
  }

  async removeFavorite(userId, plateId) {
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(plateId)) {
      console.error('DataAccess: ID inválido:', { userId, plateId });
      throw new Error('ID de usuário ou prato inválido');
    }
    try {
      console.log('DataAccess: Removendo favorito:', { userId, plateId });

      const result = await Mongo.db
        .collection(collectionName)
        .updateOne(
          { userId: new ObjectId(userId) },
          {
            $pull: { plateIds: new ObjectId(plateId) },
            $set: { updatedAt: new Date() }
          }
        );

      if (result.modifiedCount === 0) {
        console.warn('DataAccess: Favorito não encontrado ou já removido:', { userId, plateId });
      }

      console.log('DataAccess: Favorito removido:', { userId, plateId });
      return { userId, plateId, message: 'Prato desfavoritado com sucesso' };
    } catch (error) {
      console.error('DataAccess: Erro ao remover favorito:', error.message);
      throw new Error(error.message);
    }
  }
}