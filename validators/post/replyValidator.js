const { check } = require('express-validator')

module.exports = [
  check('body')
    .not()
    .isEmpty()
    .withMessage('reply can not be empty')
    .isLength({
      max: 5000,
    })
    .withMessage('reply can not be more than 5000 characters'),
]
