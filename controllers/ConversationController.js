const knex = require('../configs/knex-config')
const util = require('../utilities/util')
const shopifyController = require('./ShopifyController')
const axios = require('axios')
const redisController = require('./RedisController')
const BOT_URL = 'http://bot.sales-bot.tech/api/answer/getAnswer'

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

const checkMessageAction = async (message) => {

}

const createConversation = async ({ message, storeId }) => {
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const answer = await generateAnswerV2(message, storeId, sessionId);
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
    answer.messages.map(async m => {
        let botMessage = {
            msgContent: m.message,
            sender: 'bot',
            time: conversationObj.conversation.lastMessageTime,
            conversationId: conversationObj.conversation.id
        }
        await knex('Message').insert(botMessage)
    })
    await knex('Message').insert(userMessage)

    return { sessionId, answer }
}

const updateConversation = async ({ conversation, message }) => {
    const answer = await generateAnswerV2(message, conversation.storeId, conversation.sessionId);
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




const generateAnswerV2 = async (message, storeId, sessionId) => {
    const messages = []
    const sessionState = JSON.parse(await redisController.getKeys(sessionId))
    if (sessionState) {
        const { state, data } = sessionState
        if (state === 'input-order-id') {
            sessionState.data.orderId = message
            sessionState.state = 'input-order-email'
            redisController.setItem(sessionId, sessionState)
            messages.push({ message: 'Vui lòng nhập email', type: 'text' })
            return { action: 'input-order-email', messages }
        }
        else if (state === 'input-order-email') {
            const email = message
            if (message.toUpperCase() === "hủy".toUpperCase()) {
                messages.push({ message: `Hãy đặt câu hỏi một cách tự nhiên nhé`, isDirect: true, type: 'text' })
                redisController.setItem(sessionId, null)
                return { action: 'done', messages }
            }
            else if (!util.validateEmail(email)) {
                messages.push({ message: `Vui lòng nhập đúng định dạng email hoặc Gõ "Hủy" để bỏ qua`, isDirect: true, type: 'text' })
                return { action: 'done', messages }
            }
            const store = await knex('store').where({ id: storeId }).first('id', 'name', 'token')
            const response = await axios.get(`https://${store.name}/admin/api/2019-10/orders.json`, {
                params: {
                    'name': sessionState.data.orderId
                },
                headers: {
                    'X-Shopify-Access-Token': store.token
                }
            })
            const orders = response.data.orders
            if (orders.length) {
                const order = orders[0]
                if (order.email === email) {
                    messages.push({ message: `Thông tin của đơn hàng với mã ${order.order_number}`, isDirect: true, type: 'text' })
                    messages.push({ message: 'Nhấn vào để xem thông tin đơn hàng', link: order.order_status_url, isDirect: true, type: 'link' })
                    redisController.setItem(sessionId, null)
                } else {
                    messages.push({ message: `Không tìm thấy đơn hàng ${sessionState.data.orderId} với email ${email}. Xin hãy thử lại`, type: 'text' })
                    redisController.setItem(sessionId, null)
                    return { action: 'done', messages }
                }
            } else {
                messages.push({ message: 'Không tìm thấy đơn hàng', type: 'text' })
            }
            return { action: 'check_order', messages }
        }
    }
    const response = await axios.get(BOT_URL, { params: { sentence: message } })
    const { action, data, actionInfo, positive, negative } = response.data
    switch (action) {
        case 'ask_order':
            redisController.setItem(sessionId, { state: 'input-order-id', data: { orderId: '', email: '' } })
            messages.push({ message: 'Vui lòng nhập mã đơn hàng', type: 'text', isDirect: true })
            break
        case 'check_order':
            if (actionInfo.length) {
                const info = actionInfo[0]
                if (info.name = 'order_id') {
                    redisController.setItem(sessionId, { state: 'input-order-email', data: { orderId: info.value, email: '' } })
                    messages.push({ message: 'Vui lòng nhập email', type: 'text' })
                    return { action: 'input-order-email', messages }
                } else messages.push({ message: negative, isDirect: true })
            }
            break
        case 'find':
            if (actionInfo.length) {
                var options = actionInfo.map((option) => option.name.toLowerCase())
                var optionValues = actionInfo.map((option) => option.value.toLowerCase())
                console.log(optionValues)
                if (options.includes("product")) {
                    const store = await knex('store').where({ id: storeId }).first('id', 'name', 'token')
                    let products = await shopifyController.getProductOption(store)
                    optionValues.forEach((option, index) => {
                        console.log("loop action info value: " + option)
                        products = products.filter(p => checkOptionValue(p, option))
                    });
                    if (products.length == 0) {
                        messages.push({ message: negative, payload: products, type: 'find_product' })
                    } else {
                        products.forEach(product => {
                            var variantStock = product.variants.map(v => ({ title: v.title, inventory_quantity: v.inventory_quantity }))
                            product.variantStock = variantStock
                        })

                        messages.push({ message: positive, payload: products, type: 'find_product' })
                    }

                }
            } else {
                messages.push({ message: negative, payload: [], type: 'find_product' })
            }
            break
        default:
            messages.push({ message: positive, isDirect: true, type: 'undefined' })
    }
    return { action, messages }
}

const checkOptionValue = (product, value) => {
    var optionValues = []
    product.options.forEach(option => {
        var v = option.values
        v.forEach(val => optionValues.push(val.toLowerCase()))
    })
    if (product.title.toLowerCase().includes(value)
        || product.product_type.toLowerCase().includes(value)
        || optionValues.includes(value)) {
        return true
    }
    return false
}



module.exports = {
    findConversation,
    createConversation,
    updateConversation,
    getConversations,
    getMessages,
}