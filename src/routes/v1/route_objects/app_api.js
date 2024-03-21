const router = require("express").Router();
const {register_route} = require("../../../utils/reg_routes");
const google_login = require("../../../controllers/app_api/google_login.js");
const login = require("../../../controllers/app_api/login");
const logout = require("../../../controllers/app_api/logout");

register_route({
  router,
  route: "/login",
  auth_enable: true,
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

module.exports = router;
