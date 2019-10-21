const redisClient = require('../configs/redis-config')
const storeController = require('../controllers/StoreController2')


const getRedisProductKey = async(shopName) => {
    const store = await storeController.isStoreExisted(shopName)
    return shopName+":"+store.token+":products"
}

const updateProductCache = async (updateProduct, shopName) => {
    var key = await getRedisProductKey(shopName)
    //get data from redis
    redisClient.get(key, (err, reply) => {
        if(reply) {
            var products = JSON.parse(reply)
            //remove the current product
            var updateList = products.filter((p) => p.id !== updateProduct.id)
            //add the update product
            updateList.push(updateProduct)
            //save to redis
            redisClient.set(key, JSON.stringify(updateList))
        }
    })
}

const removeProductCache = async (id, shopName) => {
    var key = await getRedisProductKey(shopName)
    //get data from redis
    redisClient.get(key, (err, reply) => {
        if(reply) {
            var products = JSON.parse(reply)
            redisClient.set(key, JSON.stringify(products.filter((p) => p.id !== id)))
        }
    })
}

const saveNewProductCache = async (newProduct, shopName) => {
    var key = await getRedisProductKey(shopName)
    //get data from redis
    redisClient.get(key, (err, reply) => {
        if(reply) {
            var products = JSON.parse(reply)
            products.push(newProduct)
            redisClient.set(key, JSON.stringify(products))
        }
    })
}

module.exports = {
    updateProductCache,
    saveNewProductCache,
    removeProductCache
}