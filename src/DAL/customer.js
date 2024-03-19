const { Customer } = require("../models/customers");

const Signup_customer = async (customer_obj) => {
  const customer = new Customer(customer_obj);
  return await customer.save();
};
const find_customer_by_id = async (id) => {
  return await Customer.findOne({ _id: id }).populate("user_id", "email");
};
const find_customer_by_user_id = async (id) => {
  return await Customer.findOne({ user_id: id }).populate("user_id", "email");
};

const total_customer = async (id) => {
  return await Customer.find().count();
};

const latest_customer = async (id) => {
  return await Customer.find().sort({ createdAt: -1 }).limit(5);
};

const pagination_customer = async (skip, limit) => {
  return await Customer.find()
    .sort({ createdAt: -1 })
    .populate("user_id", "email")
    .limit(limit)
    .skip(skip);
};
const all_customer_count = async () => {
  return await Customer.find().countDocuments();
};

const delete_customer_by_id = async (customer_id) => {
  return await Customer.deleteOne({user_id:customer_id});
};
const get_customer_search = async (text, skip, limit) => {
  return await Customer.find({
    $or: [
      { first_name: { $regex: new RegExp(text, "i") } },
      { last_name: { $regex: new RegExp(text, "i") } },
      { post_code: { $regex: new RegExp(text, "i") } },
      { contact_number: { $regex: new RegExp(text, "i") } },
    ],
  })
    .skip(skip)
    .limit(limit);
};
const customer_search_count = async (text) => {
  return await Customer.find({
    $or: [
      { first_name: { $regex: new RegExp(text, "i") } },
      { last_name: { $regex: new RegExp(text, "i") } },
      { post_code: { $regex: new RegExp(text, "i") } },
      { contact_number: { $regex: new RegExp(text, "i") } },
    ],
  }).countDocuments();
};

module.exports = {
  Signup_customer,
  find_customer_by_id,
  total_customer,
  latest_customer,
  find_customer_by_user_id,
  pagination_customer,
  all_customer_count,
  delete_customer_by_id,
  get_customer_search,
  customer_search_count,
};
