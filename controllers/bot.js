
const express = require('express')
const botService = require('../services/BotConfigurationService')
const responseStatus = require('../configs/responseStatus')
const router = express.Router()

router.get('/:shopId', async (req, res) => {
    try {
        const response = await botService.getConfiguration(req.params.shopId)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.put('/:shopId', async (req, res) => {
    try {
        const response = await botService.updateConfiguration(req.params.shopId, req.body)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.post('/', async (req, res) => {
    try {
        const response = await botService.saveConfiguration(req.body)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

module.exports = router