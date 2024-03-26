const {
    find_user,
    find_user_by_id,
    signup_user,
    delete_user_by_id,
} = require("../DAL/user");
const {
    Signup_customer,
    pagination_customer,
    all_customer_count,
    delete_customer_by_id,
    get_customer_search,
    customer_search_count,
    find_customer_by_user_id,
} = require("../DAL/customer");
const {
    add_to_session,
    delete_from_session_by_user_id,
} = require("../DAL/session");
const jwt = require("jsonwebtoken");
const { v1: uuidv1 } = require("uuid");
const { sendEmail, email_template_code_verification_function, property_email_template_function } = require("../utils/utils");
const { find_customer_property_by_id } = require("../DAL/customer_property");
//********************************************{Sign Up Customer}********************************************************/
const _signupCustomer = async (body, resp) => {
    const user = await find_user(body.email);
    if (user) {
        resp.error = true;
        resp.error_message = "Email Alreay axist";
        return resp;
    }
    body.type = 1;
    body.status = false;
    // signup new user
    let customer_user = await signup_user(body);
    if (!customer_user) {
        resp.error = true;
        resp.error_message = "Something Went Wrong";
        return resp;
    }
    let customer = {
        _id: customer_user._id,
        email: customer_user.email,
    };
    // add customer
    const customer_obj = {
        user_id: customer,
        first_name: body.first_name,
        last_name: body.last_name,
        profile_image: "",
        contact_number: body.contact_number,
        post_code: body.post_code,
        status: true,
    };
    await Signup_customer(customer_obj);
    resp.data = "Please Verify Your Email";

    const code =
        Math.floor(Math.random() * (9 * Math.pow(10, 6 - 1))) + Math.pow(10, 6 - 1);
    customer_user.verification_code = code;
    await customer_user.save();

    let sender_email = 'support@gmail.com';
    let receiver_email = body.email;
    let email_subject = `Email Verification Code`;
    let email_body = await email_template_code_verification_function(code);
    // User-defined function to send email
    let result = sendEmail(sender_email, receiver_email, email_subject, email_body);

    return resp;
};
const signupCustomer = async (body) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _signupCustomer(body, resp);
    return resp;
};
//*****************************************************{Edit Customer} ******************************************************/
const _editCustomer = async (body, user_id, resp) => {
    const user = await find_user_by_id(user_id);
    if (!user) {
        resp.error = true;
        resp.error_message = "Invalid User";
        return resp;
    }
    if (user.type != 0 && user.type != 1) {
        resp.error = true;
        resp.error_message = "You are unauthorized!";
        return resp;
    }
    if (user.type !== 1) {
        // if (String(user._id) != String(customer_id)) {
        resp.error = true;
        resp.error_message = "You are unauthorized!";
        return resp;
        // }
    }
    // find customer by id
    const customer_detail = await find_customer_by_user_id(user_id);
    if (!customer_detail) {
        resp.error = true;
        resp.error_message = "Invalid Customer";
        return resp;
    }
    customer_detail.first_name = body.first_name;
    customer_detail.last_name = body.last_name;
    customer_detail.contact_number = body.contact_number;
    await customer_detail.save();
    resp.data = customer_detail;
    return resp;
};
const editCustomer = async (body, user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _editCustomer(body, user_id, resp);
    return resp;
};
//********************************************{Get Customer}********************************************************/
const _getCustomers = async (Limit, page, resp) => {
    ///// pagination
    let limit = parseInt(Limit);
    if (!limit) {
        limit = 15;
    }

    if (page) {
        page = parseInt(page) + 1;
        if (isNaN(page)) {
            page = 1;
        }
    } else {
        page = 1;
    }
    let skip = (page - 1) * limit;
    const customer = await pagination_customer(skip, limit);
    // count all customer
    const total_pages = await all_customer_count();
    const data = {
        customer: customer,
        total_pages: total_pages,
        load_more_url: `/customer/get_customers?page=${page}&limit=15`,
    };
    resp.data = data;
    return resp;
};
const getCustomers = async (limit, page) => {
    let resp = {
        error: false,
        auth: true,
        error_message: "",
        data: {},
    };

    resp = await _getCustomers(limit, page, resp);
    return resp;
};
//********************************************{Detail Customer}********************************************************/
const _detailCustomer = async (user_id, resp) => {
    const user = await find_user_by_id(user_id);
    if (!user) {
        resp.error = true;
        resp.error_message = "Invalid User";
        return resp;
    }
    if (user.type != 0 && user.type != 1) {
        resp.error = true;
        resp.error_message = "You are unauthorized!";
        return resp;
    }
    if (user.type !== 1) {
        // if (String(user._id) != String(customer_id)) {
        resp.error = true;
        resp.error_message = "You are unauthorized!";
        return resp;
        // }
    }
    const customer = await find_customer_by_user_id(user_id);
    if (!customer) {
        resp.error = true;
        resp.error_message = "Invalid Customer ID!";
        return resp;
    }
    resp.data = customer;
    return resp;
};
const detailCustomer = async (user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _detailCustomer(user_id, resp);
    return resp;
};
//********************************************{Delete Customer}********************************************************/
const _deleteCustomer = async (user_id, resp) => {
    // find by id
    const customer = await find_customer_by_user_id(user_id);
    if (!customer) {
        resp.error = true;
        resp.error_message = "Invalid Customer ID!";
        return resp;
    }
    // customer from user model
    const deleted_user = await delete_user_by_id(customer.user_id._id);
    // delete customer
    const deleted_customer = await delete_customer_by_id(user_id);
    // delete customer from session
    const delete_customer_session = await delete_from_session_by_user_id(user_id);
    return resp;
};
const deleteCustomer = async (user_id) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _deleteCustomer(user_id, resp);
    return resp;
};
//*****************************************************{List Customer with Search + Pagination} **********************************************/
const _listCustomer = async (text, Limit, page, resp) => {
    let limit = parseInt(Limit);
    if (!limit) {
        limit = 15;
    }
    if (page) {
        page = parseInt(page) + 1;
        if (isNaN(page)) {
            page = 1;
        }
    } else {
        page = 1;
    }
    let customers = [];
    let total_customers = 0;
    let skip = (page - 1) * limit;
    let url = "";
    if (text) {
        url = `/customer/list_customer?text=${text}&page=${page}&limit=${limit}`;
        customers = await get_customer_search(text, skip, limit);
        total_customers = await customer_search_count(text);
    } else {
        url = `/customer/list_customer?page=${page}&limit=${limit}`;
        customers = await pagination_customer(skip, limit);
        total_customers = await all_customer_count();
    }
    resp.data = {
        customer_list: customers,
        count: total_customers,
        load_more_url: url,
    };
    return resp;
};
const listCustomer = async (text, limit, page) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _listCustomer(text, limit, page, resp);
    return resp;
};
//*****************************************************{SEND EMAIL BY CUSTOMER} **********************************************/
const _CustomerSendEmail = async (user_id, body, resp) => {
    let property_object = body.property_object;
    console.log(property_object.Media[0].MediaURL, "Media");
    console.log(property_object.ListPrice, "ListPrice");
    console.log(property_object.BedroomsTotal, "BedroomsTotal");
    console.log(property_object.BathroomsFull, "BathroomsFull");
    console.log(property_object.LivingArea, "LivingArea");
    console.log(property_object.LotSizeUnits, "LotSizeUnits");
    console.log(property_object.UnparsedAddress, "UnparsedAddress");
    console.log(body.sender_email,"body.sender_email")
    console.log(body.receiver_email,"body.receiver_email")

    let sender_email = body.sender_email;
    let receiver_email = body.receiver_email;
    let email_subject = `Email Verification Code`;
    let email_body = await property_email_template_function(
        property_object.Media[0].MediaURL,
        property_object.ListPrice,
        property_object.UnparsedAddress,
        property_object.BedroomsTotal,
        property_object.BathroomsFull,
        property_object.LivingArea,
        property_object.LotSizeUnits,
    );
    // // User-defined function to send email
    let result = sendEmail(sender_email, receiver_email, email_subject, email_body);
    resp.data = {

    };
    return resp;
};
const CustomerSendEmail = async (user_id, body) => {
    let resp = {
        error: false,
        error_message: "",
        data: {},
    };

    resp = await _CustomerSendEmail(user_id, body, resp);
    return resp;
};
module.exports = {
    signupCustomer,
    editCustomer,
    getCustomers,
    detailCustomer,
    deleteCustomer,
    listCustomer,
    CustomerSendEmail
};
