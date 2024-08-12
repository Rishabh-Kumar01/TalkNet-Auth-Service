const { AuthService } = require('../services/index.services');
const { StatusCodes } = require('../utils/imports.util').responseCodes;

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async signup(req, res) {
    try {
      const { user, token } = await this.authService.signup(req.body);
      res.status(StatusCodes.CREATED).json({
        message: 'User created successfully',
        success: true,
        data: { user, token }
      });
    } catch (error) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error.explanation || {}
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      res.status(StatusCodes.OK).json({
        message: 'Logged in successfully',
        success: true,
        data: { user, token }
      });
    } catch (error) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error.explanation || {}
      });
    }
  }

  async googleCallback(req, res) {
    try {
      const { user, token } = await this.authService.googleAuth(req.user);
      res.status(StatusCodes.OK).json({
        message: 'Google authentication successful',
        success: true,
        data: { user, token }
      });
    } catch (error) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error.explanation || {}
      });
    }
  }

  async facebookCallback(req, res) {
    try {
      const { user, token } = await this.authService.facebookAuth(req.user);
      res.status(StatusCodes.OK).json({
        message: 'Facebook authentication successful',
        success: true,
        data: { user, token }
      });
    } catch (error) {
      res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error.explanation || {}
      });
    }
  }
}

module.exports = AuthController;