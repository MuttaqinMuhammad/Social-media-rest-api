const { ApiError, NotFoundError } = require('../../helpers/ApiError');
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) return next(err);
  if (err instanceof ApiError) return res.status(err.code).json(err.message);
  return res.status(500).json('Something went wrong');
};

const notFound = (req, res, next) => {
  next(new NotFoundError());
};

module.exports = [notFound, errorHandler];
