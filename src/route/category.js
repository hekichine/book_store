import express from "express";
import categoryController from "../controller/categoryController";
require("dotenv/config");

const router = express.Router();
const api = process.env.API_URL;

const initCategoryRoutes = (app) => {
  //get all
  router.get("/category", categoryController.getall);

  // create
  router.post("/category", categoryController.create);

  //delete
  router.delete("/category/:id", categoryController.delete);

  // find by id
  router.get("/category/:id", categoryController.findById);
  //update category

  router.put("/category/:id", categoryController.update);

  app.use(api, router);
};
export default initCategoryRoutes;
