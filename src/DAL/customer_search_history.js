const { customer_search_history } = require("../models/customer_search_history");
const save_search_history = async (customer_obj) => {
    const customer_history = new customer_search_history(customer_obj);
    return await customer_history.save();
};
const find_user_search_history = async (user_id) => {
    console.log(user_id, "user_id");
    return await customer_search_history.findOne({ user_id: user_id });

};
const find_user_search_history_by_id = async (_id) => {
    return await customer_search_history.findOne({ "search_data._id": _id });

};
const update_user_search_history = async (user_id, _id, data) => {
    return await customer_search_history.updateOne(
        {
            "user_id": user_id,
            "search_data._id": _id
        },
        {
            $set: {
                "search_data.$.data": data
            }
        }
    );

};
const delete_user_search_history = async (user_id, _id, data) => {
    return await customer_search_history.updateOne(
        {
            "user_id": user_id,
        },
        {
            $pull: {
                "search_data": { "_id": _id }
            }
        }
    );

};

const find_user_search_history_and_delete_by_user_id = async (user_id) => {
    return await customer_search_history.findOneAndDelete({ user_id: user_id });
};
module.exports = {
    save_search_history,
    find_user_search_history,
    update_user_search_history,
    delete_user_search_history,
    find_user_search_history_and_delete_by_user_id,
    find_user_search_history_by_id
}