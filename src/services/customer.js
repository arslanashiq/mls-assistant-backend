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
const { sendEmail, email_template_code_verification_function } = require("../utils/utils");
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
  customer_detail.profile_image = body.profile_image;
  customer_detail.contact_number = body.contact_number;
  customer_detail.post_code = body.post_code;
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
  let user = await find_user_by_id(user_id);
  let sender_email = user.email;
  let receiver_email = body.email;
  let email_subject = `Email Verification Code`;
  let email_body = `<!DOCTYPE html>
  <html>
  
  <head>
      <title>Page Title</title>
  </head>
  
  <body>
      <table role="article" aria-label="MLS" lang="en" cellpadding="0" cellspacing="0" border="0"
          style="width:100%;text-align:center;vertical-align:middle;margin:0 auto;table-layout:fixed">
          <tbody>
              <tr>
                  <td align="center" bgcolor="#ffffff">
                      <img src="https://ci3.googleusercontent.com/meips/ADKq_Nau0NCBnvOS-zNxlJq9aHl3f5N7Bo-UR5f21lsT3bvdKmtff-wenIvc0MqBET51WsbkKVvHqNCD9_-17dAfR2wTURIDTRa2SYE0hhVGv9U8kOMxxRdG5f5dHIVTvx20X9iZq2_jReWp9Z_aDQkbnj2e3OI-YV9j8mVfZiwK5J-VdHNYC1y5Pk3vv0Jk-qwP=s0-d-e1-ft#https://www.zillow.com/app/?tok=40207f35-f49a-4f6e-9469-6a4f83ac8327~X1-ZUqywfty9tym15_6ikyk&amp;service=emailtrackingservice"
                          width="1" height="1" style="display:none" class="CToWUd" data-bit="iit" />
  
  
                      <div
                          style="display:none!important;display:none;overflow:hidden;float:left;width:0px;max-height:0px;max-width:0px;line-height:0px">
                          Daily result straight to your
                          inbox.͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;͏&zwnj;&nbsp; &#xFEFF;&shy;<wbr>&nbsp;
                      </div>
  
  
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center" style="padding:0px 20px">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:600px">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:32px">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <h1 style="margin:0 auto;padding:0">
                                                          <a border="0" style="text-decoration:none" href="#"
                                                              target="_blank"> <img
                                                                  src="https://ci3.googleusercontent.com/meips/ADKq_NaieuIl3qqXHajhbbsv5emFqTdr04vEFQhaXleSXSv04j5fH0-06OOiF8igOQ1p7_I9XmDooc2f1EPcCdWWwRo8LAt_XOt8yavGpmMngFHkbLM5J2z3GQsSygOL=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/Zillow_Logo_300x64.png"
                                                                  alt="MLS" border="0" height="32" width="150"
                                                                  style="display:block;color:#006aff;font-family:Arial,sans-serif;font-weight:bold;font-size:32px;line-height:1;text-align:center;text-decoration:none;margin:0 auto;padding:0;max-width:100%;height:auto"
                                                                  class="CToWUd" data-bit="iit">
  
                                                              <div style="display:none">
                                                                  <img src="https://ci3.googleusercontent.com/meips/ADKq_NYZ5M6ZbzeB9lx6Sflloxg577pmLXNWxNuwA_e7G03gD8eCO307XlvqAJ_y7WdMv1qBngOvaEcNzjnWfyc2lqoQ6YQBuhUAls_V-s0P9uNOb_BdRXeabkwObAVBOfx0=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/Zillow_Logo_300x64_dm.png"
                                                                      alt="MLS" border="0" height="32" width="150"
                                                                      style="display:block;color:#ffffff;font-family:Arial,sans-serif;font-weight:bold;font-size:32px;line-height:1;text-align:center;text-decoration:none;margin:0 auto;padding:0;max-width:100%;height:auto"
                                                                      class="CToWUd" data-bit="iit">
                                                              </div>
  
                                                          </a>
                                                      </h1>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
  
  
  
  
  
  
  
  
  
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:504px">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:24px">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center" style="padding:0px 20px">
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td
                                                                      style="border-bottom:2px solid #ffd237;width:152px;font-size:0;height:0;line-height:0">
                                                                      &nbsp;</td>
                                                              </tr>
                                                              <tr>
                                                                  <td class="m_-2346107395176450950lh24"
                                                                      style="font-size:0px;line-height:40px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <p class="m_-2346107395176450950font14"
                                                          style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:400;font-size:16px;line-height:24px;color:#2a2a33;text-align:center;margin:0;padding:0">
                                                          Check out this property. </p>
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td class="m_-2346107395176450950lh24"
                                                                      style="font-size:0px;line-height:40px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
  
  
  
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:600px">
                                          <tbody>
                                              <tr>
                                                  <td align="center" style="padding:0px 10px">
                                                      <table role="presentation" class="m_-2346107395176450950w100p"
                                                          align="center" cellpadding="0" cellspacing="0" border="0"
                                                          style="width:534px;border:1px solid #d1d1d5;border-radius:4px">
                                                          <tbody>
                                                              <tr>
                                                                  <td align="center"
                                                                      background="https://ci3.googleusercontent.com/meips/ADKq_NbXIfDv65GCHOKz2WpU7bzIfJT5DR6-bUqcqjUOL46wqsOxd0G8-vX-YWaAXYRZyY8d5uD-Mhk2TNhgYfdwKLigtiL_htQXwISFnFaNjzI8iTszWaZIVWCnAYte9roI1pQ=s0-d-e1-ft#https://photos.zillowstatic.com/fp/31266717eab94c4507515c3439b0e1dd-p_e.jpg"
                                                                      style="background-repeat:no-repeat;background-position:center;background-size:cover;border-radius:4px 4px 0px 0px;background-color:#f1f1f4">
  
                                                                      <a style="text-decoration:none" href="#"
                                                                          target="_blank"
                                                                          data-saferedirecturl="https://www.google.com/url?q=https://click.mail.zillow.com/f/a/tnYggP3Bxo9rwmBXYaISwA~~/AAAAAQA~/RgRn4SfnP0UkZW1vLWluc3RhbnRzZWFyY2hkaWdlc3QtZm9yc2FsZWltYWdlBFcGemlsbG93Qgpl-eei_mXJEOppUhdhc2hpcWFyc2xhbjY2QGdtYWlsLmNvbVgEAAAAAA~~?target%3Dhttps%253A%252F%252Fwww.zillow.com%252Frouting%252Femail%252Fproperty-notifications%252Fzpid_target%252F7808149_zpid%252FX1-SSde72yuxlr60g0000000000_3xvey_sse%252F%253Fz%2526rtoken%253D40207f35-f49a-4f6e-9469-6a4f83ac8327%25257EX1-ZUqywfty9tym15_6ikyk%2526utm_campaign%253Demo-instantsearchdigest%2526utm_source%253Demail%2526utm_term%253Durn%253Amsg%253A20240323093737b4b41ec22cdd12ef%2526utm_medium%253Demail%2526utm_content%253Dforsaleimage&amp;source=gmail&amp;ust=1711278125410000&amp;usg=AOvVaw04Nr_7wnQu0CE2yszPwy-Y">
                                                                          <span>
                                                                              <table role="presentation"
                                                                                  class="m_-2346107395176450950w100p"
                                                                                  align="center" cellpadding="0"
                                                                                  cellspacing="0" border="0"
                                                                                  style="width:532px">
                                                                                  <tbody>
                                                                                      <tr>
                                                                                          <td align="left" valign="top"
                                                                                              height="24"
                                                                                              style="height:24px;padding:8px">
                                                                                          </td>
                                                                                          <td align="right" valign="top"
                                                                                              height="24"
                                                                                              style="height:24px;padding:8px">
                                                                                          </td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td colspan="2"
                                                                                              class="m_-2346107395176450950h134"
                                                                                              height="258"
                                                                                              style="height:258px"></td>
                                                                                      </tr>
                                                                                      <tr>
                                                                                          <td colspan="2" align="right"
                                                                                              valign="bottom" height="30"
                                                                                              style="height:30px;padding:8px">
                                                                                          </td>
                                                                                      </tr>
                                                                                  </tbody>
                                                                              </table>
                                                                          </span>
                                                                      </a>
  
                                                                  </td>
                                                              </tr>
                                                              <tr>
                                                                  <td>
                                                                      <a style="text-decoration:none" href="#"
                                                                          target="_blank" <span>
                                                                          <table role="presentation" width="100%"
                                                                              cellpadding="0" cellspacing="0" border="0">
                                                                              <tbody>
                                                                                  <tr>
                                                                                      <td class="m_-2346107395176450950padl04 m_-2346107395176450950padr08"
                                                                                          align="left"
                                                                                          style="padding-left:12px;padding-right:16px;padding-top:8px;padding-bottom:12px">
                                                                                          <table
                                                                                              class="m_-2346107395176450950w100p"
                                                                                              role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0"
                                                                                              width="500"
                                                                                              style="margin-left:4px">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td valign="middle"
                                                                                                          align="left">
                                                                                                          <table
                                                                                                              role="presentation"
                                                                                                              cellpadding="0"
                                                                                                              cellspacing="0"
                                                                                                              border="0"
                                                                                                              align="left"
                                                                                                              style="padding-right:16px;display:block">
                                                                                                              <tbody>
                                                                                                                  <tr>
                                                                                                                      <td valign="middle"
                                                                                                                          align="left">
                                                                                                                          <strong
                                                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:24px;line-height:32px;font-weight:700;color:#2a2a33">$670,000</strong>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                          <table
                                                                                                              role="presentation"
                                                                                                              cellpadding="0"
                                                                                                              cellspacing="0"
                                                                                                              border="0"
                                                                                                              align="left">
                                                                                                              <tbody>
                                                                                                                  <tr>
                                                                                                                      <td valign="middle"
                                                                                                                          align="left">
  
                                                                                                                          <table
                                                                                                                              role="presentation"
                                                                                                                              cellpadding="0"
                                                                                                                              cellspacing="0"
                                                                                                                              border="0">
                                                                                                                              <tbody>
                                                                                                                                  <tr>
                                                                                                                                      <td
                                                                                                                                          style="font-size:0px;line-height:4px">
                                                                                                                                          &nbsp;
                                                                                                                                      </td>
                                                                                                                                  </tr>
                                                                                                                              </tbody>
                                                                                                                          </table>
  
                                                                                                                          <p
                                                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:14px;line-height:24px;color:#2a2a33;font-style:normal;margin:0;padding:0">
                                                                                                                              2
                                                                                                                              bd
                                                                                                                              <span
                                                                                                                                  style="color:#d1d1d5">&nbsp;|&nbsp;</span>
                                                                                                                              2
                                                                                                                              ba
                                                                                                                              <span
                                                                                                                                  style="color:#d1d1d5">&nbsp;|&nbsp;</span>
                                                                                                                              1,661
                                                                                                                              Sqft
                                                                                                                          </p>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                          <p class="m_-2346107395176450950font14"
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#2a2a33;font-style:normal;margin:0 0 0 4px;padding:0">
                                                                                              Builder: Staman-Thomas
                                                                                          </p>
                                                                                          <p class="m_-2346107395176450950font14"
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;color:#2a2a33;font-style:normal;margin:0 0 0 4px;padding:0">
                                                                                              6337 N 19th St, Phoenix,
                                                                                              AZ</p>
                                                                                          <table role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0"
                                                                                              style="margin:4px 0 4px 0">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td valign="middle"
                                                                                                          style="padding-right:4px">
                                                                                                          <img src="https://ci3.googleusercontent.com/meips/ADKq_NYWwB-YtSgeQBP1vrIdXr3QyC5H2gamGeyf_jNIA91Bz0sNFo3RuKUdCqOopW9uWATZ-VEYEwznQzWAZHcQf3OfPhYxrddWYayRjNHuNQf6KgE=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/For_sale.png"
                                                                                                              width="16"
                                                                                                              align="left"
                                                                                                              alt=""
                                                                                                              style="display:block"
                                                                                                              class="CToWUd"
                                                                                                              data-bit="iit">
                                                                                                      </td>
                                                                                                      <td valign="middle">
                                                                                                          <b
                                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;line-height:24px;color:#2a2a33">For
                                                                                                              sale</b>
                                                                                                      </td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                          <p
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;line-height:24px;color:#e96e2f;margin:0 0 0 4px;padding:0">
                                                                                              Open: Sat. 1-4pm</p>
                                                                                          <table role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td
                                                                                                          style="font-size:0px;line-height:8px">
                                                                                                          &nbsp;</td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                          <p
                                                                                              style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:12px;line-height:16px;color:#596b82;font-style:normal;margin:0 0 0 4px;padding:0">
                                                                                              ARMLS
                                                                                              <br>
                                                                                              Russ Lyon Sotheby's
                                                                                              International Realty
                                                                                          </p>
                                                                                          <table role="presentation"
                                                                                              cellpadding="0"
                                                                                              cellspacing="0" border="0">
                                                                                              <tbody>
                                                                                                  <tr>
                                                                                                      <td
                                                                                                          style="font-size:0px;line-height:8px">
                                                                                                          &nbsp;</td>
                                                                                                  </tr>
                                                                                              </tbody>
                                                                                          </table>
                                                                                      </td>
                                                                                  </tr>
                                                                              </tbody>
                                                                          </table>
                                                                          </span>
                                                                      </a>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td style="font-size:0px;line-height:32px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
  
                                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:16px">&nbsp;</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
  
  
  
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center" style="padding:0px 20px">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:504px">
                                          <tbody>
                                              <tr>
                                                  <td align="center">
                                                      <a class="m_-2346107395176450950lh13 m_-2346107395176450950ctaPrimary"
                                                          style="display:inline-block;line-height:17px;margin:0;text-align:center;text-decoration:none;width:auto;border-radius:4px;border:1px solid #006aff;padding:12px 0;background-color:#006aff;font-size:16px;color:#ffffff"
                                                          href="#" target="_blank"
                                                          style="letter-spacing:14px">&nbsp;</i><span
                                                              style="margin:0;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-weight:700">View
                                                              on website</span><i
                                                              style="letter-spacing:14px">&nbsp;</i></a>
                                                      <table role="presentation" cellpadding="0" cellspacing="0"
                                                          border="0">
                                                          <tbody>
                                                              <tr>
                                                                  <td style="font-size:0px;line-height:48px">&nbsp;</td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0" cellspacing="0"
                          border="0" style="width:600px">
                          <tbody>
                              <tr>
                                  <td style="border-bottom:1px solid #d1d1d5;font-size:0;height:0;line-height:0">&nbsp;
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                              <tr>
                                  <td align="center">
                                      <table role="presentation" class="m_-2346107395176450950w100p" cellpadding="0"
                                          cellspacing="0" border="0" style="width:600px">
                                          <tbody>
                                              <tr>
                                                  <td style="font-size:0px;line-height:24px">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <p class="m_-2346107395176450950font14"
                                                          style="font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-style:normal;margin:0;padding:0;color:#54545a">
                                                          MLS Assistangt is better with the app.
                                                          <a class="m_-2346107395176450950txtLinkPrimary"
                                                              style="color:#0d4599;text-decoration:underline;font-weight:700"
                                                              href="#" target="_blank" </p>
                                                              <table role="presentation" cellpadding="0" cellspacing="0"
                                                                  border="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style="font-size:0px;line-height:16px">
                                                                              &nbsp;</td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                              <table role="presentation" cellpadding="0" cellspacing="0"
                                                                  border="0">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td class="m_-2346107395176450950padr16"
                                                                              style="padding-right:24px">
                                                                              <a href="#" target="_blank" <img
                                                                                  style="display:block;padding:0;margin:0;max-width:100%;text-decoration:none;color:#0d4599;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:14px"
                                                                                  border="0"
                                                                                  alt="Download on the App Store"
                                                                                  width="144"
                                                                                  src="https://ci3.googleusercontent.com/meips/ADKq_NaC4zXcGrkBXkIfbfExwD_WZ_X0usOGv0dg-EOHC5KLxfRJjBGN57Yx61eKhaHV6yxn6MfoboQIuKcYlTAdZrosSQB2DchPW4iqQT5h0s4Ei6UnWZqvzjrF=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/apple-app-badge.png"
                                                                                  class="CToWUd" data-bit="iit">
                                                                              </a>
                                                                          </td>
                                                                          <td>
                                                                              <a href="#" target="_blank" <img
                                                                                  style="display:block;padding:0;margin:0;max-width:100%;text-decoration:none;color:#0d4599;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:14px"
                                                                                  alt="Get it on Google Play" width="161"
                                                                                  src="https://ci3.googleusercontent.com/meips/ADKq_NbQNdmK88_EoP5whQZF6fBGqnvU7bnWVJ60wWD79ZHRa-1ok7iFkmqG9-m0h2On6rSGUxYRDozaBRroHd0NkvtkXLY_VlSLYCOzsJTb_n70qOdy_aV8bFUU9w=s0-d-e1-ft#https://s.zillowstatic.com/email-statics/images/google-app-badge.png"
                                                                                  class="CToWUd" data-bit="iit">
                                                                              </a>
                                                                          </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
  </body>
  
  </html>
  </body>  
  </html>`;
  // User-defined function to send email
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
