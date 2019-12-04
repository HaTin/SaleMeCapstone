require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require('path');
const bodyParser = require('body-parser');
// var RoleController = require('./controllers/RoleController')();

const conversationController = require('./controllers/conversation')

const botController = require('./controllers/bot')
const userController = require('./controllers/user')
const storeController = require('./controllers/store')
const shopifyController = require('./controllers/shopify')
const authController = require('./controllers/auth')
const webhookController = require('./controllers/webhook')
const importController = require('./controllers/import')
const chatService = require('./services/ConversationService')
const redisController = require('./controllers/redis')

// app.use(logger('common'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(cookieParser())
app.use(cors())
app.options('*', cors())
// app.use('/api/roles', RoleController);
app.use('/api/stores', storeController);
app.use('/api/users', userController);
app.use('/api/bot-config', botController)
app.use('/shopify', shopifyController)
app.use('/webhook', webhookController)
app.use('/api/conversations', conversationController)
app.use('/api/auth', authController)
app.use('/api/shop-data', importController)
app.use('/api/redis', redisController)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
} else {
    app.get('/', function (req, res) {
        const token = req.query.token
        return res.redirect(`http://localhost:3000/?token=${token}`)
    });
}
// let connections = []
global.connections = {}
try {
    io.on("connection", (socket) => {
        console.log(socket)
        global.connections[socket.id] = { state: '', data: {} }
        socket.on("message", async data => {
            // show loading message
            socket.emit('response', [{ text: '', typing: true, type: 'text' }])
            const client = global.connections[socket.id]
            console.log(data)
            client.state = data.type || client.state
            const response = await chatService.generateBotAnswer({ ...data, sessionId: socket.id, client }, socket)
            const newState = {
                state: response.state ? response.state : '',
                data: response.data ? response.data : {}
            }
            global.connections[socket.id] = newState
            console.log(global.connections[socket.id])
            socket.emit('response', response.messages)
        });
        socket.on('disconnect', () => {
            delete global.connections[socket.id]
        })
    });
} catch (error) {
    console.log(error)
}


server.listen(3001, () => {
    console.log('App listening on port 3001!');
});

