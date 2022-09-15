//external import
const express = require('express')

const app = express()
require('dotenv').config()


// internal imports
// routes
const userRoute = require('./routes/userRoute')
const profileRoute = require('./routes/profileRoute')
const postRoute = require('./routes/post/postRoute')
const commentRoute = require('./routes/post/commentRoute')
const replyRoute = require('./routes/post/replyRoute')
const securityRoute = require('./routes/securityRoute')
const storyRoute = require('./routes/storyRoute')

//middlewares
const errorhandlers = require('./middlewares/common/errorHandler')
const middlewares = require('./middlewares/middlewares')


//using middlewares from ./middlewares/middlewares
app.use(middlewares)


//using routes
app.use('/user', userRoute)
app.use('/profile', profileRoute)
app.use('/post', postRoute)
app.use('/comment', commentRoute)
app.use('/reply', replyRoute)
app.use('/security', securityRoute)
app.use('/story', storyRoute)



//using error handleling middlewares
app.use(errorhandlers)



module.exports = app