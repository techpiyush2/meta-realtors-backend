const middlewares = require("../../../../lib/middlewares"),
  blogCategory = require("./controllers/blogCategory_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/blogCategory/create", blogCategory.addBlogCategory);
  router.post("/blogCategory/uploadImage", middlewares.uploadImage);

  // READ
  router.post("/blogCategory/List", blogCategory.blogCategoryList);
  router.post("/blogCategory/details", blogCategory.details);

  // UPDATE AND DELETE
  router.post("/blogCategory/updateData", blogCategory.updateData);
  router.post("/blogCategory/delete", blogCategory.deleteBlogCategory);
  router.post("/blogCategory/changeStatus", blogCategory.changeStatus);
  return router;
};
