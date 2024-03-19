const admin = require("./route_objects/admin");
const app_api = require("./route_objects/app_api");
const website_setting = require("./route_objects/website_setting");
const customer = require("./route_objects/customer");
const init = require("./route_objects/init");
const index = require("../index");
const v1_routes = (app) => {
  app.use("/", index);
  app.use("/api/app_api", app_api);
  app.use("/api/customer", customer);
};
module.exports = { v1_routes };
