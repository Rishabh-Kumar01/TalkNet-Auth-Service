const { User } = require("../models/user.model");
const { ValidationError, AppError } = require("../utils/errors/index.error");
const { StatusCodes } = require("../utils/imports.util").responseCodes;

class UserRepository {
  static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async create(data) {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new ValidationError(error);
      }
      throw new AppError(
        "RepositoryError",
        "Cannot create user",
        "There was an issue creating the user. Please try again.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOne(filter) {
    try {
      const user = await User.findOne(filter);
      return user;
    } catch (error) {
      throw new AppError(
        "RepositoryError",
        "Cannot find user",
        "There was an issue finding the user. Please try again.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(userId, data) {
    try {
      const user = await User.findByIdAndUpdate(userId, data, { new: true });
      return user;
    } catch (error) {
      throw new AppError(
        "RepositoryError",
        "Cannot update user",
        "There was an issue updating the user. Please try again.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = UserRepository;
