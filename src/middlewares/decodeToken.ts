import * as jwt from 'koa-jwt';
import config from '../config';

export const decodeToken = jwt({
  secret: config.secretToken,
  key: 'payload',
  passthrough: true,
});
