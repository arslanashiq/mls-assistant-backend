const {detailAdmin} = require("../../services/admin");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const detail_admin = async (req, res) => {
  try {
    const {error, error_message, data} = await detailAdmin(req.user);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Admin Details",
      admin: data.admin,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = detail_admin;
