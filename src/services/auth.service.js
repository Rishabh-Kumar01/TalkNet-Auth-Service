const { UserRepository } = require("../repository/index.repository");
const { errorHandler, kafka } = require("../utils/index.util");
const { jwt, mongoose } = require("../utils/imports.util");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/serverConfig");

class AuthService {
  constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  async signup(userData) {
    try {
      const { email, password, username } = userData;
      const user = await this.userRepository.create({
        email,
        password,
        username,
      });
      const token = this.#generateToken(user);

      const userId = user.id instanceof Object ? user.id.toString() : user.id;
      // Send OTP to the user's email
      kafka.sendMessage("otp-notifications", {
        type: "SEND_OTP",
        data: {
          userId: userId,
          email: user.email,
          action: "VERIFY_EMAIL",
        },
      });

      return { user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await this.userRepository.findOne({ email });
      if (!user) {
        throw new errorHandler.ServiceError(
          "Authentication failed",
          "User not found"
        );
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new errorHandler.ServiceError(
          "Authentication failed",
          "Incorrect password"
        );
      }
      const token = this.#generateToken(user);
      return {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          status: user.status,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  #generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
  }

  async googleAuth(profile) {
    try {
      let user = await this.userRepository.findOne({ googleId: profile.id });
      if (!user) {
        user = await this.userRepository.create({
          googleId: profile.id,
          email: profile.emails[0]?.value,
          username: profile.displayName,
          profilePicture: profile.photos[0]?.value,
        });
      }
      const token = this.#generateToken(user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // async facebookAuth(profile) {
  //   try {
  //     let user = await this.userRepository.findOne({ facebookId: profile.id });
  //     if (!user) {
  //       user = await this.userRepository.create({
  //         facebookId: profile.id,
  //         email: profile.emails[0].value,
  //         username: profile.displayName,
  //         profilePicture: profile.photos[0].value
  //       });
  //     }
  //     const token = this.#generateToken(user);
  //     return { user, token };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async facebookAuth(profile) {
    try {
      let user = await this.userRepository.findOne({ facebookId: profile.id });
      if (!user) {
        const userData = {
          facebookId: profile.id,
          username: profile.displayName,
          profilePicture: profile.photos[0]?.value,
        };

        // Only set email if it's available
        if (profile.emails && profile.emails[0]) {
          userData.email = profile.emails[0].value;
        }

        user = await this.userRepository.create(userData);
      }
      const token = this.#generateToken(user);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
