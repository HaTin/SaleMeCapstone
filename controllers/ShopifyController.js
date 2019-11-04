const axios = require('axios')
const productApi = 'https://nhatlmstore.myshopify.com/admin/api/2019-10/products.json'
const getProductByTitle = async (productType) => {
    const response = await axios.get(`${productApi}`, {
        params: {
            'product_type': productType
        },
        headers: {
            'X-Shopify-Access-Token': '8fc6396a5ed57d6df89d69dfd464bf68'
        }
    })
    return response.data.products
}
module.exports = {
    getProductByTitle
}