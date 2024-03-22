const { DeleteCustomerProperty } = require("../../services/customer_property");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");

const delete_customer_property = async (req, res) => {
    try {
        const { error, error_message, data } = await DeleteCustomerProperty(req.user, req.params.id);
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

module.exports = delete_customer_property;
