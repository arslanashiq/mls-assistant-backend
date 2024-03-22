const { validate_customer_property } = require("../../utils/validation/customer");
const { AddCustomerProperty } = require("../../services/customer_property");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");

const add_customer_property = async (req, res) => {
    try {
        // validate Request Body
        try {
            await validate_customer_property(req.body);
        } catch (e) {
            return res
                .status(400)
                .json({ code: 400, message: e.details[0].message.replace(/\"/g, "") });
        }

        const { error, error_message, data } = await AddCustomerProperty(req.body, req.user);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error_message,
            });
        }

        res.status(200).json({
            code: 200,
            message: "Property Added Successfully",
            data: data,
        });
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = add_customer_property;
