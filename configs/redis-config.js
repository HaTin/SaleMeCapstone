//add this to .env
// REDIS_HOST=shopifybot.redis.cache.windows.net
// REDIS_KEY=c9SKIvCr2UNTe32i+4DjN0jlFMF9FZWrWBuZkHHufPg=
const redis = require('redis')
const client = redis.createClient(6380, process.env.REDIS_HOST,
    { auth_pass: process.env.REDIS_KEY, tls: { servername: process.env.REDIS_HOST } })
// const client = redis.createClient(6379)
client.on('connect', function () {
    console.log("connected to redis")
})
// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});

module.exports = client;