const axios = require('axios')
const BOT_URL = 'http://bot.sales-bot.tech/api/Import/'
const BOT_URL_DELETE = 'http://bot.sales-bot.tech/api/Delete';
const storeService = require('./StoreService')

const saveProduct = async (product, shopName) => {
    var optionList = product.options.map(o => ({ name: o.name, values: o.values }))
    var priceList = product.variants.map(v =>
        ({ option1: v.option1, option2: v.option2, option3: v.option3, price: v.price }))
    var tags = product.tags.split(',').map(t => t.trim())
    var p = {
        shop: shopName,
        id: product.id,
        title: product.title,
        product_type: product.product_type,
        vendor: product.vendor,
        options: optionList,
        tags: tags,
        prices: priceList
    }
    axios.post(BOT_URL + "AddProduct", JSON.stringify(p))
    return { product: p }
}

const saveOrder = async (order, shopName) => {
    var productList = order.line_items.map(i => {
        var title = i.variant_title.split('/')
        return ({
            id: i.product_id,
            option1: title[0] ? title[0].trim() : null,
            option2: title[1] ? title[1].trim() : null,
            option3: title[2] ? title[2].trim() : null,
            vendor: i.vendor,
            title: i.title,
        })
    })
    var o = {
        shop: shopName,
        customerId: order.customer !== undefined ? order.customer.id : null,
        orderNo: order.name.substring(1, order.name.length),
        orderId: order.id,
        products: productList,
    }
    axios.post(BOT_URL + "AddOrder", JSON.stringify(o))
    return { order: o }
}

const saveCollection = async (collection, shopName) => {
    let productInCollection = await getProductInCollection(collection.id, shopName)
    let productIds = productInCollection.data.products.map(p => p.id)
    var c = {
        shop: shopName,
        id: collection.id,
        title: collection.title,
        products: productIds
    }
    axios.post(BOT_URL + "AddCollection", JSON.stringify(c))
    return { collection: c }
}

const deleteProduct = async (id) => {
    axios.delete(BOT_URL_DELETE+"/Product", {params: {productId: id}})
    return {id: id}
}

const deleteCollection = async (id) => {
    axios.delete(BOT_URL_DELETE+"/Collection", {params: {collectionId: id}})
    return {id: id}
}

const deleteOrder = async (id) => {
    axios.delete(BOT_URL_DELETE+"/Order", {params: {orderId: id}})
    return {id: id}
}

const getProductInCollection = async (collectionId, shopName) => {
    const store = await storeService.isStoreExisted(shopName)
    var reqHeader = { 'X-Shopify-Access-Token': store.token }
    var url = `https://${shopName}/admin/api/2019-10/products.json?collection_id=${collectionId}&fields=id,title`        
    return axios.get(url, { headers: reqHeader })
}

const saveProducts = async (url, reqHeader, shopName) => {
    var pList = []
    let response = await axios.get(url, { headers: reqHeader })
    response.data.products.forEach(async product => {
        var optionList = product.options.map(o => ({ name: o.name, values: o.values }))
        var priceList = product.variants.map(v =>
            ({ option1: v.option1, option2: v.option2, option3: v.option3, price: v.price }))
        var tags = product.tags.split(',').map(t => t.trim())
        var p = {
            shop: shopName,
            id: product.id,
            title: product.title,
            product_type: product.product_type,
            vendor: product.vendor,
            options: optionList,
            tags: tags,
            prices: priceList
        }
        pList.push(p)
        await axios.post(BOT_URL + "AddProduct", JSON.stringify(p))
    })

    return { msg: "OK", products: pList }
}

const saveOrders = async (url, reqHeader, shopName) => {
    let oList = []
    let response = await axios.get(url, { headers: reqHeader })
    response.data.orders.forEach(order => {
        var productList = order.line_items.map(i => {
            var title = i.variant_title.split('/')
            return ({
                id: i.product_id,
                option1: title[0] ? title[0].trim() : null,
                option2: title[1] ? title[1].trim() : null,
                option3: title[2] ? title[2].trim() : null,
                vendor: i.vendor,
                title: i.title,
            })
        })
        var o = {
            shop: shopName,
            customerId: order.customer !== undefined ? order.customer.id : null,
            orderNo: order.name.substring(1, order.name.length),
            orderId: order.id,
            products: productList,
        }
        oList.push(o)
        axios.post(BOT_URL + "AddOrder", JSON.stringify(o))
    })
    return { msg: "OK", orders: oList }
}

const saveCollections = async (customCollectionUrl, smartCollectionUrl, reqHeader, shopName) => {
    let cList = []

    if (customCollectionUrl) {
        //get custom collection
        let customCollectionRes = await axios.get(customCollectionUrl, { headers: reqHeader })
        const customCollections = customCollectionRes.data.custom_collections
        for (var i = 0; i < customCollections.length; i++) {
            var collection = customCollections[i]
            var url = `https://${shopName}/admin/api/2019-10/products.json?collection_id=${collection.id}`
            let productInCollection = await axios.get(url, { headers: reqHeader })
            let productIds = productInCollection.data.products.map(p => p.id)
            var c = {
                shop: shopName,
                id: collection.id,
                title: collection.title,
                products: productIds
            }
            cList.push(c)
            axios.post(BOT_URL + "AddCollection", JSON.stringify(c))
        }
    }

    if (smartCollectionUrl) {
        //get smart collection
        let smartCollectionRes = await axios.get(smartCollectionUrl, { headers: reqHeader })
        const smartCollection = smartCollectionRes.data.smart_collections
        for (var i = 0; i < smartCollection.length; i++) {
            var collection = smartCollection[i]
            var url = `https://${shopName}/admin/api/2019-10/products.json?collection_id=${collection.id}`
            let productInCollection = await axios.get(url, { headers: reqHeader })
            let productIds = productInCollection.data.products.map(p => p.id)
            var c = {
                shop: shopName,
                id: collection.id,
                title: collection.title,
                products: productIds
            }
            cList.push(c)
            axios.post(BOT_URL + "AddCollection", JSON.stringify(c))
        }
    }

    return { msg: "OK", collections: cList }
}

module.exports = {
    saveProducts,
    saveOrders,
    saveCollections,
    saveProduct,
    saveOrder,
    saveCollection,
    deleteOrder,
    deleteCollection,
    deleteProduct,
}