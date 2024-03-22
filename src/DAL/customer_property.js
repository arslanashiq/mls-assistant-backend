const { customer_property } = require("../models/customer_property");
const save_customer_property = async (customer_obj) => {
    const property = new customer_property(customer_obj);
    return await property.save();
};

const find_user_customer_property = async (user_id) => {
    return await customer_property.findOne({ user_id: user_id });
};
const find_user_customer_property_by_id = async (_id) => {
    return await customer_property.findOne({ "property_data._id": _id });
};
const update_user_customer_property = async (user_id, _id, data) => {
    return await customer_property.updateOne(
        {
            "user_id": user_id,
            "property_data._id": _id
        },
        {
            $set: {
                "property_data.$.data": data.property_data,
                "property_data.$.name": data.name

            }
        }
    );

};
const delete_user_customer_property = async (user_id, _id) => {
    return await customer_property.updateOne(
        {
            "user_id": user_id,
        },
        {
            $pull: {
                "property_data": { "_id": _id }
            }
        }
    );

};
const find_user_customer_property_and_delete_by_user_id = async (user_id) => {
    return await customer_property.findOneAndDelete({ user_id: user_id });
};
module.exports = {
    save_customer_property,
    find_user_customer_property,
    update_user_customer_property,
    delete_user_customer_property,
    find_user_customer_property_and_delete_by_user_id,
    find_user_customer_property_by_id
}