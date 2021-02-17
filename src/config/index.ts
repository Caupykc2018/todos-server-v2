import * as dotenv from 'dotenv';

dotenv.config();

export default {
  mongoURL: process.env.MONGO_DB_URL,
  secretToken: process.env.SECRET_TOKEN,
};
