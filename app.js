//external import
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors/safe')

const app = express()
dotenv.config()


// internal imports
const userRoute = require('./routes/userRoute')
const errorhandlers = require('./middlewares/common/errorHandler')
const middlewares = require('./middlewares/middlewares')


//using middlewares from ./middlewares/middlewares
app.use(middlewares)


// routes
app.use('/user', userRoute)



//using error handleling middlewares
app.use(errorhandlers)



module.exports = app