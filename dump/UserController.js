// var sql = require("mssql");
// var conn = require("../connection/connect")()
// const knex = require('../configs/config')
// const getUsers = async () => {
//     knex.select().from('User').then((colleciton) => console.log(colleciton))
// }

// var routes = function () {
//     router.route('/').get(function (req, res) {
//         conn.connect().then(function () {
//             var query = "SELECT * FROM User"
//             var req = new sql.Request(conn)
//             req.query(query).then((recordset) => {
//                 res.json(recordset.recordset);
//                 conn.close();
//             }).catch(err => {
//                 conn.close();
//                 res.status(400).send("Error getting data: " + err)
//             })
//         }).catch(err => {
//             conn.close();
//             res.status(400).send("Connection err: " + err)
//         })
//     })

//     router.route('/admin').post(function (req, res) {
//         conn.connect().then(function () {
//             var transaction = new sql.Transaction(conn);
//             transaction.begin().then(function () {
//                 var request = new sql.Request(transaction)
//                 var query = "INSERT INTO User(Email, Password, FirstName, LastName, RoleId) "
//                     + "VALUES('" + req.body.Email + "','" + req.body.Password + "','"
//                     + req.body.FirstName + "','" + req.body.LastName + "','2')"
//                 request.query(query).then(() => {
//                     transaction.commit().then(function (recordSet) {
//                         conn.close()
//                         res.status(200).send(req.body);
//                     }).catch(err => {
//                         res.status(400).send("Error when commit: " + err)
//                     })

//                 }).catch(err => {
//                     conn.close();
//                     res.status(400).send("Error when inserting role: " + err)
//                 })
//             }).catch(err => {
//                 conn.close()
//                 res.status(400).send("Transaction error: " + err);
//             })
//         }).catch(err => {
//             conn.close()
//             res.status(400).send("Error when connecting to DB: " + err)
//         })
//     })

//     router.route('/store-owner').post(function (req, res) {
//         conn.connect().then(function () {
//             var transaction = new sql.Transaction(conn);
//             transaction.begin().then(function () {
//                 var request = new sql.Request(transaction)
//                 var query = "INSERT INTO User(Email, Password, FirstName, LastName, RoleId, StoreId) "
//                     + "VALUES('" + req.body.email + "','" + req.body.password + "','"
//                     + req.body.firstName + "','" + req.body.lastName + "','1','" + req.body.shopId + "')"
//                 console.log(query)
//                 request.query(query).then(() => {
//                     transaction.commit().then(function (recordSet) {
//                         conn.close()
//                         res.status(200).send(req.body);
//                     }).catch(err => {
//                         res.status(400).send("Error when commit: " + err)
//                     })

//                 }).catch(err => {
//                     console.log(err)
//                     conn.close();
//                     res.status(400).send("Error when inserting role: " + err)
//                 })
//             }).catch(err => {
//                 conn.close()
//                 res.status(400).send("Transaction error: " + err);
//             })
//         }).catch(err => {
//             conn.close()
//             res.status(400).send("Error when connecting to DB: " + err)
//         })
//     })

//     return router;
// }

module.exports = {
    // getUsers
}