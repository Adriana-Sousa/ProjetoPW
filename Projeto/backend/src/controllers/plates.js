import PlatesDataAccess from '../models/plates.js';
import { ok, created, notFound, badRequest, serverError } from '../helpers/httpResponses.js';

export default class PlatesControllers {
  constructor() {
    this.dataAccess = new PlatesDataAccess();
  }

  async getPlates() {
    try {
      const plates = await this.dataAccess.getPlates();
      return ok(plates);
    } catch (error) {
      return serverError(error.message);
    }
  }

  async getAvailablePlates() {
    try {
      const plates = await this.dataAccess.getAvailablePlates();
      return ok(plates);
    } catch (error) {
      return serverError(error.message);
    }
  }

  async addPlate(plateData) {
    try {
      const result = await this.dataAccess.addPlate(plateData);
      return created(result);
    } catch (error) {
      if (error.message.includes('obrigatórios') || error.message.includes('inválida')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async deletePlate(plateId) {
    try {
      const result = await this.dataAccess.deletePlate(plateId);
      return ok(result);
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        return notFound(error.message);
      }
      if (error.message.includes('ID inválido')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async updatePlate(plateId, plateData) {
  try {
    const result = await this.dataAccess.updatePlate(plateId, plateData);
    console.log('Controlador: Prato atualizado:', result); // Log para depuração
    return ok(result);
  } catch (error) {
    console.error('Controlador: Erro ao atualizar prato:', error.message); // Log para depuração
    if (error.message.includes('não encontrado')) {
      return notFound(error.message);
    }
    if (error.message.includes('obrigatórios') || error.message.includes('inválida')) {
      return badRequest(error.message);
    }
    return serverError(error.message);
  }
}
}