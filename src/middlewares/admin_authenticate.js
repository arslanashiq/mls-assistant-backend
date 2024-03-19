const { checking_session } = require("../DAL/session");
const { is_user_authorized } = require("../DAL/user");
const jwt = require("jsonwebtoken");

const admin_authenticate = async (req, res, next) => {
  try {
    const user_id = req.user;
    let admin = await is_user_authorized(user_id);
    if (!admin) {
      return res
        .status(401)
        .json({ code: 401, message: "You Are Not Authorized" });
    }
    next();
  } catch (e) {
    console.log("error", e);
    return res
      .status(401)
      .json({ code: 401, message: "Invalid Token", Error_Error: e });
  }
};

module.exports = { admin_authenticate };
