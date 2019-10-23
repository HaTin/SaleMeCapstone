const storeController = require('../controllers/StoreController2')
const redisController = require('../controllers/RedisController')

const getRedisKey = async(shopName, topic) => {
    const store = await storeController.isStoreExisted(shopName)
    return shopName+":"+store.token+":"+topic
}

const updateProduct = async (updateProduct, shopName) => {
    var key = await getRedisKey(shopName,'products')
    await redisController.updateItemInList(key, updateProduct)
}

const removeProduct = async (id, shopName) => {
    var key = await getRedisKey(shopName,'products')
    await redisController.removeItemInList(key, id)
}

const saveNewProduct = async (newProduct, shopName) => {
    var key = await getRedisKey(shopName,'products')
    await redisController.saveItemToList(key, newProduct)
}

const updateCollection = async (updateCollection, shopName) => {
    var key = await getRedisKey(shopName,'custom_collections')
    await redisController.updateItemInList(key, updateCollection)
}

const removeCollection = async (id, shopName) => {
    var key = await getRedisKey(shopName,'custom_collections')
    await redisController.removeItemInList(key, id)
}

const saveNewCollection = async (newCollection, shopName) => {
    var key = await getRedisKey(shopName,'custom_collections')
    await redisController.saveItemToList(key, newCollection)
}

const saveNewCustomer = async (newCustomer, shopName) => {
    var key = await getRedisKey(shopName,'customers')
    await redisController.saveItemToList(key, newCustomer)
}

const updateCustomer = async (updateCustomer, shopName) => {
    var key = await getRedisKey(shopName,'customers')
    await redisController.updateItemInList(key, updateCustomer)
}

const saveNewOrder = async (newOrder, shopName) => {
    var key = await getRedisKey(shopName,'orders')
    await redisController.saveItemToList(key, newOrder)
}

const updateOrder = async (updateOrder, shopName) => {
    var key = await getRedisKey(shopName,'orders')
    await redisController.updateItemInList(key, updateOrder)
}


module.exports = {
    updateProduct,
    saveNewProduct,
    removeProduct,
    updateCollection,
    saveNewCollection,
    removeCollection,
    saveNewOrder,
    updateOrder,
    saveNewCustomer,
    updateCustomer
}