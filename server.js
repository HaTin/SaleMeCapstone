require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const path = require('path');
const axios = require('axios');
const request = require('request-promise');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_products,write_script_tags';
const forwardingAddress = 'https://46abc15b.ngrok.io'; // Replace this with your HTTPS Forwarding address
const bodyParser = require('body-parser');
var RoleController = require('./controllers/RoleController')();
var StoreController = require('./controllers/StoreController')();
var UserController = require('./controllers/UserController')();
var BotConfigController = require('./controllers/BotConfigurationController')();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
} else {
    app.get('/', function (req, res) {
        res.redirect('http://localhost:3000')
    });
}
app.get('/shopify', (req, res) => {
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

app.get('/shopify/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
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

        // DONE: Exchange temporary code for a permanent access token
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const addScriptTagUrl = `https://${shop}/admin/api/2019-10/script_tags.json`
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code,
        };
        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                // sample scriptTags
                const scriptTags = {
                    "script_tag": {
                        "event": "onload",
                        "src": "https://sales-bot-script.s3-ap-southeast-1.amazonaws.com/bundle.js"
                    }
                }
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };
                axios.post(addScriptTagUrl, scriptTags, { headers: shopRequestHeaders }).then(res => console.log(res)).catch(err => console.log(err))
                res.redirect('/')

            })
            .catch((error) => {
                console.log(error)
                res.status(error.statusCode).send(error);
            });

    } else {
        res.status(400).send('Required parameters missing');
    }
});

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors())
app.use('/api/roles',RoleController);
app.use('/api/stores',StoreController);
app.use('/api/users',UserController);
app.use('/api/botConfig',BotConfigController)
app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});