const middlewares = require('../../../../lib/middlewares'),
  skills = require('./controllers/skills_ctrl')

module.exports = function (router) {
  // CREATE
  router.post('/skills/create', skills.addSkills)
  router.post("/skills/uploadImage", middlewares.uploadImage);
  router.post("/skills/deleteImage", middlewares.deleteImage);

  // READ
  router.post("/skills/List", skills.skillsList);
  router.post("/skills/details", skills.details);

  // UPDATE AND DELETE
  router.post("/skills/updateData", skills.updateData);
  router.post("/skills/delete", skills.deleteSkills);
  router.post("/skills/changeStatus", skills.changeStatus);
  return router
}
