const router = require('express').Router()
const { showNotifications, viewSource } = require('../controllers/notification')
const auth = require('../middlewares/common/auth')

router.get('/', auth, showNotifications)
router.get('/:notificationId', auth, viewSource)

module.exports = router
