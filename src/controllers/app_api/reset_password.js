const {validate_reset_password} = require("../../utils/validation/app_api");
const {resetPassword} = require("../../services/app_api");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const reset_password = async (req, res) => {
  try {
    //validate Request Body
    try {
      await validate_reset_password(req.body);
    } catch (e) {
      return res
        .status(400)
        .json({code: 400, message: e.details[0].message.replace(/\"/g, "")});
    }

    const {error, error_message, data} = await resetPassword(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Password Reset Successfully!",
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = reset_password;
