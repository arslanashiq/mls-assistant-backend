const { customer_property } = require("../models/customer_property");
const save_customer_property = async (customer_obj) => {
    const replaced_customer_obj = replacePeriodsWithUnicodeEquivalent(customer_obj);
    console.log(replaced_customer_obj.property_data, "replaced_customer_obj");
    // const property = new customer_property(replaced_customer_obj);
    // return await property.save();

    function replacePeriodsWithUnicodeEquivalent(obj) {
        const replacedObj = {};
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const newKey = key.replace(/\./g, '\u002E');
                replacedObj[newKey] = obj[key];
            }
        }
        return replacedObj;
    }
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