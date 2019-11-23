const axios = require('axios')
const BOT_URL = 'http://bot.sales-bot.tech/api'
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

const checkUsuallyBuyWithProducts = async (products) => {
    const productIds = []
    products.map(product => productIds.push(product.id))
    const response = await axios.post(`${BOT_URL}/Find/CheckUsuallyByWith`, productIds)
    return response.data
}
module.exports = {
    getUsuallyBuyWithProducts,
    checkUsuallyBuyWithProducts
}