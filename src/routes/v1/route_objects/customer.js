const router = require("express").Router();
const {register_route} = require("../../../utils/reg_routes");
const signup_customer = require("../../../controllers/customer/signup_customer");
register_route({
  router,
  route: "/signup_customer",
  auth_enable: false,
  post_method: signup_customer,
});
module.exports = router;
