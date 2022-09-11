const app = require('./app')
const database =require('./config/database')
const colors = require('colors/safe')
require('./backgroundProcesses/agendaMain')
database().catch(err=> {
  console.log(colors.inverse.bold.brightRed(err))
})

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> {
  console.log(colors.inverse.bold.blue(`server is running on ${PORT}`))
})