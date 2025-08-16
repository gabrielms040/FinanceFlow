const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',         
    host: 'localhost',
    database: 'finance',       
    password: '1907', 
    port: 5432,
});

module.exports = pool;
