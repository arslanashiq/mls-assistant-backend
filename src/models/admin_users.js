const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const adminUserSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    trim: true,
  },
  first_name: {
    type: String,
    trim: true,
  },
  last_name: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  profile_image: {
    type: String,
    trim: true,
  },
  contact_number: {
    type: String,
    trim: true,
    default: "",
  },
  status: {
    type: Boolean,
    default: false,
  },
});

adminUserSchema.plugin(timestamps);

adminUserSchema.methods.toJSON = function () {
  const adminUser = this;
  const adminUserObject = adminUser.toObject();
  const adminUserJson = _.pick(adminUserObject, [
    "_id",
    "user_id",
    "first_name",
    "last_name",
    "address",
    "profile_image",
    "contact_number",
    "status",
    "createdAt",
    "updatedAt",
  ]);
  return adminUserJson;
};

const adminUser = mongoose.model("adminUser", adminUserSchema);
exports.AdminUser = adminUser;
