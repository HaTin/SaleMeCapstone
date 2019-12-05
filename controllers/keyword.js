const express = require('express')
const router = express.Router()
const keywordServicce = require('../services/KeywordService')
const responseStatus = require('../configs/responseStatus')

router.post('/', async (req, res) => {
    try {
        const response = await keywordServicce.saveKeyword(req.body)
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

router.get('/:shopId', async (req, res) => {
    try {
        const response = await keywordServicce.getActiveKeywords(req.params.shopId)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

router.put('/:shopId', async (req, res) => {
    try {
        const response = await keywordServicce.deactiveKeyword(req.params.shopId, req.body)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

module.exports = router