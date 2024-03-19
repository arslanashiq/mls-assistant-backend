const Joi = require("joi");
function validate_user(user) {
  const schema = {
    email: Joi.string().required().email({minDomainAtoms: 2}).trim(),
    password: Joi.string().min(5).max(255).required().trim(),
    type: Joi.number().required(),
  };
  return Joi.validate(user, schema);
}

function validate_password(user) {
  const schema = {
    old_password: Joi.string().min(5).max(255).required().trim(),
    new_password: Joi.string().min(5).max(255).required().trim(),
    confirm_password: Joi.string().min(5).max(255).required().trim(),
  };
  return Joi.validate(user, schema);
}
function validate_email(body) {
  const schema = {
    email: Joi.string().required().email({minDomainAtoms: 2}).trim(),
  };
  return Joi.validate(body, schema);
}

function validate_code(body) {
  const schema = {
    email: Joi.string().required().email({minDomainAtoms: 2}).trim(),
    verification_code: Joi.string().required().min(6),
  };
  return Joi.validate(body, schema);
}
function validate_reset_password(body) {
  const schema = {
    email: Joi.string().required().email({minDomainAtoms: 2}).trim(),
    password: Joi.string().required().min(5),
    confirm_password: Joi.string().required().min(5),
  };
  return Joi.validate(body, schema);
}

function validateEmail(user) {
  const schema = {
    email: Joi.string().required().email({minDomainAtoms: 2}).trim(),
  };
  return Joi.validate(user, schema);
}

module.exports = {
  validate_user,
  validate_password,
  validate_email,
  validate_code,
  validate_reset_password,
};
