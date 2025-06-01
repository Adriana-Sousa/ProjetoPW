import express from "express";
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Mongo } from "../database/mongo.js";
import { ObjectId } from 'mongodb';
import { config } from "dotenv";

const collectionName = 'users';
const authRouter = express.Router();
config()

// Configuração do Passport Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
  try {
    const user = await Mongo.db
      .collection(collectionName)
      .findOne({ email: email });

    if (!user) {
      return callback(null, false);
    }

    const saltBuffer = user.salt.buffer;

    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (error, hashedPassword) => {
      if (error) {
        return callback(error);
      }

      const userPasswordBuffer = Buffer.from(user.password.buffer);

      if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
        return callback(null, false);
      }

      const { password, salt, ...rest } = user;
      return callback(null, rest);
    });
  } catch (error) {
    return callback(error);
  }
}));

// Rota: Registro de usuários
authRouter.post('/signup', async (req, res) => {
  try {
    // Validação de entrada
    const { fullname, email, password } = req.body;
    if (!fullname || !fullname.trim()) {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        body: 'O nome completo é obrigatório'
      });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        body: 'O e-mail é inválido'
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        body: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Checar se o usuário já existe
    const checkUser = await Mongo.db
      .collection(collectionName)
      .findOne({ email: email });

    if (checkUser) {
      return res.status(409).send({
        success: false,
        statusCode: 409,
        body: 'Usuário já existe'
      });
    }

    // Criptografar a senha
    const salt = crypto.randomBytes(16);
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 310000, 16, 'sha256', (error, derivedKey) => {
        if (error) reject(error);
        resolve(derivedKey);
      });
    });

    // Inserir o usuário
    const result = await Mongo.db
      .collection(collectionName)
      .insertOne({
        fullname,
        email,
        password: hashedPassword,
        salt,
        role: "client"
      });

    if (!result.insertedId) {
      return res.status(500).send({
        success: false,
        statusCode: 500,
        body: 'Erro ao inserir o usuário'
      });
    }

    // Buscar o usuário sem campos sensíveis
    const user = await Mongo.db
      .collection(collectionName)
      .findOne({ _id: new ObjectId(result.insertedId) }, { projection: { password: 0, salt: 0 } });

    // Gerar o token JWT
    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret');

    return res.status(201).send({
      success: true,
      statusCode: 201,
      body: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Erro no signup:', error);
    return res.status(500).send({
      success: false,
      statusCode: 500,
      body: 'Erro interno no servidor'
    });
  }
});

// Rota: Login de usuários
authRouter.post('/login', (req, res) => {
  passport.authenticate('local', (error, user) => {
    if (error) {
      return res.status(500).send({
        success: false,
        statusCode: 500,
        body: 'Erro durante autenticação'
      });
    }

    if (!user) {
      return res.status(401).send({
        success: false,
        statusCode: 401,
        body: 'Credenciais incorretas'
      });
    }

    // Gerar o token JWT
    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret');
    return res.status(200).send({
      success: true,
      statusCode: 200,
      body: {
        user,
        token
      }
    });
  })(req, res);
});

export default authRouter;