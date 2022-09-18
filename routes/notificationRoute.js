const router = require('express').Router()
const { showNotifications } = require('../controllers/notification')
const auth = require('../middlewares/common/auth')

router.get('/', auth, showNotifications)

module.exports = router
