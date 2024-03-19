const {validate_edit_admin} = require("../../utils/validation/validateAdmin");
const {editAdmin} = require("../../services/admin");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const edit_admin = async (req, res) => {
  try {
    //validate Request Body
    try {
      await validate_edit_admin(req.body);
    } catch (e) {
      return res
        .status(400)
        .json({code: 400, message: e.details[0].message.replace(/\"/g, "")});
    }

    const {error, error_message, data} = await editAdmin(req.body, req.user);

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Admin Updated successfully",
      adminUser: data.admin,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = edit_admin;
