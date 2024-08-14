const { mongoose, bcrypt } = require("../utils/imports.util");
const { BCRYPT_SALT } = require("../config/serverConfig");
const salt = bcrypt.genSaltSync(parseInt(BCRYPT_SALT));

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  profilePicture: { type: String },
  status: { type: String, enum: ["online", "offline"], default: "offline" },
  lastSeen: { type: Date },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
