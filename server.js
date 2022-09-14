const app = require('./app')
const database =require('./database')
const colors = require('colors/safe')
const config  = require('config')
require('./backgroundProcesses/agendaMain')

database().catch(err=> {
  console.log(colors.inverse.bold.brightRed(err))
})



const PORT = config.get('port')
app.listen(PORT, ()=> {
  console.log(colors.inverse.bold.blue(`server is running on ${PORT}`))
})