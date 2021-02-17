import * as jwt from 'jsonwebtoken';
import config from '../config';

export const createToken = (userId: number, expireTime: number = 60) =>
  jwt.sign({ id: userId }, config.secretToken, { expiresIn: expireTime });
