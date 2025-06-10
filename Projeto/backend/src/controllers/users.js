// src/controllers/UsersControllers.js
import UsersDataAccess from "../models/users.js";
import { ok, notFound, badRequest, serverError } from "../helpers/httpResponses.js";

export default class UsersControllers {
  constructor() {
    this.dataAccess = new UsersDataAccess();
  }

  async getUsers() {
    try {
      console.log('Controlador: Buscando todos os usuários');
      const users = await this.dataAccess.getUsers();
      return ok(users);
    } catch (error) {
      console.error('Controlador: Erro ao buscar usuários:', error.message);
      return serverError(error.message);
    }
  }

  async deleteUser(userId) {
    try {
      console.log('Controlador: Excluindo usuário com ID:', userId);
      const result = await this.dataAccess.deleteUser(userId);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao excluir usuário:', error.message);
      if (error.message.includes('não encontrado')) {
        return notFound(error.message);
      }
      if (error.message.includes('inválido')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async updateUser(userId, userData) {
    try {
      console.log('Controlador: Atualizando usuário com ID:', userId, 'Dados:', userData);
      const result = await this.dataAccess.updateUser(userId, userData);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao atualizar usuário:', error.message);
      if (error.message.includes('não encontrado')) {
        return notFound(error.message);
      }
      if (error.message.includes('inválido') || error.message.includes('obrigatórios')) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }

  async changePassword(userId, { oldPassword, newPassword }) {
    try {
      console.log('Controlador: Alterando senha do usuário com ID:', userId);
      const result = await this.dataAccess.changePassword(userId, oldPassword, newPassword);
      return ok(result);
    } catch (error) {
      console.error('Controlador: Erro ao alterar senha:', error.message);
      if (error.message.includes('não encontrado')) {
        return notFound(error.message);
      }
      if (
        error.message.includes('inválido') ||
        error.message.includes('obrigatória') ||
        error.message.includes('incorreta')
      ) {
        return badRequest(error.message);
      }
      return serverError(error.message);
    }
  }
}