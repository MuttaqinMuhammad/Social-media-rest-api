const router = require('express').Router()

const auth = require('../../middlewares/common/auth')
const upload = require('../../helpers/photoUploader')

const postValidator = require('../../validators/post/postValidator')
const validationResult = require('../../middlewares/common/validationResult')
const {
  getMyPosts,
  getUserPosts,
  createPost,
  editPost,
  deletePost,
  like,
  dislike,
} = require('../../controllers/post/post')

router.get('/', auth, getMyPosts)
router.get('/:userId', auth, getUserPosts)
router.post(
  '/create',
  auth,
  upload.single('postImage'),
  postValidator,
  validationResult,
  createPost,
)
router.post(
  '/edit/:postId',
  auth,
  upload.single('postImage'),
  postValidator,
  validationResult,
  editPost,
)
router.delete('/delete/:postId', auth, deletePost)
router.post('/like/:postId', auth, like)
router.post('/dislike/:postId', auth, dislike)

module.exports = router
