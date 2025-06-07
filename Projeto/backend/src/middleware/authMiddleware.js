import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../helpers/httpResponses.js';

// Middleware para verificar admin
export const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send(unauthorized('Token ausente'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') {
      return res.status(403).send(forbidden('Acesso restrito a administradores'));
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send(unauthorized('Token inválido'));
  }
};
