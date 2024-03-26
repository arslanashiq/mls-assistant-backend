const Joi = require("joi");

function validate_customer_signup(body) {
  const schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    password: Joi.string().min(5).max(255).required().trim(),
    first_name: Joi.string().required().min(2).trim(),
    last_name: Joi.string().required().min(2).trim(),
    contact_number: Joi.string().allow([null, '']),
    post_code: Joi.string().allow([null, '']),
  };
  return Joi.validate(body, schema);
}
function validate_send_email(body) {
  const schema = {
    sender_email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    receiver_email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    property_object: Joi.object().required(),
  };
  return Joi.validate(body, schema);
}
function validate_customer_search_history(body) {
  const schema = {
    search_data: Joi.string().required(),
    name: Joi.string().required(),
  };
  return Joi.validate(body, schema);
}
function validate_edit_customer_search_history(body) {
  const schema = {
    search_data: Joi.string().required(),
    name: Joi.string().required(),
    _id: Joi.string().required(),
  };
  return Joi.validate(body, schema);
}
function validate_edit_customer_property(body) {
  const schema = {
    property_data: Joi.object().required(),
    _id: Joi.string().required(),
  };
  return Joi.validate(body, schema);
}
function validate_google_customer(body) {
  const schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    first_name: Joi.string().required().min(2).trim(),
    last_name: Joi.string().required().min(2).trim(),
  };
  return Joi.validate(body, schema);
}
function validate_edit_customer_signup(body) {
  const schema = {
    first_name: Joi.string().required().min(2).trim(),
    last_name: Joi.string().required().min(2).trim(),
    contact_number: Joi.string().required().trim(),
  };
  return Joi.validate(body, schema);
}


function validate_customer_property(body) {
  const schema = {
    property_data: Joi.object().required(),
  };
  return Joi.validate(body, schema);
}
module.exports = {
  validate_customer_signup,
  validate_edit_customer_signup,
  validate_google_customer,
  validate_customer_search_history,
  validate_edit_customer_search_history,
  validate_customer_property,
  validate_edit_customer_property,
  validate_send_email
};
