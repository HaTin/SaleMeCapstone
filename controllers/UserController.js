var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function() {
    router.route('/').get(function(req,res) {
        conn.connect().then(function() {
            var query = "SELECT * FROM User"
            var req = new sql.Request(conn)
            req.query(query).then((recordset) => {
                res.json(recordset.recordset);
                conn.close();
            }).catch(err => {
                conn.close();
                res.status(400).send("Error getting data: "+err)
            })
        }).catch(err => {
            conn.close();
            res.status(400).send("Connection err: "+err)
        })
    })

    router.route('/createAdmin').post(function(req,res){
        conn.connect().then(function() {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function() {
                var request = new sql.Request(transaction)
                var query = "INSERT INTO User(Email, Password, FirstName, LastName, RoleId) "
                +"VALUES('"+req.body.Email+"','"+req.body.Password+"','"
                +req.body.FirstName+"','"+req.body.LastName+"','2')"
                request.query(query).then(()=>{
                    transaction.commit().then(function(recordSet){
                        conn.close()
                        res.status(200).send(req.body);
                    }).catch(err => {
                        res.status(400).send("Error when commit: "+err)
                    })
                    
                }).catch(err => {
                    conn.close();
                    res.status(400).send("Error when inserting role: "+err)
                })
            }).catch(err => {
                conn.close()
                res.status(400).send("Transaction error: "+err);
            })
        }).catch(err => {
            conn.close()
            res.status(400).send("Error when connecting to DB: "+err)
        })
    })

    router.route('/createStoreOwner').post(function(req,res){
        conn.connect().then(function() {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function() {
                var request = new sql.Request(transaction)
                var query = "INSERT INTO User(Email, Password, FirstName, LastName, RoleId, StoreId) "
                +"VALUES('"+req.body.Email+"','"+req.body.Password+"','"
                +req.body.FirstName+"','"+req.body.LastName+"','1','"+req.body.StoreId+"')"
                request.query(query).then(()=>{
                    transaction.commit().then(function(recordSet){
                        conn.close()
                        res.status(200).send(req.body);
                    }).catch(err => {
                        res.status(400).send("Error when commit: "+err)
                    })
                    
                }).catch(err => {
                    conn.close();
                    res.status(400).send("Error when inserting role: "+err)
                })
            }).catch(err => {
                conn.close()
                res.status(400).send("Transaction error: "+err);
            })
        }).catch(err => {
            conn.close()
            res.status(400).send("Error when connecting to DB: "+err)
        })
    })

    return router;
}

module.exports = routes;