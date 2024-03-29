const router = require("express").Router();
const { register_route } = require("../../../utils/reg_routes");
const signup_customer = require("../../../controllers/customer/signup_customer");
const customer_send_email = require("../../../controllers/customer/customer_send_email");
const edit_customer = require("../../../controllers/customer/edit_customer");

register_route({
  router,
  route: "/signup_customer",
  auth_enable: false,
  post_method: signup_customer,
});
register_route({
  router,
  route: "/customer_send_email",
  auth_enable: false,
  post_method: customer_send_email,
});
register_route({
  router,
  route: "/edit_customer",
  auth_enable: true,
  put_method: edit_customer,
});
// =================CUSTOMER SERACH HISTORY MODULE=================
const add_customer_search_history = require("../../../controllers/customer_search_history/add_customer_search_history");
const get_customer_search_history = require("../../../controllers/customer_search_history/get_customer_search_history.js");
const edit_customer_search_history = require("../../../controllers/customer_search_history/edit_customer_search_history.js");
const delete_customer_search_history = require("../../../controllers/customer_search_history/delete_customer_search_history.js");
register_route({
  router,
  route: "/add_customer_search_history",
  auth_enable: true,
  post_method: add_customer_search_history,
});
register_route({
  router,
  route: "/edit_customer_search_history",
  auth_enable: true,
  put_method: edit_customer_search_history,
});
register_route({
  router,
  route: "/delete_customer_search_history/:id",
  auth_enable: true,
  delete_method: delete_customer_search_history,
});
register_route({
  router,
  route: "/get_customer_search_history",
  auth_enable: true,
  get_method: get_customer_search_history,
});
// =================CUSTOMER SAVE PROPERTY MODULE=================
const add_customer_property = require("../../../controllers/customer_property/add_customer_property");
const get_customer_property = require("../../../controllers/customer_property/get_customer_property.js");
const edit_customer_property = require("../../../controllers/customer_property/edit_customer_property.js");
const delete_customer_property = require("../../../controllers/customer_property/delete_customer_property.js");
register_route({
  router,
  route: "/add_customer_property",
  auth_enable: true,
  post_method: add_customer_property,
});

register_route({
  router,
  route: "/edit_customer_property",
  auth_enable: true,
  put_method: edit_customer_property,
});
register_route({
  router,
  route: "/delete_customer_property/:id",
  auth_enable: true,
  delete_method: delete_customer_property,
});
register_route({
  router,
  route: "/get_customer_property",
  auth_enable: true,
  get_method: get_customer_property,
});
module.exports = router;
