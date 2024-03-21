const { find_user_by_id } = require("../DAL/user");
const { save_search_history, find_user_search_history } = require("../DAL/customer_search_history");
//********************************************{Add History}********************************************************/
const _AddCustomerSearchHistory = async (body, user_id, resp) => {

    let search_history = await find_user_search_history(user_id);
    console.log(search_history, "search_history")
    if (search_history) {
        search_history.search_data = body.search_data;
        search_history = await search_history.save();
    } else {
        let object = {
            user_id: user_id,
            search_data: body.search_data
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

module.exports = {
    AddCustomerSearchHistory,
    GetCustomerSearchHistory
}