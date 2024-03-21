const { customer_search_history } = require("../models/customer_search_history");
const save_search_history = async (customer_obj) => {
    console.log(customer_obj, "customer_obj")
    const customer_history = new customer_search_history(customer_obj);
    return await customer_history.save();
};
const find_user_search_history = async (user_id) => {
    console.log(user_id, "user_id");
    return await customer_search_history.findOne({ user_id: user_id });
    
};

module.exports = {
    save_search_history,
    find_user_search_history
}