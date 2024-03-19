const {
  add_website_setting,
  get_website_setting,
} = require("../DAL/website_setting");
//*************************************{Edit Website Settings}************************************************
const _editWebsiteSetting = async (body, resp) => {
  const website_setting = await get_website_setting();

  if (!website_setting) {
    add_website_setting(body);
    return resp;
  }

  website_setting.support_email = body.support_email;
  website_setting.privacy_policy = body.privacy_policy;
  website_setting.terms_and_conditions = body.terms_and_conditions;

  let editWebsiteSetting = await website_setting.save();

  if (!editWebsiteSetting) {
    resp.error = true;
    resp.error_message = "Website Settings Update failed";
    return resp;
  }

  return resp;
};
const editWebsiteSetting = async (body) => {
  let resp = {
    error: false,
    auth: true,
    error_message: "",
    data: {},
  };

  resp = await _editWebsiteSetting(body, resp);
  return resp;
};
//*************************************{Get Website Settings}************************************************
const _getWebsiteSetting = async (resp) => {
  const website_setting = await get_website_setting();

  resp.data = {
    website_setting: website_setting,
  };
  return resp;
};
const getWebsiteSetting = async () => {
  let resp = {
    error: false,
    error_message: "",
    data: {},
  };

  resp = await _getWebsiteSetting(resp);
  return resp;
};
module.exports = {
  editWebsiteSetting,
  getWebsiteSetting,
};
