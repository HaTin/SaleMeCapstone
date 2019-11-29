const express = require('express')
const router = express.Router()
// const userService = require('../services/user')
router.get('/', async (req, res) => {
    try {
        // userService.getUsers()
    } catch (error) {
        console.log(error)
    }
})
module.exports = router