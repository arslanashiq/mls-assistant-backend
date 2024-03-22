const { DeleteCustomerSearchHistory } = require("../../services/customer_search_history");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");

const delete_customer_search_history = async (req, res) => {
    try {
        const { error, error_message, data } = await DeleteCustomerSearchHistory(req.user, req.params.id);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error_message,
            });
        }

        res.status(200).json({
            code: 200,
            message: "History Deleted",
        });
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = delete_customer_search_history;
