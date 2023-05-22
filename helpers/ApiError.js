const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
//base error class
class AppError extends Error {
  constructor(type, statusCode, message, isOperational) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
  }
}

//api Specific Errors
class APIError extends AppError {
  constructor(type, statusCode, message) {
    super(type, statusCode, message, true);
  }
}

//400
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, STATUS_CODES.BAD_REQUEST, message, true);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'NotFoundError') {
    super(message, STATUS_CODES.NOT_FOUND, message, true);
  }
}

class UnauthorizationError extends AppError {
  constructor(message = 'UnauthorizationError') {
    super(message, STATUS_CODES.UN_AUTHORISED, message, true);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'InternalServerError') {
    super(message, STATUS_CODES.INTERNAL_ERROR, message, true);
  }
}
module.exports = {
  AppError,
  APIError,
  BadRequestError,
  NotFoundError,
  UnauthorizationError,
  InternalServerError,
};
