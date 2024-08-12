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

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
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

module.exports = {
  authenticate: passport.authenticate('jwt', { session: false }),
  googleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),
  facebookAuth: passport.authenticate('facebook', { scope: ['email'] })
};
