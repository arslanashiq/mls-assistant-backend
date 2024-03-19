const {validate_password} = require("../../utils/validation/app_api");
const {changePassword} = require("../../services/app_api");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const change_password = async (req, res) => {
  try {
    //validate Request Body
    try {
      await validate_password(req.body);
    } catch (e) {
      return res
        .status(400)
        .json({code: 400, message: e.details[0].message.replace(/\"/g, "")});
    }

    const {error, error_message} = await changePassword(req.body, req.user);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Password Changed Successfully",
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = change_password;
