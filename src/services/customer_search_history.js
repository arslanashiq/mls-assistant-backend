const { save_search_history, find_user_search_history, update_user_search_history, delete_user_search_history, find_user_search_history_and_delete_by_user_id, find_user_search_history_by_id } = require("../DAL/customer_search_history");
//********************************************{Add History}********************************************************/
const _AddCustomerSearchHistory = async (body, user_id, resp) => {
    let search_history = await find_user_search_history(user_id);
    if (search_history) {
        let object = {
            data: body.search_data,
            name: body.name
        }
        search_history.search_data.push(object);
        search_history = await search_history.save();
    } else {
        let object = {
            user_id: user_id,
            search_data: [{ data: body.search_data, name: body.name }]
        }
        search_history = await save_search_history(object);
    }
    resp.data = search_history;
    return resp;
};
const AddCustomerSearchHistory = async (body, user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _AddCustomerSearchHistory(body, user_id, resp);
    return resp;
};
//********************************************{Edit History}********************************************************/
const _EditCustomerSearchHistory = async (body, user_id, resp) => {
    let search_history = await find_user_search_history_by_id(body._id);
    if (!search_history) {
        resp.error = true;
        resp.error_message = "History Does Not Exsist";
        return resp;
    }
    await update_user_search_history(user_id, body._id, body);
    return resp;
};
const EditCustomerSearchHistory = async (body, user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _EditCustomerSearchHistory(body, user_id, resp);
    return resp;
};
//********************************************{GEt History}********************************************************/
const _GetCustomerSearchHistory = async (user_id, resp) => {
    let search_history = await find_user_search_history(user_id);
    if (!search_history) {
        resp.error = true;
        resp.error_message = "History Does Not Exsist";
        return resp;
    }
    resp.data = search_history;
    return resp;
};
const GetCustomerSearchHistory = async (user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _GetCustomerSearchHistory(user_id, resp);
    return resp;
};
//********************************************{GEt History}********************************************************/
const _DeleteCustomerSearchHistory = async (user_id, history_id, resp) => {
    let search_history = await find_user_search_history_by_id(history_id);
    if (!search_history) {
        resp.error = true;
        resp.error_message = "History Does Not Exsist";
        return resp;
    }
    if (search_history.search_data.length <= 1) {
        await find_user_search_history_and_delete_by_user_id(user_id)
    } else {
        await delete_user_search_history(user_id, history_id);
    }
    return resp;
};
const DeleteCustomerSearchHistory = async (user_id, history_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _DeleteCustomerSearchHistory(user_id, history_id, resp);
    return resp;
};

module.exports = {
    AddCustomerSearchHistory,
    EditCustomerSearchHistory,
    GetCustomerSearchHistory,
    DeleteCustomerSearchHistory
}