const knex = require('../configs/knex-config')
const util = require('../utilities/util')
const config = require('../configs/config')
const bcrypt = require('bcrypt')
const saltRounds = 5;
const jwt = require('jsonwebtoken')
const generateToken = async (data) => {
    const token = jwt.sign(data, config.secret, { expiresIn: config.tokenExpire })
    return token
}
const saveUser = async (data) => {
    const hashPassword = await bcrypt.hash(data.password, saltRounds)
    data.password = hashPassword
    const result = await knex('user').returning(['email', 'firstName', 'lastName', 'storeId']).insert(data)
    const response = util.createObj(result, 'user')
    return response
}
const isUserExisted = async (storeId) => {
    const result = await knex('user').where({ storeId }).first('firstName', 'lastName', 'email')
    return result
}

const verifyUser = async ({ email, password }) => {
    const user = await knex('User').where({ email }).first('firstName', 'lastName', 'email', 'password')
    if (user) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const newUser = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
            return newUser
        } else {
            throw new Error('Incorrect Password')
        }
    }
    else throw new Error('Email is not existed')
}

module.exports = {
    generateToken,
    saveUser,
    isUserExisted,
    verifyUser
}