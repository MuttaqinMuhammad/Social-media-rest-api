const router = require('express').Router()
const { sendOtp, validateOtp } = require('../controllers/security')

router.post('/sendOtp', sendOtp)
router.post('/validateOtp', validateOtp)

module.exports = router
