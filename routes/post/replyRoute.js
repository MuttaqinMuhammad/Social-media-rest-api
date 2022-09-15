const router = require('express').Router()

const {
  createReply,
  editReply,
  deleteReply,
  like,
  dislike,
} = require('../../controllers/post/reply')
const auth = require('../../middlewares/common/auth')
const validationResult = require('../../middlewares/common/validationResult')
const replyValidator = require('../../validators/post/replyValidator')



router.post('/create/:commentId', auth,replyValidator,validationResult, createReply)
router.put('/edit/:replyId', auth,replyValidator,validationResult, editReply)
router.delete('/delete/:replyId', auth, deleteReply)
router.put('/like/:replyId', auth, like)
router.put('/dislike/:replyId', auth, dislike)

module.exports = router