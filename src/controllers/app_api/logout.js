const {logoutUser} = require("../../services/app_api");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const logout = async (req, res) => {
  try {
    const {error, error_message} = await logoutUser(req.user);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Logout Successfull",
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = logout;
