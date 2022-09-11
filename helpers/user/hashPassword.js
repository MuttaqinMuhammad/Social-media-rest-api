const crypto = require('crypto')

const hashedPassword = str =>{
	salt = crypto.randomBytes(18).toString('hex');
	const hashedString = typeof str === 'string' && str.length > 0 ? crypto.pbkdf2Sync(str, salt,1000, 64, 'sha512').toString('hex') : false
return {
hash:hashedString,
salt,
}
}



module.exports = hashedPassword