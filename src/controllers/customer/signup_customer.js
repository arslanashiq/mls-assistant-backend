const {validate_customer_signup} = require("../../utils/validation/customer");
const {signupCustomer} = require("../../services/customer");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const signup_customer = async (req, res) => {
  try {
   // validate Request Body
    try {
      await validate_customer_signup(req.body);
    } catch (e) {
      return res
        .status(400)
        .json({code: 400, message: e.details[0].message.replace(/\"/g, "")});
    }

    const {error, error_message, data} = await signupCustomer(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Customer Signup Successfully",
      customer: data,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = signup_customer;
