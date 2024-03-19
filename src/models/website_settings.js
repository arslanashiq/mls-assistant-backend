const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const websiteSettingSchema = new mongoose.Schema({
  support_email: {
    type: String,
    trim: true,
  },
  privacy_policy: {
    type: String,
    trim: true,
  },
  terms_and_conditions: {
    type: String,
    trim: true,
  },
});

websiteSettingSchema.plugin(timestamps);

websiteSettingSchema.methods.toJSON = function () {
  const websiteSetting = this;
  const websiteSettingObject = websiteSetting.toObject();
  const websiteSettingJson = _.pick(websiteSettingObject, [
    "_id",
    "support_email",
    "privacy_policy",
    "terms_and_conditions",
    "createdAt",
    "updatedAt",
  ]);
  return websiteSettingJson;
};

const websiteSetting = mongoose.model("websiteSetting", websiteSettingSchema);
exports.WebsiteSetting = websiteSetting;
