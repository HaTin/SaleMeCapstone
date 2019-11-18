const storeController = require('../controllers/StoreController2')
const redisController = require('../controllers/RedisController')
const shopDataController = require('../controllers/shopDataController')

const getRedisKey = async(shopName, topic) => {
    const store = await storeController.isStoreExisted(shopName)
    return shopName+":"+store.token+":"+topic
}

const updateProduct = async (updateProduct, shopName) => {
    await shopDataController.saveProduct(updateProduct, shopName)
}

const removeProduct = async (id, shopName) => {
    // var key = await getRedisKey(shopName,'products')
    // await redisController.removeItemInList(key, id)
}

const saveNewProduct = async (newProduct, shopName) => {
    await shopDataController.saveProduct(newProduct, shopName)
}

const updateCollection = async (updateCollection, shopName) => {
    await shopDataController.saveCollection(updateCollection, shopName)
}

const removeCollection = async (id, shopName) => {
    // var key = await getRedisKey(shopName,'custom_collections')
    // await redisController.removeItemInList(key, id)
}

const saveNewCollection = async (newCollection, shopName) => {
    await shopDataController.saveCollection(newCollection, shopName)
}

const saveNewCustomer = async (newCustomer, shopName) => {
    // var key = await getRedisKey(shopName,'customers')
    // await redisController.saveItemToList(key, newCustomer)
}

const updateCustomer = async (updateCustomer, shopName) => {
    // var key = await getRedisKey(shopName,'customers')
    // await redisController.updateItemInList(key, updateCustomer)
}

const saveNewOrder = async (newOrder, shopName) => {
    await shopDataController.saveOrder(newOrder, shopName)
}

const updateOrder = async (updateOrder, shopName) => {
    await shopDataController.saveOrder(updateOrder, shopName)
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