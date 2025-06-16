import pg from 'pg';
import config from './config';

const db = new pg.Pool({
    connectionString: config.dbUri
});

export default db;