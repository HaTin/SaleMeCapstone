const express = require('express')
const router = express.Router()
const storeService = require('../services/StoreService')
const responseStatus = require('../configs/responseStatus')
router.get('/', async (req, res) => {
    try {
        const response = await storeService.getStores()
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.post('/', async (req, res) => {
    try {
        const response = await storeService.saveStore(req.body)
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
module.exports = router