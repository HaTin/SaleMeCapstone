const knex = require('../configs/knex-config')
const util = require('../utilities/util')
const config = require('../configs/config')
// const bcrypt = require('bcrypt')
const CryptoJS = require("crypto-js");
const secretKey = 'abcs321';
const jwt = require('jsonwebtoken')
const generateToken = async (data) => {
    const token = jwt.sign(data, config.secret, { expiresIn: config.tokenExpire })
    return token
}
const saveUser = async (data) => {
    // const hashPassword = '123456'
    const hashPassword = CryptoJS.AES.encrypt(data.password, secretKey).toString()
    data.password = hashPassword
    const result = await knex('user').returning(['email', 'firstName', 'lastName', 'shopId']).insert(data)
    const response = util.createObj(result, 'user')
    return response
}
const isUserExisted = async (shopId) => {
    const result = await knex('user').where({ shopId }).first('firstName', 'lastName', 'email')
    return result
}

const isRoleExisted = async (role) => {
    const result  = await knex('role').where({roleName:role}).first('id')
    return result
}

const saveRole = async (role) => {
    const result = await knex('role').returning(["id"]).insert(data)
    response = util.createObj(result,"id")
    return response
}
const verifyToken = async () => {

}

const verifyUser = async ({ email, password }) => {
    const user = await knex('User').where({ email }).first('firstName', 'lastName', 'email', 'password', 'shopId')
    if (user) {
        const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
        const plainPassword = bytes.toString(CryptoJS.enc.Utf8)
        if (plainPassword === password) {
            const newUser = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                shopId: user.shopId
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
    verifyUser,
    isRoleExisted,
    saveRole,
}