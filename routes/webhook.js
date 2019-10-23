const express = require('express')
const router = express.Router()
const webhookController = require('../controllers/WebhookController')

var today = new Date()
router.post('/products/update', async (req, res) => {
    try {
        console.log('product is updated '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var updateProduct = req.body
        webhookController.updateProduct(updateProduct, shopName)
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
        webhookController.saveNewProduct(newProduct, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/products/delete', async (req, res) => {
    try {
        console.log('A product is removed at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var productId = req.body.id
        webhookController.removeProduct(productId, shopName)
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
        webhookController.updateCollection(updateCollection, shopName)
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
        webhookController.saveNewCollection(newCollection, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/collections/delete', async (req, res) => {
    try {
        console.log('A collection is removed at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var id = req.body.id
        webhookController.removeCollection(id, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/customers/update', async (req, res) => {
    try {
        console.log('Customer is updated '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var updateCustomer = req.body
        webhookController.updateCustomer(updateCustomer, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/customers/create', async (req, res) => {
    try {
        console.log('new customer is created at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var newCustomer = req.body
        webhookController.saveNewCustomer(newCustomer, shopName)
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
        webhookController.updateOrder(updateOrder, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

router.post('/orders/create', async (req, res) => {
    try {
        console.log('new order is created at '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var newCollection = req.body
        webhookController.saveNewOrder(newOrder, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

module.exports = router
