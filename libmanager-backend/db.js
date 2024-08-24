const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',       // Replace with your PostgreSQL username
    host: 'localhost',           // Hostname of your PostgreSQL server
    database: 'libmanager',  // Your database name
    password: 'Quxub7164*02',   // Replace with your PostgreSQL password
    port: 5432,                  // Default PostgreSQL port
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');
    release();
});

module.exports = pool;
