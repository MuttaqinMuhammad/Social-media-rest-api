const Notification = require('../../models/Notification')




const populateFromReferance = async (sourceId, referance) =>{
  switch (referance.toUpperCase()) {
    case 'POST':
   const post = await Post.findOne({_id:sourceId}).populate()
      break;
  }
  
  
}

module.exports = async (reciever, notification)=>new Promise((resolve, reject)=>{
const {source:{sourceId, referance}} = notification
try {
  
  
  
} catch (e) {
  reject(e)
}
})