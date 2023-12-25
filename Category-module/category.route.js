const express = require('express');
const categoryRouter = new express.Router();
const categoryController = require('./category-controller');
const authMiddleWare = require('../auth-middleware');

categoryRouter.get("/", authMiddleWare.isLoggedIn, authMiddleWare.isSuperadmin, categoryController.getCategory);
categoryRouter.post("/createcategory", authMiddleWare.isLoggedIn, authMiddleWare.isSuperadmin, categoryController.addCategory);
categoryRouter.delete("/deletecategory/:_id", authMiddleWare.isLoggedIn, authMiddleWare.isSuperadmin, categoryController.deleteCategory);
categoryRouter.get("/editcategory/:_id", authMiddleWare.isLoggedIn, authMiddleWare.isSuperadmin, categoryController.getById);
categoryRouter.put("/updatecategory/:_id", authMiddleWare.isLoggedIn, authMiddleWare.isSuperadmin, categoryController.updateById);

module.exports = categoryRouter;