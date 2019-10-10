const knex = require('knex')({
    client: 'mssql',
    connection: {
        user: 'hatin',
        password: 'abc1234$',
        server: 'sachatbot.database.windows.net',
        database: 'sale_assistant_chatbot',
        options: {
            encrypt: true
        }
    }
});

module.exports = knex