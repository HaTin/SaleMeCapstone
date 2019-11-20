const express = require('express')
const router = express.Router()
const shop='nhatlmstore.myshopify.com'
const productUrl = "https://"+shop+"/admin/api/2019-10/products.json?fields=id,title,product_type,vendor,options,tags,variants"
const orderUrl = "https://"+shop+"/admin/api/2019-10/orders.json?fields=id,name,line_items,customer&fulfillment_status=any&status=any"
const customCollectionUrl = "https://"+shop+"/admin/api/2019-10/custom_collections.json?fields=id,title"
const smartCollectionUrl = "https://"+shop+"/admin/api/2019-10/smart_collections.json?fields=id,title"
const axios = require('axios')
const knex = require('../configs/knex-config')
const responseStatus = require('../configs/responseStatus')
const shopDataController = require('../controllers/shopDataController')

router.get('/save-products', async (req, res) => {
    try {
        const store = await knex('store').where({ name: shop }).first('id', 'name', 'token')
        const reqHeader = {
            'X-Shopify-Access-Token': store.token
        }
        const response = await shopDataController.saveProducts(productUrl,reqHeader,shop)
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

router.get('/save-orders', async (req,res) => {
    try {
        const store = await knex('store').where({ name: shop }).first('id', 'name', 'token')
        const reqHeader = {'X-Shopify-Access-Token': store.token}
        const response = await shopDataController.saveOrders(orderUrl,reqHeader,shop)
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})

router.get('/save-collections', async (req, res) => {
    try {
        const store = await knex('store').where({ name: shop }).first('id', 'name', 'token')
        var reqHeader = {'X-Shopify-Access-Token': store.token}
        const response = await shopDataController.saveCollections(customCollectionUrl, smartCollectionUrl, reqHeader, shop)    
        res.send(responseStatus.Code200(response))
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).send(error)
    }
})
module.exports = router