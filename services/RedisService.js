const redisClient = require('../configs/redis-config')
const { promisify } = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);
const saveItemToList = (key, item) => {
    redisClient.get(key, (err, reply) => {
        if (reply) {
            var list = JSON.parse(reply)
            list.push(item)
            redisClient.set(key, JSON.stringify(list))
        }
    })
}

const removeKey = async (key) => {
    return redisClient.del(key)
}

const setItem = async (key, item, expire) => {
    redisClient.set(key, JSON.stringify(item))
    return redisClient.expire(key, 7200)
}

const getItem = (key) => {
    redisClient.get(key, function (err, reply) {
        console.log(reply)
        return reply
    })
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
    const result = await getAsync(key)
    return JSON.parse(result)
}

const checkKeyExisted = async (key) => {
    const result = await getAsync(key)
    return result ? true : false
}

const removeKeys = async (key) => {
    redisClient.del(key, (err, response) => {
        console.log(response === 1 ? 'remove key successfully' : 'error remove key');
    })
}
module.exports = {
    removeItemInList,
    saveItemToList,
    updateItemInList,
    getKeys,
    setItem,
    getItem,
    checkKeyExisted,
    removeKeys
}