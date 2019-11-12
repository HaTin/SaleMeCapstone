
const express = require('express')
const botController = require('../controllers/BotConfigurationController')
const responseStatus = require('../configs/responseStatus')
const router = express.Router()

router.get('/:storeId', async (req, res) => {
    try {
        const response = await botController.getConfiguration(req.params.storeId)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.put('/:storeId', async (req, res) => {
    try {
        const response = await botController.updateConfiguration(req.params.storeId, req.body)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.post('/', async (req, res) => {
    try {
        const response = await botController.saveConfiguration(req.body)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

module.exports = router