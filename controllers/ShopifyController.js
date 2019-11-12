const axios = require('axios')
const productApi = 'https://nhatlmstore.myshopify.com/admin/api/2019-10/products.json'
const getProductByTitle = async (productType) => {
    const response = await axios.get(`${productApi}`, {
        params: {
            'product_type': productType
        },
        headers: {
            'X-Shopify-Access-Token': '0fba8fabbdac1bd95b52539092882dec'
        }
    })
    return response.data.products
}

const getProductOption = async () => {
    const response = await axios.get(`${productApi}?fields=options,title,id,handle,image,variants`, {
        headers: {
            'X-Shopify-Access-Token': '0fba8fabbdac1bd95b52539092882dec'
        }
    })
    return response.data.products
}
module.exports = {
    getProductByTitle,
    getProductOption
}