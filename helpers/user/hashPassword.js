const crypto = require('crypto')
const config = require('config')

const PASSWORD_SALT = config.get('PASSWORD_SALT')

const hashedPassword = (str) => {
  const hashedString =
    typeof str === 'string' && str.length > 0
      ? crypto.createHmac('sha256', PASSWORD_SALT).update(str).digest('hex')
      : false
  return hashedString
}

module.exports = hashedPassword
