const Joi = require("joi");

function validate_admin_signup(body) {
  const schema = {
    first_name: Joi.string()
      .regex(/^[a-z A-Z]+$/)
      .min(3)
      .max(20)
      .required()
      .trim(),
    last_name: Joi.string()
      .regex(/^[a-z A-Z]+$/)
      .min(3)
      .max(20)
      .required()
      .trim(),
    address: Joi.string().trim().allow(null, ""),
    email: Joi.string().required().email({ minDomainAtoms: 2 }).trim(),
    password: Joi.string().min(5).max(255).required().trim(),
    contact_number: Joi.string().trim().allow(null, ""),
    status: Joi.boolean().required(),
  };
  return Joi.validate(body, schema);
}

function validate_edit_admin(body) {
  const schema = {
    first_name: Joi.string()
      .regex(/^[a-z A-Z]+$/)
      .min(3)
      .max(20)
      .required()
      .trim(),
    last_name: Joi.string()
      .regex(/^[a-z A-Z]+$/)
      .min(3)
      .max(20)
      .required()
      .trim(),
    address: Joi.string().trim().allow(null, ""),
    contact_number: Joi.string().trim().allow(null, ""),
    profile_image: Joi.string().trim().required(),
    status: Joi.boolean().required(),
  };
  return Joi.validate(body, schema);
}

// exports.validate_admin_signup = validate_admin_signup;
module.exports = {
  validate_admin_signup,
  validate_edit_admin,
};
