const mongoose = require('mongoose')
const config = require('config')

const MONGO_URI = config.get('MONGO_URI')

const database = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log('database connected!')
}

module.exports = database
