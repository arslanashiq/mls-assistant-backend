const router = require("express").Router();
const { register_route } = require("../../../utils/reg_routes");
const google_login = require("../../../controllers/app_api/google_login.js");
const login = require("../../../controllers/app_api/login");
const logout = require("../../../controllers/app_api/logout");
const code_verification = require("../../../controllers/app_api/code_verification");
const change_password = require("../../../controllers/app_api/change_password");
const email_verificatin = require("../../../controllers/app_api/email_verification.js");
const reset_password = require("../../../controllers/app_api/reset_password.js");
register_route({
  router,
  route: "/reset_password",
  auth_enable: false,
  post_method: reset_password,
});
register_route({
  router,
  route: "/email_verificatin",
  auth_enable: false,
  post_method: email_verificatin,
});
register_route({
  router,
  route: "/code_verification",
  auth_enable: false,
  post_method: code_verification,
});
register_route({
  router,
  route: "/login",
  auth_enable: false,
  post_method: login,
});
register_route({
  router,
  route: "/google_login",
  auth_enable: false,
  post_method: google_login,
});
register_route({
  router,
  route: "/logout",
  auth_enable: true,
  get_method: logout,
});
register_route({
  router,
  route: "/change_password",
  auth_enable: true,
  post_method: change_password,
});

module.exports = router;
