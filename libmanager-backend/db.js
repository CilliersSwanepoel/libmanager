const { Client } = require('pg');

const client = new Client({
    user: 'postgres',    
    host: 'localhost', 
    database: 'libmanager', 
    password: 'Quxub7164*02',  
    port: 5432,            
    ssl: false, // Disable SSL
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database successfully'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;
