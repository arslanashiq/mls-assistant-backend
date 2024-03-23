const { validate_send_email } = require("../../utils/validation/customer");
const { CustomerSendEmail } = require("../../services/customer");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");

const customer_send_email = async (req, res) => {
    try {
        // validate Request Body
        try {
            await validate_send_email(req.body);
        } catch (e) {
            return res
                .status(400)
                .json({ code: 400, message: e.details[0].message.replace(/\"/g, "") });
        }

        const { error, error_message, data } = await CustomerSendEmail(req.user, req.body);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error_message,
            });
        }

        res.status(200).json({
            code: 200,
            message: "Customer Signup Successfully",
            message: data,
        });
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = customer_send_email;
