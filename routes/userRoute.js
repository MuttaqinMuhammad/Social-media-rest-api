const router = require('express').Router();
const passport = require('passport');
//middlewares
const auth = require('../middlewares/common/auth');
const validationResult = require('../middlewares/common/validationResult');

// validators
const signupvalidator = require('../validators/user/signup');
const loginvalidator = require('../validators/user/login');

const {
  signup,
  signupWithGoogle,
  GoogleCallback,
  login,
  logout,
  changePasswordWithOtp,
  deleteAccount,
  validateOtp,
  sendOtp,
} = require('../controllers/user');

router.post('/signup', signupvalidator, validationResult, signup);
router.post('/login', loginvalidator, validationResult, login);
router.delete('/logout', auth, logout);
router.put('/newpassword', changePasswordWithOtp);

//google oauth2
router.get(
  '/google-login-signup',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
  signupWithGoogle
);

router.get(
  '/redirect',
  passport.authenticate('google', { failureRedirect: '/user/login' }),
  GoogleCallback
);

router.get('/delete-account', auth, deleteAccount);
module.exports = router;
