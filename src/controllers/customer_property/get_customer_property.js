const { GetCustomerPorperty } = require("../../services/customer_property");
const { RENDER_BAD_REQUEST } = require("../../utils/utils");
const get_customer_property = async (req, res) => {
    try {
        const { error, error_message, data } = await GetCustomerPorperty( req.user);
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error_message,
            });
        }
        res.status(200).json({
            code: 200,
            message: "History List",
            customer_property: data,
        });
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};
module.exports = get_customer_property;
