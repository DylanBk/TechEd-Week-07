import dotenv from 'dotenv';

dotenv.config();

interface Config {
    client: string,
    dbUri: string,
    port: number,
    nodeEnv: string,
    secretKey: string
};

const config: Config = {
    client: process.env.CLIENT || 'http://localhost:5000',
    dbUri: process.env.DB_URI || 'DB URI undefined',
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    secretKey: process.env.SECRET_KEY || 'secret'
};

export default config;