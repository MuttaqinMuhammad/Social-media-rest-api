const mongoose = require('mongoose')


const database = async ()=>{
  await mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('database connected!')
}



module.exports = database