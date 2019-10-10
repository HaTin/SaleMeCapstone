const express = require('express')
const router = express.Router()
router.post('/', async (req, res) => {
    try {
        res.send({
            message: 'OK'
        })
    } catch (error) {
        console.log(error)
    }
})
module.exports = router