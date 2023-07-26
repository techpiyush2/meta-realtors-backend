const middlewares = require("../../../../lib/middlewares"),
  career = require("./controllers/career_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/career/create", career.addCareer);
  router.post("/career/uploadImage", middlewares.uploadImage);

  // READ
  router.post("/career/List", career.careerList);
  router.post("/career/details", career.details);

  // UPDATE AND DELETE
  router.post("/career/updateData", career.updateData);
  router.post("/career/delete", career.deleteCareer);
  router.post("/career/changeStatus", career.changeStatus);
  router.post("/career/apply", career.addApplicant);
  router.post("/career/applicants", career.applicantList);
  return router;
};
