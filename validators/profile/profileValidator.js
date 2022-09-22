const { check } = require('express-validator')

module.exports = [
  check('nickname')
    .isLength({ max: 22 })
    .withMessage("nickname can't be more than 22 characters"),
  check('bio')
    .isLength({ max: '300' })
    .withMessage("bio cant't be more than 300 characters"),
  check('occupation')
    .isLength({ max: '30' })
    .withMessage("occupation cant't be more than 30 characters"),
  check('worksAt')
    .isLength({ max: '40' })
    .withMessage("worksAt cant't be more than 40 characters")
]
