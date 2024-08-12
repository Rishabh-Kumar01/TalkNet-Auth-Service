const { StatusCodes } = require("../imports.util").responseCodes;
const AppError = require("./app.error");

class ServiceError extends AppError {
  constructor(message, explanation) {
    super(
      'ServiceError',
      message,
      explanation,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = ServiceError;
