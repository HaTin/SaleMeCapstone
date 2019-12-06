//add this to .env
const redis = require('redis')
// const client = redis.createClient("http://34.87.72.228:6379")
const client = redis.createClient("http://cache.sales-bot.tech")
// const client = redis.createClient(6379)
client.on('connect', function () {
    // console.log("connected to redis")
})
// echo redis errors to the console
client.on('error', (err) => {
    // console.log("Error " + err)
});

module.exports = client;