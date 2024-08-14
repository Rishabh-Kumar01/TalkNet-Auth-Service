const {passport, passportJwt, passportFacebook, passportGoogle} = require("../utils/imports.util");
const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;
const GoogleStrategy = passportGoogle.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const { User } = require('../models/index.model');
const {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  CALLBACK_URL
} = require('../config/serverConfig');
const { ValidationError } = require("../utils/errors/index.error");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

const validateSignupData = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('A valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return next(new ValidationError({
      message: errors.join(', ')
    }));
  }

  next();
};

const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('A valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new ValidationError({
      message: errors.join(', ')
    }));
  }

  next();
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${CALLBACK_URL}/api/v1/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: `${CALLBACK_URL}/api/v1/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.find({googleId: id});
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = {
  validateSignupData,
  validateLoginData,
  authenticate: passport.authenticate('jwt', { session: false }),
  googleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),
  facebookAuth: passport.authenticate('facebook', { scope: ['public_profile'] })
};
