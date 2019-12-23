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
            'X-Shopify-Access-Token': store.token,
            'X-Shopify-Api-Features': 'include-presentment-prices'
        }
    })
    return response.data.products
}


const getOrderById = async (store, orderId) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/orders/${orderId}.json`, {
        headers: {
            'X-Shopify-Access-Token': store.token,
        }
    })
    return response.data.order
}

const getOrderByName = async (store, orderName) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/orders.json?fields=order_number,email,order_status_url&fulfillment_status=any&status=any`, {
        params: {
            'name': orderName
        },
        headers: {
            'X-Shopify-Access-Token': store.token,
        }
    })
    const orders = response.data.orders
    const order = orders.length ? orders[0] : null
    return order
}

const getProductInCollection = async (store, collectionId) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/products.json?collection_id=${collectionId}&fields=options,title,id,product_type,handle,image,variants`, {
        headers: {
            'X-Shopify-Access-Token': store.token
        }
    })
    return response.data.products
}

const getProductById = async (store, productId) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/products/${productId}.json?fields=id,options,title,product_type,handle,image,variants&published_status=published`, {
        headers: {
            'X-Shopify-Access-Token': store.token,
            'X-Shopify-Api-Features': 'include-presentment-prices'
        }
    })
    return response.data.product
}
const getProductsById = async (store, productIds) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/products.json?fields=id,options,title,product_type,handle,image,images,variants&ids=${productIds}&published_status=published`, {
        headers: {
            'X-Shopify-Access-Token': store.token,
            'X-Shopify-Api-Features': 'include-presentment-prices'
        }
    })
    return response.data.products
}

const getAvailableProducts = async (store, products) => {
    if (!products.length) return []
    let productIds = ''
    products.map(p => { productIds += p.id + "," })
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/products.json?fields=id&ids=${productIds}&published_status=published`, {
        headers: {
            'X-Shopify-Access-Token': store.token,
        }
    })
    return response.data.products
}

const getCustomCollectionInfoByIds = async (store, ids) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/custom_collections.json?fields=id,title,handle,image&ids=${ids}`, {
        headers: {
            'X-Shopify-Access-Token': store.token,
            'X-Shopify-Api-Features': 'include-presentment-prices'
        }
    })
    return response.data.custom_collections
}

const getSmartCollectionInfoByIds = async (store, ids) => {
    const response = await axios.get(`https://${store.name}/admin/api/2019-10/smart_collections.json?fields=id,title,handle,image&ids=${ids}`, {
        headers: {
            'X-Shopify-Access-Token': store.token,
            'X-Shopify-Api-Features': 'include-presentment-prices'
        }
    })
    return response.data.smart_collections
}

module.exports = {
    getProductByTitle,
    getProductOption,
    getProductInCollection,
    getProductById,
    getProductsById,
    getCustomCollectionInfoByIds,
    getSmartCollectionInfoByIds,
    getOrderById,
    getOrderByName,
    getAvailableProducts
}