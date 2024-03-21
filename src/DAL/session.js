const {Session} = require("../models/session");
//chechkin session auth
const checking_session = async (auth) => {
  return await Session.findOne({token: auth});
};
//chechkin session auth
const get_session_by_user_id = async (user_id) => {
  return await Session.findOne({user_id: user_id});
};
const add_to_session = async (json_token, user_id) => {
  let session = new Session({
    user_id: user_id,
    token: json_token,
  });

  session = await session.save();
  return session;
};
const add_to_session_with_out_id = async (json_token) => {
  let session = new Session({
    token: json_token,
  });
  session = await session.save();
  return session;
};
const delete_from_session = async (id) => {
  const user = await Session.findByIdAndDelete(id);
  return user;
};

const delete_from_session_by_user_id = async (user_id) => {
  const user = await Session.deleteMany({user_id: user_id});
  return user;
};

module.exports = {
  add_to_session,
  checking_session,
  get_session_by_user_id,
  delete_from_session,
  delete_from_session_by_user_id,
  add_to_session_with_out_id
};
