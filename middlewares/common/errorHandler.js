/*
Description: This module exports an array of error handleing function. app.JS will use this function to handle errors.
*/

const colors = require('colors/safe')

const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err)
  }
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      error: '404 not found!',
    })
  }

  console.log(colors.bold.brightRed(err))
  res.status(500).json({
    success: false,
    error: err.message,
  })
}

const notFound = (req, res, next) => {
  //404 error handler
  const error = new Error('404 not found')
  error.status = 404
  next(error)
}

module.exports = [notFound, errorHandler]
