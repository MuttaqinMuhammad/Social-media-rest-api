const OTP = require('../../models/OTP')

module.exports = async (job)=>{
   
 try {
   const otpList = await OTP.find()
   
otpList.forEach(async otpObj=>{
  let otpObjTime = new Date(otpObj.createdAt).getTime()
  let currentTime = new Date(Date.now()).getTime()
  const fiveMunites = (5 * (1000 * 60))  

  if (currentTime - otpObjTime >= fiveMunites ) {
await OTP.deleteOne({_id:otpObj._id})
  }
  
})
   
 } catch (e) {
   console.log(e)
 }
  
}

