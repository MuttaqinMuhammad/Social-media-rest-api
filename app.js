const express = require('express');
const http = require('http');
const app = express();
require('dotenv').config();
const server = http.createServer(app);

//socket
const io = require('socket.io')(server);
global.io = io;

// routes
const userRoute = require('./routes/userRoute');
const profileRoute = require('./routes/profileRoute');
const postRoute = require('./routes/post/postRoute');
const commentRoute = require('./routes/post/commentRoute');
const replyRoute = require('./routes/post/replyRoute');
const friendRoute = require('./routes/friendRoute');
//middlewares
const errorhandlers = require('./middlewares/common/errorHandler');
const middlewares = require('./middlewares/middlewares');

app.use(middlewares);

//using routes
app.use('/user', userRoute);
app.use('/profile', profileRoute);
app.use('/post', postRoute);
app.use('/comment', commentRoute);
app.use('/reply', replyRoute);
app.use('/friend', friendRoute);

//using error handleling middlewares

app.use(errorhandlers);

module.exports = server;
