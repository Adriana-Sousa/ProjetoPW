// src/dataAccess/OrdersDataAccess.js
import { Mongo } from "../database/mongo.js";
import { ObjectId } from 'mongodb';

const collectionName = 'orders';

export default class OrdersDataAccess {
  // Pegar todas as ordens
  async getOrders() {
    try {
      console.log('Buscando todas as ordens');
      const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
          {
            $lookup: {
              from: 'orderItems',
              localField: '_id',
              foreignField: 'orderId',
              as: 'orderItems',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $project: {
              'userDetails.password': 0,
              'userDetails.salt': 0,
            },
          },
          {
            $unwind: {
              path: '$orderItems',
              preserveNullAndEmptyArrays: true, // Mantém ordens sem itens
            },
          },
          {
            $lookup: {
              from: 'plates',
              localField: 'orderItems.plateId',
              foreignField: '_id',
              as: 'orderItems.itemDetails',
            },
          },
          {
            $group: {
              _id: '$_id',
              userDetails: { $first: '$userDetails' },
              orderItems: { $push: '$orderItems' },
              pickupStatus: { $first: '$pickupStatus' },
              pickupTime: { $first: '$pickupTime' },
              pickupDate: { $first: '$pickupDate' },
              createdAt: { $first: '$createdAt' },
            },
          },
        ])
        .toArray();
      console.log('Ordens encontradas:', result.length);
      return result;
    } catch (error) {
      console.error('Erro ao buscar ordens:', error.message);
      throw new Error('Erro ao buscar ordens');
    }
  }

  // Pegar ordens pelo ID do usuário
  async getOrdersByUserId(userId) {
    if (!ObjectId.isValid(userId)) {
      throw new Error('ID de usuário inválido');
    }
    try {
      console.log('Buscando ordens para userId:', userId);
      const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
          {
            $match: { userId: new ObjectId(userId) },
          },
          {
            $lookup: {
              from: 'orderItems',
              localField: '_id',
              foreignField: 'orderId',
              as: 'orderItems',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $project: {
              'userDetails.password': 0,
              'userDetails.salt': 0,
            },
          },
          {
            $unwind: {
              path: '$orderItems',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'plates',
              localField: 'orderItems.plateId',
              foreignField: '_id',
              as: 'orderItems.itemDetails',
            },
          },
          {
            $group: {
              _id: '$_id',
              userDetails: { $first: '$userDetails' },
              orderItems: { $push: '$orderItems' },
              pickupStatus: { $first: '$pickupStatus' },
              pickupTime: { $first: '$pickupTime' },
              pickupDate: { $first: '$pickupDate' },
              createdAt: { $first: '$createdAt' },
            },
          },
        ])
        .toArray();
      console.log('Ordens encontradas para userId:', result.length);
      return result;
    } catch (error) {
      console.error('Erro ao buscar ordens por userId:', error.message);
      throw new Error('Erro ao buscar ordens por usuário');
    }
  }

  // Adicionar ordem
  async addOrder(orderData) {
    if (!orderData.userId || !orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('Dados da ordem inválidos: userId e itens são obrigatórios');
    }
    const { items, ...orderDataRest } = orderData;

    try {
      console.log('Adicionando ordem para userId:', orderDataRest.userId);
      orderDataRest.createdAt = new Date();
      orderDataRest.pickupStatus = 'Pending';
      orderDataRest.userId = new ObjectId(orderDataRest.userId);

      const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest);

      if (!newOrder.insertedId) {
        throw new Error('Não foi possível inserir a ordem');
      }

      const preparedItems = items.map((item) => ({
        ...item,
        plateId: new ObjectId(item.plateId),
        orderId: new ObjectId(newOrder.insertedId),
      }));

      const result = await Mongo.db
        .collection('orderItems')
        .insertMany(preparedItems);

      console.log('Ordem adicionada, ID:', newOrder.insertedId, 'Itens:', result.insertedCount);
      return {
        orderId: newOrder.insertedId,
        insertedItems: result.insertedCount,
      };
    } catch (error) {
      console.error('Erro ao adicionar ordem:', error.message);
      throw new Error(`Erro ao adicionar ordem: ${error.message}`);
    }
  }

  // Eliminar ordem
  async deleteOrder(orderId) {
    if (!ObjectId.isValid(orderId)) {
      throw new Error('ID de ordem inválido');
    }
    try {
      console.log('Excluindo ordem com ID:', orderId);
      // Excluir itens da ordem
      const itemsResult = await Mongo.db
        .collection('orderItems')
        .deleteMany({ orderId: new ObjectId(orderId) });

      // Excluir a ordem
      const orderResult = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(orderId) });

      console.log('Resultado da exclusão:', { itemsDeleted: itemsResult.deletedCount, orderResult });

      // Verificar se a ordem existia
      if (!orderResult.value) {
        const existing = await Mongo.db.collection(collectionName).findOne({ _id: new ObjectId(orderId) });
        if (!existing) {
          throw new Error('Ordem não encontrada');
        }
      }

      return {
        itemsDeleted: itemsResult.deletedCount,
        order: orderResult.value || { _id: orderId, message: 'Ordem excluída com sucesso' },
      };
    } catch (error) {
      console.error('Erro ao excluir ordem:', error.message);
      throw new Error(`Erro ao excluir ordem: ${error.message}`);
    }
  }

  // Atualizar ordem
  async updateOrder(orderId, orderData) {
    if (!ObjectId.isValid(orderId)) {
      throw new Error('ID de ordem inválido');
    }
    if (!orderData || Object.keys(orderData).length === 0) {
      throw new Error('Dados de atualização são obrigatórios');
    }
    try {
      console.log('Atualizando ordem com ID:', orderId, 'Dados:', orderData);
      const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
          { _id: new ObjectId(orderId) },
          { $set: orderData },
          { returnDocument: 'after' }
        );
      console.log('Resultado da atualização:', result);

      if (!result.value) {
        // Verificar se a ordem existe
        const existing = await Mongo.db.collection(collectionName).findOne({ _id: new ObjectId(orderId) });
        if (!existing) {
          throw new Error('Ordem não encontrada');
        }
        console.log('Ordem existente retornada:', existing);
        return existing;
      }

      return result.value;
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error.message);
      throw new Error(`Erro ao atualizar ordem: ${error.message}`);
    }
  }
}