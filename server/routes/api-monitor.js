const express = require('express')
const router = express.Router()
const apiController = require('../controller/api')

router.post('/monitor',apiController.getLogByUrl)

module.exports = router
