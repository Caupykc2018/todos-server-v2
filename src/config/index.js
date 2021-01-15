import dotenv from 'dotenv';

dotenv.config()

export default {
    dbURL: process.env.DB_URL,
    secretToken: process.env.SECRET_TOKEN,
    secretRefreshToken: process.env.REFRESH_SECRET_TOKEN
};