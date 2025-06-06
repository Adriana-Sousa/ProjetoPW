import { Mongo } from '../database/mongo.js';
import { ObjectId } from 'mongodb';

const collectionName = 'plates';

export default class PlatesDataAccess {
  // Pegar todos os pratos
  async getPlates() {
    return await Mongo.db.collection(collectionName).find({}).toArray();
  }

  // Pegar os pratos disponíveis
  async getAvailablePlates() {
    return await Mongo.db
      .collection(collectionName)
      .find({ available: true })
      .toArray();
  }

  // Adicionar pratos
  async addPlate(plateData) {
    const { name, price, available = true, description = '', ingredients = [], imgUrl = '', category = '' } = plateData;
    if (!name || typeof price !== 'number' || price <= 0) {
      throw new Error('Nome e preço válido são obrigatórios');
    }
    if (!Array.isArray(ingredients)) {
      throw new Error('Ingredientes devem ser uma lista');
    }
    if (category && !['entrada', 'principal', 'sobremesa', 'bebida'].includes(category)) {
      throw new Error('Categoria inválida');
    }
    const sanitizedData = { name, price, available, description, ingredients, imgUrl, category };
    const result = await Mongo.db
      .collection(collectionName)
      .insertOne(sanitizedData);
    return { _id: result.insertedId, ...sanitizedData };
  }

  // Deletar pratos
  async deletePlate(plateId) {
    if (!ObjectId.isValid(plateId)) {
      throw new Error('ID inválido');
    }
    const result = await Mongo.db
      .collection(collectionName)
      .findOneAndDelete({ _id: new ObjectId(plateId) });
    
    return result.value;
  }

  // Editar pratos
  async updatePlate(plateId, plateData) {
    if (!ObjectId.isValid(plateId)) {
      throw new Error('ID inválido');
    }
    const { name, price, available, description, ingredients, imgUrl, category } = plateData;
    if (!name || typeof price !== 'number' || price <= 0) {
      throw new Error('Nome e preço válido são obrigatórios');
    }
    if (ingredients && !Array.isArray(ingredients)) {
      throw new Error('Ingredientes devem ser uma lista');
    }
    if (category && !['entrada', 'principal', 'sobremesa', 'bebida'].includes(category)) {
      throw new Error('Categoria inválida');
    }
    const sanitizedData = {
      name,
      price,
      available: available ?? true,
      description: description ?? '',
      ingredients: ingredients ?? [],
      imgUrl: imgUrl ?? '',
      category: category ?? '',
    };
    console.log('Atualizando prato com ID:', plateId, 'Dados:', sanitizedData);
    const result = await Mongo.db
      .collection(collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(plateId) },
        { $set: sanitizedData },
        { returnDocument: 'after' }
      );
    console.log('Resultado do MongoDB:', result);
    if (!result.value) {
      // Verificar se o documento existe
      const existing = await Mongo.db.collection(collectionName).findOne({ _id: new ObjectId(plateId) });
      if (!existing) {
        throw new Error('Prato não encontrado');
      }
      console.log('Documento existente retornado:', existing);
      return existing; // Retorna o documento existente se não houve alterações
    }
    return result.value;
  }
}