const knex = require('../configs/knex-config')
const util = require('../utilities/util')
const shopifyController = require('./ShopifyController')
const axios = require('axios')
const botUrl = "http://bot.sales-bot.tech/api/answer/getAnswer?sentence="

const answerArr = ['Đây là câu trả lời mẫu', 'Tôi không hiểu câu hỏi của bạn', 'Cảm ơn câu hỏi của bạn']
const findConversation = async (sessionId) => {
    const conversation = await knex('conversation').where({ sessionId }).first('sessionId', 'storeId', 'id')
    return conversation
}

const getConversations = async (storeId) => {
    const result = await knex('conversation').where({ storeId }).orderBy('lastMessageTime', 'desc').select('id', 'userName', 'lastMessageTime')
    const response = util.createList(result, 'conversations')
    return response
}

const getMessages = async (conversationId) => {
    const result = await knex('message').where({ conversationId }).select('msgContent', 'id', 'sender', 'time')
    const response = util.createList(result, 'messages')
    return response
}

const createConversation = async ({ message, storeId }) => {
    const answer = await generateAnswer(message);
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const conversation = {
        sessionId,
        storeId,
        // lastMessage: answer,
        userName: 'Anonymous User',
        lastMessageTime: util.getCurrentDatetime()
    }
    const result = await knex('conversation').returning(['sessionId', 'storeId', 'id', 'lastMessageTime']).insert(conversation)
    const conversationObj = util.createObj(result, 'conversation')
    const userMessage = {
        msgContent: message,
        sender: 'user',
        time: conversationObj.conversation.lastMessageTime,
        conversationId: conversationObj.conversation.id
    }
    const botMessage = {
        msgContent: answer.message,
        sender: 'bot',
        time: conversationObj.conversation.lastMessageTime,
        conversationId: conversationObj.conversation.id
    }
    await knex('Message').insert(userMessage)
    await knex('Message').insert(botMessage)
    return { sessionId, answer }
}

const updateConversation = async ({ conversation, message }) => {
    const answer = await generateAnswer(message);
    const userMessage = {
        msgContent: message,
        sender: 'user',
        time: conversation.lastMessageTime,
        conversationId: conversation.id
    }
    const botMessage = {
        msgContent: answer.message,
        sender: 'bot',
        time: conversation.lastMessageTime,
        conversationId: conversation.id
    }
    await knex('Message').insert(userMessage)
    await knex('Message').insert(botMessage)
    return { sessionId: conversation.sessionId, answer }
}
const generateAnswer = async (message) => {
    // let res = await axios.get(botUrl+encodeURIComponent(message))
    // let botResponse = res.data
    // if(botResponse.mean.length === 0) {
    //     return { message: `Tôi không hiểu câu trả lời của bạn`, type: 'no-answer' }
    // } else {
    //     if(botResponse.action === 'find') {
    //         if(botResponse.actionInfo.length == 0) {
    //             return {message : botResponse.negative, type: "cannot-find"}
    //         } else {
    //             var options = botResponse.actionInfo.map((option) => option.name.toLowerCase())
    //             var optionValues = botResponse.actionInfo.map((option) => option.value.toLowerCase())
    //             let products = await shopifyController.getProductOption()
    //             //filter out the products which has require option (eg: size, color)
    //             products = products.filter(p => checkOption(p.options, options))
    //             //filter out the product which has same option value (eg: l,xl, xanh, đỏ...)
    //             return {message: botResponse.positive, payload: products, type: 'find'}
    //         }            
    //     }
    //     if(botResponse.action === 'check') {
    //         if(botResponse.actionInfo.length == 0) {
    //             return {message : botResponse.negative, type: "cannot-find"}
    //         } else {
    //             return {message: botResponse.positive, type: 'find'}
    //         }    
    //     }
    // }
    if (message.includes('tìm')) {
        const productType = message.slice(message.indexOf("tìm") + 4)
        const products = await shopifyController.getProductByTitle(productType)
        return { message: `Đây là các sản phẩm thuộc loại ${productType}`, payload: products, type: 'find-product' }
    } else if (message.includes('xem đơn hàng')) {
        return { message: ``, type: 'view-order' }
    } else if (message.includes('tình trạng đơn hàng')) {
        return { messages: ``, type: 'track-order-status' }
    }
    else {
        return { message: `Tôi không hiểu câu trả lời của bạn`, type: 'no-answer' }
    }
}

const checkOption = (productOptions, botOptions) => {
    var optionNames = productOptions.map(p => p.name.toLowerCase())
    return optionNames.some(n => (botOptions.indexOf(n) >= 0))
}

module.exports = {
    findConversation,
    createConversation,
    updateConversation,
    getConversations,
    getMessages,
}