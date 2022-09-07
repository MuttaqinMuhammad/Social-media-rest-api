const {
  check
} = require('express-validator')


module.exports = [
  check('body')
  .not().isEmpty().withMessage('comment can not be empty')
  .isLength({
    mex: 5000
  }).withMessage("comment can not be more than 5000 characters")

]