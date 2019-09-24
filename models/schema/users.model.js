const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const config = require("config");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  }
});

//Methods
userSchema.statics.loginAuthinticate = async function({ email, password }) {
  const user = await this.findUserByEmail(email);
  if (!user) return null;

  const isMatch = await user.varifyPassword(password);
  if (!isMatch) return null;

  return user;
};
userSchema.statics.createNewUser = async function(args) {
  const { email, username, password } = args;
  const hashPassword = await this.hashingPassword(password);
  return await this.create({ email, username, password: hashPassword });
};
userSchema.statics.findUserByEmail = function(email) {
  return this.findOne({ email: email });
};
userSchema.statics.findUserByName = function(username) {
  return this.findOne({ username: username });
};
userSchema.statics.findUserAndUpdate = function(username, name) {
  return this.findOneAndUpdate(
    { username: username },
    { $set: { displayName: name } },
    { new: true }
  );
};
userSchema.statics.findUserById = function(id) {
  return this.findById(id);
};
userSchema.statics.findUserByEmail = function(email) {
  return this.findOne({ email: email });
};

userSchema.methods.varifyPassword = function(input) {
  return bcryptjs.compare(input, this.password);
};

userSchema.methods.generateJwtToken = function() {
  let payload = { _id: this._id, username: this.username, role: this.role };
  const token = jwt.sign(payload, config.get("jwtPrivateKey"), {
    expiresIn: 60 * 60 * 60
  });
  return token;
};
userSchema.statics.hashingPassword = async function(password) {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

const Users = mongoose.model("users", userSchema);


module.exports = Users;
