const crypto = require('crypto')

const hashedPassword = str =>{
	const hashedString = typeof str === 'string' && str.length > 0 ? crypto.createHmac('sha256', process.env.PASSWORD_SALT).update(str).digest('hex') : false
return hashedString
}

module.exports = hashedPassword