const middlewares = require("../../../../lib/middlewares"),
  services = require("./controllers/services_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/services/create", services.addServices);

  router.post("/services/uploadImage", services.uploadServiceImage);
  // READ
  router.post("/services/List", services.servicesList);
  router.post("/services/details", services.details);
  // UPDATE AND DELETE
  router.post("/services/updateData", services.updateData);
  router.post("/services/delete", services.deleteServices);
  router.post("/services/changeStatus", services.changeStatus);
  // return router;
};
