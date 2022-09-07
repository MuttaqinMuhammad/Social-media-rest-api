const router = require('express').Router()

const auth = require('../middlewares/common/auth')

const commentValidator = require('../validators/post/commentValidator')
const validationResult = require('../middlewares/common/validationResult')
const {
  createComment,
  editComment,
  deleteComment,
  like,
  dislike,
} = require('../controllers/comment')


router.post('/create/:postId', auth,commentValidator, validationResult, createComment)
router.put('/edit/:commentId', auth, editComment)
router.delete('/delete/:commentId', auth, deleteComment)
router.put("/like/:commentId", auth, like)
router.put("/dislike/:commentId", auth, dislike)
module.exports = router