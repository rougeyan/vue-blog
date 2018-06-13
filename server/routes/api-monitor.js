const express = require('express')
const router = express.Router()
const apiController = require('../controller/api')

router.post('/monitor',apiController.getLogByUrl)

router.get('/pv',apiController.getPvLog)

router.get('/analyzeBlogDate',apiController.analyzeBlogDate)

module.exports = router
