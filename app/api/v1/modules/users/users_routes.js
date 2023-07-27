const middlewares = require("../../../../lib/middlewares"),
  users = require("./controllers/users_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/users/create", users.addUsers);
  router.post("/users/login",users.login);
  router.post("/users/signUp",users.signUp);
  router.post("/users/forget-password",users.forgetPassword);
  router.post("/users/change-password",users.changePassword);
  router.post("/users/uploadImage", middlewares.uploadImage);
  router.post("/users/verifyToken", users.verifyToken);
  router.post("/users/reset-password", users.changeForgetPassword);
  router.post("/users/users-list", users.usersList);
  router.post("/users/delete", users.deleteUsers);
  router.post("/users/changeStatus", users.changeStatus);
  return router;
};


