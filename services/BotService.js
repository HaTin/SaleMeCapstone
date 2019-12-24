const axios = require('axios')
const BOT_URL = 'http://bot.sales-bot.tech/api'
const BOT_GET_ANSWER_URL = 'http://bot.sales-bot.tech/api/Message/GetAnswer'
const getUsuallyBuyWithProducts = async ({ productId }) => {
    const response = await axios.get(`${BOT_URL}/Find/UsuallyByWith`, {
        params: {
            product: productId
        }
    })
    const productIds = response.data ? response.data : []
    return productIds.map(id => {
        return { id }
    })
}

const reportMessage = async (choice, botResponse) => {
    const response = await axios.post(`${BOT_URL}/Message/Report`, botResponse, {
        params: {
            choice: choice
        }
    })
    return response
}


const getSuggestions = async (question, prevBotResponse) => {
    const response = await axios.post(`${BOT_URL}/Message/GetSuggestion`, prevBotResponse, {
        params: {
            question
        }
    })
    return response
}

const removeDuplicateSuggestions = async (suggestions, shop) => {
    const response = await axios.post(`${BOT_URL}/Message/DuplicateMessage`, suggestions, {
        params: {
            shop
        }
    })
    return response
}

const getOrderId = async (question, customerId, store) => {
    let status = 'no-order'
    let orderId = null
    const requestData = {
        sentence: question,
        customer: customerId + '',
        shop: store.name
    }
    const response = await axios.post(BOT_GET_ANSWER_URL, requestData)
    const { message, orders, type } = response.data
    if (message === 'nullCustomer') status = 'no-order'
    else if (!message && !orders.length) {
        status = 'no-order-number'
    }
    else if (type === 'order' && orders && orders.length > 0) {
        status = 'has-order'
        orderId = orders[0]
    }
    else status = 'no-order'
    return { status, orderId }
}



const checkUsuallyBuyWithProducts = async (products) => {
    const productIds = []
    products.map(product => productIds.push(product.id))
    const response = await axios.post(`${BOT_URL}/Find/CheckUsuallyByWith`, productIds)
    return response.data
}
module.exports = {
    getUsuallyBuyWithProducts,
    getSuggestions,
    getOrderId,
    checkUsuallyBuyWithProducts,
    removeDuplicateSuggestions,
    reportMessage
}