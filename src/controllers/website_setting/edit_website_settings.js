const {
  validate_website_setting,
} = require("../../utils/validation/validateWebsiteSettings");
const {editWebsiteSetting} = require("../../services/website_setting");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const edit_website_settings = async (req, res) => {
  try {
    //validate Request Body
    try {
      await validate_website_setting(req.body);
    } catch (e) {
      return res
        .status(400)
        .json({code: 400, message: e.details[0].message.replace(/\"/g, "")});
    }

    const {error, error_message, data} = await editWebsiteSetting(
      req.body,
      req.params.id
    );

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Settings Updated successfully",
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = edit_website_settings;
