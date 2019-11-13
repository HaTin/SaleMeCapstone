const redisClient = require('../configs/redis-config')

const saveItemToList = (key, item) => {
    redisClient.get(key, (err, reply) => {
        if (reply) {
            var list = JSON.parse(reply)
            list.push(item)
            redisClient.set(key, JSON.stringify(list))
        }
    })
}

const setItem = (key, item, expire) => {
    redisClient.set(key, JSON.stringify(item), null, 3600)
}

const getItem = async (key) => {
    const reply = await redisClient.get(key)
    return reply
}


const updateItemInList = (key, updateItem) => {
    redisClient.get(key, (err, reply) => {
        if (reply) {
            var list = JSON.parse(reply)
            //remove the current item
            var updateList = list.filter((p) => p.id !== updateItem.id)
            //add the update item
            updateList.push(updateItem)
            //save to redis
            redisClient.set(key, JSON.stringify(updateList))
        }
    })
}

const removeItemInList = (key, id) => {
    redisClient.get(key, (err, reply) => {
        if (reply) {
            var list = JSON.parse(reply)
            redisClient.set(key, JSON.stringify(list.filter((p) => p.id !== id)))
        }
    })
}

const getKeys = async (key) => {
    const result = await redisClient.keys(key, (err, reply) => {
        if (reply) {
            return reply
        }
    })
    return result
}
module.exports = {
    removeItemInList,
    saveItemToList,
    updateItemInList,
    getKeys,
    setItem,
    getItem
}