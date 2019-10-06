var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function() {
    router.route('/').get(function(req,res) {
        conn.connect().then(function() {
            var query = "SELECT * FROM Store"
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

    router.route('/').post(function(req,res){
        conn.connect().then(function() {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function() {
                var request = new sql.Request(transaction)
                var query = "INSERT INTO Store(Name, TimeInstall, Token, IsActive) "
                +"VALUES('"+req.body.Name+"','"+req.body.TimeInstall+"','"+req.body.Token+"','"+req.body.IsActive+"')"
                request.query(query).then(()=>{
                    transaction.commit().then(function(recordSet){
                        conn.close()
                        res.status(200).send(req.body);
                    }).catch(err => {
                        res.status(400).send("Error when commit: "+err)
                    })
                    
                }).catch(err => {
                    conn.close();
                    res.status(400).send("Error when inserting: "+err)
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

    router.route('/deactive/:id').put(function(req,res) {
        var storeId = req.params.id
        conn.connect().then(function() {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function() {
                var request = new sql.Request(transaction)
                var query = "UPDATE Store "
                +"SET IsActive='false', TimeUninstall='"+req.body.TimeUninstall
                +"' WHERE Id="+storeId;
                request.query(query).then(() => {
                    transaction.commit().then(function(recordSet){
                        conn.close()
                        res.status(200).send(recordSet);
                    }).catch(err => {
                        res.status(400).send("Error when commit: "+err)
                    })
                }).catch(err => {
                    conn.close();
                    res.status(400).send("Error when updating: "+err)
                })
            }).catch(err => {
                conn.close();
                res.status(400).send("Transaction error: "+err)
            })
        }).catch(err => {
            conn.close();
            res.status(400).send("Connection error: "+err)
        })        
    })
    return router;
}

module.exports = routes;