const crypto = require('crypto')

module.exports = async (userPassword, salt)=>{
  
    const hash = crypto.pbkdf2Sync(userPassword,  
    salt, 1000, 64, 'sha512').toString('hex'); 
    return hash; 
  
}