const express = require('express')
const router = express.Router()
const storeController = require('../controllers/StoreController2')
const responseStatus = require('../configs/responseStatus')
router.get('/', async (req, res) => {
    try {
        const response = await storeController.getStores()
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.post('/', async (req, res) => {
    try {
        const response = await storeController.saveStore(req.body)
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
module.exports = router