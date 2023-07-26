const middlewares = require("../../../../lib/middlewares"),
  technology = require("./controllers/technology_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/technology/create", technology.addTechnology);
  router.post("/technology/uploadImage", middlewares.uploadImage);
  router.post("/technology/deleteImage", middlewares.deleteImage);

  // READ
  router.post("/technology/List", technology.technologyList);
  router.post("/technology/details", technology.details);

  // UPDATE AND DELETE
  router.post("/technology/updateData", technology.updateData);
  router.post("/technology/delete", technology.deleteTechnology);
  router.post("/technology/changeStatus", technology.changeStatus);
  return router
}
