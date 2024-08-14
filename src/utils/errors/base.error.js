const { StatusCodes } = require("../imports.util").responseCodes;
const ValidationError = require("./validation.error");
const AppError = require("./app.error");

const baseError = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Validation Error',
      success: false,
      error: err.explanation
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
      error: err.explanation
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Something went wrong',
    success: false,
    error: 'Internal server error'
  });
};

module.exports = baseError;
