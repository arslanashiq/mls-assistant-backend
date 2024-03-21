const { validate_user } = require("../../utils/validation/app_api");
const { loginUser } = require("../../services/app_api");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");

const login = async (req, res) => {
  try {
    //validate Request Body
    try {
      await validate_user(req.body);
    } catch (e) {
      return res
        .status(400)
        .json({ code: 400, message: e.details[0].message.replace(/\"/g, "") });
    }

    const {
      error,
      error_message,
      data,
    } = await loginUser(req.body);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }
    return res.status(200).json({
      code: 200,
      message: "Login Successfull",
      token: data.token,
      user: data.admin,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = login;
