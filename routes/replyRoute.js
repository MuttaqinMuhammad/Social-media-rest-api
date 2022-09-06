const router = require('express').Router()

const {
  createReply
} = require('../controllers/reply')
const auth = require('../middlewares/common/auth')
router.post('/create', auth, createReply)

module.exports = router