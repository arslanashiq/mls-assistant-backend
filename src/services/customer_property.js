
const { save_customer_property,
    find_user_customer_property,
    update_user_customer_property,
    delete_user_customer_property,
    find_user_customer_property_and_delete_by_user_id,
    find_user_customer_property_by_id } = require("../DAL/customer_property");
const _AddCustomerProperty = async (body, user_id, resp) => {
    let customer_property = await find_user_customer_property(user_id);
    if (customer_property) {
        customer_property.property_data.push(body.property_data);
        customer_property = await customer_property.save();
    } else {
        let array = [];
        array.push(body.property_data);
        let object = {
            user_id: user_id,
            property_data: array
        }
        customer_property = await save_customer_property(object);
    }
    resp.data = customer_property;
    return resp;
};
const AddCustomerProperty = async (body, user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _AddCustomerProperty(body, user_id, resp);
    return resp;
};
//********************************************{GEt CUstomer Property}********************************************************/
const _GetCustomerPorperty = async (user_id, resp) => {
    let customer_property = await find_user_customer_property(user_id);
    if (!customer_property) {
        resp.error = true;
        resp.error_message = "Property Does Not Exsist";
        return resp;
    }
    resp.data = customer_property;
    return resp;
};
const GetCustomerPorperty = async (user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _GetCustomerPorperty(user_id, resp);
    return resp;
};
//********************************************{Edit Customer Property}********************************************************/
const _EditCustomerProperty = async (body, user_id, resp) => {
    console.log(body, "body");
    let customer_property = await find_user_customer_property_by_id(body._id);
    if (!customer_property) {
        resp.error = true;
        resp.error_message = "Property Does Not Exsist";
        return resp;
    }
    await update_user_customer_property(user_id, body._id, body);
    return resp;
};
const EditCustomerProperty = async (body, user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _EditCustomerProperty(body, user_id, resp);
    return resp;
};
//********************************************{DELETE Property}********************************************************/
const _DeleteCustomerProperty = async (user_id, property_id, resp) => {
    let customer_property = await find_user_customer_property_by_id(property_id);
    if (!customer_property) {
        resp.error = true;
        resp.error_message = "Property Does Not Exsist";
        return resp;
    }
    if (customer_property.property_data.length <= 1) {
        await find_user_customer_property_and_delete_by_user_id(user_id)
    } else {
        await delete_user_customer_property(user_id, property_id);
    }
    return resp;
};
const DeleteCustomerProperty = async (user_id, property_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _DeleteCustomerProperty(user_id, property_id, resp);
    return resp;
};

module.exports = {
    AddCustomerProperty,
    GetCustomerPorperty,
    EditCustomerProperty,
    DeleteCustomerProperty
}