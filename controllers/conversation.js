const express = require('express')
const router = express.Router()
const conversationService = require('../services/ConversationService')
const responseStatus = require('../configs/responseStatus')
router.post('/', async (req, res) => {
    try {
        const { sessionId, message, storeId } = req.body
        const conversation = await conversationService.findConversation(sessionId)
        if (!conversation) {
            const response = await conversationService.createConversation({ message, storeId })
            return res.send(responseStatus.Code200(response))
        } else {
            const response = await conversationService.updateConversation({ conversation, message })
            return res.send(responseStatus.Code200(response))
        }
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.get('/:storeId', async (req, res) => {
    try {
        const { pageNumber, rowPage } = req.query
        const response = await conversationService.getConversations(req.params.storeId, parseInt(pageNumber), parseInt(rowPage))
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.get('/messages/:conversationId', async (req, res) => {
    try {
        const response = await conversationService.getMessages(req.params.conversationId)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.post('/report', async (req, res) => {
    try {
        const { message, storeId } = req.body
        const response = await conversationService.reportMessage(message, storeId)
        res.send(responseStatus.Code200(response))
    } catch (err) {
        console.log(err)
        res.status(err.status || 500).send(err)
    }
})
module.exports = router