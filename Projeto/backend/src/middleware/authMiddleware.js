import jwt from 'jsonwebtoken';
import { unauthorized, forbidden, serverError } from '../helpers/httpResponses.js';
import { Mongo } from '../database/mongo.js';
import { ObjectId } from 'mongodb';

const collectionName = 'users';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware para verificar admin
export const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send(unauthorized('Token ausente'));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).send(forbidden('Acesso restrito a administradores'));
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send(unauthorized('Token inválido'));
  }
};

// Middleware para verificar se o usuário está logado
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send(unauthorized('Token de autenticação ausente ou inválido'));
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).send(unauthorized('Token inválido ou expirado'));
    }
    const userId = decoded._id;
    if (!ObjectId.isValid(userId)) {
      return res.status(401).send(unauthorized('ID de usuário inválido no token'));
    }
    const user = await Mongo.db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(userId) }, { projection: { _id: 1, role: 1, fullname: 1 } });
    if (!user) {
      return res.status(401).send(unauthorized('Usuário não encontrado'));
    }
    req.user = {
      userId: user._id.toString(),
      role: user.role || 'user',
      fullname: user.fullname || 'Usuário sem nome',
    };
    next();
  } catch (error) {
    return res.status(500).send(serverError('Erro ao verificar autenticação'));
  }
};
