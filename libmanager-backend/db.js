const { Client } = require('pg');

// Create a new PostgreSQL client instance
const client = new Client({
    user: 'postgres',       // Your PostgreSQL username
    host: 'libmanager.czo8aeqgqkfw.eu-north-1.rds.amazonaws.com', // Your AWS RDS endpoint
    database: 'libmanager', // Your database name
    password: 'Quxub7164*02',   // Your PostgreSQL password
    port: 5432,             // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false, // Disable SSL certificate validation for development
    },
});

// Connect to the PostgreSQL database
client.connect()
    .then(() => console.log('Connected to AWS PostgreSQL database successfully'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;
