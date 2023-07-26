const middlewares = require("../../../../lib/middlewares"),
  category = require("./controllers/category_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/category/create", category.addCategory);

  // READ
  router.post("/category/List", category.categoryList);
  router.post("/category/details", category.details);

  // UPDATE AND DELETE
  router.post("/category/updateData", category.updateData);
  router.post("/category/delete", category.deleteCategory);
  router.post("/category/changeStatus", category.changeStatus);
  return router
}
