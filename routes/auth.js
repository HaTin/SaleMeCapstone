const express = require('express')
const axios = require('axios')
const authController = require('../controllers/AuthController')
const storeController = require('../controllers/StoreController2')
const botController = require('../controllers/BotConfigurationController')
const responseStatus = require('../configs/responseStatus')
const router = express.Router()
const forwardingAddress = process.env.FORWARDING_ADDRESS
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, shop, password } = req.body
        const store = await storeController.isStoreExisted(shop)
        if (store) {
            const userResult = await authController.saveUser({ firstName, lastName, email, storeId: store.id, password, roleId: 1 })
            const user = userResult.user
            const botData = {
                botName: 'SA Bot',
                storeId: store.id
            }
            const result = await botController.saveConfiguration(botData)
            const addScriptTagUrl = `https://${shop}/admin/api/2019-10/script_tags.json`
            const webhookSubscriptionUrl = `https://${shop}/admin/api/2019-10/webhooks.json`
            const createProductWebhook = {
                'webhook': {
                    'topic': 'products/create',
                    'address': forwardingAddress + "/webhook/products/create",
                    'format': 'json'
                }
            }

            const updateProductWebhook = {
                'webhook': {
                    'topic': 'products/update',
                    'address': forwardingAddress + "/webhook/products/update",
                    'format': 'json'
                }
            }
            const shopRequestHeaders = {
                'X-Shopify-Access-Token': store.token,
                'Content-Type': 'application/json'
            };

            axios.post(webhookSubscriptionUrl, updateProductWebhook, { headers: shopRequestHeaders })
                .catch(function (error) {
                    if (error.response.status === 422) {
                        console.log("Code: " + error.response.status + " - webhook for this topic has been created")
                    }
                })

            axios.post(webhookSubscriptionUrl, createProductWebhook, { headers: shopRequestHeaders })
                .catch(function (error) {
                    if (error.response.status === 422) {
                        console.log("Code: " + error.response.status + " - webhook for this topic has been created")
                    }
                })
            const scriptTags = {
                "script_tag": {
                    "event": "onload",
                    "src": `https://sales-bot-script.s3-ap-southeast-1.amazonaws.com/bundle.js?storeId=${result.botConfig.storeId}`
                }
            }

            await axios.post(addScriptTagUrl, scriptTags, { headers: shopRequestHeaders })
            const token = await authController.generateToken(user)
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
        const user = await authController.verifyUser({ email, password })
        const token = await authController.generateToken(user)
        return res.send(responseStatus.Code200({ user, token }))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

module.exports = router