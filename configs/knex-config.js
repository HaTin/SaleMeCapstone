// require('dotenv').config();
// if (process.env.NODE_ENV === 'development') {
const knex = require('knex')({
    client: 'mssql',
    connection: {
        user: 'admin',
        password: '1234567890',
        server: 'sales-bot.tech',
        database: 'shopdata',
        options: {
            encrypt: true
        }
    }
});
module.exports = knex