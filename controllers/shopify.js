require('dotenv').config()
const express = require('express')
const router = express.Router()
const request = require('request-promise');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_products,write_script_tags,read_orders,read_customers';
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const storeService = require('../services/StoreService')
const authService = require('../services/AuthService')
const botService = require('../services/BotConfigurationService')
const forwardingAddress = process.env.FORWARDING_ADDRESS
router.get('/', async (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id=' + apiKey + '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri;
        res.cookie('state', state);
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

router.get('/callback', async (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }
    if (shop && hmac && code) {
        // Redirect to dashboard if store installed app

        // DONE: Validate request is from Shopify
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };
        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }
        const store = await storeService.isStoreExisted(shop)
        if (store) {
            const user = await authService.isUserExisted(store.id)
            if (user) {
                const token = await authService.generateToken(store)
                return res.redirect(`/?token=${token}`)
            } else {
                return res.redirect(`http://localhost:3000/signup?shop=${shop}`)
            }
        } else {
            const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            };
            request.post(accessTokenRequestUrl, { json: accessTokenPayload })
                .then(async (accessTokenResponse) => {
                    const accessToken = accessTokenResponse.access_token;
                    console.log(accessToken)
                    const store = {
                        name: shop,
                        token: accessToken,
                        isActive: 1
                    }
                    const response = await storeService.saveStore(store)
                    return res.redirect(`http://localhost:3000/signup?shop=${response.store.name}`)
                })
                .catch((error) => {
                    console.log(error)
                    res.status(error.statusCode).send(error);
                });
        }
    } else {
        res.status(400).send('Required parameters missing');
    }
});


module.exports = router