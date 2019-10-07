var sql = require('mssql')
var connect = function(){
    var conn = new sql.ConnectionPool({
        user: 'sa',
        password: '123',
        server: 'localhost',
        database: 'sale_assistant_chatbot'
    });
 
    return conn;
}

module.exports = connect;