/*
Description: This function is called by agendaJS in every one munite. this function finds all the existing otp in database. if an otp is expired this function deletes the otp
*/

const OTP = require('../../models/OTP')

module.exports = async (job) => {
  try {
    const otpList = await OTP.find() //finding all the otp

    otpList.forEach(async (otpObj) => {
      let otpObjTime = new Date(otpObj.createdAt).getTime()
      let currentTime = new Date(Date.now()).getTime()
      const fiveMunites = 5 * (1000 * 60)

      if (currentTime - otpObjTime >= fiveMunites) {
        //checking if the otp is expired
        await OTP.deleteOne({ _id: otpObj._id }) //deleting the otp if the otp is expired.
      }
    })
  } catch (e) {
    console.log(e)
  }
}
