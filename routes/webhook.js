const express = require('express')
const router = express.Router()
const webhookController = require('../controllers/WebhookController')

var today = new Date()
router.post('/products/update', async (req, res) => {
    try {
        console.log('product is updated '+today.toLocaleDateString()+" "+today.toLocaleTimeString())
        var shopName = req.headers['x-shopify-shop-domain']
        var updateProduct = req.body
        await webhookController.updateProductCache(updateProduct, shopName)
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
        await webhookController.saveNewProductCache(newProduct, shopName)
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
        await webhookController.removeProductCache(productId, shopName)
        res.sendStatus(200)
    } catch(err) {
        console.log(err)
    }
})

module.exports = router
