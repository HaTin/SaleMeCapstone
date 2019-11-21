require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require('path');
const bodyParser = require('body-parser');
// var RoleController = require('./controllers/RoleController')();

const conversationRouter = require('./routes/conversation')

const botRouter = require('./routes/bot')
const userRouter = require('./routes/user')
const storeRouter = require('./routes/store')
const shopifyRouter = require('./routes/shopify')
const authRouter = require('./routes/auth')
const webhookRouter = require('./routes/webhook')
const shopDataRouter = require('./routes/shopData')
const chatController = require('./controllers/ConversationController')


// app.use(logger('common'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(cookieParser())
app.use(cors())
app.options('*', cors())
// app.use('/api/roles', RoleController);
app.use('/api/stores', storeRouter);
app.use('/api/users', userRouter);
app.use('/api/bot-config', botRouter)
app.use('/shopify', shopifyRouter)
app.use('/webhook', webhookRouter)
app.use('/api/conversations', conversationRouter)
app.use('/api/auth', authRouter)
app.use('/api/shop-data', shopDataRouter)
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
let connections = []
io.on("connection", (socket) => {
    connections[socket.id] = { state: '', data: {} }
    socket.on("message", async data => {
        // show loading message
        socket.emit('response', [{ text: '', typing: true, type: 'text' }])
        const client = connections[socket.id]
        console.log(data)
        client.state = data.type || client.state
        const response = await chatController.generateBotAnswer({ ...data, sessionId: socket.id, client }, socket)
        const newState = {
            state: response.state ? response.state : '',
            data: response.data ? response.data : {}
        }
        connections[socket.id] = newState
        console.log(connections[socket.id])
        socket.emit('response', response.messages)
    });
    socket.on('disconnect', () => {
        delete connections[socket.id]
    })
});

server.listen(3001, () => {
    console.log('App listening on port 3001!');
});

