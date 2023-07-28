  const middlewares = require("../../../../lib/middlewares"),
  property = require("./controllers/property_ctrl");

  module.exports = function (router) {
  // CREATE
  router.post("/property/create", property.addProperty);
  router.post("/property/uploadImage", middlewares.uploadImage);
  router.post("/property/deleteImage", middlewares.deleteImage);

  // READ
  router.post("/property/List", property.technologyList);
  router.post("/property/details", property.details);

  // UPDATE AND DELETE
  router.post("/property/updateData", property.updateData);
  router.post("/property/delete", property.deleteTechnology);
  router.post("/property/changeStatus", property.changeStatus);
  return router
}
