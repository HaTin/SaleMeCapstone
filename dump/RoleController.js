// var express = require('express');
// var router = express.Router();
// var sql = require("mssql");
// var conn = require("../connection/connect")();

// var routes = function () {
//     router.route('/').get(function (req, res) {
//         conn.connect().then(function () {
//             var query = "SELECT * FROM Role"
//             var req = new sql.Request(conn)
//             req.query(query).then((recordset) => {
//                 res.json(recordset.recordset);
//                 conn.close();
//             }).catch(err => {
//                 conn.close();
//                 res.status(400).send("Error getting data from Role table: " + err)
//             })
//         }).catch(err => {
//             conn.close();
//             res.status(400).send("Connection err: " + err)
//         })
//     })

//     router.route('/').post(function (req, res) {
//         conn.connect().then(function () {
//             var transaction = new sql.Transaction(conn);
//             transaction.begin().then(function () {
//                 var request = new sql.Request(transaction)
//                 var query = "INSERT INTO Role(RoleName) VALUES('" + req.body.RoleName + "')"
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

//     router.route('/:id').delete(function (req, res) {
//         var roleId = req.params.id
//         conn.connect().then(function () {
//             var transaction = new sql.Transaction(conn);
//             transaction.begin().then(function () {
//                 var request = new sql.Request(transaction)
//                 var query = "DELETE FROM Role WHERE Id=" + roleId;
//                 request.query(query).then(() => {
//                     transaction.commit().then(function (recordSet) {
//                         conn.close()
//                         res.status(200).json("RoleId: " + roleId);
//                     }).catch(err => {
//                         res.status(400).send("Error when commit: " + err)
//                     })
//                 }).catch(err => {
//                     conn.close();
//                     res.status(400).send("Error when removing role: " + err)
//                 })
//             }).catch(err => {
//                 conn.close();
//                 res.status(400).send("Transaction error: " + err)
//             })
//         }).catch(err => {
//             conn.close();
//             res.status(400).send("Connection error: " + err)
//         })
//     })
//     return router;
// }

// module.exports = routes;