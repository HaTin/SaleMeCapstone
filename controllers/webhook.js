const express = require('express')
const router = express.Router()
const webhookService = require('../services/WebhookService')
var today = new Date()

router.post('/products/update', async (req, res) => {
    try {
        console.log('product is updated '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var updateProduct = req.body
        webhookService.updateProduct(updateProduct, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/products/create', async (req, res) => {
    try {
        console.log('new product is created at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var newProduct = req.body
        webhookService.saveNewProduct(newProduct, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/products/delete', async (req, res) => {
    try {
        console.log('A product is removed at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var productId = req.body.id
        webhookService.removeProduct(productId)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/collections/update', async (req, res) => {
    try {
        console.log('collection is updated '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var updateCollection = req.body
        webhookService.updateCollection(updateCollection, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/collections/create', async (req, res) => {
    try {
        console.log('new collection is created at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var newCollection = req.body
        webhookService.saveNewCollection(newCollection, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/collections/delete', async (req, res) => {
    try {
        console.log('A collection is removed at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var id = req.body.id
        webhookService.removeCollection(id)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/orders/update', async (req, res) => {
    try {
        console.log('Order is updated '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var updateOrder = req.body
        webhookService.updateOrder(updateOrder, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/orders/create', async (req, res) => {
    try {
        console.log('new order is created at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var newOrder = req.body
        webhookService.saveNewOrder(newOrder, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/orders/delete', async (req, res) => {
    try {
        console.log('An order is removed at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var id = req.body.id
        webhookService.removeOrder(id)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})


module.exports = router
