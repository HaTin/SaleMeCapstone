const config = require('../configs/config')
const jwt = require('jsonwebtoken')
const generateToken = async (data) => {
    const token = jwt.sign(data, config.secret, { expiresIn: config.tokenExpire })
    return token
}
module.exports = {
    generateToken
}