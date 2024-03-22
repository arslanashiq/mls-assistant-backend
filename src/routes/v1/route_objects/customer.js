const router = require("express").Router();
const {register_route} = require("../../../utils/reg_routes");
const signup_customer = require("../../../controllers/customer/signup_customer");
const add_customer_search_history = require("../../../controllers/customer_search_history/add_customer_search_history");
const get_customer_search_history = require("../../../controllers/customer_search_history/get_customer_search_history.js");
const edit_customer_search_history = require("../../../controllers/customer_search_history/edit_customer_search_history.js");
const delete_customer_search_history = require("../../../controllers/customer_search_history/delete_customer_search_history.js");

register_route({
  router,
  route: "/signup_customer",
  auth_enable: false,
  post_method: signup_customer,
});
// =================SERACH HISTORY MODULE=================
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
module.exports = router;
