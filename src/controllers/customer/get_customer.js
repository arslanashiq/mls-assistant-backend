const {getCustomers} = require("../../services/customer");
const {RENDER_BAD_REQUEST} = require("../../utils/utils");

const get_customers = async (req, res) => {
  try {
    const {error, error_message, data} = await getCustomers(
      req.query.limit,
      req.query.page
    );

    if (error) {
      return res.status(400).json({
        code: 400,
        message: error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: "Customers",
      customer: data.customer,
      count: data.total_pages,
      load_more_url: data.load_more_url,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

module.exports = get_customers;
