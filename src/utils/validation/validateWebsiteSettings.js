const Joi = require("joi");

function validate_website_setting(user){
  const schema = {
    support_email      : Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    privacy_policy     : Joi.string().trim().allow(null, ''),
    terms_and_conditions    : Joi.string().trim().allow(null, ''),
  }
  return Joi.validate(user, schema);
}


module.exports = {
  validate_website_setting,
}