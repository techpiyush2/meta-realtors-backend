const middlewares = require("../../../../lib/middlewares"),
  blog = require("./controllers/blog_ctrl");

module.exports = function (router) {
  // CREATE
  router.post("/blog/create", blog.addBlog);
  router.post("/blog/uploadImage", blog.uploadImage);

  // READ
  router.post("/blog/List", blog.blogList);
  router.post("/blog/details", blog.details);

  // UPDATE AND DELETE
  router.post("/blog/updateData", blog.updateData);
  router.post("/blog/delete", blog.deleteBlog);
  router.post("/blog/changeStatus", blog.changeStatus);
  return router;
};
