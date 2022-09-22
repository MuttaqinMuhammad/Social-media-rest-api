const { check } = require('express-validator')

module.exports = [
  check('body')
    .not()
    .isEmpty()
    .withMessage('comment can not be empty')
    .isLength({
      max: 5000
    })
    .withMessage('comment can not be more than 5000 characters')
]
