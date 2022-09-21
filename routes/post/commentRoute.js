const router = require('express').Router()

const auth = require('../../middlewares/common/auth')

const commentValidator = require('../../validators/post/commentValidator')
const validationResult = require('../../middlewares/common/validationResult')
const {
  createComment,
  editComment,
  deleteComment,
  like,
  dislike,
} = require('../../controllers/post/comment')

router.post(
  '/create/:postId',
  auth,
  commentValidator,
  validationResult,
  createComment,
)
router.put('/edit/:commentId', auth, editComment)
router.delete('/delete/:commentId', auth, deleteComment)
router.get('/like/:commentId', auth, like)
router.get('/dislike/:commentId', auth, dislike)
module.exports = router
