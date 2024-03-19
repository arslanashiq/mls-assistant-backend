const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adminUser",
  },

  token: {
    type: String,
    required: true,
  },
});

sessionSchema.plugin(timestamps);

sessionSchema.methods.toJSON = function () {
  const session = this;
  const sessionObject = session.toObject();
  const sessionJson = _.pick(sessionObject, [
    "_id",
    "user_id",
    "token",
    "createdAt",
    "updatedAt",
  ]);
  return sessionJson;
};

const Session = mongoose.model("sessions", sessionSchema);
module.exports = {Session};
