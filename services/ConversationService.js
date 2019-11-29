const knex = require('../configs/knex-config')
const util = require('../utilities/util')
const shopifyService = require('../services/ShopifyService')
const axios = require('axios')
// const redisController = require('./RedisController')
const botService = require('./BotService')
const mailService = require('./MailService')
const BOT_URL = 'http://bot.sales-bot.tech/api/Message/GetAnswer'
const BOT_URL_SIMILAR = 'http://bot.sales-bot.tech/api/Find/SimilarProduct'
const amazonCrawler = require('./AmazonCrawlerService')
const translate = require('@vitalets/google-translate-api');


// const answerArr = ['Đây là câu trả lời mẫu', 'Tôi không hiểu câu hỏi của bạn', 'Cảm ơn câu hỏi của bạn']
const findConversation = async (sessionId) => {
    const conversation = await knex('conversation').where({ sessionId }).first('sessionId', 'shopId', 'id')
    return conversation
}

const insertConversation = async ({ sessionId, shopId, lastMessage, userName, timestamp }) => {
    const conversation = {
        sessionId,
        shopId,
        lastMessage,
        userName: userName ? userName : `#${util.makeId(5)}`,
        lastMessageTime: util.convertDatetime(timestamp)
    }
    const result = await knex('conversation').returning(['sessionId', 'shopId', 'id', 'lastMessageTime']).insert(conversation)
    return result[0]
}

const insertMessage = async ({ sender, timestamp, conversationId, msgContent, type, attachment }) => {
    const message = {
        msgContent,
        sender,
        type,
        attachment,
        time: util.convertDatetime(timestamp),
        conversationId
    }
    const result = await knex('Message').insert(message).returning(['id'])
    return result[0]
}


const generateBotAnswer = async (botData, socket) => {
    try {
        const messages = []
        let response = null
        let store = null
        console.log(botData)
        const { sessionId, shopId, timestamp, text, client, value } = botData
        let { state, data } = client
        let conversation = await knex('conversation').where({ sessionId }).first('sessionId', 'shopId', 'id')
        store = await knex('shop').where({ id: shopId }).first('id', 'name', 'token')
        if (!conversation) {
            conversation = await insertConversation({
                sessionId,
                shopId,
                lastMessage: text,
                timestamp
            })
        }
        await insertMessage({
            msgContent: text,
            type: 'text',
            sender: 'user',
            timestamp,
            conversationId: conversation.id
        })
        let suggestedActions = []
        console.log(state)
        if (state) {
            switch (state) {
                case 'ask-order-number':
                    state = 'input-order-number'
                    messages.push({ text: 'Vui lòng nhập mã đơn hàng', type: 'text' })
                    break;
                case 'input-order-number':
                    data.orderName = text
                    const order = await shopifyService.getOrderByName(store, data.orderName)
                    if (order && order.email === data.email) {
                        messages.push({ text: `Thông tin của đơn hàng #${order.order_number}`, type: 'text' })
                        messages.push({ text: 'Nhấn vào đây để xem thông tin đơn hàng', link: order.order_status_url, type: 'link' })
                        state = null
                    } else {
                        messages.push({ text: `Không tìm thấy đơn hàng ${data.orderName} với email ${data.email}. Xin hãy thử lại`, type: 'text' })
                        state = null
                    }
                    break;
                case 'wrong-answer':
                    messages.push({ text: 'Chúng tôi rất tiếc vì không trả lời câu hỏi của bạn, hãy cho chúng tôi biết mong muốn của bạn', suggestedActions, type: 'text' })
                    const report = data.botResponse.report
                    report.map(r => suggestedActions.push({ type: 'report', value: r }))
                    state = null
                    break;
                case 'report':
                    botService.reportMessage(text, data.botResponse)
                    messages.push({ text: 'Cảm ơn bạn đã đóng góp để cải thiện hệ thống của chúng tôi', type: 'text' })
                    state = null
                    break;
                case 'input-order-email':
                    const email = text
                    if (!util.validateEmail(email)) {
                        suggestedActions = [
                            {
                                type: 'cancel',
                                value: 'Hủy'
                            }
                        ]
                        messages.push({ text: `Vui lòng nhập đúng định dạng email`, suggestedActions, type: 'text' })
                    }
                    else {
                        const response = await axios.get(`https://${store.name}/admin/api/2019-10/customers/search.json`, {
                            params: {
                                email: email,
                                fields: 'id'
                            },
                            headers: {
                                'X-Shopify-Access-Token': store.token
                            }
                        })
                        const customers = response.data.customers
                        if (customers.length) {
                            const customer = customers[0]
                            const requestData = {
                                sentence: data.botResponse.question,
                                customer: customer.id + '',
                                shop: store.name
                            }
                            const response = await axios.post(BOT_URL, requestData)
                            const { question, type, products, orders, collections, message, report } = response.data
                            if (message === 'nullCustomer') {
                                messages.push({ text: `Không tìm thấy đơn hàng nào với email ${email}. Xin hãy thử lại`, type: 'text' })
                                state = null
                            }
                            else if (!message && !orders.length) {
                                state = 'input-order-number'
                                data.customerId = customer.id
                                data.email = email
                                messages.push({ text: 'Vui lòng nhập mã đơn hàng', type: 'text' })
                            }
                            else if (type === 'order' && orders && orders.length > 0) {
                                const orderId = orders[0]
                                const orderResponse = await axios.get(`https://${store.name}/admin/api/2019-10/orders/${orderId}.json`, {
                                    params: {},
                                    headers: {
                                        'X-Shopify-Access-Token': store.token
                                    }
                                })
                                const order = orderResponse.data.order
                                messages.push({ text: `Thông tin của đơn hàng #${order.order_number}`, type: 'text' })
                                messages.push({ text: 'Nhấn vào đây để xem thông tin đơn hàng', link: order.order_status_url, type: 'link' })
                                state = null
                            }
                            else {
                                messages.push({ text: `Không tìm thấy đơn hàng #${orderId} với email ${email}. Xin hãy thử lại`, type: 'text' })
                                state = null
                            }
                        } else {
                            messages.push({ text: 'Không tìm thấy khách hàng, vui lòng thử lại', type: 'text' })
                            state = null
                        }
                    }
                    break;
                case 'send-email':
                    messages.push({ text: 'Vui lòng nhập email của bạn', type: 'text' })
                    state = 'input-email'
                    break;
                case 'input-email':
                    const customerEmail = text
                    if (!util.validateEmail(customerEmail)) {
                        suggestedActions = [
                            {
                                type: 'cancel',
                                value: 'Hủy'
                            }
                        ]
                        messages.push({ text: `Vui lòng nhập đúng định dạng email`, suggestedActions, type: 'text' })
                    } else {
                        const user = await knex('User').where({ shopId }).first('email')
                        if (user) {
                            await knex('Conversation').where({ id: conversation.id }).update({ userName: customerEmail })
                            const question = data.question || ''
                            const redirectURL = `${process.env.DOMAIN}/app/conversation/${conversation.id}`
                            mailService.sendMail({ receiver: user.email, customerEmail, redirectURL, question })
                            messages.push({ text: 'Cảm ơn bạn, chúng tôi sẽ gửi câu trả lời cho bạn thông qua email sớm nhất có thể', type: 'text' })
                            state = null;
                        }
                    }
                    break;
                case 'cancel':
                    messages.push({ text: 'Nếu bạn có bất kỳ câu hỏi nào, hãy hỏi tôi nhé!', type: 'text' })
                    state = null
                    break;
                case 'product-out-of-stock':
                    suggestedActions = [
                        {
                            type: 'cancel',
                            value: 'Hủy'
                        },
                        {
                            type: 'check-Amazon',
                            value: "Có"
                        }
                    ]
                    // console.log(">>>>>>>>> test id: "+data.botResponse.products[0].id)
                    const response = await axios.get(BOT_URL_SIMILAR, { params: { product: data.botResponse.products[0].id } })
                    // console.log(response.data)
                    const ids = response.data
                    if (ids.length === 0) {
                        messages.push({ text: 'Shop hiện tại không có những sản phẩm tương tự', type: 'text' })
                        messages.push({ text: 'Bạn có muốn tìm sản phẩm tương tự bên amazon không', suggestedActions, type: 'text' })
                    } else {
                        let p = ids.map(i => ({ id: i }))
                        messages.push({ text: 'Những sản phẩm tìm thấy', type: 'text', report: data.botResponse.report })
                        await showProducts(messages, p, store, data)
                    }
                    state = null
                    break;
                case 'find-buy-with-products':
                    const productIds = await botService.getUsuallyBuyWithProducts({ productId: value })
                    store = await knex('shop').where({ id: shopId }).first('id', 'name', 'token')
                    messages.push({ text: 'Những sản phẩm tìm thấy', type: 'text' })
                    state = null
                    await showProducts(messages, productIds, store)
                    break
                case 'check-Amazon':
                    const products = data.products
                    let translatedTitle = await translate(products[0].title, { from: 'vi', to: 'en' })
                    // console.log("search in amazon: " + translatedTitle.text)
                    var link = `https://amazon.com/s?k=${translatedTitle.text.replace(' ', '+')}`
                    try {
                        let amazonProducts = await amazonCrawler.crawlData(translatedTitle.text)
                        if (amazonProducts.length == 0) {
                            messages.push({ text: 'Không tìm thấy sản phẩm tương tự bên Amazon', type: 'text' })
                        } else {
                            let attachments = []
                            for (var i = 0; i < amazonProducts.length; i++) {
                                const p = amazonProducts[i]
                                const attachment = { contentType: 'amazon-product', content: null }
                                attachment.title = p.name
                                attachment.image = p.image
                                attachment.buttons = [
                                    { title: 'Xem', type: 'open-url', value: p.link.replace(/(^\w+:|^)\/\//, '') }
                                ]
                                attachments.push(attachment)
                            }
                            messages.push({ text: '', attachments, type: 'text' })
                        }
                    } catch (err) {
                        messages.push({ text: 'Đi đến trang', link: link, type: 'link' })
                        console.log(err)
                    }
                    state = null
                    break;
                case 'get-email-for-product-suggestion':
                    let userEmail = text
                    if (!util.validateEmail(userEmail)) {
                        suggestedActions = [
                            {
                                type: 'show-product',
                                value: 'Hủy'
                            }
                        ]
                        messages.push({ text: `Vui lòng nhập đúng định dạng email`, suggestedActions, type: 'text' })
                    }
                    else {
                        const response = await axios.get(`https://${store.name}/admin/api/2019-10/customers/search.json`, {
                            params: {
                                email: userEmail,
                                fields: 'id'
                            },
                            headers: {
                                'X-Shopify-Access-Token': store.token
                            }
                        })
                        const customers = response.data.customers
                        if (customers.length) {
                            const customer = customers[0]
                            data.userId = customer.id
                            const requestData = {
                                sentence: data.botResponse.question,
                                customer: customer.id + '',
                                shop: store.name
                            }
                            const response = await axios.post(BOT_URL, requestData)
                            const { question, type, products, orders, collections, message, report } = response.data
                            if (type === "product") {
                                messages.push({ text: 'Những sản phẩm tìm thấy', type: 'text', report })
                                await showProducts(messages, products, store, data)
                                state = null
                            }
                        }
                    }
                    break;
                case 'input-email-for-product-suggestion':
                    state = 'get-email-for-product-suggestion'
                    messages.push({ text: 'Vui lòng nhập email', type: 'text' })
                    break
                case 'ignore-email':
                    data.noEmailRequire = true
                    messages.push({ text: 'Những sản phẩm tìm thấy', type: 'text', report: data.botResponse.report })
                    await showProducts(messages, data.botResponse.products, store, data.botResponse.report, data)
                    state = null
                    break;
                case 'show-product':
                    messages.push({ text: 'Những sản phẩm tìm thấy', type: 'text', report: data.botResponse.report })
                    await showProducts(messages, data.botResponse.products, store, data.botResponse.report, data)
                    state = null
                    break;
            }
            messages.map(async message => {
                await insertMessage({
                    msgContent: message.text,
                    sender: 'bot',
                    conversationId: conversation.id,
                    type: message.type,
                    attachment: message.attachments || ''
                })
            })
            return { state, messages, data }
        }
        const requestData = {
            "shop": store.name,
            "sentence": text,
            "customer": ''
        }
        response = await axios.post(BOT_URL, requestData)
        const { question, type, products, orders, collections, message, report } = response.data
        data.botResponse = response.data

        switch (type) {
            case 'order':
                if (message === 'nullCustomer') {
                    state = 'input-order-email'
                    messages.push({ text: 'Vui lòng nhập email', type: 'text', report })
                }
                break
            case 'check_order':
                if (actionInfo.length) {
                    const info = actionInfo[0]
                    if (info.name = 'order_id') {
                        state = 'input-order-email'
                        data.orderId = info.value
                    } else messages.push({ text: negative, type: 'link' })
                }
                break
            case 'product':
                if (products.length > 0) {
                    if (data.userId) {
                        const requestData = {
                            sentence: data.botResponse.question,
                            customer: data.userId,
                            shop: store.name
                        }
                        const response = await axios.post(BOT_URL, requestData)
                        data.botResponse = response.data
                        const { products, report } = response.data
                        messages.push({ text: 'Những sản phẩm tìm thấy', type: 'text', report })
                        await showProducts(messages, products, store, data)
                    } else if (data.noEmailRequire) {
                        messages.push({ text: 'Những sản phẩm tìm thấy', type: 'text', report: data.botResponse.report })
                        await showProducts(messages, data.botResponse.products, store, data.botResponse.report, data)
                        state = null
                        break;
                    }
                    else {
                        let suggestedActions = [
                            {
                                type: 'input-email-for-product-suggestion',
                                value: 'Nhập email'
                            },
                            {
                                type: 'show-product',
                                value: 'Tôi không muốn'
                            },
                            {
                                type: 'ignore-email',
                                value: 'Bỏ qua việc nhập email'
                            }
                        ]
                        messages.push({ text: 'Hãy nhập email để hệ thống có thể gợi ý những sản phẩm phù hợp với bạn', suggestedActions, type: 'text' })
                    }
                } else {
                    messages.push({ text: 'Không tìm thấy sản phẩm nào', type: 'text' })
                }
                break
            case 'collection':
                if (collections.length > 0) {
                    let ids = ''
                    collections.forEach(c => ids += c + ",")
                    ids = ids.substring(0, ids.length - 1)
                    let attachments = []
                    let customCollections = await shopifyService.getCustomCollectionInfoByIds(store, ids)
                    let smartCollections = await shopifyService.getSmartCollectionInfoByIds(store, ids)
                    customCollections.forEach(c => {
                        const attachment = { contentType: 'collection', content: null }
                        attachment.title = c.title
                        attachment.buttons = [{ title: "Xem", type: 'open-url', value: `${store.name}/collections/${c.handle}` }]
                        attachments.push(attachment)
                    })
                    smartCollections.forEach(s => {
                        const attachment = { contentType: 'collection', content: null }
                        attachment.title = s.title
                        attachment.buttons = [{ title: 'Xem', type: 'open-url', value: `${store.name}/collections/${s.handle}` }]
                        attachments.push(attachment)
                    })
                    messages.push({ text: 'Hãy chọn 1 bộ sưu tập', type: "text", report })
                    messages.push({ text: '', attachments, type: 'text' })
                } else {
                    messages.push({ text: 'Không tìm thấy bộ sưu tập nào', type: "text" })
                }
                break
            case 'other':
                messages.push({ text: message, type: "text", report })
                const { isOutOfStock, _products } = await showProducts(messages, products, store)
                if (!isOutOfStock && _products.length === 1) {
                    const product = _products[0]
                    const { variantName, variants } = util.getVariantsFromMessage(message)
                    // get available variants
                    const availableVariants = util.getAvailableVariants(product, variantName)
                    const checkStockMessage = `Hiện tai, các ${variantName} còn hàng là ${availableVariants.map(v => v.name).join(', ')}. Nhấn vào các lựa chọn để tới trang mua hàng`
                    const suggestedActions = availableVariants.map(variant => {
                        const action = {
                            type: 'openUrl',
                            title: util.capitalize(variantName) + ' ' + variant.name,
                            value: `https://${store.name}/products/${product.handle}?variant=${variant.id}`
                        }
                        return action
                    })
                    messages.push({ text: checkStockMessage, type: "text", suggestedActions })
                }
                break
            default:
                data.question = text
                const suggestedActions = [
                    {
                        type: 'send-email',
                        value: 'Nhận câu trả lời qua email'
                    }
                ]
                messages.push({ text: 'Hệ thống không hiểu câu hỏi của bạn', suggestedActions, type: 'text' })
        }
        messages.map(async message => {
            await insertMessage({
                msgContent: message.text,
                sender: 'bot',
                conversationId: conversation.id,
                type: message.type,
                attachment: message.attachments || ''
            })
        })
        return { messages, state, data }
    } catch (error) {
        console.log(error)
        socket.emit('response', [{ text: 'Đã xảy ra lỗi, vui lòng thử lại', type: 'text' }])
    }
}

const getConversations = async (shopId, pageNumber, rowPage) => {
    const offset = (pageNumber - 1) * rowPage
    const limit = rowPage
    const result = await knex('conversation').where({ shopId }).orderBy('lastMessageTime', 'desc').limit(limit).offset(offset).select('id', 'userName', 'lastMessageTime')
    const response = util.createList(result, 'conversations')
    return response
}

const getMessages = async (conversationId) => {
    const result = await knex('message').where({ conversationId }).select('msgContent', 'id', 'sender', 'time')
    const response = util.createList(result, 'messages')
    return response
}



const createConversation = async ({ message, shopId }) => {
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const answer = await generateAnswerV2(message, shopId, sessionId);
    const conversation = {
        sessionId,
        shopId,
        // lastMessage: answer,
        userName: 'Anonymous User',
        lastMessageTime: util.getCurrentDatetime()
    }
    const result = await knex('conversation').returning(['sessionId', 'shopId', 'id', 'lastMessageTime']).insert(conversation)
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
    const answer = await generateAnswerV2(message, conversation.shopId, conversation.sessionId);
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




const showProducts = async (messages, products, store, data) => {
    if (products.length > 0) {
        let isOutOfStock = false
        let attachments = []
        let ids = ''
        products.map(p => { ids += p.id + "," })
        ids = ids.substring(0, ids.length - 1)
        //get all product with return ids
        let [usuallyWithProductIds, _products] = await Promise.all([
            botService.checkUsuallyBuyWithProducts(products),
            shopifyService.getProductsById(store, ids)
        ])
        _products.forEach((product, index) => {
            const attachment = { contentType: 'product', content: null }
            //find index and product from bot response
            let _product = null
            products.forEach((p, index) => {
                if (p.id == product.id) {
                    attachment.order = index
                    _product = p
                }
            })
            attachment.title = product.title
            attachment.image = product.image.src
            attachment.variants = product.variants
            attachment.currencyCode = product.variants[0].presentment_prices[0].price.currency_code
            const bestMatchVariant = findBestMatchVariant(product.variants, _product)
            const variantParams = bestMatchVariant ? `?variant=${bestMatchVariant.id}` : ''
            //checking stock
            var totalStock = 0
            if (bestMatchVariant) {
                totalStock = bestMatchVariant.inventory_quantity
            } else {
                totalStock = util.calculateTotalStock(product.variants)
            }
            if (totalStock === 0) {
                attachment.buttons = [{ title: 'Hết hàng' }]
            } else {
                attachment.buttons = [
                    { title: 'Mua ngay', type: 'open-url', value: `${store.name}/products/${product.handle}${variantParams}` }
                ]
                if (usuallyWithProductIds && usuallyWithProductIds.length) {
                    if (usuallyWithProductIds.some(id => id == product.id)) {
                        attachment.buttons.push({ title: 'Xem thêm sản phẩm được mua cùng', type: 'find-buy-with-products', value: product.id, productTitle: product.title })
                    }
                }
            }
            attachments.push(attachment)
        })
        //sorting product by the order from bot response
        attachments = attachments.sort((a, b) => a.order - b.order)

        //remove out of stock products and prepare for suggesting similar product
        var outOfStockCounter = 0
        attachments.map(attachment => {
            attachment.buttons.map(b => b.title).includes("Hết hàng") ? outOfStockCounter += 1 : ''
        })
        // console.log('out of stock products: ' + outOfStockCounter + "/" + attachments.length)
        if (outOfStockCounter === attachments.length) {
            isOutOfStock = true
            data.products = attachments
            messages.push({ text: '', attachments, type: 'text' })
            const suggestedActions = [
                {
                    type: 'cancel',
                    value: 'Hủy'
                },
                {
                    type: 'product-out-of-stock',
                    value: "Có"
                }
            ]
            messages.push({ text: "Bạn có muốn xem những sản phẩm tương tự không", suggestedActions, type: 'text' })
        } else {
            attachments = attachments.filter(attachment => {
                return !attachment.buttons.map(b => b.title).includes("Hết hàng")
            })
            messages.push({ text: '', attachments, type: 'text' })
        }
        return { isOutOfStock, _products }
    }

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

const findBestMatchVariant = (variants, productFromBot) => {
    const { option1, option2, option3 } = productFromBot
    let options = []
    if (option1) options.push(option1.toLowerCase())
    if (option2) options.push(option2.toLowerCase())
    if (option3) options.push(option3.toLowerCase())
    if (options.length == 0) {
        return null
    }
    let maxScore = 0
    let baseVariant = null
    variants.map(v => {
        score = 0;
        if (v.option1 && options.includes(v.option1.toLowerCase())) {
            score += 1
        }
        if (v.option2 && options.includes(v.option2.toLowerCase())) {
            score += 1
        }
        if (v.option3 && options.includes(v.option3.toLowerCase())) {
            score += 1
        }
        if (score > maxScore) {
            maxScore = score
            baseVariant = v
        }
    })
    return baseVariant
}




const reportMessage = async (choice, botResponse) => {
    // const store = await knex('shop').where({ id: shopId }).first('id', 'name')
    // const response = await axios.get(BOT_URL, { params: { sentence: message } })

    const response = await axios.post(`http://bot.sales-bot.tech/api/Message/Report`, JSON.stringify(botResponse), {
        params: {
            choice: choice
        }
    })
    return response
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