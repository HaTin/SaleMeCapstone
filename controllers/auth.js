const express = require('express')
const axios = require('axios')
const authService = require('../services/AuthService')
const storeService = require('../services/StoreService')
const botService = require('../services/BotConfigurationService')
const responseStatus = require('../configs/responseStatus')
const router = express.Router()
const webhooks = require('../utilities/webhookData')
const importService = require('../services/ImportService')

router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, shop, password } = req.body
        const store = await storeService.isStoreExisted(shop)
        if (store) {
            const userResult = await authService.saveUser({ firstName, lastName, email, shopId: store.id, password, roleId: 1 })
            const user = userResult.user
            const botData = {
                botName: 'Bot',
                shopId: store.id,
                textColor: 'rgb(255, 255, 255)',
                backgroundColor: 'linear-gradient(135deg, rgb(19, 84, 122) 0%, rgb(128, 208, 199) 100%)',
                configDate: new Date(),
                // intro: '',
                // liveChat: true,
                // requireEmail: false,
                // requirePhone: false
            }
            const result = await botService.saveConfiguration(botData)
            const addScriptTagUrl = `https://${shop}/admin/api/2019-10/script_tags.json`
            const webhookSubscriptionUrl = `https://${shop}/admin/api/2019-10/webhooks.json`

            // const customerUrl = "https://"+shop+"/admin/api/2019-10/customers.json"
            const productUrl = "https://" + shop + "/admin/api/2019-10/products.json?fields=id,title,product_type,vendor,options,tags,variants"
            const orderUrl = "https://" + shop + "/admin/api/2019-10/orders.json?fields=id,name,line_items,customer&fulfillment_status=any&status=any"
            const customCollectionUrl = "https://" + shop + "/admin/api/2019-10/custom_collections.json?fields=id,title"
            const smartCollectionUrl = "https://" + shop + "/admin/api/2019-10/smart_collections.json?fields=id,title"

            const shopRequestHeaders = {
                'X-Shopify-Access-Token': store.token,
                'Content-Type': 'application/json'
            };

            // await webhookSubscription(webhookSubscriptionUrl, webhooks.updateProduct, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.createProduct, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.deleteProduct, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.createCustomer, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.updateCustomer, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.createOrder, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.updateOrder, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.createCollection, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.updateCollection, shopRequestHeaders)
            // await webhookSubscription(webhookSubscriptionUrl, webhooks.deleteCollection, shopRequestHeaders)

            const scriptTags = {
                "script_tag": {
                    "event": "onload",
                    "src": `https://sales-bot-script.s3-ap-southeast-1.amazonaws.com/bundle.js?shopId=${result.botConfig.shopId}`
                }
            }

            // checkAndSaveToCache(productUrl, shopRequestHeaders, shop, store.token)
            // checkAndSaveToCache(customerUrl, shopRequestHeaders, shop, store.token)
            // checkAndSaveToCache(orderUrl, shopRequestHeaders, shop, store.token)
            // checkAndSaveToCache(customCollectionUrl, shopRequestHeaders, shop, store.token)

            await importService.saveProducts(productUrl, shopRequestHeaders, shop)
            importService.saveOrders(orderUrl, shopRequestHeaders, shop)
            importService.saveCollections(customCollectionUrl, smartCollectionUrl, shopRequestHeaders, shop)

            await axios.post(addScriptTagUrl, scriptTags, { headers: shopRequestHeaders })
            const token = await authService.generateToken(user)
            return res.send(responseStatus.Code200({ user, token }))
        }
        return res.status(400).send(responseStatus.Code400())
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})


router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await authService.verifyUser({ email, password })
        const token = await authService.generateToken(user)
        return res.send(responseStatus.Code200({ user, token }))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

// const checkAndSaveToCache = async (url, reqHeader, shopName, token) => {
//     var urlSplit = url.split('/')
//     var topic = urlSplit[urlSplit.length-1].replace('.json','')
//     var key = shopName+":"+token+":"+topic
//     redisClient.get(key, (err, reply) => {
//         //if the data for this shop is saved
//         if(reply) {
//             console.log(topic+" is saved in cache")
//         } else {//if not save, request to shopify to get data
//             axios.get(url, {headers: reqHeader})
//             .then(function(data) {
//                 console.log("save "+topic+" to cache...")
//                 var list = JSON.stringify(data.data[topic])
//                 redisClient.set(key, list)
//             })
//             .catch(function(err) {
//                 console.log(err)
//             })
//         }
//     })
// }

const webhookSubscription = async (subscriptionUrl, webhookObj, reqHeader) => {
    axios.post(subscriptionUrl, webhookObj, { headers: reqHeader })
        .catch(function (error) {
            if (error.response.status === 422) {
                console.log("Code: " + error.response.status + " - webhook for the topic has been created")
            }
        })
}

module.exports = router