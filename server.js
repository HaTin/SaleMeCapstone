require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// var RoleController = require('./controllers/RoleController')();

const conversationRouter = require('./routes/conversation')
const botRouter = require('./routes/bot')
const userRouter = require('./routes/user')
const storeRouter = require('./routes/store')
const shopifyRouter = require('./routes/shopify')
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static('build'));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
} else {
    app.get('/', function (req, res) {
        res.redirect('http://localhost:3000')
    });
}
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
app.use('/api/conversation', conversationRouter)
app.listen(3001, () => {
    console.log('App listening on port 3001!');
});