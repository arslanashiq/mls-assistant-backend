const { WRONG_HTTP_METHOD } = require("../utils/error_codes");
const { authenticate } = require("../middlewares/authenticate");
const { admin_authenticate } = require("../middlewares/admin_authenticate");
const register_route = ({
  router = undefined,
  route = undefined,
  auth_enable = false,
  admin_auth_enable = false,
  get_method = undefined,
  post_method = undefined,
  put_method = undefined,
  delete_method = undefined,
} = {}) => {
  if (router !== undefined || route !== undefined) {
    let args = [route];
    if (auth_enable) {
      args.push(authenticate);
    }
    if (admin_auth_enable) {
      args.push(admin_authenticate);
    }

    if (get_method) {
      router.get(...args, get_method);
    } else {
      router.get(...args, WRONG_HTTP_METHOD);
    }

    if (post_method) {
      router.post(...args, post_method);
    } else {
      router.post(...args, WRONG_HTTP_METHOD);
    }

    if (put_method) {
      router.put(...args, put_method);
    } else {
      router.put(...args, WRONG_HTTP_METHOD);
    }

    if (delete_method) {
      router.delete(...args, delete_method);
    } else {
      router.delete(...args, WRONG_HTTP_METHOD);
    }
  }
};

module.exports = {
  register_route,
};
