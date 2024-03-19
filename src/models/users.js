const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  type: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  verification_code: {
    type: String,
    trim: true,
    default: "",
  },
  verification_status: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(timestamps);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  const userJson = _.pick(userObject, [
    "_id",
    "email",
    "password",
    "type",
    "status",
    "verification_code",
    "verification_status",
    "createdAt",
    "updatedAt",
  ]);
  return userJson;
};
const User = mongoose.model("user", userSchema);
module.exports = { User };
