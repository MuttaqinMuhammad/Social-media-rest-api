const app = require('./app')
const mongoose = require('mongoose')
const colors = require('colors/safe')

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(info=>console.log(colors.bold.brightYellow('database connected')))
.catch((err) => console.log(colors.inverse.bold.brightRed(err.message)));


const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
	console.log(colors.inverse.bold.blue(`server is running on ${PORT}`))
})