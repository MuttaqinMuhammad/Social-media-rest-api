/*
Description: This function is called by agendaJS in every 24 hours. this function finds all the existing story in database. if an story is expired this function deletes the otp
*/

const Story = require('../../models/Storie')

const clearExpiredStories = async (job) => {
  try {
    const storyList = await Story.find()

    storyList.forEach(async (storyObj) => {
      let storyObjTime = new Date(storyObj.createdAt).getTime()
      let currentTime = new Date(Date.now()).getTime()
      const twentyFourHours = 1000 * 60 * 60 * 24

      if (currentTime - storyObjTime >= twentyFourHours) {
        await Story.deleteOne({ _id: storyObj._id })
      }
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = clearExpiredStories
