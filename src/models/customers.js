const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const _ = require("lodash");

const customerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  post_code:{
    type:String
  },
  status: {
    type: Boolean,
    default: false,
  },
});

customerSchema.plugin(timestamps);

customerSchema.methods.toJSON = function () {
  const customer = this;
  const customerObject = customer.toObject();
  const customerJson = _.pick(customerObject, [
    "_id",
    "user_id",
    "first_name",
    "last_name",
    "profile_image",
    "contact_number",
    "post_code",
    "status",
    "createdAt",
    "updatedAt",
  ]);
  return customerJson;
};

const Customer = mongoose.model("customer", customerSchema);
exports.Customer = Customer;
