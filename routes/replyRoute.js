const router = require('express').Router()

const {
  createReply,
  editReply,
  deleteReply,
  like,
  dislike,
} = require('../controllers/reply')
const auth = require('../middlewares/common/auth')



router.post('/create/:commentId', auth, createReply)
router.put('/edit/:replyId', auth, editReply)
router.delete('/delete/:replyId', auth, deleteReply)
router.put('/like/:replyId', auth, like)
router.put('/dislike/:replyId', auth, dislike)

module.exports = router