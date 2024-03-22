const { validate_edit_customer_search_history } = require("../../utils/validation/customer");
const { EditCustomerSearchHistory } = require("../../services/customer_search_history");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");

const edit_customer_search_history = async (req, res) => {
    try {
        // validate Request Body
        try {
            await validate_edit_customer_search_history(req.body);
        } catch (e) {
            return res
                .status(400)
                .json({ code: 400, message: e.details[0].message.replace(/\"/g, "") });
        }

        const { error, error_message, data } = await EditCustomerSearchHistory(req.body, req.user);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error_message,
            });
        }

        res.status(200).json({
            code: 200,
            message: "History Updated Successfully",
            // customer: data,
        });
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = edit_customer_search_history;
