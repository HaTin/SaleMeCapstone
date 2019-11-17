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

const insertConversation = async ({ sessionId, storeId, lastMessage, userName, timestamp }) => {
    const conversation = {
        sessionId,
        storeId,
        lastMessage,
        userName,
        lastMessageTime: util.convertDatetime(timestamp)
    }
    const result = await knex('conversation').returning(['sessionId', 'storeId', 'id', 'lastMessageTime']).insert(conversation)
    return result[0]
}

const insertMessage = async ({ sender, timestamp, conversationId, msgContent }) => {
    const message = {
        msgContent,
        sender,
        time: util.convertDatetime(timestamp),
        conversationId
    }
    const result = await knex('Message').insert(message).returning(['id'])
    return result[0]
}

const handleClientState = async (data) => {

}

const generateBotAnswer = async (botData, socket) => {
    const messages = []
    const { sessionId, storeId, timestamp, text, client } = botData
    let { state, data } = client
    let conversation = await knex('conversation').where({ sessionId }).first('sessionId', 'storeId', 'id')
    if (!conversation) {
        conversation = await insertConversation({
            sessionId,
            storeId,
            lastMessage: text,
            userName: 'Anonymous User',
            timestamp
        })
    }
    await insertMessage({
        msgContent: text,
        sender: 'user',
        timestamp,
        conversationId: conversation.id
    })
    if (state) {
        switch (state) {
            case 'ask-order-id':
                state = 'input-order-id'
                messages.push({ text: 'Vui lòng nhập mã đơn hàng', type: 'text' })
                break;
            case 'input-order-id':
                data.orderId = text
                state = 'input-order-email'
                const suggestedActions = [
                    {
                        type: 'cancel',
                        value: 'Hủy'
                    }, {
                        type: 'ask-order-id',
                        value: 'Nhập lại mã đơn hàng'
                    }
                ]
                messages.push({ text: 'Vui lòng nhập email', suggestedActions, type: 'text' })
                break;
            case 'input-order-email':
                const email = text
                if (!util.validateEmail(email)) {
                    const suggestedActions = [
                        {
                            type: 'cancel',
                            value: 'Hủy'
                        }, {
                            type: 'ask-order-id',
                            value: 'Nhập lại mã đơn hàng'
                        }
                    ]
                    messages.push({ text: `Vui lòng nhập đúng định dạng email`, suggestedActions, type: 'text' })
                }
                else {
                    const store = await knex('store').where({ id: storeId }).first('id', 'name', 'token')
                    const response = await axios.get(`https://${store.name}/admin/api/2019-10/orders.json`, {
                        params: {
                            'name': data.orderId
                        },
                        headers: {
                            'X-Shopify-Access-Token': store.token
                        }
                    })
                    const orders = response.data.orders
                    if (orders.length) {
                        const order = orders[0]
                        if (order.email === email) {
                            messages.push({ text: `Thông tin của đơn hàng với mã ${order.order_number}`, type: 'text' })
                            messages.push({ text: 'Nhấn vào đây để xem thông tin đơn hàng', link: order.order_status_url, type: 'link' })
                            state = null
                        } else {
                            messages.push({ text: `Không tìm thấy đơn hàng ${data.orderId} với email ${email}. Xin hãy thử lại`, type: 'text' })
                            state = null
                        }
                    } else {
                        messages.push({ text: 'Không tìm thấy đơn hàng', type: 'text' })
                        state = null
                    }
                }
                break;
            case 'cancel':
                messages.push({ text: 'Nếu bạn có bất kỳ câu hỏi nào, hãy hỏi tôi nhé!', type: 'text' })
                state = null
                break;
        }
        return { state, messages, data }
    }
    const response = await axios.get(BOT_URL, { params: { sentence: text } })
    const { action, actionInfo, positive, negative } = response.data
    switch (action) {
        case 'ask_order':
            state = 'input-order-id'
            messages.push({ text: 'Vui lòng nhập mã đơn hàng', type: 'text' })
            break
        case 'check_order':
            if (actionInfo.length) {
                const info = actionInfo[0]
                if (info.name = 'order_id') {
                    state = 'input-order-email'
                    data.orderId = info.value
                    messages.push({ text: 'Vui lòng nhập email', type: 'text' })
                } else messages.push({ text: negative, type: 'link' })
            }
            break
        case 'find':
            if (actionInfo.length) {
                var options = actionInfo.map((option) => option.name.toLowerCase())
                var optionValues = actionInfo.map((option) => option.value.toLowerCase())
                console.log(optionValues)
                //if(options.includes("product")) {
                const store = await knex('store').where({ id: storeId }).first('id', 'name', 'token')
                let products = await shopifyController.getProductOption(store)
                optionValues.forEach((option, index) => {
                    console.log("loop action info value: " + option)
                    products = products.filter(p => checkOptionValue(p, option))
                });
                if (products.length == 0) {
                    messages.push({ text: negative, type: 'text' })
                } else {
                    const attachments = []
                    products.forEach(product => {
                        const attachment = { contentType: 'product', content: null }
                        var variantStock = product.variants.map(v => ({ title: v.title, inventory_quantity: v.inventory_quantity }))
                        attachment.title = product.title
                        attachment.variantStock = variantStock
                        attachment.image = product.image.src
                        attachment.variants = product.variants
                        attachment.currencyCode = product.variants[0].presentment_prices[0].price.currency_code
                        const bestMatchVariant = findBestMatchVariant(product.variants, optionValues)
                        const variantParams = bestMatchVariant ? `variant=${bestMatchVariant.id}` : ''
                        attachment.buttons = [{ title: 'Mua ngay', type: 'open-url', value: `${store.name}/products/${product.handle}${variantParams}` }]
                        attachments.push(attachment)
                    })
                    messages.push({ text: positive, type: 'text' })
                    messages.push({ text: '', attachments, type: 'text' })
                }

            } else {
                messages.push({ text: negative, payload: [], type: 'find_product' })
            }
            break
        case 'show_collection':
            if (actionInfo.length) {
                var collectionId = actionInfo[0].value
                const store = await knex('store').where({ id: storeId }).first('id', 'name', 'token')
                let products = await shopifyController.getProductInCollection(store, collectionId)
                if (products.length == 0) {
                    messages.push({ text: negative, type: "text" })
                }
                else {
                    const attachments = []
                    products.forEach(product => {
                        const attachment = { contentType: 'product', content: null }
                        attachment.title = product.title
                        attachment.image = product.image.src
                        attachment.variants = product.variants
                        attachment.currencyCode = product.variants[0].presentment_prices[0].price.currency_code
                        attachment.buttons = [{ title: 'Mua ngay', type: 'open-url', value: `${store.name}/products/${product.handle}` }]
                        attachments.push(attachment)
                    })
                    messages.push({ text: positive, type: "text" })
                    messages.push({ text: '', attachments, type: "text" })
                }
            } else {
                messages.push({ text: negative, type: "text" })
            }
            break
        default:
            messages.push({ text: positive, type: 'text' })
    }
    const botMessage = await insertMessage({
        msgContent: 'test answer',
        sender: 'bot',
        conversationId: conversation.id
    })
    return { messages, state, data }
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

const findBestMatchVariant = (variants, optionValue) => {
    //add score to each variant
    variants.map(v => {
        var optionList = []
        if(v.option1) optionList.push(v.option1.toLowerCase())
        if(v.option2) optionList.push(v.option2.toLowerCase())
        if(v.option3) optionList.push(v.option3.toLowerCase())
        var score = 0
        optionValue.forEach(o => {
            if(optionList.indexOf(o) >= 0) {
                score += 1
            }
        })
        v.score = score
    })
    //find the variant with highest score
    var bestMatchVariant = null
    var baseScore = 0
    variants.forEach(v => {
        if(v.score > baseScore) {
            baseScore = v.score
            bestMatchVariant = v
        }
    })
    return bestMatchVariant
}

const findBestMatchVariant = (variants, optionValue) => {
    //add score to each variant
    variants.map(v => {
        var optionList = []
        if (v.option1) optionList.push(v.option1.toLowerCase())
        if (v.option2) optionList.push(v.option2.toLowerCase())
        if (v.option3) optionList.push(v.option3.toLowerCase())
        var score = 0
        optionValue.forEach(o => {
            if (optionList.indexOf(o) >= 0) {
                score += 1
            }
        })
        v.score = score
    })
    //find the variant with highest score
    var bestMatchVariant = null
    var baseScore = 0
    variants.forEach(v => {
        if (v.score > baseScore) {
            baseScore = v.score
            bestMatchVariant = v
        }
    })
    return bestMatchVariant
}

const reportMessage = async (message, storeId) => {
    const store = await knex('store').where({ id: storeId }).first('id', 'name')
    const response = await axios.get(BOT_URL, { params: { sentence: message } })
    return axios.post('http://bot.sales-bot.tech/api/report/reportMessage',
        JSON.stringify(response.data),
        { params: { question: message, shop: store.name } })
}



module.exports = {
    findConversation,
    createConversation,
    updateConversation,
    getConversations,
    getMessages,
    generateBotAnswer,
    reportMessage
}