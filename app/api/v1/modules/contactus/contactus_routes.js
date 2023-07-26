const contactus = require("./controllers/contactus_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/contactus/create", contactus.addContactUs);
  router.post("/contactus/list", contactus.queryList);
  router.post("/contactus/detail", contactus.details);
  router.post("/contactus/delete", contactus.delete);
  return router;
};
