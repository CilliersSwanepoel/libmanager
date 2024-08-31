const { Client } = require('pg');

const client = new Client({
    user: 'postgres',    
    host: 'libmanager.czo8aeqgqkfw.eu-north-1.rds.amazonaws.com', 
    database: 'libmanager', 
    password: 'Quxub7164*02',  
    port: 5432,            
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect()
    .then(() => console.log('Connected to AWS PostgreSQL database successfully'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;
