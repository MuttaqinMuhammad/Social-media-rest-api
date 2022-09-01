const router = require('express').Router()

const auth = require('../middlewares/common/auth')
const validationResult = require('../middlewares/common/validationResult')
const profileValidator = require('../validators/profile/profileValidator')

const {
	createProfile,
	editProfile,
} = require('../controllers/profile')

router.post('/create',
auth,
profileValidator,
validationResult,
createProfile
)
router.post('/edit',
auth,
profileValidator,
validationResult,
editProfile)

module.exports = router