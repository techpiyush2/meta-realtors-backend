const middlewares = require("../../../../lib/middlewares"),
  industries = require("./controllers/industries_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/industries/create", industries.addIndustry);

  router.post("/industries/uploadImage", middlewares.uploadImage);
  // READ
  router.post("/industries/List", industries.industryList);
  router.post("/industries/details", industries.details);

  // UPDATE AND DELETE
  router.post("/industries/updateData", industries.updateData);
  router.post("/industries/delete", industries.deleteIndustry);
  router.post("/industries/changeStatus", industries.changeStatus);
  // return router;
};
