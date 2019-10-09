var sql = require('mssql')
var connect = function(){
    var conn = new sql.ConnectionPool({
        user: 'hatin',
        password: 'abc1234$',
        server: 'sachatbot.database.windows.net',
        database: 'sale_assistant_chatbot',
        encrypt: true,
    });
 
    return conn;
}

module.exports = connect;