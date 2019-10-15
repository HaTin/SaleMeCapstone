const express = require('express')
const router = express.Router()
const webhookController = require('../controllers/WebhookController')

router.post('/products/update', async (req, res) => {
    try {
        console.log('product is updated')
        console.log(req.body)
    } catch(err) {
        console.log(err)
    }
})

router.post('/products/create', async (req, res) => {
    try {
        console.log('new product is created')
        console.log(req.body)
    } catch(err) {
        console.log(err)
    }
})

module.exports = router
