const {getWebsiteSetting} = require("../../services/website_setting");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const get_website_setting = async (req, res) => {
  try {
    const {error, error_message, data} = await getWebsiteSetting();

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Website Setting",
      setting: data.website_setting,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = get_website_setting;
