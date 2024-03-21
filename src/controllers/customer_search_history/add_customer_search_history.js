const { validate_customer_search_history } = require("../../utils/validation/customer");
const { AddCustomerSearchHistory } = require("../../services/customer_search_history");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");

const add_customer_search_history = async (req, res) => {
    try {
        // validate Request Body
        try {
            await validate_customer_search_history(req.body);
        } catch (e) {
            return res
                .status(400)
                .json({ code: 400, message: e.details[0].message.replace(/\"/g, "") });
        }

        const { error, error_message, data } = await AddCustomerSearchHistory(req.body, req.user);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error_message,
            });
        }

        res.status(200).json({
            code: 200,
            message: "History Added Successfully",
            customer: data,
        });
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = add_customer_search_history;
