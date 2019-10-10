// var express = require('express');
// var router = express.Router();
// var sql = require("mssql");
// var conn = require("../connection/connect")();

// var routes = function () {
//     router.route('/').get(function (req, res) {
//         conn.connect().then(function () {
//             var query = "SELECT * FROM BotConfiguration"
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

//     router.route('/:storeId').get(function (req, res) {
//         var storeId = req.params.storeId
//         conn.connect().then(function () {
//             var query = "SELECT * FROM BotConfiguration WHERE StoreId=" + storeId
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

//     router.route('/bot-config/:storeId').post(function (req, res) {
//         var storeId = req.params.storeId;
//         conn.connect().then(function () {
//             var transaction = new sql.Transaction(conn);
//             transaction.begin().then(function () {
//                 var request = new sql.Request(transaction)
//                 var query = "INSERT INTO BotConfiguration(BotName, StoreId, TextColor, BackgroundColor, Font, ConfigDate, isActive, Avatar) "
//                     + "VALUES('" + req.body.BotName + "','" + storeId + "','" + req.body.TextColor + "'"
//                     + ", '" + req.body.BackgroundColor + "', '" + req.body.Font + "', '" + req.body.ConfigDate + "'"
//                     + ", 'true', '" + req.body.Avatar + "')"
//                 request.query(query).then(() => {
//                     transaction.commit().then(function (recordSet) {
//                         conn.close()
//                         res.status(200).send(req.body);
//                     }).catch(err => {
//                         res.status(400).send("Error when commit: " + err)
//                     })

//                 }).catch(err => {
//                     conn.close();
//                     res.status(400).send("Error when inserting: " + err)
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

//     router.route('/deactive/:storeId').put(function (req, res) {
//         var storeId = req.params.storeId
//         conn.connect().then(function () {
//             var transaction = new sql.Transaction(conn);
//             transaction.begin().then(function () {
//                 var request = new sql.Request(transaction)
//                 var query = "UPDATE BotConfiguration "
//                     + "SET IsActive='false' WHERE StoreId=" + storeId + " AND IsActive='true'";
//                 request.query(query).then(() => {
//                     transaction.commit().then(function (recordSet) {
//                         conn.close()
//                         res.status(200).send(recordSet);
//                     }).catch(err => {
//                         res.status(400).send("Error when commit: " + err)
//                     })
//                 }).catch(err => {
//                     conn.close();
//                     res.status(400).send("Error when updating: " + err)
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