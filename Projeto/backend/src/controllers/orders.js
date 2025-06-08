// src/controllers/OrdersControllers.js
import OrdersDataAccess from "../models/orders.js";
import { ok, notFound, badRequest, serverError } from "../helpers/httpResponses.js";

export default class OrdersControllers {
  constructor() {
    this.dataAccess = new OrdersDataAccess();
  }

  async getOrders() {
    try {
      console.log('Controlador: Buscando todas as ordens');
      const orders = await this.dataAccess.getOrders();
      return ok(orders);
    } catch (error) {
      console.error('Controlador: Erro ao buscar ordens:', error.message);
      return serverError(error.message);
    }
  }

  async getOrdersByUserId(userId) {
    try {
      console.log('Controlador: Buscando ordens para userId:', userId);
      const orders = await this.dataAccess.getOrdersByUserId(userId);
      return ok(orders);
    } catch (error) {
      console.error('Controlador: Erro ao buscar ordens por userId:', error.message);
      if (error.message.includes('inválido')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async addOrder(orderData) {
    try {
      console.log('Controlador: Adicionando ordem:', orderData);
      const result = await this.dataAccess.addOrder(orderData);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao adicionar ordem:', error.message);
      if (error.message.includes('inválidos') || error.message.includes('não foi possível')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async deleteOrder(orderId) {
    try {
      console.log('Controlador: Excluindo ordem com ID:', orderId);
      const result = await this.dataAccess.deleteOrder(orderId);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao excluir ordem:', error.message);
      if (error.message.includes('não encontrada')) {
        return notFound(error.message);
      }
      if (error.message.includes('inválido')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async updateOrder(orderId, orderData) {
    try {
      console.log('Controlador: Atualizando ordem com ID:', orderId, 'Dados:', orderData);
      const result = await this.dataAccess.updateOrder(orderId, orderData);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao atualizar ordem:', error.message);
      if (error.message.includes('não encontrada')) {
        return notFound(error.message);
      }
      if (error.message.includes('inválido') || error.message.includes('obrigatórios')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }
}