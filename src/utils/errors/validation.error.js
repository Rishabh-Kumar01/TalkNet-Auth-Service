const { StatusCodes } = require("../imports.util").responseCodes;
const AppError = require("./app.error");

class ValidationError extends AppError {
  constructor(error) {
    super(
      'ValidationError',
      'Invalid data',
      error.message,
      StatusCodes.BAD_REQUEST
    );
  }
}

module.exports = ValidationError;
