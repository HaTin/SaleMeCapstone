const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
router.get('/', async (req, res) => {
    try {
        userController.getUsers()
    } catch (error) {
        console.log(error)
    }
})
module.exports = router