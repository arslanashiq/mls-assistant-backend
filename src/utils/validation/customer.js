const Joi = require("joi");

function validate_customer_signup(body) {
  const schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    password: Joi.string().min(5).max(255).required().trim(),
    first_name: Joi.string().required().min(2).trim(),
    last_name: Joi.string().required().min(2).trim(),
    contact_number: Joi.string().required().trim(),
    post_code: Joi.string().required().trim(),
  };
  return Joi.validate(body, schema);
}
function validate_edit_customer_signup(body) {
  const schema = {
    first_name: Joi.string().required().min(2).trim(),
    last_name: Joi.string().required().min(2).trim(),
    profile_image: Joi.string().required().trim().allow(""),
    contact_number: Joi.string().required().trim(),
    post_code: Joi.string().required().trim(),
  };
  return Joi.validate(body, schema);
}

module.exports = {
  validate_customer_signup,
  validate_edit_customer_signup,
};
