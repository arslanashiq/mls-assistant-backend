const router = require("express").Router();
const { register_route } = require("../../../utils/reg_routes");
const edit_website_settings = require("../../../controllers/website_setting/edit_website_settings");
const get_website_setting = require("../../../controllers/website_setting/get_website_setting");


register_route({
  router,
  route: "/",
  auth_enable: true,
  admin_auth_enable: true,
  get_method: get_website_setting,
});

register_route({
  router,
  route: "/edit_website_setting/",
  auth_enable: true,
  admin_auth_enable: true,
  put_method: edit_website_settings,
});


module.exports = router;
