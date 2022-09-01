//external import
const express = require('express')
const dotenv = require('dotenv')

const app = express()
dotenv.config()


// internal imports
const userRoute = require('./routes/userRoute')
const profileRoute = require('./routes/profileRoute')
const errorhandlers = require('./middlewares/common/errorHandler')
const middlewares = require('./middlewares/middlewares')


//using middlewares from ./middlewares/middlewares
app.use(middlewares)


// routes
app.use('/user', userRoute)
app.use('/profile', profileRoute)


//using error handleling middlewares
app.use(errorhandlers)



module.exports = app