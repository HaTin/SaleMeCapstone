const express = require('express')
const router = express.Router()
const conversationController = require('../controllers/ConversationController')
const responseStatus = require('../configs/responseStatus')
router.post('/', async (req, res) => {
    try {
        const { sessionId, message, storeId } = req.body
        const conversation = await conversationController.findConversation(sessionId)
        if (!conversation) {
            const response = await conversationController.createConversation({ message, storeId })
            return res.send(responseStatus.Code200(response))
        } else {
            const response = await conversationController.updateConversation({ conversation, message })
            return res.send(responseStatus.Code200(response))
        }
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.get('/:storeId', async (req, res) => {
    try {
        const response = await conversationController.getConversations(req.params.storeId)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
router.get('/messages/:conversationId', async (req, res) => {
    try {
        const response = await conversationController.getMessages(req.params.conversationId)
        return res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
module.exports = router