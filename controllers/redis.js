const express = require('express')
const router = express.Router()
const redisClient = require('../configs/redis-config')
const redisService = require('../services/RedisService')

const getRedisKey = async(shopName, topic) => {
    const store = await storeController.isStoreExisted(shopName)
    return shopName+":"+store.token+":"+topic
}


router.get('/keys', async (req,res) => {
    try {
        redisClient.keys('*', (err, reply) => {
            res.send(reply)
        })
    } catch(err) {
        console.log(err)
    }    
})

const redisGetValue = (key, res) => {
    redisClient.get(key, (err, reply) => {
        if(reply) {
            res.send(JSON.parse(reply))
        }

        if(err) {
            res.status(400)
        }
    })
}

module.exports = router