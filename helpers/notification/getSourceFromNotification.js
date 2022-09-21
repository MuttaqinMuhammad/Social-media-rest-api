
const Notification = require('../../models/Notification')
const Post = require('../../models/post/Post')



const populateFromReferance = async (Id, ref) =>{
  const notification  = await Notification.findOne({_id:Id}).populate({
    path:'source.sourceId', 
    populate: {
     path: `likes ${ref==="Comment"?"replies":"comments"} dislikes` 
      }
  }).select('source -_id')
return notification.source.sourceId
}

module.exports = async (notification)=>new Promise((resolve, reject)=>{
const {source:{referance}} = notification
try {
const data =  populateFromReferance(notification._id, referance)  
resolve(data)
} catch (e) {
  reject(e)
}
})