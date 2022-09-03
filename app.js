//external import
const express = require('express')
const dotenv = require('dotenv')

const app = express()
dotenv.config({ path: "./config/.env" })


// internal imports
// routes
const userRoute = require('./routes/userRoute')
const profileRoute = require('./routes/profileRoute')
const postRoute = require('./routes/postRoute')

//middlewares
const errorhandlers = require('./middlewares/common/errorHandler')
const middlewares = require('./middlewares/middlewares')


//using middlewares from ./middlewares/middlewares
app.use(middlewares)


//using routes
app.use('/user', userRoute)
app.use('/profile', profileRoute)
app.use('/post', postRoute)


//using error handleling middlewares
app.use(errorhandlers)



module.exports = app