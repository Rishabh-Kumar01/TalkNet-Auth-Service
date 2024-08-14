const { session } = require("passport");

// Desc: Import all the required modules in one place
module.exports = {
  mongoose: require("mongoose"),
  morgan: require("morgan"),
  helmet: require("helmet"),
  cors: require("cors"),
  express: require("express"),
  compression: require("compression"),
  expressValidator: require("express-validator"),
  dotenv: require("dotenv"),
  bodyParser: require("body-parser"),
  responseCodes: require("http-status-codes"),
  bcrypt: require("bcryptjs"),
  passport: require("passport"),
  passportJwt: require("passport-jwt"),
  jwt: require("jsonwebtoken"),
  passportGoogle: require("passport-google-oauth20"),
  passportFacebook: require("passport-facebook"),
  session: require("express-session"),
};
