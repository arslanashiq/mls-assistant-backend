const Joi = require("joi");

function validate_admin(user) {
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
  return Joi.validate(user, schema);
}

function validate_edit_admin(user) {
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
  return Joi.validate(user, schema);
}

// exports.validate_admin = validate_admin;
module.exports = {
  validate_admin,
  validate_edit_admin,
};
