// src/models/users.js
import { Mongo } from "../database/mongo.js";
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import util from 'util';

// Promisify crypto.pbkdf2 para uso com async/await
const pbkdf2Async = util.promisify(crypto.pbkdf2);

const collectionName = 'users';

export default class UsersDataAccess {
  async getUsers() {
    try {
      console.log('DataAccess: Buscando todos os usuários');
      const result = await Mongo.db
        .collection(collectionName)
        .find({}, { projection: { password: 0, salt: 0 } })
        .toArray();
      console.log('DataAccess: Usuários encontrados:', result.length);
      return result;
    } catch (error) {
      console.error('DataAccess: Erro ao buscar usuários:', error.message);
      throw new Error('Erro ao buscar usuários');
    }
  }

  async deleteUser(userId) {
    if (!ObjectId.isValid(userId)) {
      console.error('DataAccess: ID de usuário inválido:', userId);
      throw new Error('ID de usuário inválido');
    }
    try {
      console.log('DataAccess: Excluindo usuário com ID:', userId);
      const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(userId) });

      if (!result.value) {
        const existing = await Mongo.db
          .collection(collectionName)
          .findOne({ _id: new ObjectId(userId) });
        if (!existing) {
          console.error('DataAccess: Usuário não encontrado:', userId);
          throw new Error('Usuário não encontrado');
        }
      }

      console.log('DataAccess: Usuário excluído:', userId);
      return result.value || { _id: userId, message: 'Usuário excluído com sucesso' };
    } catch (error) {
      console.error('DataAccess: Erro ao excluir usuário:', error.message);
      throw new Error(error.message);
    }
  }

  async updateUser(userId, userData) {
    if (!ObjectId.isValid(userId)) {
      console.error('DataAccess: ID de usuário inválido:', userId);
      throw new Error('ID de usuário inválido');
    }
    if (!userData || Object.keys(userData).length === 0) {
      console.error('DataAccess: Dados de atualização ausentes');
      throw new Error('Dados de atualização são obrigatórios');
    }

    try {
      console.log('DataAccess: Atualizando usuário com ID:', userId, 'Dados:', userData);

      let updatedData = { ...userData };

      // Se houver senha, hasheá-la
      if (userData.password) {
        const salt = crypto.randomBytes(16); // Gera Buffer
        console.log('DataAccess: Gerado novo salt para updateUser:', salt.toString('hex'));
        const hashedPassword = await pbkdf2Async(
          userData.password,
          salt,
          310000,
          16,
          'sha256'
        );
        updatedData = {
          ...updatedData,
          password: hashedPassword, // Armazena como Buffer
          salt, // Armazena como Buffer
        };
      }

      const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
          { _id: new ObjectId(userId) },
          { $set: updatedData },
          { returnDocument: 'after' }
        );

      if (!result.value) {
        const existing = await Mongo.db
          .collection(collectionName)
          .findOne({ _id: new ObjectId(userId) });
        if (!existing) {
          console.error('DataAccess: Usuário não encontrado:', userId);
          throw new Error('Usuário não encontrado');
        }
        return existing;
      }

      console.log('DataAccess: Usuário atualizado:', userId);
      return result.value;
    } catch (error) {
      console.error('DataAccess: Erro ao atualizar usuário:', error.message);
      throw new Error(error.message);
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    if (!ObjectId.isValid(userId)) {
      console.error('DataAccess: ID de usuário inválido:', userId);
      throw new Error('ID de usuário inválido');
    }
    if (!oldPassword || !newPassword) {
      console.error('DataAccess: Senhas antiga e nova são obrigatórias');
      throw new Error('Senhas antiga e nova são obrigatórias');
    }

    try {
      console.log('DataAccess: Alterando senha do usuário com ID:', userId);

      // Buscar usuário
      const user = await Mongo.db
        .collection(collectionName)
        .findOne({ _id: new ObjectId(userId) });

      if (!user) {
        console.error('DataAccess: Usuário não encontrado:', userId);
        throw new Error('Usuário não encontrado');
      }

      // Converter salt de Binary para Buffer
      let saltBuffer;
      if (user.salt && user.salt._bsontype === 'Binary') {
        saltBuffer = user.salt.buffer; // Extrai Buffer do Binary
        console.log('DataAccess: Convertido salt de Binary para Buffer:', saltBuffer.toString('hex'));
      } else if (Buffer.isBuffer(user.salt)) {
        saltBuffer = user.salt;
        console.log('DataAccess: Salt já é Buffer:', saltBuffer.toString('hex'));
      } else {
        console.error('DataAccess: Salt inválido para usuário:', userId, 'Tipo:', typeof user.salt);
        throw new Error('Salt inválido');
      }

      // Converter password de Binary para Buffer
      let passwordBuffer;
      if (user.password && user.password._bsontype === 'Binary') {
        passwordBuffer = user.password.buffer; // Extrai Buffer do Binary
        console.log('DataAccess: Convertido password de Binary para Buffer:', passwordBuffer.toString('hex'));
      } else if (Buffer.isBuffer(user.password)) {
        passwordBuffer = user.password;
        console.log('DataAccess: Password já é Buffer:', passwordBuffer.toString('hex'));
      } else {
        console.error('DataAccess: Password inválido para usuário:', userId, 'Tipo:', typeof user.password);
        throw new Error('Password inválido');
      }

      // Verificar senha antiga
      const oldHashedPassword = await pbkdf2Async(
        oldPassword,
        saltBuffer,
        310000,
        16,
        'sha256'
      );
      console.log('DataAccess: oldHashedPassword gerado:', oldHashedPassword.toString('hex'));

      if (!crypto.timingSafeEqual(oldHashedPassword, passwordBuffer)) {
        console.error('DataAccess: Senha antiga incorreta para usuário:', userId);
        throw new Error('Senha antiga incorreta');
      }

      // Gerar novo hash para a senha nova
      const newSalt = crypto.randomBytes(16); // Gera Buffer
      console.log('DataAccess: Gerado novo salt para changePassword:', newSalt.toString('hex'));
      const newHashedPassword = await pbkdf2Async(
        newPassword,
        newSalt,
        310000,
        16,
        'sha256'
      );
      console.log('DataAccess: newHashedPassword gerado:', newHashedPassword.toString('hex'));

      // Atualizar senha e salt
      const result = await Mongo.db
        .collection(collectionName)
        .findOneAndUpdate(
          { _id: new ObjectId(userId) },
          { $set: { password: newHashedPassword, salt: newSalt } },
          { returnDocument: 'after' }
        );

      if (!result.value) {
        const existing = await Mongo.db
          .collection(collectionName)
          .findOne({ _id: new ObjectId(userId) });
        if (!existing) {
          console.error('DataAccess: Usuário não encontrado após atualização:', userId);
          throw new Error('Usuário não encontrado');
        }
        return existing;
      }

      console.log('DataAccess: Senha alterada com sucesso para usuário:', userId);
      return { _id: userId, message: 'Senha alterada com sucesso' };
    } catch (error) {
      console.error('DataAccess: Erro ao alterar senha:', error.message);
      throw new Error(error.message);
    }
  }
}
