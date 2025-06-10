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

// Middleware para verificar se o usuario está logado
export const isAuthenticated = async (req, res, next) => {
  try {
    console.log('Middleware: Verificando autenticação para', req.method, req.path);

    // Verificar cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Middleware: Token ausente ou malformado');
      return res.status(401).send(unauthorized('Token de autenticação ausente ou inválido'));
    }

    // Extrair token
    const token = authHeader.split(' ')[1];

    // Verificar token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Middleware: Token inválido ou expirado:', error.message);
      return res.status(401).send(unauthorized('Token inválido ou expirado'));
    }

    // Validar userId no token
    const userId = decoded._id;
    if (!ObjectId.isValid(userId)) {
      console.error('Middleware: ID de usuário inválido no token:', userId);
      return res.status(401).send(unauthorized('ID de usuário inválido no token'));
    }

    // Verificar se o usuário existe
    const user = await Mongo.db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(userId) }, { projection: { _id: 1, role: 1, fullname: 1 } });

    if (!user) {
      console.error('Middleware: Usuário não encontrado:', userId);
      return res.status(401).send(unauthorized('Usuário não encontrado'));
    }

    // Adicionar dados do usuário ao objeto req
    req.user = {
      userId: user._id.toString(),
      role: user.role || 'user',
      fullname: user.fullname || 'Usuário sem nome',
    };
    console.log('Middleware: Usuário autenticado:', req.user);

    // Prosseguir para a próxima função
    next();
  } catch (error) {
    console.error('Middleware: Erro no isAuthenticated:', error.message);
    return res.status(500).send(serverError('Erro ao verificar autenticação'));
  }
};
