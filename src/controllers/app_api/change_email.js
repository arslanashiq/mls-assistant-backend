const {validate_email} = require("../../utils/validation/app_api");
const {changeEmail} = require("../../services/app_api");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const change_email = async (req, res) => {
  try {
    //validate Request Body
    try {
      await validate_email(req.body);
    } catch (e) {
      return res
        .status(400)
        .json({code: 400, message: e.details[0].message.replace(/\"/g, "")});
    }

    const {error, error_message} = await changeEmail(req.body, req.user);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Email Changed Successfully",
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = change_email;
