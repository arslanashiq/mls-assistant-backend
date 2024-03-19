const {all_customer_count} = require("../DAL/customer");
const _initStat = async (resp) => {
  const customers = await all_customer_count();
  resp.data = {customers: customers};
  return resp;
};
const initStat = async () => {
  let resp = {
    error: false,
    error_message: "",
    data: {},
  };
  resp = await _initStat(resp);
  return resp;
};

module.exports = {
  initStat,
};
