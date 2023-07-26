const middlewares = require("../../../../lib/middlewares"),
  aboutus = require("./controllers/aboutus_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/aboutus/create", aboutus.addAboutus);
  router.post("/aboutus/uploadImage", middlewares.uploadImage);
  router.post("/aboutus/deleteImage", middlewares.deleteImage);

  // READ
  router.post("/aboutus/List", aboutus.aboutusList);
  router.post("/aboutus/details", aboutus.details);

  // UPDATE AND DELETE
  router.post("/aboutus/updateData", aboutus.updateData);
  router.post("/aboutus/delete", aboutus.deleteAboutus);
  router.post("/aboutus/changeStatus", aboutus.changeStatus);
  return router
}
