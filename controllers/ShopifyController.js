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

const getProductOption = async (store) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/products.json?fields=options,title,id,product_type,handle,image,variants`, {
        headers: {
            'X-Shopify-Access-Token': store.token
        }
    })
    return response.data.products
}

module.exports = {
    getProductByTitle,
    getProductOption
}