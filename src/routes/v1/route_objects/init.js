const router = require("express").Router();
const {register_route} = require("../../../utils/reg_routes");
const init = require("../../../controllers/init/init");

register_route({
  router,
  route: "/init",
  auth_enable: true,
  admin_auth_enable: true,
  get_method: init,
});

module.exports = router;
