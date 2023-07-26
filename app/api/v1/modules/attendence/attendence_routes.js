const middlewares = require("../../../../lib/middlewares"),
  attendence = require("./controllers/attendence_ctrl");

module.exports = function (router) {

  router.post("/attendence/upload",attendence.uploadFile );
  router.post("/attendence/submit",attendence.addAttendence );
  router.post("/attendence/list",attendence.attendenceList );
  router.post("/attendence/employee",attendence.empAttendence);
  return router
}
