const express = require('express')
const router = express.Router()
//const redisController = require('../controllers/RedisController')
const redisClient = require('../configs/redis-config')
const storeController = require('../controllers/StoreController2')

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

router.get('/products/:shopName', async (req, res) => {
    if(req.params) {
        var shopName = req.params.shopName
        var key = await getRedisKey(shopName,'products')
        redisGetValue(key, res)
    }
})

router.get('/orders/:shopName', async (req, res) => {
    if(req.params) {
        var shopName = req.params.shopName
        var key = await getRedisKey(shopName,'orders')
        redisGetValue(key, res)
    }
})

router.get('/collections/:shopName', async (req, res) => {
    if(req.params) {
        var shopName = req.params.shopName
        var key = await getRedisKey(shopName,'custom_collections')
        redisGetValue(key, res)
    }
})

router.get('/customers/:shopName', async (req, res) => {
    if(req.params) {
        var shopName = req.params.shopName
        var key = await getRedisKey(shopName,'customers')
        redisGetValue(key, res)
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